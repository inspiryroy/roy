# 印度尼西亚 QRIS 研究报告（INSPAY 稳定币版 Alipay+ 网络）

> 研究日期：2026-10-18｜主题：印尼（QRIS、Bank Indonesia、ASPI、GPN 交换机 Artajasa/Rintis/Jalin/Alto、BI-FAST）

## 0. 方法与局限

- **WebSearch 用了 30 次，额度已用完**。WebFetch 试了 4 次：bi.go.id、docs.antom.com、en.wikipedia.org 都是 DNS 失败（ENOTFOUND），只有 pkg.go.dev 拿到了内容（开源 go-qris 的 README）。所以 **BI、ASPI、OJK 的官方原文一份都没能在线打开**，引用的官方内容全部来自搜索摘要。
- **二手源码证据**：从 npm 下载了 `qris@0.0.1`、`qris-dinamis@1.0.2`、`@agungjsp/qris-dinamis@1.0.7` 并阅读，解压在 `/tmp/claude-0/-home-user-roy/bae04deb-36b8-5b47-bbfe-be5b01336a0d/scratchpad/r2/indonesia/`，代码没有执行。我另写了一个独立的 TLV 解析和 CRC 校验脚本，放在 `/tmp/claude-0/-home-user-roy/bae04deb-36b8-5b47-bbfe-be5b01336a0d/scratchpad/r2/indonesia_scripts/`，用它核对了样例 payload 的结构和 CRC（CRC-16/CCITT-FALSE，校验通过）。
- **没查到的内容**：
  - ASPI《QRIS 技术规范》原文（不公开）及其版本号；
  - URE 的官方定义，UME/UBE 的营业额阈值；
  - QRIS 跨境入境游客的单笔/日限额；
  - 跨境 FX 报价方和结算频率的官方细则；
  - 日本游客在印尼扫 QRIS（Japan inbound）是否已正式上线；
  - 外国 PJP 接入的 PADG 条文；
  - QRIS 退款报文标准；
  - P2P 个人码的官方 payload 格式；
  - PBI 7/14/PBI/2005 现在是否仍然有效。
- **置信度约定**：high = 官方一手且在线核实（本轮几乎没有）；medium = 权威二手、开源实现或只核实了一部分；low = 凭记忆，没有核实。

---

## 1. 国家二维码标准：QRIS

| 项目 | 内容 | 置信度 |
|---|---|---|
| 名称 | QRIS（Quick Response Code Indonesian Standard） | high |
| 所有者 / 监管 | Bank Indonesia（BI）拥有并监管；标准由 ASPI（Asosiasi Sistem Pembayaran Indonesia）制定和维护 | medium |
| 发布时间 | 2019-08-17 发布，2020-01-01 起强制使用（凭记忆）；法规为 PADG 21/18/PADG/2019，后由 PADG 24/1/PADG/2022 修订（凭记忆，未核实） | low |
| 技术基础 | EMVCo MPM（tag 00/01/26–51/52–63，CRC-16/CCITT-FALSE），已用开源样例核对 | medium |
| CPM | 有 QRIS CPM（用户出示码、商户扫码），BI 的 QRIS Tap 页面里拿它和 Tap 做对比 | medium |
| QRIS Tap（NFC） | 2025-03-14 正式上线。交易约 0.3 秒，首批用于 MRT Jakarta、TransJakarta、Damri、Trans Sarbagita 等交通场景 | medium |
| QRIS TUNTAS | 用 QR 做转账、取现、存现（P2P 与现金），只在非官方来源中看到 | low |
| 静态 / 动态 | tag 01：`11` 为静态，`12` 为动态 | medium |
| 单笔上限 | Rp10 juta（2022-03 起，此前为 Rp5 juta）；2026 年是否又上调，没查到 | medium |

**规模数据（各来源口径不一，使用前须对照 BI 原始数据）**

