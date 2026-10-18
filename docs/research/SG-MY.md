# 新加坡与马来西亚国家二维码调研：PayPay 用户扫码支付与稳定币清结算

调研日期：2026-10-18。调研对象：INSPAY “稳定币版 Alipay+”网络。

## 0. 调研方法与局限（先读）

- **WebFetch 无法访问大部分官方域名。** mas.gov.sg、bnm.gov.my、paynet.my、docs.developer.paynet.my、nets.com.sg 等都报 DNS 错误（ENOTFOUND），只有 github.com、gist、pypi 能抓取。因此本文的官方事实大多来自 WebSearch 返回的官方页面摘要，没有打开 PDF 原文逐字核对。这类事实凡是 URL 属于官方、摘要里有原句的，标 high；只有二手来源的，标 medium。
- **DuitNow QR 码结构**来自 GitHub 上对 PayNet 开发者文档（MPM 规范 V1.5）的镜像，抓取时间 2026-05-04。其中 4 个官方示例 payload 我在本地重算了 CRC-16/CCITT-FALSE，**全部通过**。
- **SGQR 码结构**没有拿到 MAS/IMDA 官方规范 PDF。依据是多个开源解析器（lee-ratinan/emv-qr、pyraxo/sgqr-parser、sausheong/SGQR、smnd/utilities 等）的一致定义，外加一个真实 SGQR 标签 payload（CRC 已校验通过）。置信度统一为 medium。
- **本轮 WebSearch 配额（200 次）在调研末尾用完。** 以下几项没来得及查：HIVEX 是什么网络；PayNet–NETS 合资公司（Nexus 技术运营商）的细节；FAST/RPP 结算周期原文。如需补查，可以再发一条消息继续。

---

## 1. 关键结论（TL;DR）

1. **两国国家码都基于 EMVCo MPM，但“识别与路由”的逻辑完全不同。**
   - **马来西亚 DuitNow QR**：单一方案。固定在 tag 26，GUID 是 AID `A0000006150001`，子标签 01 是 6 位收单机构 ID。
     - 坑：PayNet 规范把 **Payload Format Indicator 定为 "02"**，EMVCo 标准是 "01"。严格校验 PFI 的解析器会把所有 DuitNow 码拒掉。
   - **新加坡 SGQR**：多方案共存的“标签”。tag 26–50 里可以并排放 PayNow（`SG.PAYNOW`）、NETS（`SG.COM.NETS`）、GrabPay（`COM.GRAB`）、ShopeePay（`SG.AIRPAY`）、Alipay（`COM.ALIPAY`）、Fave（`COM.MYFAVE`）、Singtel Dash（`SG.COM.DASH.WWW`）等。各方案的 tag 位置不固定，**必须按子标签 00 的 GUID 路由**。tag 51 固定为 `SG.SGQR` 标签元数据，不参与支付路由。
2. **新加坡已经有“境外钱包 + 稳定币清算”的现成先例。**
   - StraitsX × Ant International（Alipay+）× Grab，2024-11-05 宣布：境外游客用本国 App 扫 GrabPay 码，后台用 XSGD + Purpose Bound Money 在 Avalanche 上清结算，商户实时收到 SGD。
   - OKX SG（2025-09）：用户用 USDC/USDT 付款，换成 XSGD 后，商户在 GrabPay 侧收 SGD。
   - dtcpay（MAS 持牌 DPT 大型支付机构 MPI，SBI 集团是战略投资者）已作为 SGQR+ 发卡方，在 NETS 受理点支持“稳定币付、商户收 SGD”。
   - 结论：在新加坡做“稳定币清算 + 商户收本币”有监管与技术先例，最现实的路径是与持牌 DPT-MPI 加 NETS/GrabPay 合作。
3. **马来西亚：稳定币只能在境外这一侧流转。**
   - BNM/SC 2020 联合声明：数字资产不是法定货币，也不是 BNM 监管的支付工具。
   - 林吉特是非国际化货币，离岸交易（含 NDF）违反政策。
   - 林吉特稳定币只在 BNM 数字资产创新中心（Digital Asset Innovation Hub, DAIH）做批发沙盒试点（2026-02-11 选定渣打 + Capital A 的林吉特稳定币 B2B 试点、Maybank 与 CIMB 的代币化存款试点），BNM 计划 2026 年底前给出政策澄清。
   - 因此 INSPAY 的稳定币必须在境外完成兑换（USDC/JPYC → USD/JPY 法币），再由马来西亚在岸持牌银行完成 → MYR 的兑换并入账商户。
   - 重要新变量：**2026-09-15 日本财务省与 BNM 签署本币结算（LCS）合作备忘录**，同时日马第三份双边货币互换（US$60 亿）2026-09-18 生效。日元→林吉特直接结算可能成为我们的 FX 通道。
   - MUFG（马）629196、SMBC（马）629238、Mizuho（马）629220 都在 DuitNow 收单机构 ID 表里，是天然候选合作方。
4. **跨境 QR 联通现状。**
   - **马来西亚 DuitNow QR**：已与新加坡（NETS，2023-03-31）、泰国（PromptPay，2021-06-18 一期）、印尼（QRIS，试点 2022-01-27，商用 2023-05-08）、柬埔寨（KHQR；一期 2024-09 柬→马，二期 2025-04-08 马→柬）、中国（银联入境 2023-09 起）联通。
   - **马来西亚的钱包与网络接入**：Alipay+ 钱包 2023-10-31 起可扫 DuitNow QR，Alipay+ 占入境跨境 QR 的 >80%（2025-03 报道）。韩国 BC Card 一期入境已上线。印度 NPCI 2026-02 签约（两期）。Wise 2026-07-30 直连 PayNet。
   - **马来西亚 2025 年数据**：跨境 QR 交易 2,970 万笔（同比 2.5 倍）。
   - **新加坡**：NETS QR 与 DuitNow、Thai QR/PromptPay（NETS–ITMX）、QRIS 互通。PayNow 与 UPI、DuitNow、PromptPay 有 3 条 P2P 走廊，2025 年跨境金额 S$3.71 亿。
   - **日本 JPQR**：与两国均**未查到上线证据**。METI 只和印尼央行（2022-12）、柬埔寨央行（2023-12）签过合作备忘录（MoC）。
