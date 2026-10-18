# Alipay+ 国家码对接、结算机制、Ant 稳定币动作与 HIVEX 竞品：种子 low 事实补检报告
（INSPAY「稳定币版 Alipay+」预研 · 2026-10-18）

---

## 0. 方法与局限（先读）

- **检索预算**：共用 **20 次 WebSearch**（达到上限后停止），全部用 standard 模式。种子中已是 high 的事实没有重复检索，例如：NITMX–Ant 2025-10-26 新闻稿、PayPay 韩国/台湾海外模式、BLOOM。检索集中在 ALIPAYPLUS.json 第 3.7、4.2、5、6、7 节的 low 条目和空白。
- **WebFetch**：试了 2 次，全部失败（`getaddrinfo ENOTFOUND`），目标是 docs.alipayplus.com/reconcile_acq/reconcile_overview 和 bitget.com 的 Scan to Pay 帮助页。因此**所有结论都来自搜索引擎返回的摘要和原文片段**，没有逐字读到任何一页原文。
- **交叉引用**：同轮其他子 agent 的种子文件已有相关结论，本报告直接引用并注明出处，不另花检索。这些文件是 JP-PAYPAY.json/.md、SG-MY.json、STABLECOIN-INFRA.json，涉及 PayPay×ZeroPay、HIVEX×TWQR、Alipay+×NETS、PayNet×Ant、OKX SG、dtcpay、Coins.ph。
- **置信度规则**：
  - **high**：多家媒体或官方新闻稿摘要一致，且日期明确。
  - **medium**：只有单一来源、只是官方文档摘要（未读全文），或属于公司自述数据。
  - **low**：凭记忆，或摘要语义含糊；note 中写“未核实”。
- 用“推翻/核实：原 low→X”标记种子条目的变化。
- **主要局限**：
  - 以下内容仍是空白：Alipay+ 报价对象的完整字段表、结算文件交付方式（SFTP/API）、各国线的结算行与限额、HIVEX 的链类型与共识机制、各加密钱包在当地的收单方名称（Bitget×AEON 除外）。
  - 未专门检索越南、巴西对“加密扫码付”的监管表态。第 5.3 节的监管内容以推断为主。

---

## 1. 结论速览（TL;DR）

1. **Alipay+ 已接入约 10 个国家交换机/国家码（官方称“>10 national payment switches”，2026-09）。模式明显分成两类，这是本次最重要的发现。**
   - **A 类：“全 Alipay+ 钱包开放”型。** 交换机或国家码运营方作为 Alipay+ 的受理侧接入，所有（或大批）Alipay+ 合作钱包都能扫当地国家码。
     - 韩国 ZeroPay（2023-08-31）
     - 新加坡 SGQR 经 NETS（2023-04）
     - 马来西亚 DuitNow 经 PayNet（2023-10-31）
     - 柬埔寨 KHQR/Bakong（2024-10）
     - 菲律宾 QR Ph 经 PPMI（2026-09）
   - **B 类：“中国 Alipay 单走廊”型。** 在两国央行指导或双边本币框架下，只开放给**中国内地 Alipay 用户**（常与 UnionPay、WeChat Pay 同批），并指定本地结算行，人民币与本币直接兑换。
     - 泰国 PromptPay（NITMX，2025-10-26 宣布；结算行 Krungthai）
     - 越南 VietQR（NAPAS，2026-04-03；结算行 Vietcombank）
     - 印尼 QRIS（BI/ASPI，2026-04-30；Alipay+ 为技术层，另有 UnionPay International）
     - 截至检索，**未查到这三国对 Kakao Pay、TnG、GCash 等其他 Alipay+ 钱包开放。**
   - **对 INSPAY 的含义**：
     - **威胁**：PayPay 已是 Alipay+ 的 MPP（韩国 2025-09-30 起）。只要商务上打开，技术上很可能可以复用 A 类五国的国家码覆盖。
     - **机会**：泰国、越南、印尼三个大市场的国家码目前对“非中国钱包”只开放给央行间双边联通，Alipay+ 在这里没有形成全钱包覆盖。
2. **Alipay+ 的 FX 与结算有了第一手文档证据**（来自文档摘要，未读全文）：
   - ACQP 在 `pay` 请求中用 `settlementStrategy.settlementCurrency` 指定结算币种。不填时，以 `paymentAmount.currency` 作为结算币种。
   - UPM `pay` 中有 `settlementQuote`，即结算币种与支付币种之间的汇率。
   - MPP 侧有参考汇率查询接口 `inquiryForeignExchangeQuote`（`sellCurrency`/`buyCurrency`，“for reference only”）。
   - **ACQP 侧**：清算 T+1（按 UTC+8 自然日，含节假日），结算默认 T+2（Common Business Day）。**MPP 侧**：结算默认 T+1（Local Business Day），报告在 UTC+8 08:00 生成。
   - 结算币种由合同约定。结算净额扣除 wallet interchange fee 和 Alipay+ service fee（由 ACQP 承担）。结算所用汇率与原交易汇率相同。
   - 种子中“`paymentQuote`/`quoteId`/有效期”等字段名**仍未查到**。