- 2025 全年：交易笔数 15.51 亿，同比 +148.54%（Kontan 转引 BI）。
- 2026 年 1 月：商户 4,306 万（+17.76% YoY），用户 5,998 万；当月 18.3 亿笔，金额 Rp164.48 万亿（+103.35%）。
- 2026 年 2 月：用户 6,077 万。
- 2026 年中（Fortune IDN）：用户 6,577 万、商户 4,486 万，其中 96.68% 为 UMKM；交易量同比 +82.42%。
- 另一报道称商户 4,711 万、BI 年末用户目标 6,932 万（日期不明）。
- BI 2026 年目标：170 亿笔、约 4,500 万商户。

---

## 2. 码结构细节

### 2.1 顶层 tag

| Tag | 含义 | QRIS 用法与要点 |
|---|---|---|
| 00 | Payload Format Indicator | `01` |
| 01 | Point of Initiation | `11` 静态 / `12` 动态。开源库把静态码改成动态码的做法，就是把 `010211` 换成 `010212`，再插入 tag 54 |
| 26–45 | Merchant Account Information（PJSP / 收单域） | 每个收单 PJSP 一个模板，同一张码可以放多个（26、27、…） |
| 51 | QRIS 国家域 | 子标签 00 = `ID.CO.QRIS.WWW`，02 = NMID，03 = merchant criteria |
| 52 | MCC | 例如 5499、4829 |
| 53 | 币种 | `360`（IDR） |
| 54 | 金额 | 动态码必填；静态码没有，由用户输入 |
| 55/56/57 | 小费 / 便利费 | `55=01` 提示输入小费；`55=02` 加 56 固定费；`55=03` 加 57 百分比（见开源代码 `55020256…` / `55020357…`） |
| 58 | 国家 | `ID` |
| 59 / 60 / 61 | 商户名 / 城市 / 邮编 | EMVCo 长度上限 25 / 15 / 10 |
| 62 | Additional Data | 01 Bill No.、02 Mobile、03 Store Label、04 Loyalty、05 Reference Label、06 Customer Label、07 Terminal Label（常见值 `A01`）、08 Purpose、09 Additional Consumer Data Request。go-qris 还列出 Merchant Tax ID、Merchant Channel、RFU、payment system specific |
| 63 | CRC | CRC-16/CCITT-FALSE（poly 0x1021，init 0xFFFF），计算范围包括 `6304` 本身 |

### 2.2 tag 26–45 子标签（收单 PJSP 域）

- **00 GUID**：反向域名，例如：
  - `COM.NOBUBANK.WWW`（npm qris 样例）
  - `COM.MEMBASUH.WWW`（go-qris 样例）
  - `COM.GO-JEK.WWW`（开源库样例，GoPay）
  - `ID.CO.BCA.WWW`、`ID.DANA.WWW` 在搜索结果里只是间接出现
  - 完整的 GUID 注册表（ASPI 维护）不公开，**未查到**。
- **01 Merchant PAN（MPAN）**：18–19 位，形如 `9360` + 4 位机构码（前 8 位即 **NNS，National Numbering System**）+ 商户序号 + 校验位。
  - 样例：`936005030000080819`（Nobu，NNS 93600503），`936000091100004515`，`936009143805979959`（GoPay 样例，NNS 93600914）。
  - 用 Luhn 校验时，只有 Nobu 那条通过，另两条疑似测试数据。结论：NNS 结构为 medium，末位是否为 Luhn 校验位为 low。
- **02 Merchant ID**：收单机构内部的商户号或终端号，例如 `08040000679159`、`0489371081`。
- **03 Merchant Criteria**：`UMI` / `UKE` / `UME` / `UBE` / `URE`。

### 2.3 tag 51（国家域）

- 00 = `ID.CO.QRIS.WWW`
- 02 = **NMID**（National Merchant ID），格式为 `ID` + 13 位数字，例如 `ID2020034073193`、`ID2021084066657`。前 4 位数字看起来是注册年份（据样例推断，medium）。
- 03 = merchant criteria
- 01 在样例中通常为空。

### 2.4 Merchant criteria 与 MDR