5. **PayPay 现状。** 2025-09-30 起，PayPay“海外支付模式”通过 Alipay+ 在韩国上线。2026-04-27 起通过 HIVEX 在台湾上线。要求完成 eKYC，海外手续费 3.85%。**新加坡、马来西亚尚未上线**，窗口还在，但 Alipay+ 是现成的竞争者和替代路径。
6. **2026 年需要盯紧的政策事件。**
   - **新加坡**：
     - MAS 2026-09-01 就修改《支付服务法》（PS Act）、落地稳定币框架征求意见（2026-10-16 截止）。要点：新设“稳定币发行”牌照；只有持牌者能用 “MAS-regulated stablecoin” 标签；拟允许认可外国监管等效的稳定币；可把某个稳定币指定为“系统性”。这将决定 USDC/JPYC 在新加坡的待遇。
     - PayNow Gen2：PayNow 与 NETS QR 的互操作 POC 计划 2026 年底前试点；实施路线图 2026 年底发布。
   - **马来西亚**：BNM 计划在 2026 年底前对林吉特稳定币/代币化存款给出政策澄清。
   - **区域**：Nexus Global Payments 选定 **PayNet 与 NETS 的合资公司**为技术运营商（2026-02），平台目标 2027 年上线。

---

## 2. 新加坡

### 2.1 国家二维码标准

| 项目 | 内容 | 置信度 |
|---|---|---|
| 名称 | **SGQR**（Singapore Quick Response Code）。它是“多方案合一”的统一标签，本身不是单一支付方案 | high |
| 所有者 | MAS 与 IMDA 共同所有（co-owned）。由 MAS 与 IMDA 联合牵头的行业工作组开发 | high |
| 规范与上线 | Payments Council 于 2017-11（约 11-20）背书 SGQR 规范；2018-09-17 正式上线，首批 27 个支付方案（含 PayNow、NETS、GrabPay、Liquid Pay、Singtel DASH） | high |
| 当前版本 | 官方规范版本号**未查到**。真实标签 tag 51 子标签 02 出现过 `01.0001`、`01.0003`，是标签版本，不是规范版本 | low |
| EMVCo | 基于 EMVCo MPM 并做了新加坡定制。**未查到 SGQR 的 CPM**，SGQR 只是商户展示码标准 | medium |
| 静态/动态 | SGQR 标签本身是静态码（贴纸），POI=11。PayNow QR 和 NETS QR 都有动态码：PayNow 可带金额和过期日；NETS 动态码在 POS 上生成。静态码由付款人输入金额 | medium |
| 治理 | 《Guidelines on Participation in the SGQR Scheme》2023-12-01 生效（MAS 2023-06-23 发布咨询回应），约束“Relevant Merchant Acquirer”，即通过静态 QR 在商户实体经营场所提供收单服务的 MPI/豁免机构。2022 年咨询提出：SGQR 会员只能通过 SGQR 标签收单，不得再发专有静态码；同时设会员费用结构和分批入网 | medium |
| SGQR+ | MAS 推动的“单一收单方受理多方案”互操作层。POC 于 2023-11-01 至 11-30 进行：Liquid Group 担任交换（switch）运营方，NETS 担任主收单方，约 23 个方案、1,000+ 受理点；另一来源称 1,416 个受理点、65,204 笔、S$129 万。NETS 2024-11-07 宣布全岛推广，走“主收单方（master acquirer）”路线：24,000 个受理点，扩展到熟食中心后 >35,000；新增发卡方 dtcpay、MariBank、Maybank，发卡方/方案总数达 18；技术上线 2024 Q4，dtcpay 与 MariBank 用户 2025 Q2 接入 | medium（2025 年以后的实际完成情况未核实） |
| 规模数据 | SGQR 商户：2021 年 >160,000 个点、2022 年 >203,000 家（旧数据）。PayNow：2025-12 约 1,100 万个 proxy 注册（覆盖 >90% 成年人）、约 35 万家企业；2025 年个人支付约 S$1,540 亿、企业支付约 S$1,470 亿、跨境 S$3.71 亿（3 条走廊）。FAST：2024 年 5.0 亿笔、约 S$6,617 亿 | PayNow/FAST 为 high；SGQR 商户数为 medium（旧） |

### 2.2 码结构细节

**顶层字段**（EMVCo 通用，新加坡用法）：

| Tag | 含义 | 新加坡用法 |
|---|---|---|
| 00 | Payload Format Indicator | `01` |
| 01 | Point of Initiation | `11` 静态 / `12` 动态 |
| 26–50 | Merchant Account Information | 各方案模板，位置不固定，按子标签 00 的 GUID 识别 |
| 51 | SGQR ID 模板 | 固定 GUID `SG.SGQR` |
| 52 | MCC | PayNow 码常见 `0000` |
| 53 | 币种 | `702`（SGD） |
| 54 | 金额 | 可选 |
| 58 | 国家 | `SG` |
| 59 | 商户名 | ≤25 字符 |
| 60 | 城市 | 常为 `Singapore` |
| 62 | 附加数据 | `01` Bill Number。社区资料称 PayNow v1.2 删除了 26-05 参考号，改用 62-01 |
| 63 | CRC | CRC-16/CCITT-FALSE |

**各方案 GUID 与子标签**（来自开源解析器，非官方规范，medium）：

- **`SG.PAYNOW`（PayNow）**
  - 00 = `SG.PAYNOW`
  - 01 = Proxy Type：`0` 手机号，`2` UEN
  - 02 = Proxy Value：手机号需带 `+65`，或 UEN
  - 03 = 金额可编辑标志：`0` 不可改，`1` 可改
  - 04 = 过期日：YYYYMMDD；也有实现用 YYYYMMDDHHMMSS，**存在冲突**
  - 真实标签里还见过 05（值 `QS`），含义不明，属历史遗留
- **`SG.COM.NETS`（NETS）**
  - 00 = `SG.COM.NETS`
  - 01 = QR Metadata：解码器按 23 位数字校验
  - 02 = Merchant ID
  - 03 = Terminal ID
  - 04 = Transaction Amount Modifier
  - 99 = Signature
  - NETS 码带签名，**只能交给 NETS 主机处理，第三方无法自行构造**