3. **Ant International 的代币化路径已经清楚：“代币化存款 + 自有批发结算币”，不发零售稳定币。**
   - 2024-10：HSBC×Ant 在 HKMA Ensemble 沙盒完成 HKD 跨行区块链测试，Whale 连通 HSBC 与恒生。
   - 2025-05：Ant 成为 HSBC 香港 Tokenised Deposit Service 的首个企业客户，交易由 Whale 发起。
   - 2025-06（Bloomberg）：计划在香港、新加坡、卢森堡申请稳定币牌照。
   - 2025-07（Bloomberg）：拟把 USDC 接入自有链。
   - **2025-09-16**：卢森堡 CSSF 向 Alipay (Europe) 授予 MiCA EMT 牌照。代币为 **Bettr Settlement Token（BREUR）**，锚定欧元，**仅限 Ant 关联方之间批发使用**，不上交易所、不对零售。
   - 2025-10（FT）：PBOC 与网信办叫停 Ant Group、京东的香港稳定币计划。报道点名的是 Ant Group，未确认是否同样适用于 Ant International。
   - 2025-10-16：入选 MAS BLOOM。
   - **2026-10-06**：与 HSBC 把实时资金管理扩展到中东，经 WhaleRTP 完成 UAE↔香港/新加坡的 USD 代币化存款试点。
   - **未查到** Alipay+ 对 MPP/ACQP 的商业结算已改用稳定币；Whale 和 BREUR 都定位在集团内部 treasury。
4. **“加密钱包扫本地国家码付款”已是成熟品类，但普遍游走在监管边缘。**
   - Bitget Wallet：2025-09 经本地持牌伙伴 AEON 支持巴西 Pix（USDT/USDC）；帮助中心还列出越南 VietQR 和菲律宾 QR Ph。
   - Bitget 交易所 App 的 Scan to Pay：只支持 USDT，单笔 ≤500 USD，需 L1 KYC，并**声明 Bitget 在这些法域不作为支付服务提供商运营**。
   - Binance Pay：2025-05 接入 Pix，2025-12 让阿根廷用户在巴西经 Pix 付款。
   - RedotPay Scan to Pay：支持 VietQR、QR PH、Pix、Bre-B、QR Perú、TANQR、KE-QR。2026-08 的招聘信息把 SGQR、UPI、PromptPay、DuitNow 列为扩展目标（尚未上线）。
   - 共性：商户收到的是本地即时转账，钱包本身不在当地持牌（Bitget 原话），本地实际出款方大多不公开。
5. **HIVEX（TBCASoft）是与我们设想最接近的现有竞品。**
   - 美国公司，2016 年由吴陵创立，股东有软银、Naver、富士康、远传。
   - 定位为“区块链驱动、面向移动支付业者的互操作网络”：吸收各方 QR 格式差异，商户无需改 POS 或改码。
   - **已经连通 PayPay 的双向**：台湾钱包（街口、全支付、玉山 Wallet；2026-02 增加台新 Pay+、全盈+PAY；另有 iPASS MONEY）自 2023-10 起扫 PayPay 码；2025-09 起 Weixin Pay 也经 HIVEX 在 PayPay 商户付款；2026-04 起 PayPay 用户经 FISC 的 TWQR Inbound 在台湾扫 TWQR 码。
   - 在韩国与 ZeroPay、ICB 合作；在菲律宾与 RCBC、Novus 合作。
   - 2025-08/09 与 StraitsX 签 **Project HIVEX StableLink MOU**：用受监管稳定币做即时 FX 和结算终局，目标连通日、台、港、泰、美的稳定币发行方。HIVEX 自称 2023 年起已用稳定币技术做跨境清算。
   - 与 INSPAY 设想高度重合：区块链清结算、国家码对接、日本 PayPay、稳定币。**差距**：东南亚国家码覆盖目前很弱，只查到菲律宾 RCBC。

---

## 2. Alipay+ 与各国国家码/交换机的对接（逐条核实）

### 2.1 总表