- **定义**（Bank Sampoerna FAQ，依据 UU 20/2008 的 UMKM 划分）：
  - UMI（Usaha Mikro）：资产 ≤ Rp50 juta / 营业额 ≤ Rp300 juta
  - UKE（Usaha Kecil）：资产 Rp50–500 juta / 营业额 Rp300 juta–2.5 miliar
  - UME（Usaha Menengah）、UBE（Usaha Besar）：阈值本轮没查到
  - URE：官方定义没查到（疑为 "Usaha Reguler"，未核实）
- **MDR**（BI QRIS 页面的搜索摘要，另与 Mandiri、Sampoerna 交叉核对）：
  - UMI：单笔 ≤ Rp500,000 为 0%，> Rp500,000 为 0.3%（0.3% 自 2023-07-01 起恢复收取）
  - UKE / UME / UBE：0.7%
  - 教育：0.6%；加油站（SPBU）：0.4%；G2P / P2G：0%
  - BRI 自 2024-12-01 起对 < Rp500k 的交易免 MDR。

### 2.5 样例 payload（开源样例，非真实商户）

① **go-qris 样例**（动态码，已独立校验 CRC=F98B，正确）：

```
00020101021226630016COM.MEMBASUH.WWW0118936000091100004515021004893710810303UMI51440014ID.CO.QRIS.WWW0215ID20200340731930303UKE5204482953033605404133755020256036665802ID5912Sintas Store6015Kota Yogyakarta61055500062070703A016304F98B
```

逐段解析：

| 段 | 内容 |
|---|---|
| `0002 01` | 版本 |
| `0102 12` | 动态 |
| `26` | 00 `COM.MEMBASUH.WWW`／01 `936000091100004515`／02 `0489371081`／03 `UMI` |
| `51` | 00 `ID.CO.QRIS.WWW`／02 `ID2020034073193`／03 `UKE` |
| `52` | `4829` |
| `53` | `360` |
| `54` | `1337` |
| `55` / `56` | `02` / `666`（固定便利费） |
| `58` | `ID` |
| `59` | Sintas Store |
| `60` | Kota Yogyakarta |
| `61` | 55000 |
| `62` | 07 = `A01` |
| `63` | `F98B` |

注意：这个样例里 tag 26 与 tag 51 的 criteria 不一致（UMI 对 UKE），可见实际码中可能出现不一致。

② **npm `qris` 样例字段**（Nobu Bank，UME），按字段重新组装，并用我自己的脚本算出 CRC=4FBA：

```
00020101021226670016COM.NOBUBANK.WWW01189360050300000808190214080400006791590303UME51440014ID.CO.QRIS.WWW0215ID20210840666570303UME5204549953033605405527505802ID5913TOKO MARENGGA6009Tangerang61051581062730114082700020430200520PN2UQIR0M4YRPFIBYAAE0620PN2UQIR0M4YRPFIBYAAE0703A0163044FBA
```

### 2.6 如何识别"这是 QRIS 国家码"以及应路由到哪里

1. **判定为 QRIS**：`58=ID`、`53=360`，存在 tag 51 且 51-00 = `ID.CO.QRIS.WWW`，51-02 符合 NMID 格式 `ID\d{13}`，CRC 校验通过。
2. **路由**：
   - 境内 issuer 按 tag 26–45 里的 MPAN 前 8 位 NNS 识别收单 PJSP，同行就 on-us 处理，否则经 GPN switching 走 off-us。
   - NMID 用于全国商户库登记、去重和展示。
   - **外国钱包不需要、也不应自行解析 NNS 去找收单方**：在跨境模型下，它把整串 payload 交给本国 switch 或 hub，由对端的印尼 switch 路由（推断，medium）。
3. **P2M 与 P2P 的区分**：P2M 码一定带 tag 51 NMID 和 merchant criteria。QRIS TUNTAS 转账码（P2P）的官方格式**未查到**。建议只受理同时满足"tag 51 存在、NMID 合法、MCC 不属于 4829/6012/6051 这类转账或准现金类"的码，其余一律拒绝（属工程建议，不是规范要求）。

---

## 3. 底层支付轨道