- **`SG.SGQR`（固定在 tag 51，标签元数据）**
  - 00 = `SG.SGQR`
  - 01 = SGQR ID Number：12 位，形如 YYMMDD+序号，前 6 位与 07 的日期一致
  - 02 = Version（如 `01.0001`）
  - 03 = 邮编（6 位）
  - 04 = 楼层（Level）
  - 05 = 单元（Unit）
  - 06 = Misc（柜台/终端）
  - 07 = New Version Date（YYYYMMDD）
  - 银行登记表要求商户提供 postal code / level / unit，与上述子标签对应
- **其他已见 GUID**：`COM.GRAB`（GrabPay）、`SG.AIRPAY`（ShopeePay，子标签 01 为商户账户信息）、`COM.ALIPAY`（子标签 01 为 `https://qr.alipay.com/...` URL）、`COM.MYFAVE`（子标签 01 为 URL）、`SG.COM.DASH.WWW`（Singtel Dash）。

**真实 SGQR 标签样例**（某慈善机构，CRC `A177` 已本地校验通过）：

```
00020101021126430009SG.PAYNOW010120210T04SS0129D030110502QS
51810007SG.SGQR011221073031741D020701.00010306600316040201050327906040000070820210730
5204000053037025802SG5925LOVING HEART MULTI-SERVIC6009Singapore6304A177
```

逐项解码：

- 00=`01`；01=`11`（静态）
- 26
  - 00=`SG.PAYNOW`
  - 01=`2`（UEN）
  - 02=`T04SS0129D`
  - 03=`1`（金额可改）
  - 05=`QS`
- 51
  - 00=`SG.SGQR`
  - 01=`21073031741D`
  - 02=`01.0001`
  - 03=`600316`
  - 04=`01`
  - 05=`279`
  - 06=`0000`
  - 07=`20210730`
- 52=`0000`；53=`702`；58=`SG`；59=`LOVING HEART MULTI-SERVIC`（截断到 25 字）；60=`Singapore`

**有没有跨境专用字段或 GUID**：在 SGQR 里**未查到**。入境的境外钱包（Alipay+、DuitNow、QRIS、PromptPay 用户）走的是“扫 SGQR 标签 → 钱包解析 `SG.COM.NETS` 载荷 → 经本国交换机转发到 NETS”。是否存在专门的跨境 GUID，未查到。

**识别规则**：

- 判定为新加坡国家码：58=`SG`、53=`702`、tag 51 的 GUID 为 `SG.SGQR`，或任一 26–50 模板的 GUID 以 `SG.` 开头。
- 路由：按 GUID 选通道。
  - `SG.COM.NETS` → NETS（入境方案收单）
  - `SG.PAYNOW` → 经 FAST 参与者发起 PayNow 贷记
  - `COM.GRAB` → GrabPay/StraitsX 通道
  - 其余方案 → 无合作则不可付

### 2.3 底层支付轨道

- **FAST**（Fast And Secure Transfers）：7×24 实时零售贷记转账，具备 ISO 20022 报文能力（Mastercard 介绍）。由 ABS 体系下的 BCS（Banking Computer Services）运营（EY 报告称 BCS 为“Singapore's key payment network operator”）。单笔上限常见为 S$200,000（银行文档）。银行与非银电子钱包之间的转账，部分银行设 S$5,000 上限（Citi）。FAST 交易量：2024 年 5.0 亿笔、约 S$6,617 亿；2023 年约 3.8 亿笔。
- **PayNow**：建在 FAST 之上的寻址层（proxy = NRIC、手机号、UEN），支持 P2P 与 P2M。商户收款计划收费：据二手资料，UOB 自 2026 年起对企业 PayNow 收款按每笔 S$0.20 收费；用个人手机号收款的熟食摊不受影响。
- **结算**：MEPS+ 是 MAS 运营的 RTGS，正在分两阶段迁移 ISO 20022（对齐 CBPR+/HVPS+），后续系统为 SCRIPS。FAST 在 MEPS+ 上做净额结算，二手资料称“每日两次批量结算”。**结算周期原文未核实**（low）。
- **参与者与外国机构接入**：MAS 2020-11-30 宣布，从 2021-02 起，持 MPI 牌照的非银机构可通过 API 支付网关（由 Direct FAST Working Group 开发）直接接入 FAST/PayNow。Liquid Group、Wise 等已接入。外国机构要直连，必须先在新加坡取得 MPI 牌照；否则只能通过本地持牌参与者。
- **NETS**：本地 EFTPOS/QR 网络，运营 NETS QR，担任 SGQR+ 主收单方，并与 PayNet 组成合资公司担任 Nexus 技术运营商。NETS 股东结构（本地三大银行）为记忆，**未在线核实**。

### 2.4 跨境 QR 联通现状

| 对手方 | 方向 / 形式 | 日期 | 模型与备注 | 置信度 |
|---|---|---|---|---|
| 马来西亚 DuitNow QR ↔ NETS QR | 双向，线下扫码 + 跨境电商 | 2023-03-31 | NETS ↔ PayNet。新方首批参与者：DBS、OCBC、UOB。马方首批参与者：AmBank、Boost、CIMB、HLB、Maybank、Public Bank、Razer Merchant Services、TNG Digital、UOB Malaysia | high |
| PayNow ↔ DuitNow（P2P） | 双向汇款 | 2023-11-17（SFF） | 每日上限 RM3,000 / S$1,000。首批：Liquid Group、Maybank SG、OCBC、UOB；CIMB、Maybank、TNG Digital | medium |
| PayNow ↔ PromptPay（P2P） | 双向汇款 | 2021-04-29 | 每日上限 S$1,000 / THB25,000 | high |
| Thai QR/PromptPay ↔ NETS QR | 双向 | 2018 年 ITMX–NETS 计划；2022-08-04 扩展 | 新加坡人可用 DBS PayLah!、OCBC 在泰国 800 万+ 受理点付款；泰国游客扫 NETS QR | medium |
| 印尼 QRIS ↔ NETS QR | 双向 | 第三方博客称 2023-11-17 | 印尼央行官方页面列新加坡对应码为 NETS QR；不是所有 NETS 码都支持 | 日期 low，联通事实 high |
| 印度 UPI ↔ PayNow | P2P | 2023 | PayNow 三条走廊之一 | medium |
| 中国 | 出境 | 2025-11-28 签约，2026 Q1 落地 | 银联国际 × NETS 基础设施，OCBC 用户可在中国微信支付商户扫码 | medium |
| Alipay+（含 AlipayHK、TNG、GCash、TrueMoney、Kakao Pay 等） | 入境 | 2023-04 | 经 NETS 接入 SGQR，约 11,000 个熟食摊；Alipay 自 2019 年起已在 SGQR 内有载荷（`COM.ALIPAY`） | medium |
| Alipay+ → GrabPay（StraitsX，稳定币清算） | 入境 | 2024-11-05 | 9 国游客扫 GrabPay 码；XSGD + PBM（Avalanche）清结算；商户实时收 SGD | medium-high |