| 国家 | 对接对象 | 日期 | 方向 | 开放钱包 | 是否“扫国家码” | 结算/备注 | 置信度 | 种子变化 |
|---|---|---|---|---|---|---|---|---|
| 韩国 | **ZeroPay**（运营方 Korea Easy Payment Foundation, KEPF） | **2023-08-31** 宣布（Business Wire） | 入境 | 首批 6 个钱包（摘要列出 Alipay、AlipayHK、MPay、TrueMoney、TnG；第 6 个未查到），之后陆续增加；济州推广期为 11 个钱包 | **是**：在柜台扫 ZeroPay QR，自输金额（MPM） | 覆盖 >170 万商户；PayPay 2025-09-30 起经 Alipay+ 在 ZeroPay 店使用（JP-PAYPAY 种子） | high | 原 low→high |
| 新加坡 | **SGQR 经 NETS** | 2023-04 | 入境 | 首批 6 个：Alipay、AlipayHK、TnG、GCash、TrueMoney、Kakao Pay | **是**：游客直接扫 SGQR 标签（NETS 条目） | 约 11,000 个熟食摊（SG-MY 种子，本次未复检） | medium | 原 low→medium |
| 马来西亚 | **DuitNow QR 经 PayNet** | 2023-10-31 | 入境（2025-08-21 深化，推进出境） | Alipay、AlipayHK、HelloMoney、Hipay、MPay、Naver Pay、Toss Pay、TrueMoney 等 | **是** | 上线时 >180 万受理点；Alipay+ 占 DuitNow 入境跨境 QR 的 80% 以上（SG-MY 种子） | medium | 原 low→medium |
| 柬埔寨 | **KHQR / Bakong（NBC）** | 2023 年 SFF 期间 NBC 与 Alipay+ 签 MoU；**2024-10 正式上线**（TTG Asia 2024-10-18 等）；之后 NBC 与 Ant International 再签 MoU（日期未查到） | **双向**：入境为 Alipay+ 钱包扫 KHQR；出境为完成全 KYC、持瑞尔账户的 Bakong 用户在 Alipay+ 全球商户付款 | 12 个 Alipay+ 合作 App（含 Alipay、GCash、TnG、Kakao Pay、Toss Pay） | **是** | >100 万商户；各来源的 App 数和日期略有出入 | high（上线事实）/ medium（数字） | 原 low→high |
| 菲律宾 | **QR Ph 经 PPMI**（Philippine Payments Management Inc.） | **2026-09 初**上线（fintech.global、newsbytes 2026-09-01） | 入境 | “supported Alipay+ partner apps”，具体名单未查到 | **是**：扫商户现有 QR Ph 码，走本地银行和 EMI 共用的国家 QR 基础设施；无需本地账户 | 是否经 InstaPay 清算、谁是结算行：未查到 | high | 原“未查到”→high |
| 泰国 | **PromptPay（NITMX）** | 2025-10-26 宣布（BOT 2025-10-30 中国线上线，TH-LA 种子 high） | 入境（一期） | **只有中国内地 Alipay**；另有报道称 NITMX 与 UnionPay International、Ant（“via Alipay under Alipay+”）、Tenpay 建立战略合作，目标是中泰全面互通 | 是，但仅限 Alipay | 结算行 Krungthai；**未查到扩展到 Kakao Pay、TnG 等其他 Alipay+ 钱包** | high（一期仅 Alipay）/ medium（“未扩展”属于未检出） | 回答任务问题：仅 Alipay |
| 越南 | **VietQR（NAPAS）** + Vietcombank | **2026-04-03** 宣布 | 入境（反向规划中） | 中国 Alipay 用户在 Alipay App 中扫 **VietQR Global** 码 | 是，但仅限 Alipay | 结算行 Vietcombank；CNY↔VND 直接兑换，无中间货币；报道未提 Alipay+ 字样。PayPay 2026-06-29 经 Alipay+ 接入了一个越南钱包，那是越南人在日本付款，与此无关 | high | 原“未查到”→high |
| 印尼 | **QRIS**（BI、ASPI 与印尼银行/PJP 业界） | **2026-04-30** BI 启动 QRIS–中国联通（Business Wire 2026-05-07） | **双向** | Alipay 与 UnionPay 用户可在 >4,000 万 QRIS 商户付款；印尼用户可扫中国 >8,000 万 Alipay/UnionPay 码；WeChat Pay 仍在技术评审 | 是，但仅限 Alipay（及 UnionPay） | **Alipay+ 是连接两个生态的技术层**；在 BI 与 PBOC 指导下；中国是第 6 个接入 QRIS 的国家（前 5 个是泰、新、马、日、韩） | high（事实）/ medium（商户数字） | 原 low→high |
| 日本 | PayPay（作为 ACQP 受理入境 Alipay+ 钱包；作为 MPP 出境） | 入境：2024-01-29、2026-06-29 多轮扩展，合计 17 国家/地区 35 项服务（JP-PAYPAY 种子 high）；出境：韩国 2025-09-30 经 Alipay+，台湾 2026-04-27 经 HIVEX | 双向 | — | 入境方向是外国钱包扫 **PayPay 专有码**，不是 JPQR | PayPay 最早受理 Alipay 的日期**未核实**（凭记忆为 2018–2019 年）；JPQR Global（NETSTARS）是另一条线（QRIS 2025-08-17、KHQR 2025-07-05） | 入境/出境 high；起始年 low | 部分核实 |