| 层 | 机构 / 系统 | 要点 | 置信度 |
|---|---|---|---|
| QR 交换（switching） | GPN 持牌 switching：PT Artajasa Pembayaran Elektronis（ATM Bersama）、PT Rintis Sejahtera（ATM Prima）、PT Daya Network Lestari（Alto）、PT Jalin Pembayaran Nusantara（Jalin，2019 年起大股东由 Telkom 变为 PT Danareksa (Persero)） | Jalin 2019 年取得 QRIS 运营许可，2018 年取得 BI-RTGS 参与许可。2024-08 时 Artajasa 的 ATM Bersama QR 有 59 家成员，自称占全国 off-us QR 交易量的 61% | medium |
| GPN 规则 | PBI 19/8/PBI/2017 | 境内交易（印尼发行的工具 + 在印尼发生）必须经 GPN 处理。switching 机构须 ≥80% 本国持股（外资 ≤20%），系统、应用、数据中心、灾备都须在境内；issuer/acquirer 至少接 2 家 switching；最终结算在 BI | medium（律所摘要） |
| 结算 | BI-RTGS | switching 之间、银行之间的最终结算在 BI。QRIS 商户的入账时限（如 D+1）没查到 | low |
| 即时支付 | **BI-FAST**（BI 运营） | 2021-12 上线（PADG 23/25/PADG/2021）；7x24、实时，约 25 秒完成；单笔上限起始 Rp250 juta；BI 向参与者收 Rp19/笔，参与者向客户收费最高 Rp2,500。参与者为银行和非银行机构（LSB），首批 22 家、第二批 22 家。采用 ISO 20022 和 proxy（手机号/邮箱）寻址：未核实 | medium / low |
| 外国机构接入 | 外国机构不能直接成为 GPN 或 BI-FAST 参与者 | 只能通过印尼持牌 PJP、银行，或经 BI 双边框架下的跨境 switch 接入（推断，medium） | medium |

---

## 4. 跨境 QR 联通现状

### 4.1 已联通或在推进的国家（截至 2026-10）

| 国家 / 地区 | 方向 | 上线时间 | 对端系统 / 机构 | 备注 |
|---|---|---|---|---|
| 泰国 | 双向 | 2021-08 试点，2022-08 商业化 | PromptPay（ITMX，名称未核实） | 截至某时点约 164 万笔 |
| 马来西亚 | 双向 | 2022 年试点，2023-05 商业化 | DuitNow（PayNet） | 马来游客是入境最大用户群，交易集中在 Bandung、Tanah Abang |
| 新加坡 | 双向 | 2023-11-17 | NETS QR / SGQR | 日期来自二手博客，medium |
| **日本** | **出境**（印尼人在日本扫 JPQR Global） | **2025-08-17**（BI 新闻稿日期）；2025-08-25 在大阪世博印尼馆办启动仪式 | BI、ASPI、METI、PJA，JPQR Global 运营方 **Netstars** | 首批 35 家商户，14 家银行的手机银行加若干钱包；GoPay 2025-09 加入；早期累计 5,088 笔、Rp4.288 亿；日本 UC Card 为日本商户提供 QRIS 受理导入支持 |
| 日本（入境） | 日本钱包在印尼扫 QRIS | **未确认上线** | — | 2026-04 BI 副行长 Filianingsih 称已取得 **日本 FSA 许可**，"很快会有 Indonesia inbound"；BI 2026-09 的入境统计口径列出 6 国，包括日本，但没有逐国拆分。第 7 节的建议以此为前提 |
| 韩国 | **出境** | 2026-04-01 | BI 与 Bank of Korea，ASPI 与 KFTC | 本币直接结算；韩国游客入境方向是否开通未查到 |
| 中国 | 双向 | 2025-08-17 起沙盒；2026-04-30 软启动；2026-05-07 Ant International 新闻稿；2026-06 上海 grand launch（计划） | **Alipay+（Ant International）**、UnionPay International，在 BI–PBoC 指导下 | 支付宝和云闪付用户可在 4,000 万以上 QRIS 商户付款，**商户无需改造**；印尼用户可扫中国 8,000 万以上支付宝/银联码；印方 24 家 PJP（16 家银行、8 家非银行）；沙盒期入境 164 万笔、Rp5,560 亿；微信支付"后续" |
| 印度 | 计划 | 目标 2026 年底（QRIS–UPI） | NPCI | 2026-10 报道称"仍受阻" |
| 沙特、香港、东帝汶 | 计划 | ASPI（2026-10-14）：2026 年底试点，2027 年全面运营 | 沙特侧另有 mada 与 Alipay+ 的连接 | 东帝汶、香港已签约 |
| 阿联酋 | 2024 年签 MoU（与韩国同批） | 进展未查到 | AANI（未核实） | low |