- 入境游客限额、FX 报价方、结算行：新加坡各条线**大多未查到**官方披露。行业惯例是由发卡侧交换机或钱包报价，商户按本币全额入账。
- 境外钱包在新加坡的受理方式：**直接扫 SGQR 标签**（不另贴品牌码），前提是标签里有对应合作方的载荷（NETS 或 GrabPay）。是否支持要看商户的收单方：没有 NETS 载荷的标签，NETS 入境伙伴无法支付。社区资料称，Singtel Dash 2025-07 才开始支持扫 SGQR 标签上的 NETS 码，且不含 POS 动态码。
- **PayNow Gen2**（MAS 与 ABS，2026-06-25）：PayNow 与 NETS QR 互操作的 POC 计划 2026 年底前试点，目标是“一码通扫”；实施路线图 2026 年底发布。MAS 董事总经理 2025-11 表示 “PayNow and QR can now be used in Thailand, Malaysia, Indonesia and India”。
- **区域**：Nexus Global Payments 是新加坡注册的非营利担保有限公司，创始成员为 RBI、BNM、BSP、MAS、BOT。2026-02 选定 PayNet 与 NETS 合资公司为技术运营商，目标 2027 年上线（至少连接 3 个司法辖区）。

### 2.5 监管

1. **牌照**。PS Act 2019 涵盖 7 类服务：账户发行、境内转账、跨境汇款、商户收单、电子货币发行、DPT 服务、换汇。在新加坡开展业务须持牌，持牌人须在新加坡有永久营业地址或注册办公室。外国公司可以持牌。若 INSPAY 不在新加坡经营、只与新加坡持牌机构合作，**通常不需要自己持牌**，但需要律师意见。若要直连 FAST，或在新加坡做收单/DPT，就需要 MPI 牌照。SGQR 受理还要遵守《Guidelines on Participation in the SGQR Scheme》（2023-12-01 生效）。
2. **数据本地化**。新加坡没有一般性的金融数据本地化要求，适用 PDPA 的跨境传输义务和 MAS TRM 指引。本条为记忆，**未在线核实**（low）。
3. **外汇**。新元“非国际化”政策：MAS Notice 757 规定，银行向非居民金融机构提供超过 S$500 万的新元授信时，若款项汇出境外须换汇；有理由怀疑用于投机新元汇率的一律禁止。经常项下支付不受限制，对零售支付清算影响小。
4. **稳定币与加密资产**。
   - **SCS 框架**（2023-08 定稿）：锚定 SGD 或 G10 货币（**JPY 属 G10**）；流通量超过 S$500 万的发行人纳入；最低资本取 S$100 万与年度运营开支 50% 的较高者；储备不低于面值；直接赎回须在 5 个工作日内按面值兑付。
   - **2026-09-01 PS Act 修订征求意见**（2026-10-16 截止，尚未成法）：
     - 新设“stablecoin issuance”牌照，只有持牌者可用 “MAS-regulated stablecoin” 标签；
     - 拟允许新加坡与外国联合发行的稳定币获得该标签；
     - 拟认可外国监管等效的稳定币，逐案认可，需要 MAS 与外国监管机构签双边安排；
     - 可指定“系统性稳定币”，考量规模和与支付系统的关联度；
     - 禁止付息；银行须通过独立法人发行；
     - 发行人须具备追踪、冻结、销毁能力；
     - 不在框架内的稳定币继续按 DPT 监管。
   - **StraitsX**：获 MAS 原则性批准（MPI，DPT 服务），覆盖 XSGD/XUSD 发行，并称“实质符合即将实施的 SCS 框架”。
   - **DTSP 制度**：2025-06-30 起，只服务境外客户的新加坡数字代币服务商须持 FSMA 牌照，否则停业，无过渡期。已持 PS Act DPT 牌照者不受影响。
   - **项目**：Project Orchid（2021 起，数字新元与 PBM）；Project Guardian（资产代币化）；**BLOOM**（2025-10-16 启动，用代币化银行负债和受监管稳定币做结算，覆盖多币种、跨境、批发场景；参与者含 Circle、DBS、OCBC、Partior、Stripe、UOB、Ant International、StraitsX、Coinbase）。
   - 2026-10-16 MAS 另有咨询，拟要求 MPI/SPI 和稳定币发行人加入 FIDReC，仅见摘要（low）。

### 2.6 本地结算/收单合作方候选

| 类型 | 候选 | 理由 |
|---|---|---|
| 国家网络 / 主收单方 | **NETS** | SGQR+ 主收单方；已接入 Alipay+、DuitNow、QRIS、PromptPay 等入境方案；Nexus 技术运营商合资方 |
| 交换 / 跨境聚合 | **Liquid Group**（XNAP） | SGQR+ POC 交换运营方；FAST 直连非银；已有 PayNow/Thai QR 跨境合作（如菲律宾 AUB） |
| 稳定币发行 / 兑换（MPI-DPT） | **StraitsX**（XSGD/XUSD） | Alipay+ × Grab 先例；BLOOM 跨境结算工作流参与者 |
| 稳定币发行 / 兑换（MPI-DPT） | **dtcpay** | SGQR+ 发卡方；SBI 集团是战略投资者，有日本渊源 |
| 稳定币发行 / 兑换（MPI-DPT） | **OKX SG** | GrabPay 稳定币支付先例 |
| 稳定币发行 / 兑换（MPI-DPT） | Triple-A | GrabPay 加密充值先例 |
| 方案收单方 | **GrabPay**（`COM.GRAB`，约 2.5 万+ 商户） | StraitsX/Alipay+ 先例 |
| 银行 / FAST 参与者 / 结算行 | DBS、OCBC、UOB、Maybank SG、MariBank、Wise（FAST 直连） | 本地结算与 SGD 出款 |