补充：Ant International 2026-09 对外口径为 Alipay+ 连接“>20 亿消费者账户、>50 家 MPP、>10 个国家支付交换机”（QR Ph 新闻稿，medium，公司自述）。

### 2.2 对设计的含义

1. **Alipay+ 接国家码的通用做法：国家交换机/运营方 = 一个大 ACQP。**
   - KEPF、NETS、PayNet、NBC/Bakong、PPMI 都是这种形态。商户不用换码，所有 Alipay+ MPP 立即可扫。
   - 这验证了种子 4.1 节的推论：交换机作为 ACQP 接入，再加一条码规则。
2. **在“央行间双边框架”国家（泰、越、印尼），Alipay+ 只拿到中国走廊。**
   - 这些国家的国家码对外开放，走的是“中国 ↔ 本国”央行间本币结算安排，Ant 以“Alipay（中国钱包）”身份接入。
   - 推断：日本钱包想进这三国，大概率要走“日本 ↔ 该国”的双边安排（类似 JPQR Global×QRIS），或与该国结算行合作。这正是 INSPAY 可以切入的空白，但门槛在监管层面。
3. **PayPay 作为 Alipay+ MPP，“技术可达”范围很可能已覆盖 A 类五国。**
   - 目前只开了韩国，原因未查到，可能涉及商务、费率或 eKYC 安排。这是 INSPAY 的直接竞争风险，需要在 BD 上尽早锁定 PayPay 的东南亚出境合作意向。

---

## 3. Alipay+ 的 FX 与结算（文档摘要级证据）

### 3.1 字段与接口

| 项目 | 内容 | 来源页 | 置信度 |
|---|---|---|---|
| `settlementStrategy`（ACQP→Alipay+ 的 `pay` 请求） | “The settlement strategy that is applied to the payment order, for example, specify the currency that the ACQP wants to be settled against”。结算币种与支付币种不同时须正确设置；不填或为 null 时，以 `paymentAmount.currency` 作为 `settlementCurrency` | api_acq_ns/pay_auto_debit、api_acq/pay_order_code | high（原文片段） |
| 结算金额 | “calculated based on the payment amount and the exchange rate between the settlement currency and payment currency”；同币种时等于支付金额 | 同上 | high |
| `settlementQuote` | UPM `pay` 中为结算币种与支付币种之间的汇率 | api_acq_ns/pay_user_presented_mode | medium（摘要；子字段未读到） |
| `inquiryForeignExchangeQuote` | MPP 侧非 SDK API：`POST /aps/v1/payments/inquiryForeignExchangeQuote`（摘要中的路径如此，与其他接口的 `/aps/api/v1/` 前缀不一致，待核）；必填 `sellCurrency`、`buyCurrency`（ISO 4217），可选 `paymentFactor`；“The exchange rate returned by Alipay+ is for reference only” | api_non_sdk_mpp/inquiry_quote | medium |
| `paymentQuote`、`quoteId`、`quoteCurrencyPair`、`quoteExpiryTime` | **未查到** | — | — |

**推翻种子**：种子写“不能确认存在 consultExchangeRate/inquiryExchangeRate”。实际查到的官方接口名是 `inquiryForeignExchangeQuote`（MPP 侧，仅供参考汇率）。种子中“paymentQuote/settlementQuote”一条，只核实了 `settlementQuote`。

### 3.2 清算与结算周期（reconcile_acq / reconcile_mpp 文档摘要）

- **ACQP**：
  - 清算每 T+1 日进行，覆盖前一个 UTC+8 自然日，节假日也照常清算。
  - **结算默认 T+2**，结算日必须是 Common Business Day。一个结算周期可以包含多个清算周期，例如节假日累积的清算周期。
- **MPP**：
  - **结算默认 T+1**，结算日必须是 Local Business Day。
  - Settlement Report 在约定结算日的 08:00（UTC+8）生成，只在 Local Business Day 生成。
- **币种**：结算币种“as agreed in the contract”。Settlement Report 给出该周期 ACQP 应收或应付的**净额**。USD 以“分”表示，即 1.00 美元记为 100。
- **费用**：结算为扣费后净额。**ACQP 承担 wallet interchange fee 和 Alipay+ service fee**，从结算款中扣除。文档示例：一笔 1000 LLC（虚拟币种）的支付，最终以 98.3 USD 结给 ACQP。
- **汇率**：Settlement Report **不含汇率**。交易币种与结算币种不同时，使用与原交易相同的汇率。
- **报告**：Transaction Summary Report 按结算币种汇总单个清算周期的交易。周期内只有一个清算周期时，它与 Settlement Report 的总额一致。
- **未查到**：文件交付方式（SFTP 或 API）、文件字段表、预付或保证金安排、FX 风险由谁承担。文档存在 `integration_tsp/files`、`integration_cashier_acq_ns/files` 等“files”页，但内容未读到。

