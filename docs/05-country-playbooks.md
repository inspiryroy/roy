# 05 · 各国接入手册

> 每个国家回答同样的问题：码是什么、钱走哪条轨道、已有哪些跨境通道、监管红线在哪、找谁合作、推荐哪条接入路径、稳定币放在哪一段。路径编号见 [01 章 1.5](01-architecture.md#15-接入各国国家码的四种路径)：**A** 交换机跨境网关（覆盖参与跨境受理的银行发出的全部商户码）/ **B1** 收单行 on-us（只付该行商户码）/ **B2** 发卡侧赞助行（issuer-sponsor：本国快速支付系统直连成员代境外钱包向任意国家码商户发起贷记，需央行/交换机确认）/ **C** 借道 Alipay+、HIVEX / **D** Nexus（首版只做账户到账户，日本非成员，不是 PayPay 的扫码通道）。码结构细节见 [02 章](02-qr-interoperability.md)，来源见 [09](09-sources.md)。
>
> 两条全局约定：
> * **伙伴结算方式因国而异**：新加坡、菲律宾的伙伴链上收 USDC，可 7×24、日内多次结算；泰国、马来西亚、印尼、越南、柬埔寨、老挝的伙伴收工作日 USD 电汇 + 境内换汇（T+0–T+1 工作日），稳定币只在离岸枢纽，带来的是枢纽侧多国共享流动性与链上批次存证，不是伙伴侧 7×24，还多出 JPY→USDC→USD 两次兑换（10 章假设约 15 bps）。这些国家是否经 USDC 中转，由 [10 章](10-economics.md) 10.6 的法币基准对照决定。
> * **流程结构**：新加坡、马来西亚、越南、菲律宾、老挝与泰国（[03 章](03-payment-flows.md)）结构相同，只有本地轨道和码字段不同；印尼、柬埔寨可经日方 Netstars/JPQR Global 交换（METI–BI、METI–NBC 框架；出境方向尚无日本钱包，由本网络补上发行侧）：印尼由 LCS 框架下的 ACCD 银行按本币直接汇率报价；柬埔寨的汇率安排未查到（推断由当地银行按本币报价，与印尼类似）。路由、FX 和结算都与泰国不同（见 5.5、5.7）。

## 5.1 优先级总览

评分维度：**日本游客量**（2025，接待国统计）、**国家码普及**、**私营网络接入先例**（交换机是否已对私营跨境网络开放）、**Alipay+ 现状**（该国国家码是否已经交换机/码运营方对中国以外的**多家** Alipay+ 钱包开放。公开的上线名单中均未见 PayPay；PayPay 海外支付模式截至 2026-10 只覆盖韩国、台湾，是否在这些国家开通取决于 PayPay 与 Ant 的商务决定（推断）。已开放的国家我们与 Alipay+ 正面竞争，差异化只剩锁定报价、价格与链上伙伴的日内结算；泰、越、印尼的国家码对日本钱包尚无已上线通道，差异化最强。另须注意：Alipay+ 由收单侧向钱包付 wallet interchange，PayPay 改用本网络是从"收 interchange"变为"付网络费"，BD 须给出对标 Alipay+ 的钱包分润，见 [06 章](06-compliance-risk.md) R3 与 [10 章](10-economics.md) 10.7）、**稳定币可落地程度**（括号内为伙伴结算方式）。

| 国家 | 日本游客（2025） | 国家码普及 | 私营网络接入先例 | Alipay+ 现状 | 稳定币可落地（伙伴结算） | 建议定位 |
|---|---|---|---|---|---|---|
| 泰国 | 已知数据中最多：1–5 月 44.4 万（全年推算约 100–110 万；他国同口径数据未查到，排序未核实） | 极高（PromptPay 全部交易月 20 亿笔以上，含转账；Thai QR 商户数及各行份额未查到，Phase 0 向候选行索取） | 有：Ant（仅中国走廊，Krungthai）、GLN × KB 国民 × SCB（B2，2023-12，现状未核实） | 国家码线只见中国 Alipay 用户（未检出对其他钱包开放的公告，非官方否定）；其他 Alipay+ 钱包只能扫 KTC/2C2P/Antom 等收单方的码 | 低（只在离岸；USD 电汇） | **Phase 1 试点首选**：已知量最大、差异化最强；先 B2（SCB，GLN 先例）或 B1，再 A；工作日日结 |
| 越南 | 已知数据中次之：1–5 月 34.2 万；2025 全年约 81.4 万（SGGP 引越南统计，见 12 章来源 52；排序未核实） | 高 | 有：Ant（Vietcombank）、GLN（BIDV/Hana）、Liquid（VietinBank）；Decree 52 修订利好；加密钱包 Bitget、RedotPay 已可扫 VietQR（竞品） | Alipay 线只见中国 Alipay 用户（未检出对其他钱包开放的公告，非官方否定） | 低（USD 电汇） | **Phase 1–2**：复制 GLN 的 NAPAS 境外网络模式（需对端结算行，见 5.6） |
| 印尼 | 未查到 | 极高（商户约 4,500 万） | 以与东盟各国的双边联通为主；中国线经 Alipay+ 技术层；日本方向经 METI–BI 框架下的 Netstars | Alipay 线只见中国 Alipay 用户（未检出对其他钱包开放的公告，非官方否定；中国线另有银联） | 低（法币；LCS 本币直接汇率） | **Phase 2**：本网络作为日方发行侧聚合者，经 Netstars/JPQR Global 交换接 QRIS（BI 称日本→印尼方向已获 FSA 许可，但未见日本钱包接入）；谈不成时改走 B1/A |
| 柬埔寨 | 未查到（量小） | 高（约 450 万商户） | 有：Alipay+、UPI（ACLEDA）、微信（单一报道，未核实） | 已对 12 个 Alipay+ 钱包开放（2024-10） | **中**（银行经 NBC 批准可持 Group 1b 稳定币；获批前 USD 电汇） | **Phase 2**：经 Netstars 参与 JPQR–KHQR 二期，同时试点银行层稳定币结算 |
| 马来西亚 | 未查到 | 高 | 成熟：Alipay+、Wise 直连（2026-07）、BC Card（一期已上线）；NPCI 2026-02 签约、未确认上线 | 已对 8 个以上 Alipay+ 钱包开放（2023-10，占入境 > 80%） | 低（USD 电汇） | Phase 2：A 路径成熟，但与 Alipay+ 正面竞争（价格、锁定报价） |
| 新加坡 | 未查到 | 中（多方案标签） | 有：NETS 入境方案 | 经 NETS 对首批 6 个钱包开放（2023-04） | **高**（MAS 框架、StraitsX、CPN；链上 USDC） | **网络主体与稳定币枢纽所在地**（须持牌，见 5.4）；商户侧与 Alipay+ 竞争 |
| 菲律宾 | 未查到 | 中，增长快 | PPMI × Alipay+（2026-09）；HIVEX × RCBC MOU；加密钱包 Bitget、RedotPay 已可扫 QR Ph（竞品） | PPMI × Alipay+ 2026-09 上线，开放钱包名单未查到 | **高**（Coins.ph、CPN 出金、PHPC；链上 USDC） | Phase 2–3：稳定币出金最顺，但国家级双边联通空白 |
| 老挝 | 未查到（量小） | 中 | GLN × BCEL、UnionPay | 未见 | 无（USD 电汇） | Phase 3 |

> 日本游客数为接待国统计的阶段数据与推算（泰国、越南），其余国家本轮未查到 2025 年数值，所以"最多/次之"只是已知数据中的排序；反方向（东南亚→日本，JNTO 2025 确定值）：泰国 123.3 万、菲律宾 88.5 万、新加坡 72.6 万、越南 67.9 万、印尼 64.1 万、马来西亚 63.7 万——**双向流量都可观，网络应按双向设计以便轧差**。

## 5.2 泰国

| 项 | 内容 |
|---|---|
| 码 / 轨道 | Thai QR Payment（BOT 标准）；PromptPay，NITMX 运营，ISO 20022 + 8583 并存，BAHTNET 延时净额结算 |
| 规模 | 2025-12 单月约 23.8 亿笔 / 4.70 万亿泰铢（二手引 BOT；是 PromptPay 全部交易，含转账，不等于 Thai QR 商户受理）；PromptPay 注册约 8,100 万；Thai QR 商户总数及各行份额未查到（Phase 0 向候选行索取） |
| 跨境现状 | 东盟连接面最广：新、马、印尼、越、柬、老、港，韩国 GLN（经 SCB），中国 Alipay/WeChat/UnionPay（2025-10-30，结算行 Bangkok Bank、Krungthai）；中国线开通时只能扫 BBL、KTB、KBank、ICBC Thai、SCB、BAAC 六家银行的商户码（BAY、GSB、HSBC TH、ttb 待上线），其他入境线是否同样受限、是否受理 tag 29 个人码未核实；Alipay+ 的国家码线只见中国 Alipay 用户，其他 Alipay+ 钱包只能扫 KTC/2C2P/Antom 等收单方的码；2026-06 TAT/BOT "Pay Like a Local"（8 家银行）；RedotPay 招聘信息称计划接 PromptPay（未上线） |
| 日本 | 只有来日方向：泰国人在日本出示 MyPrompt QR（CPM，Krungsri 等泰国银行 + NETSTARS/NTT DATA），泰国钱包经 Alipay+ 在 PayPay 商户付款（SCB PLANET PLUS 等，2026-06）；日本钱包扫 PromptPay 国家码尚无通道 |
| 监管红线 | SEC 2022 禁止数字资产业者为加密支付提供便利；BOT 2026-06 持牌 PSP 只处理泰铢；2026 Q4 起管控稳定币资金流；TouristDigiPay 沙盒（游客加密 → 泰铢，月度上限） |
| 外汇 | NRBA/NRBS 日终合计上限 2 亿泰铢（2019 年口径；BOT 外汇通知 No.34 于 2025-12-01 生效后放宽了 NRBA/NRBS 规则，现行上限待核实）；**NRQC 是 BOT 给非居民的资格，不是账户类型**：提供跨境支付服务的非居民可加入 NRQC，其 NRBA 泰铢余额不受日终上限约束（BOT PR 42/2023）；2025-12-30 起银行须报告非居民来账超过 20 万美元的交易；本币腿只有在泰方结算行书面承诺"交易日锁价、T+n 交割"时，才能向用户承诺锁定汇率（见 [04 章](04-stablecoin-settlement.md) 4.6） |
| 候选伙伴 | **SCB**（GLN × KB 国民先例，可作 B2 赞助行；SCB PLANET PLUS 已经 Alipay+ 接入 PayPay 入境；2024-10 与 Lightnet 宣布推出"泰国首个稳定币"跨境转账服务（所用代币、泰铢出金能力与牌照范围未查到），可探讨其合规接收稳定币的可能）、**Krungsri**（BAY，MUFG 集团，已有 MyPrompt QR 在日本的合作；但中国线开通时 BAY 商户码仍"待上线"）、KBank（老挝线结算行，K-Shop 商户网络大）、Krungthai、Bangkok Bank（现有跨境线结算行） |
| 推荐路径 | **B2 → A**：优先与 SCB 谈发卡侧赞助模式（GLN 先例，SCB 称覆盖全国 Thai QR 商户，现状未核实），需 BOT/NITMX 确认"境外发起"口径与外汇定性；Krungsri 作为备选（B1 或 B2）。只能做 B1 时，须按 tag 30 Biller ID 前 13 位税号识别合作行商户码（这一段也可能是 biller 自身税号，规则须与合作行确认），而不只看 tag 31（参考实现尚未实现，见 02 章 2.2）。A 阶段申请 NITMX 跨境平台的"境外网络"接入（复制 Ant 模式）：现有 NITMX 跨境线的泰方结算行是 Bangkok Bank（中国、香港线）、Krungthai（中国线）、KBank（老挝线）、CIMB Thai（马来西亚线），Krungsri/SCB 没有结算行先例，A 阶段结算行候选列 KTB/BBL/KBank |
| 结算与担保 | Phase 1 按泰国工作日日结：枢纽 USDC → 出金方 → USD 电汇 → 泰方结算行兑泰铢入账（T+0–T+1 工作日），截止时间与节假日日历对齐结算行，不做小时结，伙伴侧没有 7×24；伙伴的净退款也经出金方以电汇收回，不收稳定币。周末/节假日：网络离岸主体可申请加入 NRQC，在其 NRBA 中持泰铢预存池（即 04 章模型 C）。垫付风险用结算行保函/SBLC 或 NRQC 泰铢预存覆盖；链上保证金合约在审计前只用于链上伙伴（新加坡、菲律宾） |
| 稳定币位置 | 只在离岸（枢纽侧多国共享流动性与链上批次存证）；不让泰国交易所为商户支付把稳定币变现；是否经 USDC 中转由 10 章 10.6 法币基准对照决定 |
| 技术要点 | 只接 tag 30/31 商户码（只有 tag 31 的码只能经该收单行 on-us）；`A000000677012006` 识别但不承接；Ref1/Ref2、`62-07` 原样透传；很多码不带 `59`，**商户名查询回显是 Phase 1 必需项**（[07 章](07-api-spec.md) 7.4.0，经 NITMX/结算行查询） |

## 5.3 马来西亚

| 项 | 内容 |
|---|---|
| 码 / 轨道 | DuitNow QR（PayNet MPM v1.5，PFI=`02`）；RPP（ISO 20022，7×24），参与者在 RENTAS 结算（净额机制、场次与预存要求未核实） |
| 规模 | 2025 年 PayNet 84.4 亿笔数字支付；DuitNow QR 约 30 亿笔；受理点 > 300 万；跨境 QR 2,970 万笔（2.5 倍） |
| 跨境现状 | 商户开通 DuitNow 即**自动受理跨境 QR**、MYR 入账；跨境费率由收单方自定（DuitNow 官网称收单方可能有不同费率结构，Alliance Bank 称与本地 QR 相同）；PayNet 跨境网关已接泰、新、印尼、柬、银联、**Alipay+（8 个以上钱包，占入境 > 80%）**、BC Card（一期已上线）、**Wise 直连（2026-07-30）**；NPCI 2026-02 签约、未确认上线；RedotPay 招聘信息称计划接 DuitNow（未上线） |
| 日本 | 未上线；**2026-09-15 日马本币结算（LCS）合作备忘录** + 60 亿美元互换（2026-09-18 生效） |
| 监管红线 | 数字资产不是 BNM 监管的支付工具；林吉特非国际化、离岸交易违反政策；林吉特稳定币：BNM DAIH 批发试点（渣打马 + Capital A），另有私营 RMJDT（2025-12，自称沙盒内，监管身份未确认），均不能用于零售支付（RMJDT 一项为推断） |
| 候选伙伴 | **PayNet**（跨境网关）；结算行候选 **MUFG(M) / SMBC(M) / Mizuho(M)**（均在 DuitNow 收单目录，最适合承接 JPY/MYR LCS）、CIMB（泰马线结算行）、Maybank |
| 推荐路径 | **A**：PayNet 跨境网关已对多家私营网络开放（Alipay+、Wise），是最成熟的"境外网络"入口 |
| 稳定币位置 | 只在离岸；JPY/USD 法币进入日资在马子行（参考实现：USD 电汇），在岸兑换 MYR 后与 PayNet 结算（RENTAS 上的结算机制未核实）；日马 LCS 下直接 JPY→MYR 是否比经 USDC 更便宜，由 10 章 10.6 对照决定 |
| 技术要点 | PFI `02`；动态码有效期短（社区资料约 60 秒，D313 过期）→ 锁汇 TTL 更短；跨境账户查询（交易码 521）回显商户名（07 章 7.4.0 的马来西亚实现）；`MCC 0000` 为 P2P；JomPAY（`898989`）为账单 |

## 5.4 新加坡

| 项 | 内容 |
|---|---|
| 码 / 轨道 | SGQR 统一标签（MAS/IMDA）；PayNow（FAST 上的寻址层）、NETS QR、GrabPay 等多方案；MEPS+ 结算 |
| 跨境现状 | 入境钱包经 NETS 受理 SGQR（DuitNow、QRIS、PromptPay、Alipay+ 首批 6 个钱包 2023-04）；**StraitsX × Alipay+ × Grab 稳定币清算先例（2024-11，XSGD + PBM，商户收 SGD）**——所以"机构间稳定币结算"本身不是我们的差异化；dtcpay 为 SGQR+ 发卡方；NETS 已接台湾 TWQR；RedotPay 招聘信息称计划接 SGQR（未上线） |
| 日本 | 未上线 |
| 监管 | 有稳定币框架（SCS 2023；2026-09 征求意见拟立法化并引入外国稳定币认可）；MAS BLOOM（2025-10，代币化负债与受监管稳定币结算，参与方含 Circle、StraitsX、Partior、Ant International）；**DTSP 制度**（FSMA 第 9 部分，2025-06-30 生效，无过渡期）：只服务境外客户的数字代币服务商须持牌，已持 PS Act 牌照者不受影响——枢纽向 PayPay 收日元、持有并转出 USDC、向境外 LSP 付款，客户全在新加坡境外，不持 PS Act 牌照即落入此制度 |
| 候选伙伴 | **NETS**（入境方案收单，覆盖最大）、**StraitsX / dtcpay**（MPI-DPT，稳定币↔SGD）、Liquid Group、DBS/OCBC/UOB |
| 推荐路径 | **网络主体 + 稳定币枢纽所在地，但必须持牌**：申请 MPI（跨境汇款 + DPT 服务），或由已持牌的 StraitsX / dtcpay 担任稳定币兑换与托管方、网络只做规则与技术；新加坡法律意见是 Phase 0 阻断项。商户侧走 NETS 入境方案（A） |
| 稳定币位置 | 可以落地：USDC/XSGD ↔ SGD 由持牌 MPI 完成；新加坡伙伴链上收 USDC，可 7×24、日内多次结算 |
| 技术要点 | 按 GUID 路由；NETS 载荷带签名只能原样提交；`51` 不是支付账户；PayNow 过期日两种格式 |

## 5.5 印度尼西亚

| 项 | 内容 |
|---|---|
| 码 / 轨道 | QRIS（BI / ASPI）；GPN 交换机（Artajasa、Rintis、Jalin、Alto）；BI-FAST；BI-RTGS 最终结算 |
| 规模 | 2026 年中用户约 6,577 万、商户约 4,486 万（96.68% 为 UMKM） |
| 跨境现状 | 泰、马、新、中（2026-04-30，Alipay+/银联）、韩（2026-04-01）；入境累计 1,780 万笔（截至 2026-08）；商户按 IDR 入账、MDR 与境内相同；LCS 框架下 ACCD 银行报价 |
| 日本 | **印尼→日本（扫 JPQR Global）2025-08-17 上线**（日方 Netstars；METI 2022-12 与 BI 签 JPQR 互操作 MoC，日本央行未参与）；**日本→印尼**：BI 2026-04 称已获日本 FSA 许可、"很快"，未见正式上线，也未见任何日本钱包宣布接入（Netstars 是交换运营方，不是钱包）；入境方向只覆盖张贴 JPQR Global 码的商户（首批 35 家） |
| 监管红线 | 加密资产不是支付工具；稳定币专门规则预计 2027-01；GPN 境内处理与数据境内化；卢比禁止离岸；非银 PJP 外资 ≤ 85%、基础设施类 ≤ 20%；USTR 对 QRIS/GPN 的批评使"外资直连"政治敏感 |
| 候选伙伴 | **Netstars / JPQR Global（日方 hub）**、日资背景银行（Bank Danamon（MUFG）、SMBC Indonesia、Mizuho Indonesia）、大型收单行（BRI、Mandiri、BNI、BCA）、聚合商（Xendit、DOKU）、钱包（GoPay、DANA） |
| 推荐路径 | **经 METI–BI 框架下的 Netstars/JPQR Global 交换**：Netstars 只是交换运营方，日本→印尼方向缺的是日本钱包一端；本网络与 Netstars 合作，作为日方发行侧聚合者 / FX 与结算服务方，把 PayPay 等钱包接进来。若 Netstars 自己引入日本钱包或拒绝合作，就改走 B1 或 A。流程与泰国不同：路由经 Netstars 枢纽，由 ACCD 银行按本币直接汇率（LCS）报价，FX 与结算要另行设计。过渡期 **B1**（旅游区大商户、单一收单方） |
| 稳定币位置 | 只在日本侧或离岸；进入印尼的必须是 JPY/USD 法币，在 ACCD 银行兑换 IDR |
| 技术要点 | 以 `51` NMID 为商户主键（NMID 不合法的码不承接）；多收单域原样转交；TUNTAS 个人码结构未查到，P2P 判别未实现；静态码"插入 54 当动态码"的做法不能当对账依据；部分银行 App 付款的 QRIS 不支持退款 |

## 5.6 越南

| 项 | 内容 |
|---|---|
| 码 / 轨道 | VietQR（NAPAS）；Napas 247；经 SBV IBPS 结算（场次、担保/预存安排未核实）；另有 VNPAY-QR 网 |
| 规模 | 约 9,000 万手机银行账户使用 VietQR（2025-10）；2025 年 1–10 月 VietQR 笔数 +52% |
| 跨境现状 | **NAPAS 直连境外私营网络**：Alipay（Vietcombank）、银联、微信（BIDV）、韩国 GLN（Hana + BIDV）、新加坡 Liquid（VietinBank）；柬、老、泰双边；外国钱包直接扫 VietQRGlobal；加密钱包 Bitget Wallet / Bitget、RedotPay 已可扫 VietQR（用户付 USDT/USDC，经未公开的本地出款方走 NAPAS），是直接竞品，也是监管风险信号（越南加密资产不得作支付手段） |
| 日本 | NAPAS 曾宣布"2025 年拓展至日本"，未上线 |
| 监管红线 | Decree 52/2024：境外机构须经 SBV 认可的商业银行进入（2026-07 修订草案拟允许经 NAPAS 等国际交换服务商接入）；加密资产不得作支付手段；试点排除法币稳定币；VND 无离岸市场；个人数据跨境传输须做影响评估并于 60 天内报公安部（个人数据保护法 2026-01-01 生效，见 [06 章](06-compliance-risk.md) 6.7） |
| 候选伙伴 | **NAPAS**；结算行 Vietcombank / BIDV / VietinBank（日资持股背景：瑞穗—Vietcombank、MUFG—VietinBank、SMBC—VPBank，**均待核实**）；钱包 MoMo、ZaloPay、VNPAY |
| 推荐路径 | **A**：复制 GLN 模式，作为境外合作网络签约 NAPAS——注意 GLN 模式包含两端银行（韩方 Hana Bank 经 SBV 批准为结算行、越方 BIDV）；INSPAY 需确认 SBV 是否接受非银行的离岸结算方，或另找一家经 SBV 批准的境外银行作为对端结算行，并指定一家越南结算行；跟踪 Decree 52 修订定稿 |
| 稳定币位置 | 只在离岸；结算行收 USD/JPY 法币（工作日电汇）兑 VND |
| 技术要点 | 无显式 P2M 标志；个人码缺 `52/59/60`；`62-08` 附言透传；VND 无小数；BIN 表维护 |

## 5.7 柬埔寨

| 项 | 内容 |
|---|---|
| 码 / 轨道 | KHQR（NBC）；Bakong（Hyperledger Iroha，日本 Soramitsu 承建），KHR/USD 双币 |
| 规模 | 约 450 万受理商户；2025 年约 13.3 亿笔 |
| 跨境现状 | 越、老、马、泰、UnionPay、**Alipay+（2024-10，12 个钱包）**、微信（据单一报道 2026-08，未核实）、印度 UPI（2026-06，ACLEDA）；Bakong Tourists App（游客用国际卡充值扫码） |
| 日本 | **柬→日（扫 JPQR）2025-07-04 上线**（METI–NBC MoC 2023-12、NBC–PJA MoU 2025-04，日本央行未参与）；日→柬（二期）计划中，未见日本钱包宣布参与：日方 NETSTARS（日方结算行据单一报道为 SMBC，未核实），柬方 ACLEDA、Sathapana |
| 监管 | 2024-12 加密资产 Prakas：持牌银行经 NBC 事前批准可持有 Group 1b 稳定币（≤ 3% CET1，NBC 原文未核）；**推断**：跨境 QR 可能以 KHR 结算（依据 ACLEDA 指南：柬方用户出境扫码只能从 KHR 账户扣款）；入境方向是否只能 KHR、USD 标价 KHQR 能否被外国钱包支付，待 NBC 确认 |
| 候选伙伴 | **ACLEDA**、Sathapana（日资背景，待核实）、ABA；日方 NETSTARS、SMBC（单一报道）；Soramitsu 作为与 NBC 沟通的纽带 |
| 推荐路径 | **经 Netstars 参与 JPQR–KHQR 二期**（METI–NBC 框架）：二期同样缺日本钱包一端，本网络作为发行侧伙伴把 PayPay 等接入；谈不成时改与 ACLEDA/Sathapana 走 B1/B2；流程与泰国不同，要经 Netstars 枢纽（柬方汇率安排未查到，推断由当地银行按本币报价，与印尼类似）；并行与 ACLEDA/Sathapana 探讨 **NBC 批准下以 Group 1b 稳定币做跨境头寸结算**——东南亚少数可能让稳定币直接到 LSP 的国家 |
| 稳定币位置 | 可能可以到银行层（需 NBC 批准），获批前按法币（USD 电汇）；商户侧 KHR |
| 技术要点 | 无 GUID 的结构化识别；`99-01` 过期校验（动态码或带金额却无过期时间的码不承接）；KHR 金额须为整数；USD 码的跨境可付性待确认 |

## 5.8 老挝

| 项 | 内容 |
|---|---|
| 码 / 轨道 | LAO QR（BOL / LAPNet）；成员接口据两份第三方开源实现为私有 JSON + RSA 签名（低置信度，是否另有 ISO 8583/20022 接口未核实） |
| 跨境现状 | 柬、泰（KBank + BCEL）、越、UnionPay、韩国 GLN（BCEL）；日本无 |
| 监管 | BOL 禁止境内金融机构从事加密资产业务（Notice 382/CO，2018）；政府 2021 年起试点许可少数交易所/矿企（LDX、Bitqik），但无允许稳定币支付的规定；国内标价支付一律基普；2023 年起只有商业银行可兑换；支付牌照有本地持股要求 |
| 推荐路径 | Phase 3（见 5.1），经 BCEL（B1）或 LAPNet 双边（A） |
| 稳定币位置 | 不入境；伙伴收 USD 电汇 |
| 技术要点 | tag 38 GUID 由真实码推断；个人码无商户名，需经 LAPNet INQUIRY 取户名（07 章 7.4.0）；LAK 金额精度未核实 |

## 5.9 菲律宾

| 项 | 内容 |
|---|---|
| 码 / 轨道 | QR Ph（PPMI）；InstaPay（BancNet 运营的 ACH，实时、单笔 ≤ ₱50,000）、PESONet（批量）；PhilPaSSplus 结算 |
| 规模 | 2025 年 24.7 亿笔、₱1.16 万亿；数字支付占零售笔数 64.69% |
| 跨境现状 | **Alipay+ × PPMI（2026-09-01）**，全国 QR Ph 商户可被 Alipay+ 合作钱包扫（开放钱包名单未查到）；加密钱包 Bitget Wallet / Bitget、RedotPay 已可扫 QR Ph（用户付 USDT/USDC，经未公开的本地出款方走 InstaPay；Bitget 声明不在当地作为支付服务提供商运营），是直接竞品，也是监管风险信号；DuitNow 线计划 2026 年内；Nexus 2027 年年中（首版只做账户到账户）；HIVEX × RCBC × Novus MOU |
| 日本 | 无（反方向：GCash、HelloMoney 经 Alipay+ 在 PayPay 商户付款） |
| 监管 | BSP VASP 新牌照无限期暂停（2025-09 起）；SEC CASP 规则（2025-07-05 生效）；**PHPC 已出 BSP 沙盒（2025-06）**；BPI × Meridian 以稳定币为入境汇款结算层（2026-07，与本方案同模式）；2026-09 征求意见拟暂停新 OPS 注册 12 个月、收单机构只能与持牌 VASP 合作 |
| 候选伙伴 | **Coins.ph**（VASP + EMI，InstaPay/PESONet 双参与者，PHPC 发行方，CPN 收款机构——"收稳定币 → 付 QR Ph 商户"可在一家内闭环）、PDAX、BPI、UnionBank / Security Bank；注意日资银行马尼拉分行只参与 PESONet、不在 InstaPay |
| 推荐路径 | 短期 **B2 发卡侧赞助行（issuer-sponsor）**：与一家 InstaPay 发送方参与者（Coins.ph 等）签约，由其向任意 QR Ph 商户发起贷记（与泰国 GLN × SCB 同一模式）——需确认 PPMI 规则是否允许"境外发起"及 BSP 定性；中期与 PPMI 谈对标 Alipay+ 的跨境平台接入（A） |
| 稳定币位置 | **可以落地**：USDC → Coins.ph（CPN）→ PHP；菲律宾伙伴链上收 USDC，可 7×24、日内多次结算 |
| 技术要点 | 只接 tag 28 P2M；单笔 ≤ ₱50,000（参考实现拒绝超额）；参与机构代码 ≠ SWIFT BIC，需维护映射表；`62` 字段 `***` 时需付款人填写；退款靠收单方反向贷记 |

## 5.10 缅甸（不建议进入第一期）

MMQR（CBM，2025-02 正式推出，基于 EMVCo，GUID 与子字段未查到）；缅甸自 2022-10 起被 FATF 列入"call for action"黑名单（2026-06 全会继续保留），加上制裁筛查、代理行去风险与严格外汇管制，日本持牌机构可行性很低。