### 2.7 对我们方案的技术含义（新加坡）

- **建议路径 A（最快）：与 StraitsX 或 dtcpay 这类持牌 DPT-MPI 合作。**
  - 流程：INSPAY 在境外把 USDC 或 JPYC 兑成 XSGD 或 SGD，由合作方完成 SGD 出款或结算。
  - 前端受理：(i) 经 NETS 的入境方案通道受理 SGQR 上的 `SG.COM.NETS` 载荷，覆盖面最大；(ii) 经 GrabPay 通道受理 `COM.GRAB`。
- **路径 B：以“境外方案”身份与 NETS 签双边入境协议**，模式同 DuitNow、QRIS、PromptPay、Alipay+。INSPAY 的交换机对接 NETS 主机，NETS 负责商户侧本币结算。
- **路径 C（中长期）：PayNow 寻址付款。** 需要 FAST 参与者代为发起贷记。P2M 收费与 KYC 归类要谨慎处理；可关注 PayNow Gen2 的互操作进展。
- **技术坑**：
  - 必须按 GUID 路由，不能写死 tag 号。
  - tag 51 不是支付账户。
  - 静态码要用户输入金额；PayNow 03=0 时金额不可改。
  - NETS 码有 99 签名，动态码只能原样提交 NETS。
  - PayNow 过期日格式不统一。
  - 59 截断到 25 字，展示名应以收单方或名称查询返回为准。
  - 对账可用 62-01 Bill Number 和 51-01 SGQR ID 作为商户主数据键。
  - 退款与撤销机制：NETS 入境方案的退款接口**未查到**，需要在合作谈判中确认。
  - 小额高频场景下，PayNow 企业收款每笔收费（如 S$0.20）会压缩利润。

---

## 3. 马来西亚

### 3.1 国家二维码标准

| 项目 | 内容 | 置信度 |
|---|---|---|
| 名称 | **DuitNow QR**（National QR Standard） | high |
| 法律基础 | BNM 的 Interoperable Credit Transfer Framework（ICTF，2018-07-01 生效）要求共享基础设施运营方 PayNet 实施统一的可互操作 QR 标准 | medium-high |
| 运营方 | **PayNet**（Payments Network Malaysia Sdn Bhd），2017 年由 MyClear 与 MEPS 合并而成。2017 年 BNM 持股 35.5%，另有 11 家金融机构股东 | medium-high |
| 发布 / 上线 | 2019-07-17 软启动（Public Bank 首家）；2019-11 GrabPay 成为首个采用的电子钱包；TNG 2020 年、Boost 2021 年加入 | high |
| 规范版本 | PayNet “QR Generation Specification – Merchant-Presented Mode” **V1.5**。规范基于 EMVCo QRCPS MPM，同时包含 CPM、交易与报文、结算、终端要求等章节 | medium |
| CPM | 有。消费者在 App 生成码、商户扫码，在线处理；交易码 240（扣款请求）、880（预授权）、250（预授权完成），均为境内交易 | medium |
| 静态/动态 | POI `11`（静态）/ `12`（动态）。社区逆向称动态码里的账户号是收单方分配的临时值，有效期约 60 秒（low）。过期响应码 D313（QR Expired） | medium / low |
| 规模 | 2025 年 PayNet 共处理 8.44 亿…更正：**84.4 亿笔**数字支付（银行渠道 +30.69%，非银 +71.7%）。DuitNow QR 约 30 亿笔（2024 年 15 亿，BNM 数据）。2025 年新增 681,250 个受理点（其中 MSME 267,780 个），累计 >300 万。跨境 QR 2,970 万笔（2.5 倍）。整个 DuitNow 系统（RPP）2025 年约 54.4 亿笔、约 RM3.64 万亿（二手）。用户数**未查到** | high（PayNet/BNM）；DuitNow 系统数据为 medium |

### 3.2 码结构细节（PayNet MPM V1.5，GitHub 镜像，示例 CRC 已校验）

**顶层字段：**

| ID | 名称 | 格式 / 长度 | 出现 | 说明 |
|---|---|---|---|---|
| 00 | Payload Format Indicator | N2 | M | **固定 `02`**，与 EMVCo 的 `01` 不同 |
| 01 | Point of Initiation | N2 | M | `11` 静态 / `12` 动态 |
| 26 | Merchant Account Information | ANS ≤99 | M | DuitNow 模板 |
| 27 | （保留） | | | RFU |
| 52 | MCC | N4 | M | `0000` = P2P；`6010` = POS 取现 |
| 53 | 币种 | N3 | M | `458`（MYR） |
| 54 | 金额 | ≤13 | C | 由 App 提示用户输入时省略 |
| 55 | Tip / Convenience Indicator | N2 | O | `01` 提示输入小费；`02` 固定费；`03` 百分比 |
| 56 | 固定便利费 | ≤13 | C | 55=`02` 时必填 |
| 57 | 便利费百分比 | ≤5 | C | 55=`03` 时必填，范围 0.01–99.99 |
| 58 | 国家 | 2 | M | `MY` |
| 59 | 商户名 | ≤25 | M | |
| 60 | 城市 | ≤15 | M | 不适用时填 `MY` |
| 61 | 邮编 | 5 位 | O | |
| 62 | 附加数据模板 | ≤99 | C | JomPAY 必填 |
| 64 | Merchant Info Language Template | | O | 00 语言、01 商户名（替代语言）、02 城市（替代语言） |
| 82 | Data Integrity Check | ≤99 | O | SHA-256 哈希 |
| 63 | CRC | 4 | M | 必须位于最后 |

**Tag 26 子标签：**

| 子标签 | 名称 | 格式 / 长度 | 出现 | 说明 |
|---|---|---|---|---|
| 00 | AID | ANS 14 | M | **`A0000006150001`** |
| 01 | Acquirer ID | ≤6 | M | 收单机构 ID，见下表 |
| 02 | QR ID | AN ≤28 | M | 收单方分配的商户/收款人号；JomPAY 填 Biller Code |
| 03 | Merchant Descriptor | ≤20 | O | |
| 04 | Mobile Number | ≤15 | O | |