**推翻或修正种子**：种子凭记忆写“T+1 至 T+N，USD 或当地币”。修正为 ACQP 默认 T+2、MPP 默认 T+1，币种按合同约定，结算汇率等于交易汇率，费用由 ACQP 侧承担并从结算款中扣除。

### 3.3 对 INSPAY 的设计启示

- 可直接复制的部分：
  - 清算日按固定时区切日，结算日按各方营业日；允许一个结算周期包含多个清算周期。
  - 结算汇率等于交易时锁定的汇率，避免结算日重新报价。
  - 收单侧承担 interchange（付给钱包）和网络费。这与卡组织的经济模型同构，PayPay 作为 MPP 能拿到 interchange 收入，这是它接入第三张网络的动机之一。
- 稳定币可以改进的地方：
  - 把 T+1/T+2 压缩为日内多次链上净额结算。
  - 结算报告附带 tx hash。
  - 结算币种可选 USDC 或代币化存款，而不只是合同约定的法币。

---

## 4. Ant International 的稳定币与代币化动作（时间线）

| 日期 | 事件 | 置信度 | 种子变化 |
|---|---|---|---|
| 2024-10-28 | HSBC 与 Ant International 在 HKMA **Ensemble Sandbox** 完成 HKD 跨行区块链测试交易；**Whale** 连通 HSBC 与恒生银行网络，实现 24/7 实时跨行转账（HSBC 香港新闻稿） | high | 新增 |
| 2024 年全年 | Ant 称其 treasury 转账中**超过三分之一**经 Whale 在链上执行 | medium（公司自述） | 原 low→medium |
| 2024-11-05 | StraitsX × Ant（Alipay+）× Grab：后台以 XSGD + PBM 在 Avalanche 上清结算，商户实时收 SGD（SG-MY/STABLECOIN-INFRA 种子） | medium | 引用 |
| 2025-05（Business Wire 2025-05-22） | Ant International 成为 **HSBC 香港 Tokenised Deposit Service 首个企业客户**：区块链账本上的公司账户间实时 HKD/USD 支付；首笔集团内即时调拨由 Whale 发起，Ant 存在 HSBC 的 USD 存款在 HSBC 的 DLT 上代币化 | high | **核实：原 low→high** |
| 2025-05 | CSSF 因反洗钱缺陷对 Alipay (Europe) 罚款 €214,000（Paperjam） | medium | 新增 |
| 2025-06 | Bloomberg：Ant International 计划在香港、新加坡、卢森堡申请稳定币发行牌照（经 The Block 转述） | medium | 原 low→medium（并补充新加坡、卢森堡） |
| 2025-07-10 | Bloomberg/The Block：Ant International 与 Circle 合作，待 USDC 满足美国监管要求后接入其区块链，用于商户和银行的资金管理与结算 | medium（双方未正式证实） | 引用 |
| **2025-09-16** | 卢森堡 **CSSF** 向 **Alipay (Europe) Limited** 授予 **MiCA EMT** 授权（该公司 2018-12 起已持 EMI 牌照）。代币为 **Bettr Settlement Token（BREUR）**，锚定欧元、银行储备支持，**仅限获批的 Ant International 关联方之间批发使用**，不上公开交易所、不对零售（Paperjam、Ledger Insights、Financial IT、MEXC 转载的代币文件） | high（多源）/ medium（BREUR 细节） | **新增，重要** |
| 2025-10（FT，Reuters 转述但未能独立核实） | PBOC 与国家网信办指示 **Ant Group、京东**暂停香港稳定币计划，理由是担心科技集团和券商“发行任何形式的货币”；两家公司未回应，HKMA 不评论传闻 | high（报道存在）/ medium（事实本身） | **核实：原 low→high（报道层面）**。注意报道点名的是 Ant Group，未明确是否涵盖 Ant International |
| 2025-10-16 | MAS **BLOOM** 参与者含 Ant International（SG-MY 种子 high） | high | 引用 |
| 2026 年 | HKMA 预期 2026 年发出首批稳定币牌照；Cointelegraph 标题称香港“missed March target”。Ant 是否获香港牌照：**未查到** | low-medium | 空白 |
| 2026-04 | Alipay+ 推出 AI agent 支付协议 AMP，一期有 10 个钱包、7 个收单方支持（与稳定币无关，仅作动态参考） | low-medium | 新增 |
| **2026-10-06** | Ant International 与 HSBC 把实时 treasury 服务扩展到**中东**：完成 UAE↔香港两条走廊试点，其中一条是 USD 代币化存款在 UAE 与香港、新加坡等市场之间转账，经 **WhaleRTP** 在 HSBC TDS 基础设施上实时执行；Ant 为 HSBC 中东首个 TDS 客户。WhaleRTP 称有 >20 家银行伙伴、>17 种货币 | medium-high（新闻稿级） | 新增 |

