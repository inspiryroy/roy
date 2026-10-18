# 05 · 各国接入手册

> 每个国家回答同样的问题：码是什么、钱走哪条轨道、已有哪些跨境通道、监管红线在哪、找谁合作、推荐哪条接入路径、稳定币放在哪一段。路径编号见 [01 章 1.5](01-architecture.md#15-接入各国国家码的四种路径)：**A** 交换机跨境网关 / **B** 单一收单行 on-us / **C** 借道 Alipay+、HIVEX / **D** Nexus。码结构细节见 [02 章](02-qr-interoperability.md)，来源见 [09](09-sources.md)。

## 5.1 优先级总览

评分维度：**日本游客量**（2025，接待国统计）、**国家码普及**、**私营网络接入先例**（交换机是否已对私营跨境网络开放）、**Alipay+ 竞争**（该国是否已对全部 Alipay+ 钱包开放——若是，PayPay 可直接沿用 Alipay+，我们的差异化只剩价格与结算速度）、**稳定币可落地程度**。

| 国家 | 日本游客（2025） | 国家码普及 | 私营网络接入先例 | Alipay+ 现状 | 稳定币可落地 | 建议定位 |
|---|---|---|---|---|---|---|
| 泰国 | 最多：1–5 月 44.4 万（全年推算约 100–110 万） | 极高（月 20 亿笔以上） | 有：Ant（仅中国走廊，Krungthai）、GLN × SCB | **仅中国 Alipay** | 低（只能离岸） | **Phase 1 试点首选**：量最大、差异化最强；先 B（Krungsri/SCB on-us）再 A |
| 越南 | 第二：1–5 月 34.2 万（全年推算约 80 万） | 高 | 有：Ant（Vietcombank）、GLN（BIDV/Hana）、Liquid（VietinBank）；Decree 52 修订利好 | **仅中国 Alipay** | 低 | **Phase 1–2**：复制 GLN 的 NAPAS 境外网络模式 |
| 印尼 | 未查到 | 极高（商户约 4,500 万） | 央行双边为主；中国线经 Alipay+ 技术层 | **仅中国（Alipay/UnionPay）** | 低 | **Phase 2**：借道 BI–日本（Netstars）框架，日本→印尼方向已获 FSA 许可、待上线 |
| 柬埔寨 | 未查到（量小） | 高（约 450 万商户） | 有：Alipay+、UPI（ACLEDA）、微信 | 全钱包开放 | **中**（银行经批准可持 Group 1b 稳定币） | **Phase 2**：参与 JPQR–KHQR 二期，同时试点银行层稳定币结算 |
| 马来西亚 | 未查到 | 高 | 成熟：Alipay+、Wise 直连、BC Card、NPCI | 全钱包开放（占入境 > 80%） | 低 | Phase 2：A 路径成熟，但与 Alipay+ 正面竞争（价格、锁定报价） |
| 新加坡 | 未查到 | 中（多方案标签） | 有：NETS 入境方案 | 全钱包开放 | **高**（MAS 框架、StraitsX、CPN） | **网络主体与稳定币枢纽所在地**；商户侧与 Alipay+ 竞争 |
| 菲律宾 | 未查到 | 中，增长快 | PPMI × Alipay+（2026-09）；HIVEX × RCBC MOU | 全钱包开放（2026-09 起） | **高**（Coins.ph、CPN 出金、PHPC） | Phase 2–3：稳定币出金最顺，但国家级双边联通空白 |
| 老挝 | 未查到（量小） | 中 | GLN × BCEL、UnionPay | 未见 | 无 | Phase 3 |

> 日本游客数为接待国统计的阶段数据与推算（泰国、越南），其余国家本轮未查到 2025 年数值；反方向（东南亚→日本，JNTO 2025 确定值）：泰国 123.3 万、菲律宾 88.5 万、新加坡 72.6 万、越南 67.9 万、印尼 64.1 万、马来西亚 63.7 万——**双向流量都可观，网络应按双向设计以便轧差**。

## 5.2 泰国

| 项 | 内容 |
|---|---|
| 码 / 轨道 | Thai QR Payment（BOT 标准）；PromptPay，NITMX 运营，ISO 20022 + 8583 并存，BAHTNET 延时净额结算 |
| 规模 | 2025-12 单月约 23.8 亿笔 / 4.70 万亿泰铢（二手引 BOT）；PromptPay 注册约 8,100 万 |
| 跨境现状 | 东盟连接面最广：新、马、印尼、越、柬、老、港，中国 Alipay/WeChat/UnionPay（2025-10-30，结算行 Bangkok Bank、Krungthai）；入境**只接受参与银行的商户码**；2026-06 TAT/BOT "Pay Like a Local"（8 家银行） |
| 日本 | 只有泰国人出境（MyPrompt QR CPM，Krungsri + NETSTARS/NTT DATA）；日本钱包入泰未上线 |
| 监管红线 | SEC 2022 禁止数字资产业者为加密支付提供便利；BOT 2026-06 持牌 PSP 只处理泰铢；2026 Q4 起管控稳定币资金流；TouristDigiPay 沙盒（游客加密 → 泰铢，月度上限） |
| 外汇 | NRBA/NRBS 日终上限 2 亿泰铢；**提供跨境支付服务的非居民可加入 NRQC 豁免上限**；非居民来账 > 20 万美元需报告 |
| 候选伙伴 | **Krungsri（BAY，MUFG 集团，对日本天然友好，已有 MyPrompt QR 在日本）**、SCB（GLN 先例，SCB PLANET PLUS 已接入 PayPay 入境）、KBank（老挝线结算行，K-Shop 商户网络大）、Krungthai、Bangkok Bank |
| 推荐路径 | **B → A**：先与 Krungsri 或 SCB 做 on-us 入境受理（只付该行商户码），再经该行作为结算行申请 NITMX 跨境平台的"境外网络"接入（复制 Ant/GLN 模式） |
| 稳定币位置 | 只在离岸：枢纽 USDC → USD → 结算行（NRQC 账户）→ 泰铢入账；不让泰国交易所为商户支付把稳定币变现 |
| 技术要点 | 只接 tag 30/31 商户码；Ref1/Ref2、`62-07` 原样透传；很多码不带 `59`，需商户名查询回显 |

## 5.3 马来西亚

| 项 | 内容 |
|---|---|
| 码 / 轨道 | DuitNow QR（PayNet MPM v1.5，PFI=`02`）；RPP（ISO 20022，7×24），RENTAS 净额结算 |
| 规模 | 2025 年 PayNet 84.4 亿笔数字支付；DuitNow QR 约 30 亿笔；受理点 > 300 万；跨境 QR 2,970 万笔（2.5 倍） |
| 跨境现状 | 商户开通 DuitNow 即**自动受理跨境 QR**、MYR 入账、费率同境内；PayNet 跨境网关已接泰、新、印尼、柬、银联、**Alipay+（占入境 > 80%）**、BC Card、NPCI（2026-02 签约）、**Wise 直连（2026-07-30）** |
| 日本 | 未上线；**2026-09-15 日马本币结算（LCS）合作备忘录** + 60 亿美元互换（2026-09-18 生效） |
| 监管红线 | 数字资产不是 BNM 监管的支付工具；林吉特非国际化、离岸交易违反政策；林吉特稳定币仅 DAIH 批发试点 |
| 候选伙伴 | **PayNet**（跨境网关）；结算行候选 **MUFG(M) / SMBC(M) / Mizuho(M)**（均在 DuitNow 收单目录，最适合承接 JPY/MYR LCS）、CIMB（泰马线结算行）、Maybank |
| 推荐路径 | **A**：PayNet 跨境网关已对多家私营网络开放（Alipay+、Wise），是最成熟的"境外网络"入口 |
| 稳定币位置 | 只在离岸；JPY/USD 进入日资在马子行，在岸兑换 MYR 后在 RENTAS 与 PayNet 结算 |
| 技术要点 | PFI `02`；动态码有效期短（社区资料约 60 秒，D313 过期）→ 锁汇 TTL 更短；跨境账户查询（交易码 521）回显商户名；`MCC 0000` 为 P2P；JomPAY（`898989`）为账单 |

## 5.4 新加坡

| 项 | 内容 |
|---|---|
| 码 / 轨道 | SGQR 统一标签（MAS/IMDA）；PayNow（FAST 上的寻址层）、NETS QR、GrabPay 等多方案；MEPS+ 结算 |
| 跨境现状 | 入境钱包经 NETS 受理 SGQR（DuitNow、QRIS、PromptPay、Alipay+）；**StraitsX × Alipay+ × Grab 稳定币清算先例（2024-11）**；dtcpay 为 SGQR+ 发卡方；NETS 已接台湾 TWQR |
| 日本 | 未上线 |
| 监管 | 有稳定币框架（SCS 2023；2026-09 征求意见拟立法化并引入外国稳定币认可）；MAS BLOOM（2025-10，代币化负债与受监管稳定币结算，参与方含 Circle、StraitsX、Partior、Ant International） |
| 候选伙伴 | **NETS**（入境方案收单，覆盖最大）、**StraitsX / dtcpay**（MPI-DPT，稳定币↔SGD）、Liquid Group、DBS/OCBC/UOB |
| 推荐路径 | **网络主体 + 稳定币枢纽所在地**；商户侧走 NETS 入境方案（A） |
| 稳定币位置 | 可以落地：USDC/XSGD ↔ SGD 由持牌 MPI 完成 |
| 技术要点 | 按 GUID 路由；NETS 载荷带签名只能原样提交；`51` 不是支付账户；PayNow 过期日两种格式 |

## 5.5 印度尼西亚

| 项 | 内容 |
|---|---|
| 码 / 轨道 | QRIS（BI / ASPI）；GPN 交换机（Artajasa、Rintis、Jalin、Alto）；BI-FAST；BI-RTGS 最终结算 |
| 规模 | 2026 年中用户约 6,577 万、商户约 4,486 万（96.68% 为 UMKM） |
| 跨境现状 | 泰、马、新、中（2026-04-30，Alipay+/银联）、韩（2026-04-01）；入境累计 1,780 万笔（截至 2026-08）；商户 IDR 全额入账、MDR 同境内；LCS 框架下 ACCD 银行报价 |
| 日本 | **印尼→日本（扫 JPQR Global）2025-08-17 上线**（日方 Netstars）；**日本→印尼**：BI 2026-04 称已获日本 FSA 许可、"很快"，未见正式上线 |
| 监管红线 | 加密资产不是支付工具；稳定币专门规则预计 2027-01；GPN 境内处理与数据境内化；卢比禁止离岸；非银 PJP 外资 ≤ 85%、基础设施类 ≤ 20%；USTR 对 QRIS/GPN 的批评使"外资直连"政治敏感 |
| 候选伙伴 | **Netstars / JPQR Global（日方 hub）**、日资背景银行（Bank Danamon（MUFG）、SMBC Indonesia、Mizuho Indonesia）、大型收单行（BRI、Mandiri、BNI、BCA）、聚合商（Xendit、DOKU）、钱包（GoPay、DANA） |
| 推荐路径 | **借道 BI–日本既有框架（入境方向）**：与 Netstars 合作，作为日方发行侧聚合者 / FX 与结算服务方，把 PayPay 等钱包接进来；过渡期 **B**（旅游区大商户、单一收单方） |
| 稳定币位置 | 只在日本侧或离岸；进入印尼的必须是 JPY/USD 法币，在 ACCD 银行兑换 IDR |
| 技术要点 | 以 `51` NMID 为商户主键；多收单域原样转交；静态码"插入 54 当动态码"的做法不能当对账依据；部分银行 App 付款的 QRIS 不支持退款 |

## 5.6 越南

| 项 | 内容 |
|---|---|
| 码 / 轨道 | VietQR（NAPAS）；Napas 247；SBV IBPS 结算；另有 VNPAY-QR 网 |
| 规模 | 约 9,000 万手机银行账户使用 VietQR（2025-10）；2025 年 1–10 月 VietQR 笔数 +52% |
| 跨境现状 | **NAPAS 直连境外私营网络**：Alipay（Vietcombank）、银联、微信（BIDV）、韩国 GLN（Hana + BIDV）、新加坡 Liquid（VietinBank）；柬、老、泰双边；外国钱包直接扫 VietQRGlobal |
| 日本 | NAPAS 曾宣布"2025 年拓展至日本"，未上线 |
| 监管红线 | Decree 52/2024：境外机构须经 SBV 认可的商业银行进入（2026-07 修订草案拟允许经 NAPAS 等国际交换服务商接入）；加密资产不得作支付手段；试点排除法币稳定币；VND 无离岸市场；个人数据跨境传输需影响评估并报备 |
| 候选伙伴 | **NAPAS**；结算行 Vietcombank / BIDV / VietinBank（日资持股背景：瑞穗—Vietcombank、MUFG—VietinBank、SMBC—VPBank，**均待核实**）；钱包 MoMo、ZaloPay、VNPAY |
| 推荐路径 | **A**：复制 GLN 模式，作为境外合作网络签约 NAPAS，指定一家越南结算行；跟踪 Decree 52 修订定稿 |
| 稳定币位置 | 只在离岸；结算行收 USD/JPY 法币兑 VND |
| 技术要点 | 无显式 P2M 标志；个人码缺 `52/59/60`；`62-08` 附言透传；VND 无小数；BIN 表维护 |

## 5.7 柬埔寨

| 项 | 内容 |
|---|---|
| 码 / 轨道 | KHQR（NBC）；Bakong（Hyperledger Iroha，日本 Soramitsu 承建），KHR/USD 双币 |
| 规模 | 约 450 万受理商户；2025 年约 13.3 亿笔 |
| 跨境现状 | 越、老、马、泰、UnionPay、**Alipay+（2024-10）**、微信（2026-08）、印度 UPI（2026-06，ACLEDA）；Bakong Tourists App（游客用国际卡充值扫码） |
| 日本 | **柬→日（扫 JPQR）2025-07-04 上线**；日→柬（二期）计划中，日方 NETSTARS + SMBC，柬方 ACLEDA、Sathapana |
| 监管 | 2024-12 加密资产 Prakas：持牌银行经事前批准可持有 Group 1b 稳定币（≤ 3% CET1）；跨境 QR 以 KHR 结算（去美元化） |
| 候选伙伴 | **ACLEDA**、Sathapana（日资背景，待核实）、ABA；日方 NETSTARS、SMBC；Soramitsu 作为与 NBC 沟通的纽带 |
| 推荐路径 | **借道 JPQR–KHQR 二期**（与 NETSTARS 合作或作为其发行侧伙伴）；并行与 ACLEDA/Sathapana 探讨 **NBC 批准下以 Group 1b 稳定币做跨境头寸结算**——东南亚少数可能让稳定币直接到 LSP 的国家 |
| 稳定币位置 | 可能可以到银行层（需 NBC 批准）；商户侧 KHR |
| 技术要点 | 无 GUID 的结构化识别；`99-01` 过期校验；USD 码的跨境可付性待确认 |

## 5.8 老挝

| 项 | 内容 |
|---|---|
| 码 / 轨道 | LAO QR（BOL / LAPNet）；成员接口私有 JSON + RSA 签名 |
| 跨境现状 | 柬、泰（KBank + BCEL）、越、UnionPay、韩国 GLN（BCEL）；日本无 |
| 监管 | 加密业务被禁止；国内标价支付一律基普；只有商业银行可兑换；支付牌照有本地持股要求 |
| 推荐路径 | 二期，经 BCEL（B）或 LAPNet 双边（A） |
| 稳定币位置 | 不入境 |

## 5.9 菲律宾

| 项 | 内容 |
|---|---|
| 码 / 轨道 | QR Ph（PPMI）；InstaPay（BancNet 运营的 ACH，实时、单笔 ≤ ₱50,000）、PESONet（批量）；PhilPaSSplus 结算 |
| 规模 | 2025 年 24.7 亿笔、₱1.16 万亿；数字支付占零售笔数 64.69% |
| 跨境现状 | **Alipay+ × PPMI（2026-09-01）**，全国 QR Ph 商户可被 Alipay+ 钱包扫；DuitNow 线计划 2026 年内；Nexus 2027 年年中；HIVEX × RCBC × Novus MOU |
| 日本 | 无（反方向：GCash、HelloMoney 经 Alipay+ 在 PayPay 商户付款） |
| 监管 | BSP VASP 新牌照无限期暂停（2025-09 起）；SEC CASP 规则（2025-07-05 生效）；**PHPC 已出 BSP 沙盒（2025-06）**；BPI × Meridian 以稳定币为入境汇款结算层（2026-07，与本方案同模式）；2026-09 征求意见拟暂停新 OPS 注册 12 个月、收单机构只能与持牌 VASP 合作 |
| 候选伙伴 | **Coins.ph**（VASP + EMI，InstaPay/PESONet 双参与者，PHPC 发行方，CPN 收款机构——"收稳定币 → 付 QR Ph 商户"可在一家内闭环）、PDAX、BPI、UnionBank / Security Bank；注意日资银行马尼拉分行只参与 PESONet、不在 InstaPay |
| 推荐路径 | 短期 **issuer-sponsor**：与一家 InstaPay 发送方参与者（Coins.ph 等）签约，由其向任意 QR Ph 商户发起贷记——需确认 PPMI 规则是否允许"境外发起"及 BSP 定性；中期与 PPMI 谈对标 Alipay+ 的跨境平台接入 |
| 稳定币位置 | **可以落地**：USDC → Coins.ph（CPN）→ PHP |
| 技术要点 | 只接 tag 28 P2M；参与机构代码 ≠ SWIFT BIC，需维护映射表；`62` 字段 `***` 时需付款人填写；退款靠收单方反向贷记 |

## 5.10 缅甸（不建议进入第一期）

MMQR（CBM，2025-02 正式推出，基于 EMVCo，GUID 与子字段未查到）；缅甸自 2022-10 起被 FATF 列入"call for action"黑名单（2026-06 全会继续保留），加上制裁筛查、代理行去风险与严格外汇管制，日本持牌机构可行性很低。