**Tag 62 子标签：**

| 子标签 | 名称 | 说明 |
|---|---|---|
| 01 | Bill Number | ≤25 |
| 02 | Mobile | ≤25 |
| 03 | Store Label | ≤25 |
| 04 | Loyalty Number | ≤25 |
| 05 | Reference Label | ≤25 |
| 06 | Customer Label | ≤25 |
| 07 | Terminal Label | ≤25 |
| 08 | Purpose of Transaction | ≤25 |
| 09 | Additional Consumer Data Request | A 地址 / M 手机 / E 邮箱 |
| 10 | Merchant Tax ID | ≤15 |
| 11 | Merchant Channel | 3 位：第 1 位为媒介（0–3 印刷，4–7 屏幕）；第 2 位为交易地点；第 3 位为商户在场情况。例 `400` = 商户场所内 POS 屏幕、有人值守 |
| 90 | RRN（Ref-1） | ≤20；JomPAY 必填 |
| 91 | RRN2（Ref-2） | ≤30 |
| 92 | Geo Coordinates | ≤35 |

**跨境相关**：二维码里**没有跨境专用字段或 GUID**，商户用的是同一张 DuitNow QR。跨境体现在交易层：交易码 031（cross-border POS）和 521（cross-border account enquiry），以及针对新加坡、印尼、泰国、中国的跨境响应码。

**部分 Acquirer ID**（PayNet 目录 2026，共 70 条，medium）：

- **银行**
  - Maybank 588734、CIMB 501854、Public Bank 564162、RHB 564160
  - Hong Leong 588830、AmBank 564169、Affin 501664、Alliance 504374
  - UOB（马）519469、OCBC（马）504324、HSBC（马）589836、StanChart（马）539981
  - **MUFG Bank (M) 629196、SMBC (M) 629238、Mizuho (M) 629220**
  - GX Bank 629279、AEON Bank 629295
- **电子钱包 / 非银**
  - TNG Digital 890053、GrabPay MY 890046、ShopeePay MY 890004、Boost 890061、BigPay 890012
  - Razer Merchant Services 890087、iPay88 890079、2C2P 890285、Paydibs 890269
  - **Stripe Payments Singapore Pte Ltd 890137**（一家新加坡注册实体出现在收单目录里，值得关注）
- **JomPAY**：898989

**PayNet 官方示例**（本地 CRC 校验全部通过）：

1. 静态零售：
   ```
   00020201021126410014A000000615000101065016640209123456789520499995303458540510.005802MY5909QRCSDNBHD6005BANGI6304343F
   ```
   解码：PFI=`02`；POI=`11`；26 = AID `A0000006150001` / 收单 `501664`（Affin）/ QR ID `123456789`；MCC=`9999`；币种 `458`；金额 `10.00`；`MY`；`QRCSDNBHD`；`BANGI`。
2. 静态 P2P：同上，但 MCC=`0000`、59=`AUSERNAME`，CRC `3A23`。
3. 带 ID 82：在 63 之前插入 `8264` + 64 位十六进制 SHA-256，CRC `B623`。
4. JomPAY：
   ```
   00020201021126360014A00000061500010106898989020412345204111153034585802MY5903TNB6002KL610559200621790130124007552406823231d4db4506dc9852b1c21c74be148b8363045DFB
   ```
   解码：26 的收单为 `898989`、Biller `1234`；61=`59200`；62-90=`0124007552406`；82 为 32 位哈希。

另有 AmBank 真实码片段（gist）：`26` 里 01=`564169`、02=`QRAMB0000000002273409`，MCC `5045`，金额 `1.00`。

**识别规则**：判定为马来西亚国家码的条件是：任一 26–51 模板（实际上就是 tag 26）的子标签 00 = `A0000006150001`，且 58=`MY`、53=`458`。解析器**不要因为 PFI=`02` 报错**。路由时用 26-01 的 Acquirer ID 识别本地收单方。跨境支付不需要我们直接对接收单方，统一经 PayNet 跨境网关处理，由 PayNet 按收单方 ID 转发。

### 3.3 底层支付轨道

- **RPP**（Real-time Retail Payments Platform）：PayNet 运营，基于 ACI UP Real-Time Payments，**从一开始就用 ISO 20022**，7×24。首个公众服务是 DuitNow 转账（寻址方式：手机号、NRIC、护照、商业登记号 BRN）。DuitNow QR 和 DuitNow Online Banking/Wallets 也跑在 RPP 上。36 家银行在 9 个月内接入；非银机构（电子钱包、第三方收单）后续开放。
- **结算**：参与者在 RENTAS（BNM 的 RTGS）上做净额结算。**周期与机制未查到**原文（low）。
- **准入**：2017 年起的政策是“对银行与合格非银 PSP 公平开放”。PayNet 数字注册商户要求合作方为马来西亚注册的 BNM 注册第三方收单方或获批电子货币发行人，且有 ≥3 年电子支付/收单经验，并满足最低净资产要求。外国机构要么在马来西亚设实体取得牌照，要么通过 PayNet 的跨境网关以“境外方案/网络”身份接入（Alipay+、银联、NPCI、BC Card 都是这种模式）。Wise 2026-07-30 宣布直连 PayNet，是 Wise 全球第 9 个直连本地支付系统，支持扫 DuitNow QR 和 DuitNow 转账；Wise 在马来西亚的牌照情况**未核实**。

### 3.4 跨境 QR 联通现状