**整体数据**：

- 2025 年入境 5,892,621 笔，出境 1,681,112 笔。
- 截至 2026-08，入境累计 1,780 万笔、Rp6.2 万亿（6 国：新、泰、马、日、韩、中）。

### 4.2 技术模型

- **switch-to-switch，本币结算**：BI 页面称，消费者以本币支付，**商户按账单金额收 IDR**。
- **FX**：在 LCS（Local Currency Settlement）框架下，由 ACCD（Appointed Cross Currency Dealer）银行提供直接汇率（IDR/THB、IDR/MYR 等）。中国线由 Alipay+ 与 UnionPay International 承担对端 hub。
- **没查到的细节**：谁具体报价、加点多少、结算行是谁、结算频率。
- **入境游客限额**：没查到官方数字。合理推测是境内单笔 Rp10 juta 上限加上发卡（钱包）方自身的限额。

### 4.3 外国钱包在印尼怎么受理

- **有双边框架的国家**：直接扫商户现有的 QRIS 码（中国线已明确"商户无需新硬件或集成"）。只有 BI 公布名单里的 PJP（各国参与者）能用。
- **没有框架的钱包**：历史上 Alipay+、银联等靠本地收单行给商户另贴品牌码，或者接入特定商户（推断，low）。
- **游客自己下载印尼本地钱包**：DANA 官方博客称可以用外国手机号注册，并绑定 Visa/MC/Amex/JCB 卡（厂商宣传）。旅游博客提到可用护照加本地 SIM 认证。BI 没有对此出台统一规则。
- **PayPay**："海外支付模式"2025-09 在韩国上线（走 Alipay+，需要 eKYC，加收 3.85% 手续费）。截至本次检索，**印尼不在 PayPay 海外可用国之列**。

### 4.4 重点问题：没有双边联通安排的日本钱包（如 PayPay 或 INSPAY 合作钱包）怎样覆盖全印尼 QRIS 商户

> 前提：BI–日本框架已经存在（出境已上线，入境据称拿到了 FSA 许可）。所以对日本而言，"央行双边路径"不是从零开始。