**判断**：
- Ant International 的代币化走的是“银行代币化存款（HSBC TDS 等）+ 自有链 Whale/WhaleRTP + 关联方批发结算币 BREUR”，零售稳定币基本被北京叫停。
- 截至检索，**没有证据显示 Alipay+ 对外部 MPP/ACQP 的商业结算已改用稳定币**。StraitsX×Grab 是个案试点。
- 因此“对外部持牌机构开放的稳定币清结算层”目前仍是 Alipay+ 的空白。但 Ant 已具备 EMT 牌照和 BLOOM 资格，随时可能补上，INSPAY 的时间窗有限。

---

## 5. 加密/稳定币钱包“扫本地国家码付款”先例

### 5.1 案例表

| 产品 | 国家/码 | 上线 | 资产 | 本地出款方 | 限额/KYC | 置信度 |
|---|---|---|---|---|---|---|
| **Bitget Wallet**（非托管钱包） | 巴西 Pix | **2025-09-19** 宣布 | USDT/USDC（多链） | **AEON**（报道称“licensed local partner”） | — | high |
| Bitget Wallet 帮助中心 | 越南 VietQR、菲律宾 QR Ph、巴西 Pix | 日期未查到 | 仅 USDT/USDC，链为 Base、BNB Chain、Ethereum、Solana、Tron；属于链上交易，需付 gas | 越南、菲律宾的出款方未查到 | — | medium |
| **Bitget 交易所 App “Scan to Pay”** | 越南（VietQR/NAPAS）、菲律宾（QR Ph/InstaPay）等 | 日期未查到 | **仅 USDT** | 页面按市场写“VietQR (NAPAS)”“QR Ph (InstaPay)”，指的是清算轨道而非具名机构；**声明“Bitget does not operate as a payment service provider in any of the above jurisdictions”** | 越南最低 0.2 USD、菲律宾最低 0.05 USD，单笔 ≤500 USD；需 L1 KYC | medium |
| **Binance Pay** | 巴西 | 2023-08 推出商户 Binance Pay；**2025-05 接入 Pix**（首次接入国家支付基础设施）；**2025-12** 阿根廷用户可在巴西用 Pix 进行加密支付（跨境） | >100 种加密资产换成 BRL 后经 Pix 付给任何银行账户或 Pix 商户 | 未查到 | — | high（Pix 接入）/ medium（阿根廷） |
| **RedotPay Scan to Pay** | 越南 VietQR、菲律宾 QR PH、巴西 Pix、哥伦比亚 Bre-B、秘鲁 QR Perú、坦桑尼亚 TANQR、肯尼亚 KE-QR | 日期未查到；2026-08 招聘信息把 SGQR、UPI、PromptPay、DuitNow 列为待扩展 | 从加密余额支付 | 未查到 | 例：菲律宾单笔 ≤50,000 PHP；Pix 单笔 ≤22,000 BRL；需 KYC | medium |
| **OKX SG** | 新加坡 GrabPay 的 SGQR | 2025-09 | USDC/USDT 换成 XSGD，商户收 SGD | Grab、StraitsX | — | medium（SG-MY 种子） |
| **dtcpay** | 新加坡 SGQR/NETS | 2025-07 | USDT/USDC 即时兑换成法币 | dtcpay 自身持 MAS DPT 大型支付机构牌照 | 自称 >40,000 个 NETS 受理点 | medium（SG-MY 种子） |
| **Coins.ph** | 菲律宾 QR Ph | — | PHPC（已从 BSP 沙盒毕业）；是 Circle CPN 在菲律宾的受益机构 | 自身持 BSP EMI + VASP 牌照 | — | medium（STABLECOIN-INFRA 种子） |

### 5.2 共性架构（已由上述案例佐证）

用户钱包解析当地 EMV 码，按稳定币金额扣款，然后由某个本地出款方以本币即时转账给商户。各国轨道分别是 Pix、InstaPay（QR Ph）、NAPAS 247（VietQR）、NETS。商户感知到的是一笔普通入账。

两种形态：
- **持牌型**：dtcpay、Coins.ph 自身持当地牌照。
- **借道型**：钱包不在当地持牌，例如 Bitget 原话，出款方往往不公开（Bitget×AEON 是少数具名案例）。

### 5.3 合规争议（推断为主，未专门检索）

- Bitget 声明“不在这些法域作为 PSP 运营”。说明其越南、菲律宾业务依赖第三方出款，钱包本身没有当地支付牌照，监管上属于灰色地带。
- 泰国：2022-04-01 起 SEC 禁止数字资产业者为加密支付提供便利（TH-LA 种子）。RedotPay 把 PromptPay 列为“待扩展”而未上线，与此一致（推断）。
- 越南、巴西的最新监管表态：本次**未检索**，列入开放问题。巴西央行 2025 年 VASP 规则把稳定币支付纳入外汇监管一事，仍为 low、未核实。
- 对 INSPAY：我们的设计把稳定币只放在持牌机构之间，用户付日元、商户收本币，**在定位上明显优于“加密钱包借道出款”模式**。这一点应作为对监管和对 PayPay 的核心叙事。