| 对手方 | 方向 / 日期 | 模型 | 置信度 |
|---|---|---|---|
| 泰国 PromptPay / Thai QR | 一期 2021-06-18：泰国用户扫 DuitNow；二期（马→泰）原定 2021 Q4，实际上线日期未查到；三期汇款原定 2022 Q4 | PayNet ↔ NITMX；**CIMB Group / CIMB Thai 为跨境结算行**，泰方机构经 CIMBT 接入；首批 CIMB Thai 与 Public Bank；2021-12-01 起扩展林吉特-泰铢结算框架，简化外汇手续 | high |
| 新加坡 NETS QR | 双向 2023-03-31 | PayNet ↔ NETS；结算行未查到 | high |
| 印尼 QRIS | 试点 2022-01-27，商用 2023-05-08 | PayNet ↔ 印尼支付系统协会（ASPI）体系；**汇率由 LCS 框架下的 ACCD 银行提供** | high / medium |
| 柬埔寨 KHQR / Bakong | 一期 2024-09（柬→马，Bakong App 扫 DuitNow）；二期 2025-04-08（马→柬） | 央行对央行 | high |
| 中国 银联 | 入境 2023-09 起；反向“稍后” | 银联国际 × PayNet | medium-high |
| Alipay+（Alipay、AlipayHK、HelloMoney、Hipay、MPay、Naver Pay、Toss Pay、TrueMoney 等） | 入境 2023-10-31（上线时 180 万+ 受理点）；2025-08-21 深化合作推进反向出境（覆盖约 1 亿 Alipay+ 商户），上线日期未确认 | 聚合网络接入 PayNet；**占入境跨境 QR 的 >80%** | medium-high |
| 韩国 BC Card（Paybooc） | 一期入境已上线；二期出境未定 | | medium |
| 印度 NPCI / UPI | 2026-02 签约；一期入境、二期出境；是否已上线未确认 | | high（签约事实） |
| 日本 JPQR | 2024 年报道称“2025 财年实现”，**未查到上线证据** | | low |

- **商户侧**：PayNet FAQ 称，商户只要开通了 DuitNow QR 受理，就**自动受理跨境 QR**，按本币 MYR 入账，费率同境内（Alliance Bank）。PayNet FAQ 列出的入境来源国：印尼、新加坡、泰国、中国、柬埔寨、韩国。
- **境外钱包受理方式**：**直接扫 DuitNow 国家码**，不另贴品牌码。
- **限额**：入境限额由发卡侧决定（未查到 PayNet 统一上限）。马来西亚用户出境常见单笔 RM3,000，每日 RM10,000–50,000 不等（Public Bank、RHB）；Maybank 2023 年为每日 RM1,000。

### 3.5 监管

1. **牌照**。
   - 商户收单须按 FSA 2013 第 17 条注册；BNM《Merchant Acquiring Services》政策文件 2021-09-15 发布（非银机构有最低资本要求）。
   - 电子货币发行须经 BNM 批准；跨境汇款受 MSBA 2011 约束（记忆，**未核实**）。
   - 境外钱包要受理 DuitNow QR，现行做法是作为境外方案或网络与 PayNet 签约。PayNet 会对接对方交换机，并指定马来西亚结算行（参照泰马线路由 CIMB 担任结算行）。
2. **数据**。BNM 的 RMiT 和外包政策规定：重大外包须事先获批；关键系统上云前须咨询 BNM；客户数据和密钥须保持控制权；第三方保存信用转账客户数据须事先获批。**没有查到对外国钱包的明确数据本地化条文**。
3. **外汇**。
   - 林吉特是非国际化货币，离岸交易任何形式（NDF、境外期货期权）都违反政策（BNM 2016–2017 立场，2024-11 再次重申后，林吉特 NDF 成交量骤降）。
   - 非居民的林吉特账户（External Account）有资金来源和用途限制。
   - 国际贸易林吉特结算须经在岸持牌银行或 Appointed Overseas Office（二手）。
   - 新机会：**日马本币结算合作备忘录（2026-09-15）**，以及 US$60 亿双边互换（2026-09-18 生效）。
4. **加密 / 稳定币**。
   - BNM/SC 2020-12-16 联合回应：数字资产“不是 BNM 监管的支付工具，也不是可依法用于交换商品和服务的货币”。2018 年也重申过“不是法定货币”。
   - SC 监管数字资产的发行与交易（DAX 等）；具有支付功能的须同时遵守 BNM 支付相关法规。
   - BNM DAIH（2025-06 设立）2026-02-11 选定 3 个试点，均为批发、可控环境：渣打 + Capital A 的林吉特稳定币 B2B 结算；Maybank、CIMB 各一个代币化存款试点。BNM 承诺 2026 年底前对林吉特稳定币/代币化存款给出政策澄清。
   - BNM 资产代币化三年路线图（2025–2027）；讨论文件征求意见至 2026-03-01。
   - 私营林吉特稳定币 **RMJDT**：Bullish Aim（柔佛摄政王所有）2025-12-09 在 Zetrix 链上发行，自称“在受监管沙盒框架下”，监管方身份未获官方确认。
   - SC 截至 2025-12-03 共注册 6 家 DAX 运营商（RMO，名单未完全核实）。SC 修订后的 DAX 指引 2026-05-20 生效。
   - **零售加密支付不被承认**。在马来西亚境内用稳定币直接向商户付款，存在明显监管风险。

### 3.6 本地结算/收单合作方候选

| 类型 | 候选 | 理由 |
|---|---|---|
| 国家网络 | **PayNet** | 方案级跨境接入，参照 Alipay+、银联、NPCI、BC Card 的模式 |
| 跨境结算行 | **CIMB**（泰马线结算行）、Maybank、Public Bank、RHB、HLB | 对外结算与入账 |
| 日资在马子行 | **MUFG Bank (Malaysia)、SMBC Malaysia、Mizuho Malaysia** | 均为 DuitNow 收单参与者；最适合承接日马 LCS 下的 JPY/MYR 兑换与结算 |
| 非银收单 / 钱包 | TNG Digital（与 Ant 关联）、GrabPay MY、Razer Merchant Services（新马线参与者）、iPay88、2C2P、Stripe（890137）、Paydibs（2026-05 直连 PayNet） | 本地收单与商户覆盖 |
| 加密出入金 | SC 注册的 DAX（Luno、SINEGY、Tokenize、HATA 等） | **只能用于法币出入金，不宜作为支付结算代理** |

### 3.7 对我们方案的技术含义（马来西亚）

- **建议路径：INSPAY 作为“境外方案/网络”接入 PayNet 跨境网关（模式同 Alipay+）。**
  - 境外：用 USDC 或 JPYC 预存/预付资金，在境外兑换成 USD 或 JPY 法币。
  - 境内：由马来西亚结算行（优先考虑日资在马子行，或 CIMB、Maybank）在岸兑换成 MYR，在 RENTAS 上与 PayNet 净额结算。
  - 商户：照常收 MYR。
  - 稳定币全程不进入马来西亚境内，不让商户或在岸主体持有。