| 路径 | 机制 | 覆盖面 | 审批 / 难度 | 与稳定币结算的兼容性 |
|---|---|---|---|---|
| **A. 搭 BI–日本既有双边框架（入境方向）** | 日本钱包 → 日方 hub（大概率是 Netstars 的 JPQR Global，未确认）→ ASPI 指定的印尼 switching → QRIS 收单 → 商户收 IDR | **全部 QRIS 商户（约 4,500 万）** | 要成为 BI 批准名单中的日方参与者（日方监管为 FSA，日方 hub 运营方要同意接入）；时间取决于入境方向何时正式上线。难度中高，但最有确定性 | 印尼一侧必须是法币 IDR，经 ACCD 银行和 LCS 结算。稳定币只能用在日本境内或离岸：INSPAY ↔ 日本钱包 ↔ 日方 hub 结算行，之间用 JPY 稳定币或 USDC 做内部清算 |
| **B. 经印尼本地 switching 的跨境平台**（Artajasa/Rintis/Jalin/Alto 直接对接 INSPAY） | INSPAY 作为境外 issuer 或 hub 直连某家印尼 switch | 技术上覆盖全部 QRIS 商户（switch 之间互通） | 很可能仍要 BI 批准，而且要放在某个双边框架之下；switch 单方面接入外国 issuer 没有先例（未查到）。难度高 | 印尼侧同上，只能 IDR 法币 |
| **C1. 与单一本地收单行或聚合商合作**（如 Nobu、BCA、Xendit、DOKU） | 只受理该收单方自己的商户（on-us），或另发品牌码 | 只有该收单方的商户，覆盖有限 | 商业合同为主，难度低到中；但用外币付款、境外 issuer 的交易是否算"境内交易须经 GPN"仍需确认 | 收单方收 IDR；INSPAY 须在印尼银行用外汇兑成 IDR 后结算 |
| **C2. 与单一本地 issuer（钱包或银行）合作，"代发行"** | 日本用户在印尼钱包开户（KYC 由印尼 PJP 完成），INSPAY 向其 IDR 账户跨境充值（汇款或外汇） | 技术上覆盖全部 QRIS 商户 | 实际是外国人开立印尼电子钱包，牵涉 e-money KYC 和余额上限、反洗钱、外汇；体验割裂（两个 App 或 SDK 内嵌）。难度中高 | 印尼侧只能 IDR；充值是跨境汇款，需要持牌汇款机构 |
| **D. 借道 Alipay+** | 日本钱包以 Alipay+ 合作钱包身份出境（PayPay 已在韩国这样做） | 中国线是在 BI–PBoC 框架下、限支付宝和云闪付；非中国钱包能否经 Alipay+ 扫 QRIS **未确认**，很可能要 BI 另行认可。否则只能用 Alipay+ 的直连商户（覆盖有限） | 商业上取决于 Ant，监管上仍要 BI 点头。对 INSPAY 来说这等于不自建网络，与"替代 Alipay+"的定位冲突 | 结算由 Ant 掌控，INSPAY 的稳定币层插不进去 |

**结论**：

- 覆盖面最大、合规上最确定的是 **A**。
- 短期能落地的是 **C1**（少数旅游区大商户，或单一收单方的商户群）。
- **C2** 适合作补充和过渡。
- **D** 可以短期借用，但会把 INSPAY 变成 Alipay+ 的下游。

---

## 5. 监管

1. **外国 PJP 牌照与持股**（PBI 22/23/2020，实施细则 PBI 23/6/PBI/2021（PJP）、PBI 23/7/PBI/2021（PIP））：
   - 非银行 PJP 外资最多 85%，本国持股至少 15%，且有表决权股份的 51% 须由本国持有；外资持股按直接加间接、穿透到最终股东计算。
   - PIP（switching、清算、最终结算等基础设施）外资最多 20%。
   - 外国电子钱包要在印尼"发行"，必须设立或参股印尼 PJP，否则只能走 4.4 节的 A、B、D 路径。
2. **数据与处理境内化**：GPN 规定境内交易须经境内 switching，基础设施（数据中心、灾备）须在境内。PBI 22/23/2020 另有数据境内保存要求（凭记忆，low）。跨境 QRIS 由印尼 switch 处理印尼侧报文。
3. **外汇与卢比离岸**：
   - PBI 7/14/PBI/2005 限制银行向非居民转账卢比、提供卢比授信等，例外条款很多；它在 2026 年是否仍然有效没查到。
   - PBI 24/6/2022（Allen & Gledhill 摘要）重申禁止卢比离岸使用：非居民只能在印尼境内、并且有真实经济活动（underlying）时才能使用卢比。
   - 对 INSPAY 的含义：**不能在境外持有或转移 IDR 头寸，也不能发行或持有 IDR 稳定币做离岸结算**。JPY/USD 兑 IDR 应在印尼境内银行（ACCD）完成。