---

## 6. HIVEX（TBCASoft）深度核实：最接近的现有竞品

### 6.1 公司与架构

- **TBCASoft**：美国公司，2016 年由 **吴陵（Ling Wu）** 创立。股东或战略投资方有**软银、Naver、富士康、远传电信**（managertoday、gvm、fintechnews 等，medium-high）。
- **HIVEX®** 的特点：
  - 定位为“blockchain-powered, interoperable payment network designed for mobile payment service providers”，用于跨境 QR 支付。
  - 允许不同 QR 格式互操作：钱包方不必采用新 QR 格式，商户不改 POS 和既有码。
  - 台湾报道称它以区块链分布式账本传输数据、建立互信，并比喻为“电支界的 VISA”。
  - 软银 2026-04-23 新闻稿称其为“区块链底层的国际支付基础设施，可吸收各国 QR 规格差异”（JP-PAYPAY 种子）。
- **未查到**：链类型（联盟链？自研？）、共识机制、节点由谁运行、清算资产、报文标准、费率。

### 6.2 成员与里程碑

| 时间 | 事件 | 来源 | 置信度 |
|---|---|---|---|
| 2023-08 | HIVEX 在台湾首发记者会：与街口支付（JKOPAY）、全支付（PXPay Plus）、玉山银行（E.SUN）合作 | 中央社 2023-08-23 | high |
| 2023-10 | 上线：玉山 Wallet 等可在日本 PayPay 商户扫码付款（推广期免 1.5% 海外手续费） | managertoday | medium-high |
| 2023-11（约） | 菲律宾：TBCASoft、RCBC 与本地网关 Novus Technologies 合作，引入跨境 QR 连接 | Digitimes PR（2023-11-28） | medium |
| 2024-02 底 | 全支付、街口、玉山 Wallet 启用日本“反扫”（CPM，由日本商户扫台湾用户的码） | technews 2024-03 | medium |
| 2024（一周年） | 把 PayPay 台日模式复制到韩国，瞄准医美消费 | Inside | medium |
| 2025 | 全支付与韩国 **ZeroPay**、ICB 合作，经 HIVEX 系统推出跨境支付 | managertoday 2025 | medium |
| 2025-08-31 / 09-03 | 与 **StraitsX** 签 **Project HIVEX StableLink** MOU：用受监管稳定币实现即时 FX 与结算终局，目标连通日本、台湾、香港、泰国、美国等法域的受监管稳定币发行方；称 HIVEX **自 2023 年起已用稳定币技术做跨境清算**，此次要从“即时清算”延伸到“受监管的即时结算与 FX” | technews.tw 2025-08-31、technode 2025-09-03、fintechnews.hk/my | high（MOU 存在）/ medium（“2023 起稳定币清算”为自述） |
| 2025-09 | **Weixin Pay（微信支付）用户可经 HIVEX 在日本 PayPay 商户扫码付款** | technews 2025-09-07 | medium-high |
| 2026-02-03 | 台新 Pay+、全盈+PAY 开通日本 PayPay 服务；HIVEX 台湾参与方还有一卡通 iPASS MONEY | 工商时报 2026-02-03/04 | medium-high |
| 2026-04-14 | 台湾**财金资讯（FISC）“TWQR Inbound”**开通，首波串接 PayPay，清算银行为玉山 | JP-PAYPAY 种子（台湾媒体） | medium-high |
| 2026-04-27 | PayPay 用户可在台湾贴 TWQR 标识的店铺使用海外支付模式，经 HIVEX，覆盖 >40 万处 | PayPay 官方公告（JP-PAYPAY 种子 high） | high |

### 6.3 与 INSPAY 设想的对照

| 维度 | HIVEX | INSPAY 设想 | 评估 |
|---|---|---|---|
| 底层 | 区块链（细节不明），自称 2023 年起用稳定币技术做清算；StableLink 拟用受监管稳定币做结算 | 稳定币只在持牌机构之间流转 | **高度重合** |
| 日本侧 | 已连通 PayPay 双向：入境是台湾钱包、Weixin Pay 扫 PayPay 码；出境是 PayPay 用户扫 TWQR。软银系 | 以 PayPay 等日本钱包为 MPP | **HIVEX 有先发和股东关系优势**（软银是 PayPay 的母公司系） |
| 国家码 | 台湾 TWQR（经 FISC）；韩国 ZeroPay（经全支付合作，方向细节不明）；菲律宾经 RCBC 和 Novus（是否覆盖 QR Ph 不明） | 东南亚 8 国国家码 | **东南亚覆盖明显不足**：未查到泰、马、新、印尼、越、柬、老有任何上线 |
| 稳定币伙伴 | StraitsX（XSGD/XUSD） | 待定（USDC/JPYC 等） | StraitsX 也是 Alipay+×Grab 的结算方。**稳定币供应侧可能出现竞合** |
| 治理 | 私营公司网络 | 私营网络 | 同类 |