- **技术坑**：
  - PFI 为 `02`；
  - 静态码没有 54 时需要用户输入金额；
  - 动态码约 60 秒有效（未核实）+ D313 过期，FX 锁价窗口必须短于码的有效期；
  - 便利费 / 小费（55/56/57）要计入外币报价；
  - 59 截断到 25 字，可用 64 的替代语言商户名；
  - 跨境账户查询（交易码 521）可用于展示商户名称；
  - 对账键：62-05、62-07、62-90/91 和收单 ID + QR ID；
  - JomPAY 码（收单 898989）属于账单支付，应排除或单独处理；
  - MCC `0000` 是 P2P 码，应考虑按 AML 要求禁用；
  - 退款、撤销的跨境流程**未查到**。

---

## 4. 端到端草图：PayPay 用户在新马扫国家码（稳定币清结算）

1. **扫码。** PayPay App 内嵌或调用 INSPAY SDK 扫码，本地解析 TLV 并校验 CRC。
   - 马来西亚：判定为 `A0000006150001` 码 → 发起 PayNet 跨境账户查询（521），返回商户名。
   - 新加坡：取 `SG.COM.NETS` 载荷 → 交给 NETS 入境接口；或取 `COM.GRAB` → GrabPay/StraitsX 通道。
2. **报价。** INSPAY 给出 JPY 金额（含 FX 和费用），锁价时长小于码的有效期。PayPay 扣用户日元余额，资金进入 INSPAY 在日本的信托/预存户。
3. **授权。** 向 PayNet 或 NETS 发送授权，商户实时收到本币入账确认。
4. **清结算（T+0 或 T+1 净额）。**
   - 新加坡：INSPAY 把 JPYC/USDC → XSGD/SGD（经 StraitsX 等 MPI-DPT），向 NETS 或结算行付 SGD。
   - 马来西亚：INSPAY 把 JPYC/USDC → JPY/USD 法币，经日资在马子行或 CIMB 在岸兑换成 MYR，向 PayNet 结算账户付款。
5. **对账与退款。** 按交换机日终文件对账；退款走反向贷记或专用退款报文（需与 NETS/PayNet 确认）。

---

## 5. 风险汇总

| 类别 | 风险 |
|---|---|
| 监管 | MY 不承认加密资产是支付工具，林吉特不得离岸；SG 稳定币法案未落地，JPYC/USDC 的“认可外国稳定币”地位未定；DTSP 制度；PayPay 侧的日本资金移动业/电子支付手段监管 |
| 商业 | Alipay+ 在 MY 入境占比 >80%，在 SG 已有 NETS 与 Grab 双通道，PayPay 出境也已经用 Alipay+；我们需要价格或功能优势（如更低 FX 点差、日元稳定币直接结算） |
| 技术 | SGQR 多方案路由；NETS 签名码；PFI=02；动态码时效；静态码金额输入；退款；商户名展示；时区与日切；不同交换机的报文差异（ISO 20022 vs 私有 API） |
| 运营 | FX 头寸与预存资金；稳定币 → 法币兑换的银行通道（新加坡银行对加密资金的接受度）；AML/制裁筛查；Travel Rule |



### OPEN QUESTIONS
- SGQR 官方技术规范（MAS/IMDA）当前版本号与全文：是否另有跨境专用 GUID 或子标签？各方案在 tag 26–50 中的分配规则（是否由 SGQR 中央库统一分配）？
- NETS 入境方案的接入规范：境外交换机对接 NETS 的接口（报文标准、授权与清算文件、退款/撤销接口）、FX 由哪方报价、结算行与结算频率、单笔/单日限额、费率
- SGQR+ 在 2025–2026 的实际完成情况：dtcpay/MariBank 是否已在 2025 Q2 上线？目前受理点数和发卡方数是多少？新的境外方案能否以 SGQR+ 发卡方身份接入？
- PayNow 与 NETS QR 互操作 POC（PayNow Gen2，2026 年底试点）的技术模式，以及境外钱包是否能借此受理 PayNow 码
- INSPAY 若不在新加坡经营、只与 MPI 合作，是否需要 PS Act 牌照（跨境汇款/DPT）？需律师意见
- MAS 拟议的外国稳定币认可机制（双边安排、监管等效）对日本 JPYC/电子支付手段的适用性：日本 FSA 是否会与 MAS 签安排？USDC 能否获认可？
- StraitsX / dtcpay 能否作为 INSPAY 的 SGD 结算代理（USDC/JPYC → XSGD → SGD）？报价、限额与托管安排如何？
- PayNet 接纳新的境外方案或网络（如 INSPAY）的商务和技术条件：准入标准、是否需要马来西亚结算行、交易码 031/521 的报文规范、日终清算文件、费率
- 日马本币结算合作备忘录（2026-09-15）下指定的 ACCD 银行名单与可用产品（JPY/MYR 直接报价、对冲），MUFG/SMBC/Mizuho 马来西亚子行是否愿意担任 DuitNow 跨境结算行
- DuitNow 跨境入境的限额与 KYC 要求是否由 PayNet 统一设定；境外钱包 eKYC 的最低要求
- DuitNow 动态码有效期的官方值（社区称约 60 秒）与退款/撤销流程（跨境退款走反向贷记还是专用报文）
- RPP 与 FAST 在 RTGS（RENTAS / MEPS+）上的结算周期、预存/抵押要求的官方原文
- BNM 是否允许马来西亚 PayNet 参与者从境外稳定币相关机构收取 USD/JPY 结算资金？FEP 对结算资金来源有没有限制？需要什么证明材料？
- 马来西亚对外国钱包或支付机构的数据本地化要求（RMiT/外包政策）在跨境 QR 场景下的具体适用
- PayPay 是否愿意在 Alipay+ 之外再接一个出境网络？与 PayPay 的商务、技术集成方式（SDK、白标、API）
- HIVEX（PayPay 台湾出境所用网络）的运营方与模式；日本 JPQR Global 与 DuitNow/NETS 是否有进行中的互通项目
- Nexus Global Payments（PayNet–NETS 合资技术运营商）2027 年上线后，是否会开放给非央行体系的跨境网络接入