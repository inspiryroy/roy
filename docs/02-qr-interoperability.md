# 02 · 国家二维码互通层：识别、解析与路由

> 本章回答"PayPay 扫到一张东南亚国家码时，技术上怎么知道它是谁、钱该付到哪里"。所有国家码都基于 **EMVCo MPM**（商户展示码）规范做本国裁剪，所以一套 TLV 解析器 + 每国一个 profile（识别规则）即可覆盖；真正的差异在**模板位置、GUID/AID、子字段语义**，以及**码背后的支付轨道和跨境接入方式**。
>
> 对应代码：`reference-impl/src/emvco/`（解析/校验）与 `reference-impl/src/schemes/`（各国 profile），测试 `reference-impl/test/schemes.test.ts`。证据等级见每节末尾，资料来源见 [09-sources.md](09-sources.md)。

## 2.1 EMVCo MPM 速览

码是一串 `ID(2位) + 长度(2位) + 值` 的数据对象，部分对象（模板）内部再嵌套 TLV：

| ID | 含义 | 互通要点 |
|---|---|---|
| `00` | Payload Format Indicator | EMVCo 规定 `01`；**马来西亚 DuitNow 用 `02`**，严格校验会误拒全部 DuitNow 码 |
| `01` | Point of Initiation | `11` 静态（用户输入金额）/`12` 动态（码内带金额，通常一次性） |
| `02`–`25` | 卡组织模板（Visa 02/03、Mastercard 04/05、UnionPay 15/16 …） | 东南亚商户码常把卡组织模板与国家码模板"多网合一" |
| `26`–`51` | **Merchant Account Information 模板**，子字段 `00` = GUID/AID | **国家码识别的核心**：按子字段 `00` 判断方案，**不能按 tag 号写死**（新加坡 SGQR 各方案位置不固定） |
| `52` | MCC | 马来西亚 `0000` = P2P |
| `53` | 币种（ISO 4217 数字） | 764 THB、458 MYR、702 SGD、360 IDR、704 VND、608 PHP、116 KHR、840 USD、418 LAK |
| `54` | 金额 | 动态码必有；静态码由付款人输入 |
| `55`–`57` | 小费/便利费 | `01` 提示输入、`02` 固定（`56`）、`03` 百分比（`57`）——要计入外币报价 |
| `58`/`59`/`60` | 国家/商户名（≤25）/城市（≤15） | 商户名常被截断；可用 `64` 的本地语言名 |
| `62` | 附加数据模板 | `01` 账单号、`05` 参考号、`07` 终端号、`08` 交易目的、`50–99` 方案私有；值为 `***` 表示需要付款人填写 |
| `63` | CRC | CRC-16/CCITT-FALSE（poly 0x1021、init 0xFFFF），覆盖到 `6304` 为止 |
| `64` | 本地语言模板 | UTF-8，个别实现按字节计长度——解析器需兼容两种计长方式 |
| `80`–`99` | 自由模板 | DuitNow 用 `82` 放 SHA-256 完整性校验值（非 TLV） |

参考实现的解析器（`decodeMpm`）把问题分为 `errors`（不能安全路由：TLV 结构错、CRC 错、缺 53、无任何商户账户模板）和 `warnings`（各国常见的偏差：PFI=02、商户名超长、缺 58 等）。

## 2.2 通用识别与路由算法