4. **加密资产与稳定币**：
   - Bappebti 的监管职能 2025-01-10 移交 OJK 和 BI（依据 PP 49/2024 和 P2SK 法）；POJK 27/2024 同日生效，Bappebti 已发的牌照继续有效。
   - 加密资产在印尼是交易标的，不是支付工具。依据是 BI 禁止 PJP 处理虚拟货币（PBI 18/40/2016、19/12/2017 一路延续）和《货币法》UU 7/2011 规定境内支付须用卢比，两者均凭记忆（low）。
   - OJK 表示稳定币"不能成为创造私人卢比的后门"，**稳定币 POJK 预计 2027 年 1 月发布**。
   - 2026-06 有 IDRP（并据报道有 IDDR）从 OJK 沙盒毕业，100% 卢比储备（Kontan 单一来源，medium-low）。
   - IDRT 2019 年面世；IDRX 2024 年面世，多链运行，2026 年在新加坡 MASA 推介；BIDR 已停止。
   - BI 自己在推进 Rupiah Digital（CBDC），明确它不是加密资产也不是稳定币。
5. **贸易摩擦背景**：USTR 2025 NTE（2025-03-31）批评 QRIS 和 GPN 限制外国支付机构参与；BI 坚持支付主权。外国机构"直连 QRIS"在政策上很敏感。

---

## 6. 本地合作方候选与先例

- **银行（收单、ACCD、结算）**：
  - 大型 QRIS 收单兼跨境参与行：BRI、Bank Mandiri、BNI、BCA、CIMB Niaga。
  - **日资背景**：Bank Danamon（MUFG 子公司）、SMBC Indonesia（原 BTPN）、Mizuho Indonesia、Resona Perdania。哪些是 ACCD（IDR/JPY）没查到，low。
  - Bank Nobu：QRIS 收单与 fintech 赞助较多，样例码出自 Nobu。
- **钱包、PJP**：GoPay（GoTo，已支持日本出境）、DANA（支持外国手机号注册）、OVO、ShopeePay、LinkAja；聚合商 Xendit、Midtrans、DOKU、Netzme（QRIS Tap 合作方）。
- **switching**：Artajasa、Rintis、Jalin、Alto。
- **日方**：Netstars（JPQR Global 运营方，BI–日本线的日方 hub）、PJA、METI；UC Card（在日本为商户受理 QRIS 提供支持）。
- **VASP、稳定币**：OJK 持牌 PAKD（交易平台如 Indodax、Tokocrypto、Pintu 等，凭记忆，low）；IDRX、IDRT 发行方；IDRP（沙盒毕业）。目前都不能用于支付结算。
- **先例**：Ant International / Alipay+ 与 UnionPay International（中国线 hub）、KFTC（韩国）、PayNet、NETS、ITMX。

---

## 7. 对 INSPAY 方案的技术含义

### 7.1 接入路径建议

1. **主线（路径 A）**：与 Netstars（JPQR Global）以及 BI–日本入境方向的日方参与者体系对接。INSPAY 定位为日方的 issuer 侧聚合者，把 PayPay 等日本钱包聚合进来。和 BI、ASPI 确认入境上线时间表，以及外国参与者的准入条件。
2. **稳定币层的位置**：只放在日本境内或离岸，在 INSPAY 与日本钱包、日方 hub 结算行之间流转（例如 JPY 稳定币、USDC 的内部净额清算）。**跨进印尼的那一段必须是 JPY 或 USD 法币进入印尼 ACCD 银行，在境内兑成 IDR**，再由印尼 switch 或收单方给商户入账。不要设计 IDR 稳定币离岸结算。
3. **过渡**：找 1–2 家收单方或聚合商（Xendit、Nobu、BCA 等）做旅游区大商户试点（C1），或者与 DANA、GoPay 合作发行游客账户（C2）。

### 7.2 主要风险

- 日本入境方向上线时间不确定。
- BI 是否允许新的日方参与者或聚合者加入。
- 稳定币在印尼支付链条中无合法地位（BI 和 UU 7/2011）。
- 卢比离岸限制。
- 中国线由 Alipay+ 主导，形成先发优势。
- USTR 争议带来的政治敏感度。
- 外资持股限制（PJP 85%，PIP 20%）。

### 7.3 技术坑