**结论**：HIVEX 是“区块链跨境钱包网络 + PayPay + 稳定币结算”方向上最直接的竞品，也可能成为合作对象（例如由 INSPAY 补齐东南亚国家码，HIVEX 负责 PayPay 和台湾侧）。需要重点跟踪三件事：
- PayPay 是否经 HIVEX 扩展到东南亚；
- StableLink 是否有正式上线或受监管批准（**2026 年进展未查到**）；
- HIVEX 在泰国的布局（StableLink 目标法域中包括泰国）。

---

## 7. 对 INSPAY 的综合建议（基于本次核实）

1. **市场优先级**：
   - 泰国、越南、印尼的国家码目前只对中国钱包开放，Alipay+ 和 HIVEX 都未覆盖“日本钱包扫国家码”。这三国是差异化重点，但必须走监管或双边路线。可参照 JPQR Global×QRIS（2025-08-17，BI+ASPI+METI+PJA+NETSTARS），先打通“日本 ↔ 该国”的官方框架，再以 INSPAY 作为日本侧网络方接入。
   - 韩国、新加坡、马来西亚、柬埔寨、菲律宾已被 Alipay+“全钱包开放”覆盖。PayPay 若在这些国家扩展海外模式，最自然的选择是沿用 Alipay+，INSPAY 必须在价格和结算速度上给出可量化的优势。
2. **结算设计**：
   - 复制 Alipay+ 的切日方式、营业日规则、“结算汇率 = 交易汇率”、净额扣费。
   - 用稳定币把 T+1/T+2 压到日内结算；对 ACQP 支付 interchange 的方向和比例需要单独做经济模型。
3. **竞争窗口**：
   - Ant 已有 MiCA EMT（BREUR，仅限关联方）、HSBC TDS、WhaleRTP、BLOOM 资格。HIVEX 已有 StraitsX 的 StableLink。
   - 两者都还没有对外开放“持牌机构间稳定币结算”的商业服务（截至检索）。窗口存在，但可能只有 12–24 个月（判断，非事实）。
4. **合规叙事**：明确区别于 Bitget、RedotPay 式的“钱包不在当地持牌 + 借道出款”。我们的模式是本地持牌收单方或交换机入账本币，稳定币只在离岸持牌机构之间流转。


### OPEN QUESTIONS
- 泰国 NITMX、越南 NAPAS、印尼 QRIS 的中国 Alipay 走廊，是否计划对非中国的 Alipay+ 钱包（Kakao Pay、TnG、GCash、PayPay 等）开放？央行间框架是否允许第三国钱包借道？
- 菲律宾 QR Ph × Alipay+（2026-09）：开放哪些钱包？是否经 InstaPay 清算？PPMI 侧的结算行是谁？是否有单笔或每日限额？
- Alipay+ 报价对象的完整字段（settlementQuote 子字段、是否有 paymentQuote/quoteId/有效期）、汇率由谁锁定、在哪个时点锁定、FX 风险由谁承担。
- Alipay+ 结算文件的交付方式（SFTP 还是 API）、字段表、预付或保证金安排；wallet interchange fee 的典型费率区间。
- inquiryForeignExchangeQuote 的路径前缀（/aps/v1 还是 /aps/api/v1）及完整响应字段。
- PayPay 作为 Alipay+ MPP 为何目前只在韩国开通出境？新加坡、马来西亚、柬埔寨、菲律宾（技术上 Alipay+ 全钱包可达）是否在计划中？
- HIVEX 的链类型、共识机制、节点运营方、清算资产（2023 年起使用的“稳定币技术”具体是什么？）；Project HIVEX StableLink 在 2026 年是否上线或获批；HIVEX 在泰国及其他东南亚国家的布局。
- HIVEX 在 PayPay 出境（台湾）中的结算币种与周期，以及与 FISC、玉山的分工。
- Ant International 是否获得香港或新加坡稳定币牌照？北京 2025-10 的叫停是否涵盖 Ant International？BREUR 是否会扩展到非关联方或 Alipay+ 合作方结算？
- Bitget Wallet 在越南、菲律宾，以及 RedotPay、Binance Pay 在各国的实际本地出款方是谁？当地监管（越南 SBV、菲律宾 BSP、巴西 BCB）是否对“加密钱包扫国家码”有执法或表态？
- 巴西央行 2025 年 VASP 规则是否把稳定币支付或转账纳入外汇监管？对 Pix 扫码类产品有何影响（仍为 low，未核实）？
- PayPay 最早受理 Alipay 的日期，以及作为 Alipay+ ACQP 的起始日期（仍未核实）。