```
扫码 → 自家码 / URL 码？ ──是──▶ 钱包自身处理
          │否
          ▼
   以 "000201"（EMVCo）或 "000202"（马来西亚 DuitNow，PFI=02）开头？ ──否──▶ 不是 EMVCo 码，钱包自身处理
          │是
          ▼
   含 ID 26 GUID `jp.or.paymentsjapan`（JPQR，本身也是 EMVCo TLV）？ ──是──▶ 钱包自身（日本境内码）
          │否 → 调用网络 identify
          ▼
   TLV 解析 + CRC 校验 ──失败──▶ INVALID_QR
          │
          ▼
   遍历 26–51 模板：子字段 00 (GUID/AID) 查注册表 → 每国 profile.interpret()
          │     （一张码可能命中多个方案，例如 SGQR 同时有 NETS 与 PayNow；KHQR 无 GUID，按结构匹配）
          │     一个方案都没命中 → UNSUPPORTED_QR
          ▼
   交叉校验 58 国家码 / 53 币种与方案是否一致（不一致 → 该模板标为不可付（declineReason），不进入路由）
          │     （profile 自身也会标不可付：泰国 A000000677012006、NMID 不合法的 QRIS、动态或带金额却无 99-01 的 KHQR）
          │     全部模板不可付 → INVALID_QR
          │
          ▼
   排序：可付先于不可付，P2M/BILL 先于 P2P，再按置信度（< 0.5 不路由）；
   逐个检查该方案的路由键是否有在线的本地结算伙伴：
     先看"交换机级"键（如 TH:NITMX、MY:PAYNET），再看"收单行级"键（如 TH:ACQ:004）
          │
          ▼
   只剩 P2P（个人收款码）→ 默认拒绝（P2P_NOT_SUPPORTED），见 2.4；同码上的个人码模板不会遮住商户模板
   有可付的商户模板但没有在线伙伴 → NO_ROUTE
   码已过期（KHQR 99-01、PayNow 04）→ QR_EXPIRED；汇款/取现/准现金 MCC → MCC_NOT_SUPPORTED
   P2M / BILL → 返回 decodeId、商户信息、金额是否可编辑、需要用户填写的附加字段
```