- **静态码（01=11）**：用户输入 IDR 金额，App 端要显示 IDR 和换算后的 JPY，并在报价有效期内锁定汇率。
- **便利费与小费**：tag 55/56/57 要正确处理。
- **静态改动态**：开源库把静态码插入 tag 54 当作"动态码"，但这类码没有后台订单号，不能当作真正的动态码对账依据。
- **动态码（01=12）**：EMVCo MPM 没有有效期 tag，有效期和一次性由收单方后台控制。参考号放在 62-01（Bill No.）和 62-05（Reference Label），必须原样回传给收单方，用于对账和防重。
- **退款**：Antom 文档摘要提到，用 BNI、BCA、BRI 银行 App 付款的 QRIS 交易不支持退款。跨境退款要按"原路、IDR 金额、FX 重新计价或按原汇率"事先定规则；部分撤销（void）只能当日做。
- **商户名显示**：59 最多 25 字符，60 最多 15 字符。tag 26 和 tag 51 的 criteria 可能不一致，不要用 criteria 计算 MDR。展示和风控以 NMID 为主键。
- **多收单域**：同一张码可能有多个 tag 26–45。跨境模型下原样转交即可，不要自己选路由。
- **CRC**：CRC-16/CCITT-FALSE，计算时包括 `6304`。
- **P2P 码**：拒绝没有 tag 51 NMID 的码。
- **限额与 KYC**：单笔 Rp10 juta 上限，加上日方钱包自身的限额和 eKYC 要求（PayPay 海外模式需要 eKYC）。
- **对账**：以 NMID + MPAN + 62-01/05 + 印尼 switch 的 RRN 为键，T+? 的结算周期要和对端 hub 确认。


### OPEN QUESTIONS
- BI–日本 QRIS 入境方向（日本钱包在印尼扫 QRIS）的确切上线日期、日方 hub 是否就是 Netstars JPQR Global、外国（日方）新参与者（如 INSPAY 这类聚合者）的准入条件和审批流程（BI、ASPI、日本 FSA/METI）
- 跨境 QRIS 的 FX 机制：谁报价（ACCD 银行、发卡方、hub），加点上限，结算币种（JPY/IDR 直接，还是经 USD），结算行和结算频率（T+0/T+1、净额或全额）
- 入境游客的单笔、日、月限额（是否沿用境内 Rp10 juta），以及跨境交易的 MDR 或交换费分配
- 非中国的 Alipay+ 合作钱包（PayPay、Kakao Pay 等）能否走 BI–PBoC 中国线的 Alipay+ 管道扫 QRIS，还是需要 BI 另批
- 外国 issuer 经单一印尼收单方受理（C1）是否会被认定为必须经 GPN 的'境内交易'，以及外币付款的定性
- 外国人开立印尼 e-money 账户（C2 模式）的 KYC、余额与交易上限，以及跨境充值需要的汇款牌照
- ASPI《QRIS 技术规范》最新版本号、完整 GUID/NNS 注册表、URE 的定义、UME/UBE 阈值、QRIS 退款与撤销报文标准、动态码有效期规则
- QRIS TUNTAS（P2P 转账码）的 payload 格式，以及如何可靠区分 P2P 与 P2M
- PBI 7/14/PBI/2005 是否仍有效，PBI 24/6/2022 的确切条文；INSPAY 能否在印尼境内银行开设 JPY/USD 账户并在当地兑换成 IDR 结算
- OJK 稳定币 POJK（预计 2027-01）是否允许持牌机构之间用 IDR 稳定币做批发结算；IDRP、IDDR 的发行方和用途限制；BI 对 PJP 接触稳定币的最新立场
- PBI 22/23/2020 下数据境内存储和处理的具体要求，对跨境 hub 报文与数据出境的影响
- 日资银行（Danamon/MUFG、SMBC Indonesia、Mizuho）是否为 IDR/JPY 的 ACCD 银行、是否参与 QRIS 跨境，可否担任 INSPAY 在印尼的结算行
- 阿联酋（AANI）联通的进展，以及印度 QRIS–UPI 的新时间表