两层路由键对应路径 A、B1；路径 B2 按下文的设计约定（假设）复用交换机级键（编号见 [01 章 1.5](01-architecture.md#15-接入各国国家码的四种路径)）：
* **交换机级 = 路径 A**（例：作为"境外方案"接入泰国 NITMX 跨境平台、马来西亚 PayNet 跨境网关、新加坡 NETS）：覆盖该国**参与跨境受理的银行发出的全部商户码**，不是字面上的所有商户；
* **收单行级 = 路径 B1 收单行 on-us**（例：只和泰国某一家银行签约）：只能付**该行发出的商户码**（码内的收单行代码 = 合作行），覆盖面小但落地快。参考实现用 `altRoutingKeys` 表达这一点，测试 `Thailand: acquirer template adds an on-us routing key` 演示了"合作行 004 的码可付、014 的码不可付"。限制：参考实现只从泰国 tag 31 的银行代码生成 `TH:ACQ:<代码>`，只连收单行级伙伴时，只带 tag 30 的合作行码会得到 `NO_ROUTE`；若只能做 B1，须按 tag 30 Biller ID（前 13 位为 biller 或收单行税号，是否总是收单行未核实）识别合作行发出的码——需合作行提供规则，**尚未实现**；
* **路径 B2 发卡侧赞助行（issuer-sponsor）**：由一家本国快速支付系统直连成员代境外钱包发起贷记，可付任意国家码商户（先例：韩国 GLN × KB 国民 × 泰国 SCB，2023-12，SCB 称覆盖全国 Thai QR 商户，现状未核实），需央行/交换机确认"境外发起"口径与外汇定性。**设计约定（假设）**：在参考实现里，赞助行伙伴可登记交换机级键（如 `TH:NITMX`），因为它经 PromptPay/InstaPay 把贷记送到任意商户。

## 2.3 各国 profile

### 泰国 · Thai QR Payment（PromptPay / NITMX）

* 标准：BOT 政策指引 *Standardized Thai QR Code for Payment Transactions*（FPG 25620084，2019-04-17），基于 EMVCo MPM；交换由 National ITMX（NITMX）运营。泰国 profile 把 `26–28` 留给本地卡组织、`29–31` 给 PromptPay 及其他支付系统。
* 模板与 AID：

| tag | AID | 用途 | 关键子字段 |
|---|---|---|---|
| 29 | `A000000677010111` | PromptPay 转账码（个人/个体户） | `01` 手机（`0066`+去首位 0 的 9 位）、`02` 身份证/税号、`03` e-Wallet ID、`04` 银行账户（保留） |
| 30 | `A000000677010112` | **Bill Payment = 商户收单码主路由** | `01` Biller ID（15 位 = 13 位税号 + 2 位后缀）、`02` Ref1（必填）、`03` Ref2 |
| 30 | `A000000677012006` | 跨境 Bill Payment 变体（**低置信度**：衍生文档称与 `62-08` 的币种+本地金额+国家配合，唯一示例为日元/JP，疑为境外商户展示泰式码供泰国游客付款；入境方向是否出现未确认） | 识别但不承接、不路由，待 BOT/NITMX 确认 |
| 31 | `A000000677010113` | 收单行自定义模板 | `01` 3 位银行代码（如 `004` = KBank），`02–99` 收单行自定义 |
| — | `A000000677010114` | 资料冲突：BOT 字段表称客户展示（CPM），部分开源库称一次性授权（OTA） | 不承接，待 BOT 原文确认 |

* 识别：`58=TH`、`53=764`；tag 30 优先，tag 31 的银行代码作为收单行级路由键（`TH:ACQ:<代码>`）；无 tag 30、仅有 tag 31 的码按收单行级路由（置信度 0.7），只能经该收单行 on-us 支付。动态码的 Ref1/Ref2 和 `62-07` 终端号**必须原样回传**，否则商户 POS 无法自动核销。
* 跨境现状要点：PromptPay 本身互联面很广（东盟多国、香港 FPS、韩国 GLN 经 SCB）。中国线（Alipay/WeChat/UnionPay，2025-10-30）开通时只能扫 BBL、KTB、KBank、ICBC Thai、SCB、BAAC 六家银行发出的商户码（BAY、GSB、HSBC TH、ttb 待上线）；香港、新马印越柬老等其他入境线是否同样只受理参与银行的商户码、是否受理 tag 29 个人码，**未核实**，需向 NITMX 确认。在 Alipay+ 体系内，NITMX 国家码线目前只见中国 Alipay 用户可用（截至 2026-10 未检出对其他钱包开放的公告，不是官方否定）；其他 Alipay+ 钱包在泰国只能扫 KTC/2C2P/Antom 等收单方的码；日本钱包尚无扫 PromptPay 国家码的通道。个人码（tag 29）没有商户身份，我们默认不承接（见 2.4），且 2026 年 BOT 正在整治个人码商用。
* 证据等级：AID 与子字段来自多个独立开源实现与 CRC 校验通过的真实码，BOT 附件原文未取得（中-高）。

### 马来西亚 · DuitNow QR（PayNet / RPP）

* 标准：PayNet *QR Generation Specification – Merchant-Presented Mode* v1.5，基于 EMVCo MPM，另有 CPM；底层 RPP（ISO 20022、7×24）。
* 结构：**单一模板 tag 26**，AID `A0000006150001`；`01` 收单机构 ID（6 位，PayNet 目录，如 Maybank `588734`、CIMB `501854`，日资 MUFG(M) `629196`、SMBC(M) `629238`、Mizuho(M) `629220`）、`02` QR ID（收单方分配的商户号）、`03` 商户描述、`04` 手机号；**PFI = `02`**；`52=0000` 表示 P2P；收单 ID `898989` = JomPAY 账单；`62-90/91` 为 RRN；`82` = SHA-256 完整性校验。
* 识别：tag 26 AID + `58=MY` + `53=458`。跨境不需要逐个对接收单方：经 PayNet 跨境网关，按 `26-01` 转发。
* 跨境现状：PayNet FAQ 称商户只要开通 DuitNow QR 即**自动受理跨境 QR**、按 MYR 入账；跨境费率由收单方自定（DuitNow 官网称收单方可能有不同费率结构，Alliance Bank 称与本地 QR 相同）。已联通泰、新（NETS）、印尼、柬、中国银联，8 个以上 Alipay+ 钱包 2023-10-31 起可扫 DuitNow（Alipay+ 占入境跨境 QR >80%），印度 NPCI 2026-02 签约（未确认上线），Wise 2026-07 直连。
* 证据等级：规范 v1.5 的 GitHub 镜像 + 官方示例 4 个 CRC 全部通过（中-高）；参考实现测试直接使用 PayNet 规范里的示例码。

### 新加坡 · SGQR（PayNow / NETS / 多方案标签）

* SGQR 是 MAS 与 IMDA 共有的**统一标签**：一张贴纸在 `26–50` 并排放多个方案，位置不固定，**必须按 GUID 路由**；`51` 固定为 `SG.SGQR` 标签元数据（SGQR ID、版本、邮编、楼层、单元），**不是支付账户**。
* 常见 GUID：

| GUID | 方案 | 子字段 / 处理 |
|---|---|---|
| `SG.PAYNOW` | PayNow（FAST 上的寻址层） | `01` 代理类型（`0` 手机、`2` UEN）、`02` 代理值、`03` 金额可改（`0` 否/`1` 是）、`04` 过期日（`YYYYMMDD` 或 `YYYYMMDDHHMMSS`，现场两种都有） |
| `SG.COM.NETS` | NETS QR | `01` 元数据、`02` 商户号、`03` 终端号、`99` 签名——**带签名，只能原样交给 NETS 主机** |
| `COM.GRAB` | GrabPay | 私有方案；StraitsX × Alipay+ × Grab 已有"稳定币清算、商户收 SGD"先例 |
| `SG.AIRPAY`、`COM.ALIPAY`、`COM.MYFAVE`、`SG.COM.DASH.WWW` | ShopeePay、Alipay、Fave、Singtel Dash | 无合作则不可付 |

* 路由：境外钱包入境的既有模式是"扫 SGQR → 取 `SG.COM.NETS` 载荷 → 经本国交换机转发 NETS"（DuitNow、QRIS、PromptPay、Alipay+ 均如此；Alipay+ 2023-04 经 NETS 接入，首批 6 个钱包）；没有 NETS 载荷的标签，NETS 通道无法支付。参考实现对一张同时含 NETS 与 PayNow 的 SGQR 返回两个候选，按已连接的伙伴选路；PayNow 的 UEN 代理判为 P2M、手机号代理判为 P2P，商户模板总排在个人模板之前。
* 证据等级：多个开源解析器一致 + 真实标签 CRC 校验通过，MAS/IMDA 规范原文未取得（中）。

### 老挝 · LAO QR（LAPNet）

* BOL 2020-01-29 软发布、LAPNet 运营；规范不公开。由多份 CRC 通过的真实码推断：tag 38，GUID `A005266284662577`；`01` 8 位机构 IIN（4 位机构码 + `0418`，如 BCEL `27710418`）、`02` 业务类型（`001` 转账 / `002` 商户支付 / `003` 账单）、`03` 收款方 token；`53=418`、`58=LA`。个人码无商户名，需先走 LAPNet INQUIRY 取户名。
* 成员接口：据两份第三方开源实现（低置信度），为私有 JSON over HTTPS + SHA256withRSA 签名（"LMPS"，命令 INQUIRY/TRANSFER/NOTIFY）；LAPNet 是否另有 ISO 8583/20022 接口未核实，需向 LAPNet 索取规范。
* 金额：`53=418`（LAK）按 ISO 4217 记 2 位小数；实际是否只用整数未核实，参考实现未收窄。
* 证据等级：推断（中）。

### 印度尼西亚 · QRIS（BI / ASPI / GPN 交换机）

* 标准：Bank Indonesia 所有、ASPI 制定维护（规范原文不公开）；基于 EMVCo MPM，另有 CPM 与 QRIS Tap（NFC，2025-03）。境内单笔上限 Rp10 juta（2022-03 起）。
* 结构（开源实现 + CRC 校验通过的样例）：
  * **`26–45` 收单方（PJSP）模板**：GUID 为反向域名（如 `COM.NOBUBANK.WWW`），`01` = Merchant PAN（`9360` 开头；前 8 位据样例推断为收单方 **NNS**，官方 NNS 表未核实），`02` = 收单方内部商户号，`03` = 商户分类；同一张码可有多个；
  * **`51` 国家域**：GUID **`ID.CO.QRIS.WWW`**，`02` = **NMID**（`ID` + 13 位数字，全国商户号），`03` = 商户分类（UMI/UKE/UME/UBE/URE；MDR：UMI 单笔 ≤ Rp500,000 为 0%、> Rp500,000 为 0.3%，UKE/UME/UBE 0.7%，教育 0.6%，SPBU 0.4%，URE 费率未查到；据多家银行通知与媒体，2026-10-01 起所有类别单笔 ≤ Rp100,000 为 0%，BI 原文未读，见 [12 章](12-inscreen-sea-dynamic-qr.md)）。
* 识别：存在 `51` 且 GUID 为 `ID.CO.QRIS.WWW`、NMID 合法，`58=ID`、`53=360`。跨境模式下**不自行按 NNS 选收单方**，而是整串交给印尼侧交换机路由；参考实现把 NNS 作为收单行级路由键（`ID:NNS:<NNS>`）供 on-us 合作使用。
* P2M/P2P：据开源样例，P2M 码带 `51` NMID；QRIS TUNTAS（个人转账码）的结构未查到，**不能仅凭存在 `51` 判定为 P2M**。参考实现现状：NMID 不符合 `ID` + 13 位 → 识别但不承接；`MCC 4829/6010/6011/6012/6051`（汇款/取现/准现金）→ `MCC_NOT_SUPPORTED`（各国通用）；其余 QRIS 一律按 P2M 处理——P2P 判别要等 TUNTAS 格式确认后补上（**未实现**）。金额按整数卢比、单笔 ≤ Rp10 juta 校验（入境交易是否沿用境内上限未核实，参考实现按境内上限处理）。
* 跨境现状：与泰、马、新（2023-11-17）、中国（2026-04-30，经 Alipay+ 与银联）、韩国（2026-04-01 印尼→韩）联通；**印尼用户在日本扫 JPQR Global 已于 2025-08-17 上线**（只限张贴 JPQR Global 码的商户，首批 35 家；METI 与 BI 2022-12 签 JPQR 互操作 MoC，日方执行为私营的 Netstars）；反方向（日本钱包在印尼扫 QRIS）BI 称已获日本 FSA 许可、"很快上线"，截至 2026-10 未见正式上线，也未见任何日本钱包宣布接入——Netstars 是交换运营方，日本一端要有钱包加入才能用（推荐路径见 [05 章 5.5](05-country-playbooks.md)）。商户按 IDR 入账，MDR 与境内相同（BI 跨境 QRIS 页面）。
* 约束：GPN 要求境内交易经境内交换机处理、基础设施在境内；卢比禁止离岸使用。
* 证据等级：中（官方原文未取得）。

### 越南 · VietQR（NAPAS / Napas 247）与 VNPAY-QR

* VietQR：NAPAS 运营，2021 年推出；跨境受理品牌为 **VietQRGlobal**。
* 结构：**tag 38**，GUID `A000000727`；`01` 是**嵌套模板**（`00` = 6 位受益机构 BIN，如 Vietcombank `970436`、BIDV `970418`、MoMo `971025`；`01` = 账号或卡号）；`02` = 服务码（`QRIBFTTA` 转账户 / `QRIBFTTC` 转卡）；`53=704`（VND 无小数）；`62-08` 附言是商户对账关键字段，必须透传。
* **没有显式的 P2M 标志**：个人转账码通常没有 `52/59/60`（违反 EMVCo 必填，严格校验器会误拒）；参考实现以"有商户名且 MCC ≠ 0000"判为 P2M，否则 P2P，并提示先做 NAPAS 账户名查询。
* 另一张网 **VNPAY-QR**：tag 26，GUID `A000000775`，`01` = 商户号；能否经 NAPAS 跨境通道支付待确认。
* 跨境现状：NAPAS 直连境外网络/聚合方——Alipay（2026-04-03，结算行 Vietcombank）、银联（ICBC、Vietcombank）、微信支付（2026-08，BIDV）、韩国 GLN（2026-04-23，Hana Bank + BIDV，KRW–VND 实时）、新加坡 Liquid Group（2026-07，VietinBank）；柬、老、泰双边。另有加密钱包 Bitget Wallet / Bitget、RedotPay 的 Scan to Pay 已支持扫 VietQR（用户以 USDT/USDC 付款，经未公开的本地出款方走 NAPAS；上线日期未查到），是直接竞品，也是监管风险信号。**日本未上线**。
* 监管：Decree 52/2024 要求境外机构经 SBV 认可的商业银行进入；**2026-07 修订草案拟允许境外机构经持牌国际交换服务商（NAPAS 等）接入**——对私营网络是利好，需跟踪定稿；加密资产不得作为支付手段，试点排除法币稳定币。
* 证据等级：中。

### 柬埔寨 · KHQR（NBC / Bakong）

* NBC 运营，基于 EMVCo MPM 但有关键偏离（依据 NBC 官方 JavaScript SDK 源码与测试样例）：
  * **tag 29 = 个人、tag 30 = 商户**，子字段 `00` **不是 GUID**，而是 Bakong 账户 ID（`name@bankdomain`，如 `@aclb` ACLEDA、`@abaa` ABA）；`30-01` 商户号、`29/30-02` 收单行；
  * **tag 99 时间戳模板**：`00` 创建、`01` 过期（13 位毫秒），**动态码必须带过期时间**；
  * 币种 KHR（116）或 USD（840）；KHR 金额为整数（USD 最多 2 位小数）；常与 Visa/Mastercard/UnionPay 模板同码并存。
* 识别：`58=KH` + tag 29/30 的 `00` 含 `@` → 路由到 Bakong。参考实现为此给注册表增加了"无 GUID 的结构化匹配"（`templateTags` + `matchTemplate`）；动态码或带金额却缺 `99-01` 的码不承接（同 NBC SDK），已过期的码返回 `QR_EXPIRED`，KHR 金额须为整数。
* 跨境现状：越（2023-12）、老（二期 2025-12）、马（2024-09 起）、泰、UnionPay、**Alipay+（2024-10，12 个钱包可扫 KHQR）**、微信支付（据单一报道 2026-08 上线，未核实）、印度 UPI（2026-06）；**柬埔寨用户在日本扫 JPQR 已于 2025-07-04 上线**（METI–NBC MoC 2023-12、NBC–PJA MoU 2025-04），日本用户扫 KHQR 的二期仍是计划，未见日本钱包宣布参与（日方运营 NETSTARS；日方结算行据单一报道为 SMBC，未核实；柬方 ACLEDA、Sathapana）。据 ACLEDA 指南，柬方用户经 Bakong 出境扫码只能从 KHR 账户扣款；**推断**跨境 QR 可能以 KHR 结算，入境方向是否只能 KHR、美元标价的 KHQR 能否被外国钱包支付，待 NBC 确认（参考实现对 USD 码只告警）。
* 监管亮点：NBC 2024-12 加密资产 Prakas 允许持牌银行经 NBC 事前批准持有**有有效稳定机制的稳定币（Group 1b，排除算法币，上限 3% CET1）**（据律所解读，NBC 原文未核）——这是东南亚少有的"银行可合法持有稳定币"的路径。
* 证据等级：中-高。

### 菲律宾 · QR Ph（PPMI / InstaPay）

* BSP Circular 1055（2019-10）强制推行，PPMI 制定管理；P2P 2019 年先行，P2M 2021-04 试点；均基于 EMVCo MPM（未见 CPM）。2025 年 QR Ph 24.7 亿笔、₱1.16 万亿，首次超过借记卡和信用卡笔数。
* 结构（开源实现 + CRC 校验通过的真实样例）：

| tag | GUID | 用途 | 关键子字段 |
|---|---|---|---|
| 28 | `ph.ppmi.p2m` | 商户码（P2M） | `01` InstaPay 参与机构代码（BIC 形式，如 GCash `GXCHPHM2XXX`、BPI `BOPIPHMMXXX`——**不一定等于 SWIFT BIC**，需 PPMI/BancNet 代码表）、`03` 商户收款账户、`04` 可选、`05` 3 位标志（含义未核实） |
| 27 | `com.p2pqrpay` | 个人码（P2P） | `01` 参与机构、`04` 收款账户/代理；MCC 惯例 `6016`；`59` 为掩码姓名 |

  另外 `62` 子字段 `00` 也带 GUID（如 `ph.ppmi.qrph`），`88` 自定义模板常见 `ph.ppmi.qrph`；`62-05` 为一次性参考号（动态码去重键）。
* 识别：`58=PH`、`53=608`、tag 28/27 的 GUID；按 `28-01` 路由到 InstaPay 收款参与者，贷记 `28-03`。单笔受 InstaPay 上限 **₱50,000** 约束（参考实现拒绝超额金额，`AMOUNT_LIMIT`）。
* 跨境现状：**Alipay+ × PPMI 2026-09-01 上线**，海外 Alipay+ 合作钱包可扫全国 QR Ph 商户（开放钱包名单未查到），是目前在菲律宾唯一查到的、经 QR Ph 管理方 PPMI 授权并已上线的外国钱包直扫安排；另有加密钱包 Bitget Wallet / Bitget、RedotPay 的 Scan to Pay 已可扫 QR Ph（用户以 USDT/USDC 付款，经未公开的本地出款方走 InstaPay；Bitget 声明不在当地作为支付服务提供商运营；越南 VietQR 同样），属于直接竞品与监管风险信号；马来西亚 DuitNow 线 BSP 称 2026 年内上线；Nexus 计划 2027 年年中（首版只做账户到账户，不是扫码通道）；无日本线。
* 外国机构接入：设立本地法人取得 EMI/银行牌照并直连 InstaPay（Wise 2024-11 先例），或与本地 InstaPay 参与者合作（含发卡侧赞助行，即路径 B2，见 [05 章 5.9](05-country-playbooks.md)）；**2026-09 BSP 征求意见稿拟暂停新 OPS 注册 12 个月**，并要求收单机构只与持牌 VASP 合作。
* 证据等级：中。

## 2.4 个人码（P2P）为什么默认不承接

1. **合规**：P2M 是"购买商品/服务"，P2P 是"汇款"——跨境个人汇款在多数国家需要汇款牌照、额外的发起人/受益人信息与申报；
2. **既有通道**：泰国中国线只受理参与银行的商户码（已核实）；泰国其他入境线、马来西亚 MCC `0000`、新加坡 PayNow 手机号码在跨境 QR 通道上是否受理**未核实**——而且 PayNow–DuitNow（2023-11）、PayNow–PromptPay（2021-04）已有按手机号代理的跨境 P2P 实时转账联通，所以拒绝个人码是我们的合规选择，不是既有通道的技术限制；
3. **风控**：个人码无商户 KYC（KYM），是贴码诈骗、地下换汇（如泰国 2025–2026 年冻结约 5,000 个人民币 P2P 账户）的主要载体；
4. **例外**：大量路边摊只有个人码。可作为二期选项：仅在目的国监管明确允许且有额度控制的前提下（如泰国 TouristDigiPay 沙盒对个人码设每月 5 万泰铢上限）开放，并强制商户名查询回显。

参考实现：只剩个人码模板时 identify 返回 `P2P_NOT_SUPPORTED`；同一张贴纸上若同时有商户模板，商户模板总是排在前面。印尼 QRIS 的 P2P 判别尚未实现（见 2.3 印尼）。

## 2.5 工程注意事项清单

* 不按 tag 号写死，按 GUID；GUID 比较大小写不敏感；
* PFI `02`（马来西亚）放行，钱包侧也不得对 PFI 做 `01` 等值校验（否则 DuitNow 码永远到不了网络）；JPQR（ID 26 GUID `jp.or.paymentsjapan`）由钱包自己处理；`80–99` 的非 TLV 内容不报错；
* `64` 模板 UTF-8 计长兼容字符/字节两种方式；
* 动态码有效期（马来西亚社区资料称约 60 秒，以收单方返回 D313 为准，码内无过期字段；KHQR `99-01`；PayNow `04`）→ **锁汇有效期必须短于码有效期**：decode 会话的 `expiresAt` 取 min（会话 TTL，码过期时间 − 安全余量），报价的 `expiresAt` 取 min（政策 TTL，LP 报价有效期，码过期时间 − 安全余量），支付执行前再校验一次码是否过期（`QR_EXPIRED`）——参考实现已按此实现（余量默认 5 秒）；
* 金额：接口金额一律按 [07 章 7.1](07-api-spec.md) 的币种指数（ISO 4217 最小单位）表示：JPY、VND 0 位；THB/MYR/SGD/PHP/USD 2 位；**IDR、KHR、LAK 也是 2 位**（例：Rp85,000 应传 `8500000`，否则差 100 倍）。IDR、KHR 在码内与用户输入实际只有整数，参考实现按轨道收窄：小数部分非 `00` 的 IDR/KHR 金额被拒（码内金额 → `INVALID_QR`，用户输入 → `AMOUNT_PRECISION`）；LAK 未收窄（见 2.3 老挝）。静态码显示日元折算并锁价；
* 单笔上限与 MCC：QR Ph/InstaPay ₱50,000、QRIS 境内 Rp10 juta，超额返回 `AMOUNT_LIMIT`；汇款/取现/准现金 MCC（4829/6010/6011/6012/6051）返回 `MCC_NOT_SUPPORTED`；
* 商户名：`59` 常被截断或缺失（泰国很多商户码不带 `59`），**商户名查询回显是 Phase 1 必需项**：网络在 identify 阶段调用 LSP 的 [07 章 7.4.0](07-api-spec.md) `POST {lsp}/v1/accounts/inquiry`（超时 ≤ 1 s；泰国经 NITMX/结算行，马来西亚交易码 521，老挝 LAPNet INQUIRY），查不到商户名时 identify 返回 `prompts` 让用户人工核对，并对该码执行首笔限额，防止贴码诈骗。参考实现尚未实现这一查询；
* 对账键：方案参考号（Ref1/Ref2、`62-05/07/90/91`、SGQR ID）+ 收单行 ID + 商户号；
* 多网合一码：同一张码里有卡组织模板（02–25）时，我们只取国家码模板。
