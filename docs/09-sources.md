# 09 · 资料来源与置信度

> 由调研 agent 的事实清单自动汇总（2026-10-18）。置信度：**高** = 官方一手且在线核实；**中** = 二手权威、开源实现或部分核实；**低** = 未核实（凭记忆或推断），**不得作为决策依据**。
> 调研环境限制：多数官方域名无法直接打开（只能依据搜索结果摘要），搜索次数有上限；因此"高"也主要指"官方页面摘要中有原句"。实施前请按 open questions 逐条向伙伴/监管/律师确认。

## 泰国 / 老挝

事实 69 条（高 17 / 中 47 / 低 5）。

| # | 事实 | 置信度 | 来源 | 日期 | 备注 |
|---|---|---|---|---|---|
| 1 | Thai QR CRC 为 CRC-16/CCITT-FALSE（poly 0x1021，init 0xFFFF），计算范围包含 '6304'；货币 53='764'，国家 58='TH'；01='11' 静态、'12' 动态 | 高 | [链接](https://github.com/dtinth/promptpay-qr) | 2026 | 开源库源码与真实 payload CRC 校验一致 |
| 2 | 泰国–中国跨境 QR 联通 2025-10-30 上线：NITMX 联通 Alipay、UnionPay、WeChat Pay；泰方结算行 Bangkok Bank、Krungthai；开通时可扫 BBL、KTB、KBank、ICBC Thai、SCB、BAAC 的商户码；BAY、GSB、HSBC TH、ttb 待上线 | 高 | [链接](https://www.bot.or.th/en/news-and-media/news/news-20251030.html) | 2025-10-30 | BOT 官方新闻稿（搜索摘要） |
| 3 | NITMX、Ant International、Krungthai 2025-10-26 宣布 PromptPay–Alipay 联通，Krungthai 为结算行；一期中国 Alipay 用户在 Alipay App 内扫 PromptPay 码 | 高 | [链接](https://www.businesswire.com/news/home/20251026429360/en/NITMX-Ant-International-and-Krungthai-Bank-Expand-Payment-Connectivity-Between-Thailand-and-China-via-PromptPay) | 2025-10-26 | 官方新闻稿（搜索摘要）；未见扩展到其他 Alipay+ 钱包的二期公告 |
| 4 | PromptPay × FPS（香港）2023-12-04 上线，双向扫码，运营方 HKICL 与 NITMX | 高 | [链接](https://www.hkma.gov.hk/eng/news-and-media/press-releases/2023/12/20231204-3/) | 2023-12-04 | HKMA 与 BOT 联合新闻稿 |
| 5 | PromptPay–PayNow 2021-04-29 上线，用手机号做跨境实时转账，上限 S$1,000 或 THB25,000/日 | 高 | [链接](https://www.bot.or.th/en/news-and-media/news/news-20210429.html) | 2021-04-29 | BOT 新闻稿 |
| 6 | 泰国–越南互操作 QR 于 2021-03-26 启动 | 高 | [链接](https://www.bot.or.th/en/news-and-media/news/news-20210324-1.html) | 2021-03-24 | BOT 新闻稿 |
| 7 | 泰国–印尼 QRIS 跨境 QR 2021-08-17 试点，2022-08-29 进入实施阶段（76 家机构） | 高 | [链接](https://www.bot.or.th/en/news-and-media/news/news-20220829-1.html) | 2022-08-29 | BOT 新闻稿 |
| 8 | 泰国–老挝跨境 QR：2024-04-03 一期（老挝用户扫 Thai PromptPay 码），2024-06 底起二期（泰国用户扫 LAO QR）；运营方 NITMX 与 LAPNet；结算行 KBank、BCEL | 高 | [链接](https://www.bot.or.th/en/news-and-media/news/news-20240403.html) | 2024-04-03 | BOT/BOL 联合新闻稿；结算行信息来自 Bangkok Post 与 KBank |
| 9 | 泰国–日本：泰国游客在手机银行生成 MyPromptQR（买家出码），日本参与商户扫码；由泰国商业银行与日本服务商在 BOT 支持下建立；仅泰国人出境方向 | 高 | [链接](https://www.bot.or.th/en/financial-innovation/digital-finance/digital-payment/cross-border-payment.html) | 2026-05 | BOT 跨境页面（搜索摘要） |
| 10 | PayPay 2026-06-29 经 Alipay+ 新接入 ShopeePay（新加坡、泰国）与 SCB Planet Plus（泰国），可在日本 PayPay 商户使用，合计 17 个国家地区 35 项服务 | 高 | [链接](https://about.paypay.ne.jp/en/pr/20260629/01/) | 2026-06-29 | PayPay 官方新闻稿（搜索摘要） |
| 11 | SEC Notification KorThor 5/2565：自 2022-04-01 起，数字资产业者不得为用数字资产支付商品服务提供便利，不得提供可作支付工具的钱包，发现客户用于支付须警告、暂停或关户 | 高 | [链接](https://blockchain.bakermckenzie.com/2022/03/27/thai-sec-bans-cryptocurrency-as-a-means-of-payment) | 2022-03-27 | 多家律所一致；发布日 3-18 与 3-23 两说 |
| 12 | TouristDigiPay：SEC 2025-08-18 宣布，联合财政部、AMLO、旅游体育部推出 18 个月沙盒；运营方须为 SEC 持牌数字资产 exchange/broker/dealer，与 BOT 持牌 e-money 合作；申请期 2025-09-25 至 2025-12-26 | 高 | [链接](https://www.sec.or.th/EN/Pages/Shortcut/TouristDigiPay.aspx) | 2025-08-18 | SEC 官方页面（搜索摘要） |
| 13 | BOT 2023-09-26（PR 42/2023）：提供跨境支付服务的非居民可以加入 NRQC 计划，在 NRBA 中管理泰铢流动性而不受日终余额上限约束，且无需逐笔提交底层单据 | 高 | [链接](https://www.bot.or.th/en/news-and-media/news/news-20230926.html) | 2023-09-26 | BOT 新闻稿（搜索摘要） |
| 14 | BOL 于 2020-01-29 软发布 Lao QR Code 支付标准 | 高 | [链接](http://www.xinhuanet.com/english/2020-01/30/c_138743047.htm) | 2020-01-30 | 新华社 |
| 15 | 越南–老挝跨境 QR 2025-01 上线：越南用户扫 LaoQR，7 家越南银行、14 家老挝银行，LAK/VND 本币按实时汇率；反向为后续阶段 | 高 | [链接](https://vietnamnews.vn/economy/1690482/seven-banks-allow-customers-to-pay-by-qr-codes-in-laos.html) | 2025-01-11 | 多家越南官方媒体一致 |
| 16 | UnionPay International 与 LAPNet 2024-12-19 启动 QR 互联：UnionPay App、经 MobileWallet Connect 的中国钱包、国际 UPI 合作钱包可扫 Lao QR 付款 | 高 | [链接](https://www.globenewswire.com/news-release/2024/12/25/3001834/0/en/Lao-QR-Merchants-Now-Accept-Payments-by-UnionPay-Powered-Wallets-UnionPay-International-and-LAPNet-Launch-Payment-Linkage.html) | 2024-12-25 | 结算细节未查到 |
| 17 | 柬埔寨–老挝跨境 QR：一期 2023-08（ACLEDA Bank Plc. 与 ACLEDA Bank Lao 为结算行）；二期 2025-12-19 上线，老挝用户可扫 KHQR（约 450 万商户） | 高 | [链接](https://www.nbc.gov.kh/english/news_and_events/news_info.php?id=877) | 2025-12-19 | NBC 官方新闻 |
| 18 | BOT 2019 年发布 Policy Guideline 'Standardized Thai QR Code for Payment Transactions'（编号 FPG 25620084，B.E.2562），含三部分：PSP 实践、Thai QR Code Payment Standard（支付与转账）、bill payment 用 QR 标准；泰文为正式版，英文为非官方译本 | 中 | [链接](https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2562/EngPDF/25620084.pdf) | 2019-04-17 | PDF 未能直接打开（WebFetch DNS 失败），依据搜索摘要；2019-04-17 这一日期来自 GitHub 衍生文档 |
| 19 | Thai QR 的 tag 段分配：02–25 国际卡组织，26–28 本地卡组织，29–31 PromptPay 及其他支付系统，32–38 与 40–51 按 EMVCo，39 给尚未接入集中式系统的服务商（接入后必须停用） | 中 | [链接](https://github.com/mamamind47/promptpay-resolution-oracle) | 2026-08 | 该仓库 TLV-REFERENCE.md 称依据 BOT FPG 25620084 整理，非 BOT 原文 |
| 20 | tag 29 PromptPay Credit Transfer：sub 00 AID 'A000000677010111'（merchant-presented）；sub 01 手机号 N13，格式 0066+号码；sub 02 身份证/税号 N13；sub 03 e-Wallet ID N15；01/02/03 三选一必填 | 中 | [链接](https://github.com/dtinth/promptpay-qr) | 2026 | 多个独立开源实现（dtinth/promptpay-qr、thai-qr-payment npm 1.2.0 源码）与 BOT 衍生字段表一致；BOT 原文未取得 |
| 21 | tag 30 Bill Payment：sub 00 AID 国内为 'A000000677010112'、跨境为 'A000000677012006'；sub 01 Biller ID N15（税号/身份证 13 位 + 2 位后缀）；sub 02 Ref1（≤20，必填）；sub 03 Ref2（≤20，选填） | 中 | [链接](https://github.com/mamamind47/promptpay-resolution-oracle) | 2026-08 | 跨境 AID 在 saladpuk/PromptPay、keenthekeen/php-promptpay-qr、ihiroshi27/promptpay-js 等多个库中一致；Bangkok Bank API 称 Ref 最长 30（单行实现差异） |
| 22 | tag 31 Payment Innovation：收单行专用 AID 'A000000677010113'，sub 01 为 3 位 Acquirer ID（真实 KBank 码为 004），02–99 由收单行自定义；另有 Standard API AID 'A000000677012004'（sub 01 API ID 001 = Transaction verification API） | 中 | [链接](https://github.com/Fakepng/k-bank-api) | 2023-2026 | 多个真实 KBank K-Shop payload 可见 ...0113 与 004；A000000677012004 仅见于单一衍生文档，属低置信度 |
| 23 | 真实 KBank K-Shop 静态商户码 '00020101021130810016A00000067701011201150107536000315010214KB0000020817990320KPS004KB00000208179931690016A00000067701011301030040214KB0000020817990420KPS004KB00000208179953037645802TH630472B3'，本地重算 CRC-16/CCITT-FALSE 通过；Biller ID 010753600031501 | 中 | [链接](https://github.com/spayicloud01-source/admin-id-bot) | 2026 | GitHub 代码检索所得的生产码；0107536000315 为 KBank 税号属记忆，未核实 |
| 24 | PromptPay QR 基于 EMVCo MPM；MyPrompt QR 用于消费者出码（B scan C） | 中 | [链接](https://developer.scb.co.th/assets/documents/documentation/qr-payment/thai-qr.html) | 未知 | SCB 开发者文档，经搜索摘要读取 |
| 25 | PromptPay 由 NITMX 运营；NITMX 把成员净头寸送 BAHTNET，经 Multilateral Funds Transfer 做最终、不可撤销结算（延时净额）；成员须按 BOT 计算的 Potential Debit Position 质押证券 | 中 | [链接](https://www.bot.or.th/content/dam/bot/documents/en/our-roles/payment-systems/payment-systems-notification---circulars/SRS/regulation/SorRorKhor_1-2557_MeasuresforManagingRisks.pdf) | 2014/2024 | BOT SRS 规则与 BAHTNET 2024 自评估（搜索摘要）；每日结算场次未查到 |
| 26 | BOT 2026 BAHTNET 现代化咨询称 PromptPay 峰值约 9,500 万笔/日，并拟为零售系统增加结算场次、消除隔夜敞口 | 中 | [链接](https://www.bot.or.th/content/dam/bot/documents/th/our-roles/payment-systems/regulations-announcements/bahtnet-modernization-consultation-paper/Response%20Form%20to%20the%20Consultation%20Paper_072026.pdf) | 2026-07 | 只读到搜索摘要，属咨询提案，未定案 |
| 27 | 2021 年 ITMX 采用 ACI Worldwide 实时支付平台，符合 ISO 20022，与 ISO 8583 并存，覆盖 33 家成员行 | 中 | [链接](https://investor.aciworldwide.com/node/22186) | 2021-02-02 | 厂商新闻稿 |
| 28 | PromptPay 为自愿加入的计划，参与者包括 28 家银行和 6 家 e-wallet（非银） | 中 | [链接](https://bfaglobal.com/wp-content/uploads/2022/08/Highlights-emerging-from-Thailand.pdf) | 2022-08 | BFA 报告，数据可能已过时 |
| 29 | PromptPay 2021 年交易 92.775 亿笔、金额 31.8 万亿泰铢 | 中 | [链接](https://www.bot.or.th/content/dam/bot/documents/en/research-and-publications/reports/payment-report/payment-systems-annual-report/Payment_2021_E.pdf) | 2022 | BOT 年报，经搜索摘要读取 |
| 30 | PromptPay 2025-12 单月 23.8 亿笔、4.70 万亿泰铢（引 BOT 数据） | 中 | [链接](https://www.mastercard.com/europe/en/news-and-trends/Insights/2026/real-time-payments-ignite-thailand-as-an-economic-force.html) | 2026 | 二手转引 |
| 31 | PromptPay 2026-03 单月超过 25 亿笔、近 5 万亿泰铢，笔均约 1,950 泰铢 | 中 | [链接](https://www.bangkokbank.com/th-TH/-/media/7987988529484de29125743bdd2ff585.ashx) | 2026-07 | Bangkok Bank 报告，经搜索摘要读取 |
| 32 | PromptPay 注册量 2025-03 末约 8,106 万 | 中 | [链接](https://tazapay.com/en-sg/blog/promptpay-for-business-thailand-checkout-success) | 2025 | 二手；Antom 另称“7,000 万+账户”，口径不同 |
| 33 | 2024 年泰国入境跨境 QR 支付约 25 亿泰铢（约 8,000 万美元），已联通国家游客只占入境游客的 29% | 中 | [链接](https://fintechnews.sg/124222/thailand/top-payment-trends-among-tourists-visiting-thailand/) | 2025-12 | 转引 BOT×Visa 白皮书 |
| 34 | 中国线开通至 2025 年底超过 90 万笔、6 亿泰铢；出境方向规划 2026–2027 年 | 中 | [链接](https://www.bot.or.th/th/research-and-publications/articles-and-publications/bot-magazine-issues/phrasiam-69-1/connect-the-border.html) | 2026 | BOT 杂志（泰文），经搜索摘要读取 |
| 35 | 香港线结算行为 HSBC 与 Bangkok Bank；香港用户上限 HK$10,000/日；7 家银行 + 2 家 SVF 参与 | 中 | [链接](https://www.aseanbriefing.com/news/thailand-and-hong-kong-launch-cross-border-qr-payments/) | 2023-12 | 二手报道 |
| 36 | 泰国–马来西亚 PromptPay–DuitNow 跨境 QR 联通（BOT 2021-06-18 新闻稿）；马方 DuitNow 跨境 QR 限 RM3,000/笔，汇率由付款方银行/钱包报价 | 中 | [链接](https://www.bot.or.th/en/news-and-media/news/news-20210618.html) | 2021-06-18 | 日限额各行不同（RM10k–50k） |
| 37 | Krungsri 与 NTT DATA 2020-10 签约，在日本推出 MyPromptQR；此后与 NETSTARS 合作扩展；出境 QR 上限 10 万泰铢/笔、50 万泰铢/日 | 中 | [链接](https://www.krungsri.com/en/newsandactivities/krungsri-banking-news/krungsri-ntt-launch-mypromptqr) | 2020-10 | 限额来自 Krungsri 产品页 |
| 38 | 截至 2026-02，PromptPay 已在日本约 9,000 家门店受理，并于 2026-03 在 SHIBUYA109 上线 | 中 | [链接](https://honichi.com/news/2026/03/16/prompt-pay-shibuya109/) | 2026-03-16 | 页面部分付费墙 |
| 39 | TAT/BOT 2026-06-26 推出“Pay Like a Local”：8 家银行（KTB、BBL、KBank、SCB、BAY、ICBC Thai、BAAC、CIMB Thai），伙伴 NITMX、Alipay、WeChat Pay、UnionPay；面向中、新、马、印尼、越、韩、老、柬、港用户 | 中 | [链接](https://thailand.go.th/event-detail/-cross-border-qr-payment--) | 2026-06-26 | 官方页面经搜索摘要读取 |
| 40 | SCB 与 KB Kookmin、GLN 合作，韩国游客可用 KB Wallet GLN 扫泰国全国 Thai QR 商户码 | 中 | [链接](https://www.scb.co.th/en/about-us/news/dec-2023/qr-code-payment) | 2023-12 | 当前状态未核实 |
| 41 | Alipay+ 在泰国经收单方受理（KTC 网关首批，2C2P 为 Ant 控股）：AlipayHK、Kakao Pay、TnG、Alipay（自 2015 年） | 中 | [链接](https://techwireasia.com/2023/05/chinas-ant-group-expands-alipay-integrations-in-thailand/) | 2023-05 | 不属于国家码互联 |
| 42 | PayPay“海外支付模式”2025-09-30 在韩国上线，2026-04 扩展到台湾；结算汇率外加 3.85%（含税）海外事务手续费；截至 2026-09 未见泰国上线 | 中 | [链接](https://about.paypay.ne.jp/en/pr/20260414/01/) | 2026-04-14 | “泰国未上线”属检索未果的结论 |
| 43 | SEC 把 USDT、USDC 加入核准加密货币清单，2025-03-16 生效，可作交易所基础交易对 | 中 | [链接](https://technode.global/2025/03/10/thai-sec-adds-usdc-and-usdt-to-the-cryptocurrencies-list/) | 2025-03-10 | SEC 新闻 SECID=11613 |
| 44 | TouristDigiPay 限额：Tourist Wallet 充值 ≤50 万泰铢/月/户；向小商户 Personal QR 付款 ≤5 万/月；经 KYM 的 Merchant QR ≤50 万/月；月交易超 5 万泰铢须做区块链取证；禁止金、珠宝、佛牌、古董、赌场、娱乐场所；不可提现，仅关户时退款 | 中 | [链接](https://www.infoquest.co.th/?p=542781) | 2025-08 | 转述 SEC FAQ（2025-08-18 版）；获批运营商名单和实际上线情况未查到 |
| 45 | BOT 行长 Vitai 2026-06-26：BOT 拟推 1:1 泰铢储备稳定币（非 CBDC），初期仅限持牌金融机构用于结算，2026 年底前公开征求意见 | 中 | [链接](https://news.bitcoin.com/bank-of-thailand-backs-11-baht-stablecoin-while-tightening-cross-border-payment-rules/) | 2026-06-29 | 二手报道，非咨询文件原文 |
| 46 | BOT 2026-06：持牌 PSP 只能处理泰铢交易，个人 QR 必须以泰铢结算；2025-02 至 2026-05 约 5,000 个用于人民币 P2P（Alipay/WeChat）的账户被冻结或终止 | 中 | [链接](https://www.nationthailand.com/business/banking-finance/40067830) | 2026-06 | 讲话报道，非正式通知 |
| 47 | BOT 2026-07-11 宣布针对大额现金、黄金和稳定币资金流的管控，2026 Q4 生效 | 中 | [链接](https://www.tilleke.com/insights/bank-of-thailands-cash-gold-and-digital-asset-controls-combating-the-grey-economy) | 2026-07-17 | 稳定币部分的具体义务未查到 |
| 48 | BOT 2021-03-19 稳定币指引：泰铢锚定稳定币按 Payment Systems Act 下的 e-money 监管，发行前须与 BOT 沟通；外币锚定稳定币当时未纳入监管 | 中 | [链接](https://www.tilleke.com/insights/stablecoin-policy-guidelines-issued-by-bank-of-thailand) | 2021-04-05 | 律所摘要 |
| 49 | NRBA 与 NRBS 日终余额合计上限 2 亿泰铢（由 3 亿下调） | 中 | [链接](https://www.bangkokpost.com/business/1711395/bot-tightens-screws-on-non-resident-accounts) | 2019-07 | 下调年份按 Bangkok Post 原文推断为 2019 年；2025 年 No.34 之后是否调整未核实 |
| 50 | BOT Exchange Control Notification No.34 于 2025-09-01 发布、2025-12-01 生效，放宽 NRBA/NRBS 存取规则及对非居民的泰铢借贷 | 中 | [链接](https://www.nishimura.com/en/knowledge/publications/20260216-119076) | 2026-02-16 | 具体条款未读到 |
| 51 | Payment Systems Act B.E.2560 下，e-money、收单、支付便利、e-money 转账等须获财政部依 BOT 建议发放的牌照；无泰籍持股强制要求，但外资控股须另办 Foreign Business Licence | 中 | [链接](https://kpmg.com/th/en/home/insights/2023/03/legal-news-update-issue-23.html) | 2023-03 | 须当地律师确认 |
| 52 | KBank TAGTHAi Easy Pay 为泰国首个游客 e-wallet，2025-03 上线，配合 PAY&TOUR 预付卡使用 | 中 | [链接](https://www.kasikornbank.com/en/News/Pages/TAGTHAi_EASY_PAY.aspx) | 2025-03 |  |
| 53 | LAO QR 使用 tag 38 作商户账户模板，GUID 为 'A005266284662577'；sub 01 为 8 位 IIN（BCEL 27710418、JDB 32170418），sub 02 为业务类型（个人码 001、商户码 002），sub 03 为收款方 token；53='418'，58='LA' | 中 | [链接](https://github.com/dongri/emv-qrcode) | 2018-2026 | 多份独立真实 payload（dongri/emv-qrcode 测试、BCEL One 码、JDB 配置）CRC 校验一致；非官方规范 |
| 54 | 真实 BCEL One 个人转账码 '00020101021138670016A00526628466257701082771041802030010324CCHRJZRJZWUDWNQVHEXUHNOQ53034185802LA63049B5F'，CRC 校验通过 | 中 | [链接](https://github.com/Phoudthavisack/nodejs-hack-wifi) | 2023 | 公开仓库中的真实码 |
| 55 | LAPNet 由 BOL 与 BCEL、LDB、APB、Lao-Viet Bank、JDB、ST Bank、BIC 七家银行合资 | 中 | [链接](https://laos.opendevelopmentmekong.net/news/lao-banks-partner-in-integrated-payment-system/) | 未知 | 另有资料称 UnionPay 参与合资和国家卡系统建设 |
| 56 | MmoneyX 于 2025-07-01 签约，成为首个加入 LAPNet 的 e-wallet，可向成员行转账并扫 Lao QR 付款 | 中 | [链接](https://kpl.gov.la/detail.aspx?id=92282) | 2025-07 | 老挝国家通讯社 |
| 57 | BCEL 与韩国 GLN 2022-12 合作，GLN 钱包可扫 BCEL OnePay 商户码，并在 BCEL ATM 扫码取现 | 中 | [链接](https://www.tourismlaos.org/2022/12/27/laos-south-korea-allow-qr-payments-for-travelers/) | 2022-12-27 | 2026-04 GLN 新闻稿称取现服务已扩展 |
| 58 | 老挝修订外汇管理法自 2022-07 起施行，国内标价、支付、收款须用基普；BOL Decision No.11/BOL（2025-01-03）仅允许少数情形以外币为辅币 | 中 | [链接](https://www.tilleke.com/insights/new-regulations-on-foreign-currency-in-laos/) | 2025 | 律所摘要 |
| 59 | 老挝个人向他人账户转外币，每日超过 1 万美元须提供用途证明，机构超过 10 万美元/日；外币转账费 0.3%，上限 30 美元；BOL Decision No.1161（2024-10-29）在手机银行内设立官方外汇市场 | 中 | [链接](https://www.vdb-loi.com/?p=5219) | 2024-2025 | 律所摘要 |
| 60 | 老挝 Law on Payment System No.32/NA（2017-11-07）于 2023-11-20 修订；支付服务须获 BOL 牌照；Decision 288/BOL（2020-04-12 生效）要求老挝本地持股和老挝籍董事；修订法规定 e-money 只能以基普发行 | 中 | [链接](https://conventuslaw.com/report/new-license-requirement-in-lao-payment-services/) | 2020-06-23 | 本地持股 10%、资本 100–400 亿基普的说法属低置信度 |
| 61 | BOL Notice No.382/CO（2018-10-30）禁止境内金融机构从事加密资产业务（交易、兑换、平台、顾问、信用卡购币） | 中 | [链接](https://data.laos.opendevelopmentmekong.net/laws_record/notice-on-prohibition-of-financial-institutions-within-the-country-conducting-business-related-to-c) | 2018-10-30 | 2019 年重申 |
| 62 | 老挝 2021 年试点允许 6 家公司挖矿和交易，LDX、Bitqik 获交易所牌照；2025-10 政府拟于 2026 Q1 停止向挖矿供电 | 中 | [链接](https://www.tilleke.com/insights/laos-initiates-pilot-project-for-cryptocurrency-mining-and-trading/) | 2021/2025 | 停电是否执行未核实；未见允许稳定币支付的规定 |
| 63 | BOL 与 Soramitsu 于 2023-02 启动 DLak CBDC PoC（Hyperledger Iroha），截至 2025-09 仍为 PoC | 中 | [链接](https://soramitsu.co.jp/iroha-cbdc-2025) | 2025-09 | 厂商资料 |
| 64 | BCEL 2019 年经 Wallyt/SwiftPass 使其商户受理 Alipay 与 WeChat Pay；2024-01 推出游客 App EZyKip | 中 | [链接](https://www.theasianbanker.com/press-releases/bcel-and-wallyt-partner-to-enable-alipay-and-wechat-pay-acceptance-in-laos) | 2019 | Alipay+ 经 LaoQR 互联未查到 |
| 65 | BOT 字段表把 tag 29 下的 AID 'A000000677010114' 定义为 customer-presented mode，sub 05 OTA（N10）在 AID 为 ...0114 时必填；sub 04 Bank account 标为 'Reserved for future use' | 低 | [链接](https://github.com/mamamind47/promptpay-resolution-oracle) | 2026-08 | 衍生文档称依据 BOT 表；thai-qr-payment 等库把 ...0114 解释为 OTA 变体并实现了 sub 04，两种说法冲突 |
| 66 | BOT 跨境 profile：62-08（purpose of transaction）在跨境时为 Currency(3)+Local amount(13)+Country(2)，例如 '3920000003000.00JP'；tag 30 存在时允许 62-07 Terminal ID | 低 | [链接](https://github.com/mamamind47/promptpay-resolution-oracle) | 2026-08 | 衍生文档转述 BOT 表；示例显示该字段用于境外（日本）商户码，属推断 |
| 67 | 一份 LAPNet 对接实现注释：LaoQR tag 38 的 sub 02 中 001=Credit（转账）、002=QR Payment、003=Bill；tag 15 UnionPay 的转发 IIN 默认值为 00520446 | 低 | [链接](https://github.com/ketsanato7/monday-mfi-backend) | 2026 | 单一第三方实现 |
| 68 | LAPNet 成员接口 LMPS（一份实现标注 v8.7.4）为 JSON over HTTPS，请求头 X-LAPNET-Request-Signature、X-Source-Request-Signature、X-LAPNET-Transaction-ID，签名 SHA256withRSA，命令 INQUIRY/TRANSFER/NOTIFY，reference 为 20 位 | 低 | [链接](https://github.com/Long0017/mobile-transfer-api) | 2026 | 两份独立开源实现交叉印证，非官方文档 |
| 69 | LOCA PAY（老挝本地 PF）允许游客绑 Visa/MC/JCB/UPI 卡或 Alipay，扫任意 Lao QR 付款 | 低 | [链接](https://loca.la/locapay/) | 2024 | 约 3% + 5,000 基普的费用来自用户评价 |

<details><summary>待确认问题</summary>

- BOT Thai QR 规范原文（FPG 25620084 附件）中：A000000677010114 到底是 CPM 还是 OTA？tag 29 sub 04 是否仍为保留？tag 31 的 A000000677012004 sub 01 编号冲突如何解释？需从 BOT 或 TBA 取得正式附件。
- AID A000000677012006（跨境 Bill Payment）+ 62-08 的确切用途：是否只用于境外商户展示泰式码（泰国用户出境），入境方向是否从不使用？
- NITMX 跨境平台对新境外交换方（如 INSPAY）的准入条件、技术接口（报文标准、inquiry/confirm/reversal 报文、超时与冲正）、费用，以及是否必须经 BOT 双边或政府间安排。
- 各条泰国跨境线的结算细节：结算币种（本币 LCS 还是 USD）、FX 由哪一方报价、结算频率（T+0/T+1）、预付或抵押要求、结算行完整名单。本轮搜索额度用尽，未查完。
- 入境线是否接受 tag 29 个人 PromptPay 码（个人商户）？能否扫非参与银行的商户码？2026 年 BOT 对个人码商用的整治对跨境受理有何具体限制？
- 跨境 QR 的退款、撤销、拒付机制和对账文件格式（NITMX 与结算行各自的规范）。
- INSPAY 作为非居民跨境支付服务商加入 NRQC 的申请流程与条件；2025-12 生效的 No.34 之后 NRBA 日终上限的现状。
- BOT 2026-07 稳定币资金流管控在 Q4 2026 的具体义务（申报门槛、对银行或交易所的要求），以及 2026 年底泰铢稳定币咨询文件是否允许跨境机构或结算行用于跨境结算。
- TouristDigiPay 实际获批的数字资产运营商与 e-money 合作方名单、上线日期、截至 2026-10 的交易数据；Tourist Wallet 是否支持日本发行卡或日本钱包充值。
- PayPay 海外支付模式何时扩展到泰国、走 Alipay+ 还是直连 NITMX；Ant 与 NITMX 联通二期是否开放给 PayPay 等其他 Alipay+ 钱包。
- Project Nexus 截至 2026-10 的上线状态，泰国是否已经切换或并行使用 Nexus。
- LAPNet LAO QR 官方规范（版本、tag 38 子标签定义、是否有 CPM、动态码有效期）以及 LMPS 接口规范，须向 LAPNet/BOL 索取。
- LAPNet 清结算机制（是否在 BOL RTGS 上做净额结算、场次、7×24 情况）及外国交换机接入条件；UPI–LAPNet 联通的结算币种与结算行。
- 老挝非居民能否持有基普账户、基普离岸限制，以及跨境 QR 中 FX 由哪一方报价；Decision 288/BOL 的本地持股比例与资本要求的现行版本。
- 泰国银行 3 位代码表（002/004/006/014/025 等）与 Biller ID 的分配和查询方式需官方确认；Biller ID 前 13 位是否总是收单行税号。

</details>

## 新加坡 / 马来西亚

事实 70 条（高 18 / 中 46 / 低 6）。

| # | 事实 | 置信度 | 来源 | 日期 | 备注 |
|---|---|---|---|---|---|
| 1 | SGQR 由 MAS 与 IMDA 共同所有，2018-09-17 正式上线，首批 27 个支付方案（含 PayNow、NETS、GrabPay、Liquid Pay、Singtel DASH） | 高 | [链接](https://www.mas.gov.sg/news/media-releases/2018/singapore-introduces-worlds-first-unified-payment-qr-code) | 2018-09-17 |  |
| 2 | PayNow Gen2 一期报告（MAS 与 ABS，2026-06-25）：2025-12 约 1,100 万个 proxy 注册、约 35 万家企业；2025 年个人支付约 S$1,540 亿、企业支付约 S$1,470 亿、跨境约 S$3.71 亿（UPI、DuitNow、PromptPay 三条走廊） | 高 | [链接](https://www.mas.gov.sg/news/media-releases/2026/mas-and-abs-chart-instant-payments-enhancements-with-paynow-generation-2-study) | 2026-06-25 |  |
| 3 | MAS 与 ABS 计划做 PayNow 与 NETS QR 互操作的 POC，目标 2026 年底前试点；实施路线图 2026 年底发布 | 高 | [链接](https://www.mas.gov.sg/-/media/PNG2-Phase-1-Collaterals_PDDC/PayNow-Gen2-Phase-1-Report_25-June-2026.pdf) | 2026-06-25 |  |
| 4 | FAST 2024 全年 5.0 亿笔、约 S$6,617 亿（2023 年约 3.8 亿笔） | 高 | [链接](https://www.mas.gov.sg/-/media/mas-media-library/statistics/payment-statistics/semi-annual-retail-payment-statistics/retail-payment-statistics-h2-2024-1.pdf) | 2025 |  |
| 5 | 自 2021-02 起，持 MPI 牌照的非银金融机构可通过 Direct FAST Working Group 开发的 API 支付网关直接接入 FAST 和 PayNow | 高 | [链接](https://www.mas.gov.sg/news/media-releases/2020/non-bank-financial-institutions-to-have-access-to-fast-and-paynow) | 2020-11-30 |  |
| 6 | 马新跨境 QR（DuitNow QR ↔ NETS QR）2023-03-31 上线，覆盖线下扫码和跨境电商；新方 DBS、OCBC、UOB，马方 AmBank、Boost、CIMB、HLB、Maybank、Public Bank、Razer Merchant Services、TNG Digital、UOB Malaysia | 高 | [链接](https://www.bnm.gov.my/-/qrcode-connectivity-my-sg) | 2023-03-31 |  |
| 7 | PayNow–PromptPay 联通于 2021-04-29 上线，每日上限 S$1,000 / THB25,000 | 高 | [链接](https://www.bot.or.th/en/news-and-media/news/news-20210429.html) | 2021-04-29 |  |
| 8 | 印尼央行 QRIS 跨境页面列新加坡对应码为 NETS QR、马来西亚为 DuitNow QR、日本为 JPQR Global；印尼商户收入境付款的 MDR 与境内相同 | 高 | [链接](https://www.bi.go.id/en/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/qris/qris-antarnegara/default.aspx) | 2026 |  |
| 9 | MAS 2026-09-01 就修改 PS Act、落地稳定币框架征求意见（2026-10-16 截止）：新设稳定币发行牌照，只有持牌者可用 'MAS-regulated stablecoin' 标签；拟认可外国监管等效的稳定币；可指定系统性稳定币；禁止付息 | 高 | [链接](https://www.mas.gov.sg/news/media-releases/2026/mas-consults-on-legislative-amendments-to-implement-stablecoin-regulatory-framework) | 2026-09-01 | 细节（外国认可需双边安排、银行须设独立法人、追踪冻结销毁能力）来自 TRM Labs / Ledger Insights / Allen & Gledhill，属 medium |
| 10 | MAS 2025-10-16 启动 BLOOM，用代币化银行负债与受监管稳定币做结算；参与者含 Circle、DBS、OCBC、Partior、Stripe、UOB、Ant International、StraitsX、Coinbase | 高 | [链接](https://www.mas.gov.sg/news/media-releases/2025/mas-launches-bloom-initiative-to-extend-settlement-capabilities) | 2025-10-16 |  |
| 11 | MAS Notice 757：银行向非居民金融机构提供超过 S$500 万的新元授信时，若款项汇出境外须换汇；有理由怀疑用于投机新元汇率的一律禁止 | 高 | [链接](https://www.mas.gov.sg/regulation/notices/notice-757) | 2021-07-01（最近修订） |  |
| 12 | DuitNow QR 依 BNM ICTF 由 PayNet 实施，2019-07-17 软启动（Public Bank 首家） | 高 | [链接](https://www.paynet.my/press-release/2019/PUBLIC-BANK-FIRST-TO-SOFT-LAUNCH-MALAYSIA-NATIONAL-QR-STANDARD-DUITNOW-QR.pdf) | 2019-07 |  |
| 13 | PayNet 2025 年共处理 84.4 亿笔数字支付（银行渠道 +30.69%，非银 +71.7%）；新增 681,250 个 DuitNow QR 受理点，累计 >300 万；跨境 QR 2,970 万笔（2.5 倍） | 高 | [链接](https://paynet.my/about-us/media-centre/press-release/8-44-billion-transactions-processed-in-2025-as-digital-payments-become-malaysians-preferred-way-to-pay.html) | 2026-04-23 |  |
| 14 | 马泰跨境 QR 一期 2021-06-18 上线（泰国用户扫 DuitNow QR）；PayNet 与 NITMX 为运营方，CIMB Group 与 CIMB Thai 为跨境结算行 | 高 | [链接](https://www.bot.or.th/en/news-and-media/news/news-20210618.html) | 2021-06-18 |  |
| 15 | 马柬 QR 联通：一期 2024-09（柬→马，Bakong 扫 DuitNow），二期 2025-04-08（马来西亚人扫 KHQR） | 高 | [链接](https://www.bis.org/review/r250409e.htm) | 2025-04-08 |  |
| 16 | PayNet 与 NPCI International 2026-02 签约：一期印度游客用 UPI App 扫 DuitNow，二期马来西亚人在印度扫 UPI QR | 高 | [链接](https://paynet.my/about-us/media-centre/press-release/payments-network-malaysia-and-india-npci-international-sign-agreement-to-enable-cross-border-qr-payments.html) | 2026-02 |  |
| 17 | BNM：林吉特为非国际化货币，任何形式的离岸交易（NDF、境外交易所衍生品）均违反马来西亚政策 | 高 | [链接](https://www.bnm.gov.my/-/bnm-stance-on-ringgit-currency-derivatives-products-in-offshore-market) | 2017 |  |
| 18 | BNM/SC 联合回应：数字资产不是 BNM 监管的支付工具，也不是可依法用于交换商品和服务的货币（不是法定货币） | 高 | [链接](https://www.bnm.gov.my/-/bnm-and-sc-s-joint-response-on-policy-confusion-over-cryptocurrencies-) | 2020-12-16 |  |
| 19 | Payments Council 于 2017 年 11 月背书 SGQR 规范，规范基于 EMVCo QR 规格并做新加坡定制 | 中 | [链接](https://www.mas.gov.sg/news/media-releases/2017/payments-council-endorses-singapore-quick-response-code-specifications-for-electronic-payments) | 2017-11-20 | 日期来自 mondovisione 转载 URL（20171120），MAS 原文未打开 |
| 20 | SGQR 码中 PayNow 模板 GUID 为 'SG.PAYNOW'；子标签 01=Proxy Type（0 手机，2 UEN），02=Proxy Value，03=金额可编辑（0/1），04=过期日（YYYYMMDD；部分实现为 YYYYMMDDHHMMSS） | 中 | [链接](https://github.com/lee-ratinan/emv-qr) | 2021 | 开源解析器，非官方规范；另见 https://github.com/poonchuanan/Python-PayNow-QR-Code-Generator 与 https://pypi.org/project/nlannuzel-sgqr/ |
| 21 | NETS 模板 GUID 为 'SG.COM.NETS'；子标签 01=QR Metadata（23 位数字），02=Merchant ID，03=Terminal ID，04=Transaction Amount Modifier，99=Signature | 中 | [链接](https://github.com/lee-ratinan/emv-qr/blob/master/src/EmvMerchant.php) | 2021 | 开源实现，与 pyraxo/sgqr-parser 一致；官方 NETS 规范未查到 |
| 22 | SGQR 的 tag 51 固定 GUID 'SG.SGQR'，子标签：01 SGQR ID Number、02 Version、03 邮编、04 楼层、05 单元、06 Misc、07 新版本日期；tag 26–50 为各方案模板，位置不固定 | 中 | [链接](https://github.com/pyraxo/sgqr-parser) | 2024 | 多份开源实现一致（lee-ratinan、sausheong/SGQR、smnd/utilities）；真实标签 payload 的 CRC 已本地校验 |
| 23 | 真实 SGQR 标签样例：00020101021126430009SG.PAYNOW010120210T04SS0129D030110502QS51810007SG.SGQR011221073031741D020701.00010306600316040201050327906040000070820210730 5204000053037025802SG5925LOVING HEART MULTI-SERVIC6009Singapore6304A177（CRC A177 校验通过） | 中 | [链接](https://github.com/poonchuanan/Python-PayNow-QR-Code-Generator) | 未知 | CRC-16/CCITT-FALSE 已本地重算；中间空格为排版 |
| 24 | SGQR 中已见的其他方案 GUID：COM.GRAB（GrabPay）、SG.AIRPAY（ShopeePay）、COM.ALIPAY、COM.MYFAVE、SG.COM.DASH.WWW（Singtel Dash） | 中 | [链接](https://github.com/pyraxo/sgqr-parser/blob/main/src/standards/sgqr.ts) | 2024 | 开源实现 |
| 25 | 《Guidelines on Participation in the SGQR Scheme》2023-12-01 生效，适用于通过静态 QR 在商户实体经营场所提供收单服务的 MPI/豁免支付机构（Relevant Merchant Acquirers） | 中 | [链接](https://www.rajahtannasia.com/viewpoints/major-payment-institutions-exempt-payment-services-providers-to-note-sgqr-guidelines-taking-effect-on-1-dec-2023/) | 2023 |  |
| 26 | SGQR+ POC 于 2023-11-01 至 11-30 进行：Liquid 为交换运营方，NETS 为主收单方；约 23 个方案、1,000+ 受理点；另一来源称 1,416 个受理点、65,204 笔、S$129 万 | 中 | [链接](https://fintechnews.sg/79529/payments/mas-takes-step-towards-more-interoperable-qr-payments-with-sgqr-pilot/) | 2023-11 |  |
| 27 | NETS 2024-11-07 宣布 SGQR+ 全岛推广（主收单方路线）：24,000 个受理点，扩至熟食中心后 >35,000；新增发卡方 dtcpay、MariBank、Maybank，发卡方/方案共 18 个；技术上线 2024 Q4，dtcpay/MariBank 2025 Q2 | 中 | [链接](https://www.nets.com.sg/newsroom/nets-announces-sgqr-islandwide-rollout-following-the-success-of-sgqr-proof-of-concept) | 2024-11-07 | 2025 年以后的实际完成情况未核实 |
| 28 | dtcpay（MAS 持牌 DPT 大型支付机构）2025-07 在 SGQR/NETS 受理点推出扫码付，用户可把 USDT/USDC 即时兑换为法币付款；自称 >40,000 个 NETS 受理点 | 中 | [链接](https://dtcpay.com/company/newsroom/dtcpay-rolls-out-qr-payments-and-celebrates-sg60-with-exclusive-rewards) | 2025-07-25 | 公司自述 |
| 29 | FAST/PayNow 单笔上限常见为 S$200,000；部分银行对与非银电子钱包之间的转账设 S$5,000 上限 | 中 | [链接](https://www.citibank.com.sg/personal-banking/online-services/online-payments) | 未知 | 银行级上限，不是系统级规则 |
| 30 | MEPS+ 分两阶段迁移 ISO 20022（对齐 CBPR+/HVPS+），后续系统为 SCRIPS；FAST 具备 ISO 20022 报文能力 | 中 | [链接](https://www.swift.com/news-events/news/iso-20022-bytes-voice-singapore-community-getting-ready-testing-and-more) | 未知 |  |
| 31 | PayNow–DuitNow 实时 P2P 联通于 2023-11-17 上线，每日上限 RM3,000 / S$1,000 | 中 | [链接](https://www.mas.gov.sg/news/media-releases/2023/launch-of-cross-border-real-time-payment-systems-connectivity-between-singapore-and-malaysia) | 2023-11-17 |  |
| 32 | NETS 与 National ITMX 2022-08 扩展跨境 QR：新加坡用户可用 DBS PayLah!/OCBC 在泰国 800 万+ PromptPay QR 受理点付款，泰国游客可扫 NETS QR | 中 | [链接](https://fintechnews.sg/63141/thailand/nets-and-thailands-national-itmx-expand-cross-border-qr-payment-ties/) | 2022-08 |  |
| 33 | Alipay+ 2023-04 经 NETS 接入 SGQR，覆盖约 11,000 个熟食摊；首批 6 个钱包（Alipay、AlipayHK、TNG、GCash、TrueMoney、Kakao Pay）；游客直接扫 SGQR 标签 | 中 | [链接](https://fintechnews.sg/71856/payments/alipay-integrates-with-sgqr-to-enable-qr-payments-at-11000-hawkers/) | 2023-04 |  |
| 34 | StraitsX × Ant International（Alipay+）× Grab（2024-11-05）：9 国游客可在新加坡部分 GrabPay 商户用本国 App 付款，后台以 XSGD + Purpose Bound Money 在 Avalanche 上清结算，商户实时收 SGD | 中 | [链接](https://www.straitsx.com/case-study/alipay-grab) | 2024-11-05 | 官方案例页；另见 Ledger Insights |
| 35 | OKX SG 2025-09 在新加坡 GrabPay 商户推出 USDC/USDT 支付：先兑换为 XSGD，商户收 SGD；用户用 OKX SG App 扫 GrabPay SGQR | 中 | [链接](https://www.nst.com.my/amp/business/corporate/2025/09/1284336/okx-singapore-launches-stablecoin-payments-local-grabpay) | 2025-09 |  |
| 36 | MAS SCS 框架（2023-08）：锚定 SGD 或 G10 货币；流通量超过 S$500 万的发行人纳入；最低资本取 S$100 万与年度运营开支 50% 的较高者；直接赎回须在 5 个工作日内按面值兑付 | 中 | [链接](https://cm.twobirds.com/en/capabilities/practices/digital-rights-and-assets/apac-dra/apac-dsd/crypto-assets/singapore/stablecoin-regulatory-framework) | 2023-2026 | 律所摘要 |
| 37 | StraitsX 获 MAS 原则性批准（MPI，DPT 服务），覆盖 XSGD 与 XUSD 的发行，称实质符合即将实施的 SCS 框架 | 中 | [链接](https://www.straitsx.com/blog-post/straitsx-receives-in-principle-approval-from-mas-to-issue-scs) | 未知（2024–2025） |  |
| 38 | 新加坡 DTSP 制度（FSMA 第 9 部分）2025-06-30 生效，只服务境外客户的数字代币服务商须持牌，无过渡期；已持 PS Act 牌照/豁免者不受影响 | 中 | [链接](https://cms.law/en/sgp/legal-updates/singapore-s-june-30-hard-deadline-for-crypto-firms-serving-overseas-customers) | 2025-06 |  |
| 39 | UnionPay International 与 NETS 2025-11-28 正式合作，OCBC 用户可在中国微信支付商户扫码（计划 2026 Q1） | 中 | [链接](https://www.ocbc.com/group/media/release/2025/ocbc-app-first-can-scan-and-pay-all-merchants-qr-codes-in-china.page) | 2025-11 |  |
| 40 | Nexus Global Payments 为新加坡注册的非营利担保有限公司，创始成员为 RBI、BNM、BSP、MAS、BOT；2026-02 选定 PayNet 与 NETS 合资公司为技术运营商，目标 2027 年上线 | 中 | [链接](https://www.nasdaq.com/press-release/nexus-global-payments-appoints-technical-operator-2026-02-09) | 2026-02-09 |  |
| 41 | PayNet DuitNow QR MPM 规范 V1.5：PFI 固定 '02'，POI 11/12；tag 26 子标签 00=AID 'A0000006150001'（14 位）、01=Acquirer ID（≤6）、02=QR ID（≤28）、03=Merchant Descriptor（≤20）、04=Mobile（≤15）；tag 27 保留 | 中 | [链接](https://github.com/deadboy18/malaysia-pay-kit/blob/main/docs/paynet-developer-docs.md) | 2026-05-04（镜像抓取） | 原始页 https://docs.developer.paynet.my/docs/duitNow-QR/integration/QR-generation-specification/merchant-presented-mode/qr-data-object 无法直接访问（DNS 失败）；官方示例 CRC 已本地校验通过 |
| 42 | DuitNow QR 其他字段：52 MCC（0000=P2P，6010=POS 取现）、53=458、55/56/57 小费与便利费、59≤25、60≤15（不适用时填 MY）、61 为 5 位邮编、64 替代语言模板、82 为 SHA-256 数据完整性字段；62 子标签 01–08、09、10 税号、11 Merchant Channel（3 位）、90 RRN Ref-1（JomPAY 必填）、91 Ref-2、92 地理坐标 | 中 | [链接](https://github.com/deadboy18/malaysia-pay-kit/blob/main/docs/paynet-developer-docs.md) | 2026-05-04 |  |
| 43 | PayNet 官方示例（静态零售）：00020201021126410014A000000615000101065016640209123456789520499995303458540510.005802MY5909QRCSDNBHD6005BANGI6304343F（CRC 校验通过） | 中 | [链接](https://github.com/deadboy18/malaysia-pay-kit/blob/main/docs/paynet-developer-docs.md) | 2026-05-04 |  |
| 44 | DuitNow 收单机构 ID 示例：Maybank 588734、CIMB 501854、Public Bank 564162、RHB 564160、HLB 588830、AmBank 564169、Affin 501664、TNG Digital 890053、GrabPay 890046、ShopeePay 890004、MUFG (M) 629196、SMBC (M) 629238、Mizuho (M) 629220、Stripe Payments Singapore 890137、JomPAY 898989 | 中 | [链接](https://github.com/deadboy18/malaysia-pay-kit/blob/main/docs/paynet-developer-docs.md) | 2026-05-04 |  |
| 45 | DuitNow QR 二维码里没有跨境专用字段；跨境体现在交易码 031（cross-border POS）与 521（cross-border account enquiry），以及针对新加坡、印尼、泰国、中国的跨境响应码；CPM 交易码为 240/880/250；D313 = QR Expired | 中 | [链接](https://github.com/deadboy18/malaysia-pay-kit/blob/main/docs/paynet-developer-docs.md) | 2026-05-04 |  |
| 46 | 据 BNM 数据，DuitNow QR 交易 2025 年约 30 亿笔（2024 年 15 亿） | 中 | [链接](https://apac.entrepreneur.com/business-news/wise-plugs-into-malaysias-paynet-as-duitnow-qr-payments-hit-3-bn) | 2026-07 |  |
| 47 | RPP 基于 ACI UP Real-Time Payments，PayNet 从一开始就用 ISO 20022；首个服务为 DuitNow | 中 | [链接](https://investor.aciworldwide.com/node/20401) | 2018-12 |  |
| 48 | PayNet 由 MyClear 与 MEPS 合并而成；BNM 持股 35.5%，另有 11 家金融机构股东；对银行与合格非银机构开放 | 中 | [链接](https://www.bis.org/review/r170613d.htm) | 2017-06-13 |  |
| 49 | 马印 QR 联通：试点 2022-01-27，商用 2023-05-08；汇率由 LCS 框架下的 ACCD 银行提供 | 中 | [链接](https://selangorjournal.my/2023/05/malaysia-indonesia-launch-cross-border-qr-payment-linkage/) | 2023-05-08 | ACCD 汇率来自二手来源 |
| 50 | 银联 QR 用户自 2023-09 起可在 DuitNow QR 受理点付款，反向（DuitNow 用户在银联受理点付款）稍后推出 | 中 | [链接](https://m.unionpayintl.com/wap/en/mediaCenter/newsCenter/marketUpdate/3015312.shtml) | 2023 |  |
| 51 | PayNet × Ant Group：自 2023-10-31 起 Alipay+ 钱包（Alipay、AlipayHK、HelloMoney、Hipay、MPay、Naver Pay、Toss Pay、TrueMoney）可扫 DuitNow QR，上线时 180 万+ 受理点；2025-08-21 深化合作，推进马来西亚人出境使用 | 中 | [链接](https://paynet.my/press-release/2023/Travellers-from-7-Key-Asian-Travel-Corridors-Can-Now-Enjoy-Seamless-Digital-Payments-in-Malaysia-More-Travel-Corridors-in-the-Pipeline.pdf) | 2023-10 |  |
| 52 | Alipay+ 占 DuitNow 入境跨境 QR 支付的 80% 以上 | 中 | [链接](https://soyacincau.com/2025/03/25/paynet-80pct-duitnow-qr-inbound-payments-alipay-plus-ewallet/) | 2025-03-25 |  |
| 53 | PayNet FAQ：商户开通 DuitNow QR 受理后自动受理跨境 QR，按 MYR 入账；入境来源国为印尼、新加坡、泰国、中国、柬埔寨、韩国 | 中 | [链接](https://knowledgebase.paynet.my/hc/en-us/articles/49748850759577-Frequently-Asked-Questions-FAQs) | 2026 |  |
| 54 | 马来西亚用户出境 DuitNow 跨境 QR 限额：单笔 RM3,000；每日 RM10,000（Public Bank）至 RM50,000（RHB） | 中 | [链接](https://www.rhbgroup.com/-/media/Files/others/highlights/announcements/H20260224-1.pdf) | 2026-02-24 |  |
| 55 | Wise 2026-07-30 宣布直连 PayNet（Wise 全球第 9 个直连本地支付系统），支持扫 DuitNow QR 与 DuitNow 转账 | 中 | [链接](https://newsroom.wise.com/en-CAS/268696-wise-connects-directly-to-paynet-malaysia-s-national-payments-network/) | 2026-07-30 |  |
| 56 | 日本财务省与 BNM 2026-09-15 签署本币结算合作备忘录；日马第三份双边互换（US$60 亿）2026-09-18 生效 | 中 | [链接](https://www.businesstoday.com.my/2026/09/15/malaysia-japan-deepen-financial-ties-with-local-currency-push-us6-billion-swap-deal/) | 2026-09-15 |  |
| 57 | BNM 数字资产创新中心 2026-02-11 选定 3 个批发试点：渣打（马）+ Capital A 的林吉特稳定币 B2B 结算，Maybank 与 CIMB 的代币化存款；BNM 计划 2026 年底前对林吉特稳定币/代币化存款给出政策澄清 | 中 | [链接](https://www.theasianbanker.com/press-releases/bank-negara-malaysia-onboards-ringgit-stablecoin-and-tokenised-deposit-pilots-under-digital-asset-innovation-hub) | 2026-02-11 |  |
| 58 | 私营林吉特稳定币 RMJDT 由 Bullish Aim（柔佛摄政王所有）2025-12-09 在 Zetrix 链上发行，自称在受监管沙盒框架下 | 中 | [链接](https://www.theasianbanker.com/press-releases/malaysia-s-regent-of-johor-launches-ringgit-backed-stablecoin-rmjdt-on-zetrix) | 2025-12-09 | 监管方身份未获官方确认 |
| 59 | BNM《Merchant Acquiring Services》政策文件 2021-09-15 发布，适用于按 FSA 2013 第 17(1)、18 条注册的收单机构 | 中 | [链接](https://www.bnm.gov.my/-/pd-merchant-acquiring-services) | 2021-09-15 |  |
| 60 | PayNet 数字注册商户的合作方须为马来西亚注册的 BNM 持牌第三方收单方或获批电子货币发行人，且有 ≥3 年经验 | 中 | [链接](https://knowledgebase.paynet.my/hc/en-us/articles/51398791153817-Which-business-types-are-eligible-for-digital-registration-with-PayNet) | 2026 |  |
| 61 | PayPay 海外支付模式 2025-09-30 起经 Alipay+ 在韩国上线（需 eKYC）；海外手续费 3.85% | 中 | [链接](https://about.paypay.ne.jp/en/pr/20250916/01/) | 2025-09-16 | 3.85% 来自媒体报道 |
| 62 | PayPay 2026-04-27 起经 HIVEX 在台湾提供海外支付模式（40 万+ 受理点）；未查到新加坡、马来西亚上线 | 中 | [链接](https://paypay.ne.jp/notice/20260427/f-overseaspayment/) | 2026-04-27 |  |
| 63 | METI 2022-12 与印尼央行、2023-12 与柬埔寨央行签署 JPQR 互操作合作备忘录 | 中 | [链接](https://www.ide.go.jp/library/Japanese/Publish/Reports/AjikenPolicyBrief/pdf/242.pdf) | 2025-04 |  |
| 64 | FAST 由 BCS（Banking Computer Services）运营；EY 报告称 BCS 为新加坡主要支付网络运营方 | 中 | [链接](https://assets.ey.com/content/dam/ey-sites/ey-com/en_gl/topics/financial-services-asia-pacific/ey-interoperable-qr-payments-in-singapore.pdf) | 2023 |  |
| 65 | QRIS–NETS 联通上线日期 2023-11-17 | 低 | [链接](https://www.transfi.com/blog/qris-cross-border-explained-how-indonesians-can-pay-with-qris-in-singapore-malaysia-and-thailand) | 2026 | 唯一来源为商业博客，未在线核实官方日期 |
| 66 | UOB 自 2026 年起对企业 PayNow 收款按每笔 S$0.20 收费；用个人手机号收款的熟食摊不受影响 | 低 | [链接](https://www.hack.gov.sg/2025/singpay/) | 2025 | 二手引述 UOB 官网，未打开原文 |
| 67 | DuitNow 动态码中的账户号为临时值，有效期约 60 秒 | 低 | [链接](https://github.com/deadboy18/malaysia-pay-kit/blob/main/docs/duitnow-qr-research.md) | 2026-05-04 | 社区逆向结论，未核实 |
| 68 | DuitNow QR 与日本 JPQR 预计 2025 财年实现互通 | 低 | [链接](https://www.imoney.my/articles/duitnow-payment-japan-cashless-travel) | 2024-03 | 只是计划报道，未核实是否上线；未查到任何上线证据 |
| 69 | 新加坡没有一般性的金融数据本地化要求（适用 PDPA 与 MAS TRM 指引） | 低 | [链接](https://www.mas.gov.sg/regulation/payments/payment-systems) |  | 未核实，凭记忆 |
| 70 | Ant International 拟把 Circle USDC 接入其区块链，用于资金管理与结算（Bloomberg 报道，未经双方证实） | 低 | [链接](https://www.theblock.co/post/361951/jack-ma-ant-international-circle-usdc-stablecoin) | 2025-07-10 | 媒体报道，双方未证实 |

<details><summary>待确认问题</summary>

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

</details>

## 印度尼西亚

事实 45 条（高 0 / 中 43 / 低 2）。

| # | 事实 | 置信度 | 来源 | 日期 | 备注 |
|---|---|---|---|---|---|
| 1 | QRIS 跨境（出境）在日本上线：印尼用户可用本国 App 扫 JPQR Global 付款；BI 新闻稿日期 2025-08-17；首批 35 家商户、14 家银行加若干钱包；合作方为 BI、ASPI、METI、PJA 与 JPQR Global 运营方 Netstars | 中 | [链接](https://www.bi.go.id/en/publikasi/ruang-media/news-release/Pages/sp_2719325.aspx) | 2025-08-17 | bi.go.id 无法 WebFetch，内容来自搜索摘要，并与 antaranews、investortrust 交叉一致 |
| 2 | BI 2025-08-25 在大阪世博印尼馆举行 QRIS–JPQR 启动仪式；Netstars 称 JPQR Global 自 2025-08-17 起支持 QRIS | 中 | [链接](https://paymentnavi.com/?p=164513) | 2025-08 |  |
| 3 | GoPay 2025-09 起支持在日本扫 JPQR 付款 | 中 | [链接](https://www.cnnindonesia.com/teknologi/20250912141119-206-1272982/belanja-di-jepang-kini-bisa-pakai-qris-gopay-china-menyusul/amp) | 2025-09-12 |  |
| 4 | 日本游客在印尼扫 QRIS（Japan inbound）：BI 副行长 Filianingsih 2026-04 称已取得日本 FSA 许可，'很快会有 Indonesia inbound'；截至 2026-10 未查到正式上线公告 | 中 | [链接](https://www.metrotvnews.com/read/N6GCVl8e-turis-jepang-bisa-iscani-qr-saat-belanja-di-ri-qris-segera-berlaku) | 2026-04（据搜索摘要） | 上线状态未核实 |
| 5 | UC Card（ユーシーカード）为日本商户提供 QRIS 受理导入支持 | 中 | [链接](https://paymentnavi.com/?p=164557) | 2025 |  |
| 6 | 印尼–韩国跨境 QR 支付 2026-04-01 上线（BI 与 Bank of Korea、ASPI 与 KFTC），本币直接结算，初期为印尼人在韩国使用（出境） | 中 | [链接](https://www.bi.go.id/en/iru/highlight-news/Pages/Indonesia-and-South-Korea-Officially-Connect-with-QR-Payments,-Enabling-More-Convenient,-Affordable-and-Faster-Cross-Border.aspx) | 2026-04 |  |
| 7 | 2025 年 QRIS 跨境入境 5,892,621 笔，出境 1,681,112 笔 | 中 | [链接](https://www.crowdfundinsider.com/2026/04/271195-indonesia-south-korea-launch-cross-border-qr-payments-in-local-currencies/) | 2026-04 |  |
| 8 | 截至 2026-08，QRIS 跨境入境累计 1,780 万笔、Rp6.2 万亿，来源国为新加坡、泰国、马来西亚、日本、韩国、中国 | 中 | [链接](https://www.idnfinancials.com/news/69514/qris-transactions-by-tourists-reach-idr-6-2-trillion-through-august) | 2026-09 |  |
| 9 | 中国线：2026-04-30 软启动，经 Ant International 的 Alipay+ 与 UnionPay International 实现；支付宝和云闪付用户可在 4,000 万以上 QRIS 商户付款，商户无需新硬件或集成；印尼用户可扫中国 8,000 万以上支付宝/银联码；在 BI–PBoC 指导下 | 中 | [链接](https://ibsintelligence.com/ibsi-news/indonesia-and-china-launch-cross-border-qr-payments-link/) | 2026-05 |  |
| 10 | 中国线印方有 24 家 PJP 参与（16 家银行、8 家非银行）；沙盒期（2025-08-17 起）入境 164 万笔、Rp5,560 亿；初期限支付宝，微信支付后续加入 | 中 | [链接](https://investortrust.id/macro/101858/bi-luncurkan-qris-antarnegara-china-dapat-digunakan-mulai-30-april-2026) | 2026-04 |  |
| 11 | Ant International 2026-05-07 发布新闻稿，宣布印尼–中国跨境支付互联经 Alipay+ 连接 | 中 | [链接](https://www.eagletribune.com/region/indonesia-china-launch-cross-border-payments-connectivity-connecting-millions-of-merchants-via-ant-international-s/article_7025cbdb-284e-5b77-960b-a9847208a0bd.html) | 2026-05-07 |  |
| 12 | ASPI 目标：香港、东帝汶、沙特的跨境 QRIS 于 2026 年底试点、2027 年全面运营；印度 QRIS–UPI 原定 2026 年底完成，2026-10 报道称仍受阻 | 中 | [链接](https://finansial.bisnis.com/read/20261014/11/2012511/aspi-targetkan-qris-tembus-arab-saudi-hingga-hong-kong-pada-2027) | 2026-10-14 |  |
| 13 | QRIS–新加坡（NETS QR）联通 2023-11-17 上线 | 中 | [链接](https://www.transfi.com/id/blog/qris-cross-border-explained-how-indonesians-can-pay-with-qris-in-singapore-malaysia-and-thailand) | 未知 | 二手博客 |
| 14 | 与泰国合作自 2022-08 起（商业化，此前 2021-08 有 BOT–BI 试点）；与马来西亚自 2023-05 起 | 中 | [链接](https://keuangan.kontan.co.id/news/transaksi-qris-antar-negara-semakin-diminati) | 2025-2026 |  |
| 15 | QRIS 跨境中商户按账单金额收 IDR；BI 称跨境 QRIS 目前用于泰国、马来西亚、新加坡、日本、韩国、中国 | 中 | [链接](https://www.bi.go.id/en/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/QRIS/QRIS-Antarnegara/default.aspx) | 2026 | 搜索摘要，页面 DNS 失败 |
| 16 | QRIS 跨境在 LCS 框架下由 ACCD 银行提供本币直接汇率 | 中 | [链接](https://asianews.network/indonesia-singapore-debut-linked-cross-border-qr-payment-system) | 2023 |  |
| 17 | PayPay 海外支付模式 2025-09 在韩国上线，限 Alipay+ 标识商户，须 eKYC，海外手续费 3.85%；印尼不在可用国之列（截至检索时） | 中 | [链接](https://www.alipayplus.com/news/detail/paypay-accepted-in-south-korea) | 2025-09 |  |
| 18 | QRIS MDR：UMI 单笔 ≤ Rp500,000 为 0%，> Rp500,000 为 0.3%；UKE、UME、UBE 为 0.7%；教育 0.6%；SPBU 0.4%；G2P/P2G 0% | 中 | [链接](https://www.bi.go.id/id/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/QRIS/default.aspx) | 2025-2026 | 与 Bank Mandiri、Sampoerna 页面交叉一致 |
| 19 | UMI 的 0.3% MDR 自 2023-07-01 起恢复收取（BI 函 25/316/DKSP/Srt/B，2023-06-26） | 中 | [链接](https://bankmandiri.co.id/en/qris) | 2023 |  |
| 20 | Merchant criteria：UMI 为资产 ≤ Rp50 juta、营业额 ≤ Rp300 juta；UKE 为资产 Rp50–500 juta、营业额 Rp300 juta–2.5 miliar；UME、UBE 阈值和 URE 定义未查到 | 中 | [链接](https://www.banksampoerna.com/uploads/img/upload/files/SMM-id.pdf) | 未知 |  |
| 21 | QRIS 单笔交易上限提高到 Rp10 juta（2022-03） | 中 | [链接](https://finance.detik.com/moneter/d-5936787/limit-bayar-pakai-qris-naik-jadi-rp-10-juta) | 2022-02/03 | 2026 年是否再调整未查到 |
| 22 | QRIS payload 结构：tag 26 子标签 00=GUID（如 COM.MEMBASUH.WWW）、01=MPAN（如 936000091100004515）、02=商户或终端 ID、03=criteria；tag 51 子标签 00=ID.CO.QRIS.WWW、02=NMID（如 ID2020034073193）、03=criteria；62-07 Terminal Label=A01；完整样例的 CRC F98B 已独立校验通过 | 中 | [链接](https://pkg.go.dev/github.com/fyvri/go-qris) | 2026（抓取） | 开源实现样例，非官方 |
| 23 | npm qris 库样例：tag 26 的 GUID 为 COM.NOBUBANK.WWW，MPAN 936005030000080819（NNS 93600503，通过 Luhn 校验），Merchant ID 08040000679159，criteria UME；tag 51 的 NMID 为 ID2021084066657；62 中有 01 Bill No.、05/06 Reference/Customer Label、07 Terminal Label | 中 | [链接](https://registry.npmjs.org/qris) | npm qris@0.0.1 | 开源实现 |
| 24 | 开源库把静态 QRIS 转成动态 QRIS 的做法：把 010211 替换为 010212，在 5802ID 之前插入 tag 54 金额，可选 55=02+56（固定费）或 55=03+57（百分比），再重算 CRC16 | 中 | [链接](https://registry.npmjs.org/@agungjsp/qris-dinamis) | npm 1.0.7 |  |
| 25 | QRIS Tap（NFC）2025-03-14 正式上线，交易约 0.3 秒，首批用于 MRT、TransJakarta、Damri、Trans Sarbagita；BI 页面提到 QRIS CPM（用户出示码） | 中 | [链接](https://www.cnbcindonesia.com/tech/20250314131152-37-618650/qris-tap-resmi-berlaku-mulai-hari-ini-begini-kecanggihannya) | 2025-03-14 |  |
| 26 | 2026 年 1 月 QRIS：商户 4,306 万（+17.76%），用户 5,998 万，交易 18.3 亿笔、Rp164.48 万亿；2025 全年 155.1 亿笔（+148.54%） | 中 | [链接](https://keuangan.kontan.co.id/news/bi-mencatat-nilai-transaksi-qris-capai-rp-16448-triliun-pada-januari-2026) | 2026-02 |  |
| 27 | 2026 年中 QRIS 用户 6,577 万、商户 4,486 万（96.68% 为 UMKM），交易量同比 +82.42% | 中 | [链接](https://www.fortuneidn.com/finance/transaksi-digital-melesat-qris-tumbuh-82-4-persen-d7w02-00-lflgw-8hs5kx) | 2026 年中 | 另有报道称商户 4,711 万，口径或日期不同 |
| 28 | BI 2026 年目标：QRIS 交易 170 亿笔、约 4,500 万商户、6,932 万用户 | 中 | [链接](https://investortrust.id/financial/117342/bi-bidik-69-32-juta-pengguna-qris-pada-2026) | 2026 |  |
| 29 | GPN（PBI 19/8/PBI/2017）：境内交易（印尼发行的工具 + 在印尼发生）须经 GPN 处理；switching 机构本国持股 ≥80%、外资 ≤20%；系统、数据中心、灾备须在境内；issuer/acquirer 至少接 2 家 switching；最终结算在 BI | 中 | [链接](https://www.makarim.com/storage/uploads/a0c1fe80-3f4c-4147-9df0-c1adc952bd17/109524_Advisory---Bank-Indonesia’s-National-Payment-Gateway-Introduced-(11-August-2017).pdf) | 2017-08-11 | 律所摘要 |
| 30 | 持有 BI 境内借记交易 switching 许可的四家：Artajasa（ATM Bersama）、Rintis Sejahtera（ATM Prima）、Daya Network Lestari（Alto）、Jalin Pembayaran Nusantara | 中 | [链接](https://finansial.bisnis.com/read/20190418/90/913143/artajasa-buka-peluang-kerja-sama-dengan-switching-asing) | 2019-04-18 |  |
| 31 | Jalin 2019 年取得 QRIS 运营许可，2018 年取得 BI-RTGS 参与许可；2019 年大股东由 Telkom 变为 PT Danareksa (Persero) | 中 | [链接](https://www.jalin.co.id/en-en/news/news/5-years-of-jalin-giving-more-meaning-in-every-step-of-your-digital-way) | 2021 |  |
| 32 | 截至 2024-08，Artajasa 的 ATM Bersama QR 有 59 家成员，自称占全国 off-us QR 交易量的 61% | 中 | [链接](https://infobanknews.com/members-meeting-atm-bersama-2024-artajasa-perkuat-kolaborasi-dengan-industri-keuangan/) | 2024 |  |
| 33 | BI-FAST：BI 运营，7x24 实时，约 25 秒完成；单笔上限起始 Rp250 juta；BI 向参与者收 Rp19/笔，参与者向客户收费最高 Rp2,500；参与者为银行与非银行机构；法规 PADG 23/25/PADG/2021 | 中 | [链接](https://www.bi.go.id/id/publikasi/ruang-media/news-release/Pages/sp_2327021.aspx) | 2021-12 | 上线时的数据，2025-2026 年是否调整未查到；ISO 20022 和 proxy 寻址未核实 |
| 34 | PBI 22/23/2020：非银行 PJP 外资最多 85%，本国持股至少 15% 且有表决权股份的 51% 须本国持有；PIP 外资最多 20%；细则见 PBI 23/6/PBI/2021（PJP）与 PBI 23/7/PBI/2021（PIP），外资按直接加间接穿透计算 | 中 | [链接](https://www.makarim.com/storage/uploads/4337a0d3-c9a0-430a-bf01-c9c571ceb63f/653871_Feb-2021---Issue-1---The-New-Indonesian-Umbrella-Regulation-on-Payment-Systems.pdf) | 2021-02 |  |
| 35 | PBI 7/14/PBI/2005 限制银行对外国方的卢比交易和外币授信（包括向外国人账户转账），例外条款很多；2026 年是否仍有效未查到 | 中 | [链接](https://peraturan.bpk.go.id/Download/128257/Peraturan%20BI%20No.%207-14-PBI-2005.pdf) | 2005 |  |
| 36 | BI 的 PBI 24/6/2022（卢比在国际活动中的使用）重申禁止卢比离岸使用，非居民只能在印尼境内、有 underlying 时使用卢比 | 中 | [链接](https://www.allenandgledhill.com/sg/publication/articles/22150/bank-indonesia-regulates-use-of-rupiah-in-international-transactions) | 2022 | 法规编号来自律所摘要，未核对原文 |
| 37 | 加密资产（数字金融资产）的监管职能 2025-01-10 由 Bappebti 移交 OJK 与 BI（PP 49/2024）；POJK 27/2024 同日生效，Bappebti 已发牌照继续有效 | 中 | [链接](https://ojk.go.id/en/berita-dan-kegiatan/siaran-pers/Pages/Bappebti-Transfers-Regulation-and-Supervision-Duties-on-Digital-Financial-Assets-Crypto-Assets-and-Derivatives-to-OJK-BI.aspx) | 2025-01-10 | OJK 官方新闻稿，内容经搜索摘要确认 |
| 38 | OJK 称稳定币不能成为创造'私人卢比'的后门；稳定币 POJK 预计 2027 年 1 月发布 | 中 | [链接](https://investortrust.id/market/118744/pojk-stablecoin-terbit-januari-2027-begini-kabar-terbaru-dari-ojk-termasuk-soal-rupiah-digital) | 2026 |  |
| 39 | 卢比稳定币 IDRP 2026-06 从 OJK 沙盒毕业，100% 卢比储备；IDRT 2019 年面世，IDRX、BIDR 2024 年面世（BIDR 已停止） | 中 | [链接](https://investasi.kontan.co.id/news/pasar-stablecoin-global-capai-us-308-miliar-rupiah-baru-punya-porsi-0005) | 2026 | IDDR 一同毕业只见于搜索摘要，单一来源 |
| 40 | DANA 允许外国手机号注册，并绑定 Visa/MC/Amex/JCB 卡付 QRIS | 中 | [链接](https://www.dana.id/blog/can-tourist-use-qris-in-indonesia/) | 2025-2026 | 厂商宣传，非监管确认 |
| 41 | USTR 2025 NTE（2025-03-31）把 QRIS 和 GPN 列为贸易壁垒，批评外国支付机构参与不足 | 中 | [链接](https://www.cnnindonesia.com/ekonomi/20250421101434-532-1220711/as-kritik-qris-) | 2025-04-21 |  |
| 42 | Antom 文档摘要：用 BNI、BCA、BRI 银行 App 付款的 QRIS 交易不支持退款 | 中 | [链接](https://docs.antom.com/ac/antomop/qris) | 未知 | WebFetch DNS 失败，仅搜索摘要 |
| 43 | QRIS 的 CRC 为 CRC-16/CCITT-FALSE（poly 0x1021，init 0xFFFF），计算范围含 '6304'；已用独立脚本校验开源样例 | 中 | [链接](https://pkg.go.dev/github.com/fyvri/go-qris) | 2026 |  |
| 44 | MPAN 前缀 9360 + 4 位机构码构成 8 位 NNS（例如 93600914 为 GoPay，93600503 为 Nobu） | 低 | [链接](https://pkg.go.dev/github.com/fyvri/go-qris) | 2026 | 由样例推断，官方 NNS 表未核实 |
| 45 | BI 禁止 PJP 处理虚拟货币交易；《货币法》UU 7/2011 规定境内支付须用卢比 | 低 | [链接](https://www.bi.go.id/id/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/QRIS/default.aspx) | N/A | 未核实，凭记忆；PBI 18/40/2016、19/12/2017、22/23/2020 一路延续 |

<details><summary>待确认问题</summary>

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

</details>

## 越南 / 柬埔寨

事实 48 条（高 2 / 中 43 / 低 3）。

| # | 事实 | 置信度 | 来源 | 日期 | 备注 |
|---|---|---|---|---|---|
| 1 | 越新跨境 QR 于 2026-07-02 正式上线，合作方为 NAPAS、Liquid Group（新加坡）、VietinBank | 高 | [链接](https://en.napas.com.vn/vietnam-and-singapore-launch-cross-border-qr-payment-service-accelerating-digital-economic-184260702152948206.htm) | 2026-07-02 |  |
| 2 | 柬马：MoU 2024-02，Phase 1 2024-09 上线（柬用户经 Bakong 或 Maybank M2U KH 扫 DuitNow）；Phase 2（马来西亚人扫 KHQR）无时间表 | 高 | [链接](https://www.bnm.gov.my/-/khqr-pr) | 2024-09 |  |
| 3 | VietQR 码使用 tag 38 作为 Merchant Account Information，子标签 00 = GUID 'A000000727'，01 = 嵌套模板（01.00 = 6 位受益机构 BIN，01.01 = 账号或卡号），02 = service code（QRIBFTTA 转账户 / QRIBFTTC 转卡） | 中 | [链接](https://registry.npmjs.org/vietnam-qr-pay/-/vietnam-qr-pay-1.5.1.tgz) | 2026-07-19 | 开源实现 vietnam-qr-pay 与 napas-qr 结论一致；样例 CRC16-CCITT 复算通过；官方规范原文未取得 |
| 4 | napas-qr 判定卡号的规则：以 9704 开头且长度为 16 或 19 位，则 service code 用 QRIBFTTC，否则用 QRIBFTTA | 中 | [链接](https://registry.npmjs.org/napas-qr/-/napas-qr-1.0.4.tgz) | 2023-06-07 |  |
| 5 | VietQR P2P 样例 00020101021138530010A0000007270123000697041601092576788590208QRIBFTTA53037045802VN6304AE9F 中没有 52/59/60（偏离 EMVCo 必填要求）；53=704，58=VN；62.08 为转账附言 | 中 | [链接](https://registry.npmjs.org/vietnam-qr-pay/-/vietnam-qr-pay-1.5.1.tgz) | 2026-07-19 | README 样例，本地复算 CRC=AE9F 吻合 |
| 6 | VNPAY-QR 是越南并行的 QR 网络，使用 tag 26，GUID 'A000000775'，子标签 01 = 商户ID；62.03 store、62.05 reference、62.07 terminal、62.08 purpose | 中 | [链接](https://registry.npmjs.org/vietnam-qr-pay/-/vietnam-qr-pay-1.5.1.tgz) | 2026-07-19 |  |
| 7 | 电子钱包在 NAPAS 有自己的 BIN：MoMo = 971025；ZaloPay 码使用 BVBank BIN 970454 + '99ZP…' 账号；主要银行 BIN：Vietcombank 970436、BIDV 970418、VietinBank 970415、Agribank 970405、Techcombank 970407、MB 970422、VPBank 970432、Sacombank 970403、ACB 970416 | 中 | [链接](https://registry.npmjs.org/vietnam-qr-pay/-/vietnam-qr-pay-1.5.1.tgz) | 2026-07-19 |  |
| 8 | NAPAS 于 2021 年 6 月推出统一转账二维码品牌 VietQR，依据 EMVCo 与 SBV 标准 | 中 | [链接](https://english.vtv.vn/news/napas-unveils-unified-qr-code-system-for-bank-transfers-2021062123463189.htm) | 2021-06-21 |  |
| 9 | NAPAS 现以 VietQRPay 做境内支付、VietQRGlobal 做跨境支付；已接通中、韩游客入境支付，越南人出境方向预计年底前完成；计划 2026 年接通印度、台湾 | 中 | [链接](https://vnba.org.vn/vi/napas-gioi-thieu-phuong-thuc-thanh-toan-xuyen-bien-gioi-qua-ma-qr-tai--ngay-tai-chinh-so-2026-22154.htm) | 2026-07-21 |  |
| 10 | 2025 年 NAPAS 系统笔数 +23.7%、金额 +8.7%，日均 >3,200 万笔；Napas 247 笔数约 +27%；VietQR 2025 年 1–10 月笔数 +52%、金额 +85%；截至 2025-10 约 9,000 万手机银行账户扫 VietQR | 中 | [链接](https://en.napas.com.vn/napas-2025-member-organization-conference-184260317124736875.htm) | 2026-03-17 | 两份 NAPAS 报告口径略有差异（23.7%/8.7% 与约 24%/8%） |
| 11 | 2024 年 VietQR 交易笔数为 2023 年的 2.2 倍，金额为 2.6 倍 | 中 | [链接](https://en.vietstock.vn/2025/01/qr-code-payment-transactions-surged-in-2024-37-597236.htm) | 2025-01 |  |
| 12 | 2026-04-03 起，中国游客可用 Alipay 扫全国 NAPAS 网络商户的 VietQRGlobal 码；由 NAPAS 与 Ant International 基础设施处理，Vietcombank 为结算行；反向（越南人扫 Alipay 码）在计划中 | 中 | [链接](https://technode.global/2026/04/07/vietnams-vietcombank-chinas-ant-international-launch-cross-border-qr-payment-service/) | 2026-04-07 |  |
| 13 | UnionPay 与 NAPAS 于 2024-10 签 MoU；2025-04 UPI、NAPAS、ICBC、Vietcombank 签四方协议；试点允许中国游客用银联 App 扫 VietQR Global | 中 | [链接](https://www.sacombank.com.vn/en/home/news/sacombank-news/2026/sacombank-pioneers-cross-border-qr-payment-connectivity-between-vietnam-and-china.html) | 2026 |  |
| 14 | 越韩跨境 QR 于 2026-04-23 上线：GLN International（Hana Financial 子公司）+ NAPAS + BIDV + Hana Bank；韩国 App（Toss、Hana OneQ、Hana Money、Hana Card）扫 VietQR Global；Hana Bank 为 SBV 批准的唯一韩方结算行，KRW–VND 实时结算 | 中 | [链接](https://fintech.global/?p=239685) | 2026-04 | NAPAS 官网也有报道：en.napas.com.vn/new-milestone-in-vietnamkorea-financial-connectivity-launch-of-cross-border-qr-payment-service-184260526100013798.htm |
| 15 | NAPAS、BIDV 与 Weixin Pay 于 2026-08 宣布扩大中越 QR 联通；越南人扫中国码方向仍在研究 | 中 | [链接](https://tapchikinhtetaichinh.vn/napas-bidv-va-weixin-pay-mo-rong-dich-vu-thanh-toan-qr-xuyen-bien-gioi-163811.html) | 2026-08 |  |
| 16 | 越老 QR 于 2025-01-09 上线（NAPAS–LAPNet），第一阶段仅越南用户扫 LaoQR；参与方为越方 7 家银行、老方 14 家银行 | 中 | [链接](https://vietnamnews.vn/economy/1690482/seven-banks-allow-customers-to-pay-by-qr-codes-in-laos.html) | 2025-01 |  |
| 17 | NAPAS 2024-12 宣布 2025 年拓展与中国、日本、韩国的跨境 QR；截至 2026-10 未查到日本通道上线 | 中 | [链接](https://en.vneconomy.vn/vietnams-napas-to-expand-qr-payment-reach-to-china-japan-south-korea.htm) | 2024-12-02 | “未上线”系基于检索不到，不是官方否认 |
| 18 | 越柬跨境 QR 于 12 月 3 日在暹粒上线（Wikipedia 与 Vietcetera 均记为 2023 年）；越南人以 VND 扫 KHQR，覆盖约 180 万柬埔寨商户 | 中 | [链接](https://thoibaotaichinhvietnam.vn/vietnam-cambodia-launch-cross-border-qr-payment-link-141406-141406.html) | 2023-12 |  |
| 19 | Decree 52/2024/ND-CP（非现金支付）2024-07-01 生效；现行框架下境外机构只能通过与 SBV 认可的商业银行或外资分行签约进入越南；SBV 2026-07 修订草案（改动 38 条中的 17 条）拟允许境外机构经持牌国际金融交换服务商（NAPAS、MobiFone）接入，并取消“最多连 2 家交换商”的限制，以支持区域 QR 联通 | 中 | [链接](https://www.tilleke.com/insights/vietnams-draft-decree-on-non-cash-payments-would-relax-requirements-for-ips-providers/) | 2026-07 | WebFetch DNS 失败，仅有搜索摘要；草案未定稿 |
| 20 | 《数字技术产业法》（Law 71/2025/QH15）2026-01-01 生效；数字资产分为 virtual assets 与 crypto assets，均不包括证券、数字法币及其他金融工具 | 中 | [链接](https://www.pwc.com/vn/en/publications/2025/vietnam-cryptocurrencies.pdf) | 2025-12 |  |
| 21 | 越南加密资产被承认为合法的交换与投资工具，但不得作为支付手段 | 中 | [链接](https://www.pwc.com/vn/en/publications/2025/vietnam-cryptocurrencies.pdf) | 2025-12 |  |
| 22 | Resolution 05/2025/NQ-CP（2025-09-09）：5 年试点；发行人须为越南企业，底层须为真实资产，不得是证券或法币；只向外国投资者发行，且只在外国投资者之间经持牌服务商交易 | 中 | [链接](https://www.bakermckenzie.com/-/media/files/insight/publications/alerts/09/vietnam-new-resolution-on-pilot-program-for-digital-and-crypto-assets-marke.pdf) | 2025-09 |  |
| 23 | 试点期最多 5 家 CASP；最低实缴资本 10 万亿 VND（约 4 亿美元）；外资 ≤49%；依 Decision 96/QĐ-BTC 自 2026-01-20 受理申请 | 中 | [链接](https://www.theblock.co/post/386543/vietnam-opens-crypto-exchange-licensing) | 2026-01 |  |
| 24 | 5 份交易所申请被认定有效（VIX、Loc Phat、Vietnam Prosperity、Techcom、Vietnam Digital Asset JSC），报道时尚无持牌；Decree 284/2026/ND-CP（2026-07-16 发布、09-01 生效）对经未持牌平台交易者罚 3,000–5,000 万 VND | 中 | [链接](https://vietnamnet.vn/en/vietnam-tightens-crypto-trading-rules-from-september-1-2539366.html) | 2026-07/08 | 有一篇二手报道（Tangem）称 5 家已获批，与此矛盾；以“未确认发牌”为准 |
| 25 | 岘港稳定币支付沙盒面向外国人，2025-09-01 至 2028-08-31，限 3 个地点；2026-01 起 USDT→VND 兑换试点，Basal Pay 已运营 | 中 | [链接](https://news.tuoitre.vn/foreign-visitor-demand-drives-pilot-for-digital-asset-conversions-in-da-nang-103260115000440801.htm) | 2026-01-15 |  |
| 26 | 越南《个人数据保护法》（Law 91/2025/QH15）2026-01-01 生效；跨境传输须做影响评估并于 60 天内报公安部（A05）；罚款最高为上年营收的 5% | 中 | [链接](https://www.allenandgledhill.com/vn/publication/articles/31075/upcoming-changes-to-vietnam-s-personal-data-protection-regime) | 2025-08-21 |  |
| 27 | Ordinance 28/2005 外汇管理令的政策目标是越南境内只使用 VND；境内以外币计价或支付原则上禁止（2018 年报道的罚款为 2–2.5 亿 VND） | 中 | [链接](https://english.luatvietnam.vn/ordinance-no-28-2005-pl-ubtvqh11-dated-december-21-2005-of-the-standing-committee-of-the-national-assembly-on-foreign-exchange-control-18163-doc1.html) | 2005-12-21 | 罚款额可能已被后续行政处罚法令调整，未核实 |
| 28 | NAPAS 与 VNPAY 于 2026-03 签署全面合作协议 | 中 | [链接](https://en.napas.com.vn/napas-and-vnpay-sign-comprehensive-cooperation-agreement-to-expand-the-digital-ecosystem-18426031710010799.htm) | 2026-03-17 | 协议是否包含 VNPAY-QR 与 VietQR 互通，未核实 |
| 29 | KHQR 官方 SDK（bakong-khqr，仓库 gitlab.nbc.gov.kh/khqr/sdk-javascript）：tag 29 = 个人、tag 30 = 商户；子标签 00 = Bakong Account ID（name@bank，≤32），01 = 个人 account information 或商户 merchant ID（≤32），02 = acquiring bank（≤32）；子标签 00 不是 GUID/AID | 中 | [链接](https://registry.npmjs.org/bakong-khqr/-/bakong-khqr-1.0.20.tgz) | 2025-04-30 | 源码常量与测试一致；未取得 NBC 规范 PDF |
| 30 | KHQR tag 99 为时间戳模板：00 = 创建时间、01 = 过期时间，均为 13 位毫秒 epoch；动态码（01=12，金额 >0）必须带过期时间，过期时 SDK 报 KHQR_EXPIRED | 中 | [链接](https://registry.npmjs.org/bakong-khqr/-/bakong-khqr-1.0.20.tgz) | 2025-04-30 |  |
| 31 | KHQR 币种：53 = 116（KHR）或 840（USD）；KHR 金额须为整数，USD 最多 2 位小数；tag 15 为 UnionPay merchant account，SDK 禁止 USD 码带 UPI 字段 | 中 | [链接](https://registry.npmjs.org/bakong-khqr/-/bakong-khqr-1.0.20.tgz) | 2025-04-30 |  |
| 32 | KHQR 62 子标签：01 bill number、02 mobile、03 store label、07 terminal、08 purpose（各 ≤25）；64 = 语言模板（00 语言、01 名称、02 城市）；59 ≤25、60 ≤15；MCC 默认 5999 | 中 | [链接](https://registry.npmjs.org/bakong-khqr/-/bakong-khqr-1.0.20.tgz) | 2025-04-30 |  |
| 33 | SDK 测试中有 ABA 格式的多网络 KHQR：同一码里并存 tag 02（Visa）、04（Mastercard）、30（abaakhppxxx@abaa，merchant ID 316600770110242，acquiring bank abaa），53=840；CRC=3870，复算吻合 | 中 | [链接](https://registry.npmjs.org/bakong-khqr/-/bakong-khqr-1.0.20.tgz) | 2025-04-30 |  |
| 34 | Bakong 由 NBC 与 Soramitsu 基于 Hyperledger Iroha（许可型链）构建；三层结构为 NBC 的 Bakong Core、分配给金融机构的 domain / payment gateway、机构分配给用户的钱包 | 中 | [链接](https://www.lfdecentralizedtrust.org/blog/2020/08/17/national-bank-of-cambodias-new-digital-payment-system-how-soramitsu-helped-modernize-retail-payments-using-hyperledger-iroha) | 2020-08-17 | 厂商与合作方材料 |
| 35 | 2024 年 Bakong 交易额 1,506.1 亿美元（约 GDP 的 330%），约 6.08 亿笔（同比 +95%）；约 3,000 万钱包；450 万+ 商户受理 | 中 | [链接](https://en.vietstock.vn/2025/03/bakong-volume-now-more-than-300-percent-of-cambodias-gdp-114-606221.htm) | 2025-03 |  |
| 36 | 2025 年 Bakong 约 13.3 亿笔，金额 KHR 285.9 万亿 + USD 1,528 亿；KHQR 商户约 450 万；手机银行用户超 1,000 万 | 中 | [链接](https://cambodiainvestmentreview.com/2026/06/08/exclusive-cambodias-digital-economy-reaches-new-milestone-as-mobile-banking-users-surpass-10-million-and-khqr-payments-exceed-105-billion-annually/) | 2026-06-08 | 同文有“约 75 万用户”的冲突口径 |
| 37 | 日柬 QR：METI–NBC MOC（2023-12-18）、NBC–PJA MoU（2025-04-21）；Phase 1 于 2025-07-04 在大阪世博上线（柬埔寨 Bakong 或银行 App 扫 JPQR）；Phase 2 为日本用户扫 KHQR；日方运营商 NETSTARS，柬方 ACLEDA、Sathapana | 中 | [链接](https://fintechnews.sg/110676/cambodia/japan-cambodia-qr/) | 2025-07 | PJA 新闻稿：paymentsjapan.or.jp/wp-content/uploads/2025/04/PressRelease_en_20250421.pdf |
| 38 | 柬老 Phase II 于 2025-12-19 上线，老挝用户可扫 KHQR（约 450 万商户）；Phase I（2023-08）为柬→老 | 中 | [链接](https://b2b-cambodia.com/news/cambodia-and-laos-launch-phase-ii-cross-border-qr-code-payments) | 2025-12 |  |
| 39 | Bakong–Alipay+ 跨境 QR 于 2024-10-17 正式上线（NBC 与 Ant International 于 2023-11-15 签 MoU）；12 个国际钱包（Alipay、AlipayHK、Touch 'n Go、GCash、Kakao Pay 等）可扫 KHQR；全 KYC 的 KHR 账户 Bakong 用户可在 Alipay+ 商户付款 | 中 | [链接](https://www.bis.org/speeches/20241017-remarks-official-launching-ceremony-cross-border-qr-code-payment-between-bakong-and-alipay-plus) | 2024-10-17 | bis.org WebFetch 失败；钱包清单来自 thepaypers 等二手报道 |
| 40 | 银联持卡人或 App 用户可在约 180 万柬埔寨商户扫 KHQR | 中 | [链接](https://www.b2b-cambodia.com/news/overview-of-cambodias-cross-border-qr-payments-with-vietnam-thailand-laos-china/) | 未查到 |  |
| 41 | Bakong Tourists App 于 2024-08-19 在暹粒软启动；游客用邮箱注册，用本国 Visa、Mastercard、UnionPay 卡充值后扫 KHQR（330 万+ 商户），支持 USD/KHR 兑换；后与 Mastercard 在金边正式发布 | 中 | [链接](https://fintechnews.sg/100446/cambodia/cambodia-launch-bakong-tourists-app/) | 2024-08 |  |
| 42 | ACLEDA 指南：经 Bakong 在泰、越、老跨境扫码，只能从 KHR 账户扣款 | 中 | [链接](https://www.acledasecurities.com.kh/qr/toanchet-manual/qrpayment-cross-border?h=0&l=eng) | 未查到 |  |
| 43 | NBC《加密资产相关交易 Prakas》（2024-12-26）：Group 1a 代币化传统资产、Group 1b 有有效稳定机制的稳定币（排除算法币）、Group 2 其他；银行须经 NBC 批准，不得发行、不得做 Group 2；敞口上限 1a ≤5% CET1、1b ≤3% CET1；须按季报告；CASP（交换、转移、托管）须持牌，规则延伸至支付服务机构；罚款 KHR 2,000 万–5 亿 | 中 | [链接](https://www.dfdl.com/insights/legal-and-tax-updates/cryptoassets-regulation-introduced-by-the-national-bank-of-cambodia-nbc/) | 2024-12/2025-01 | Rajah & Tann 说法一致；NBC 原文未核 |
| 44 | 柬埔寨 Prakas on the Management of Payment Service Providers（2017-06-14）：提供支付服务须获 NBC 牌照；电子货币只能由银行与持牌支付机构发行 | 中 | [链接](https://cambodiantr.gov.kh/?p=2042) | 2017-06-14 | 非官方英译；是否有 2024 年新版未查到 |
| 45 | PayPay 于 2025-09-30 正式推出“海外支付模式”，首站韩国，在 Alipay+ 与 ZeroPay 标识的店铺使用；须出国前完成 eKYC；海外事务手续费 3.85%（含税） | 中 | [链接](https://appllio.com/news/2025-09-30-67941-paypay-overseas-payment) | 2025-09-30 | Business Wire 同步报道 PayPay accepted in Korea via Alipay+ |
| 46 | 日柬通道中 SMBC 为日方结算行；Phase 2 原计划“2025 年底前”实施，截至 2026-10 未查到上线报道 | 低 | [链接](https://www.theasset.com/article/54401/theasset.com) | 2025-07 | “2025 年底”目标只见于单一来源 |
| 47 | NBC 与 Weixin Pay 推出跨境 QR，第一阶段入境游客可用 WeChat Pay 扫全国 KHQR | 低 | [链接](https://www.theasset.com/article/57000/theasset.com) | 2026-08-21 | 单一来源，日期未交叉核实 |
| 48 | 柬埔寨 SERC 的 FinTech 沙盒只有 2 家持牌机构，且不得将加密资产兑成法币；《数字资产法》在起草中 | 低 | [链接](https://cryptoforinnovation.org/cambodias-crypto-interest-reflects-wider-policy-changes-to-financial-system/) | 2025 |  |

<details><summary>待确认问题</summary>

- NAPAS：VietQRGlobal 跨境通道是否只受理已登记商户的 P2M 码？外国钱包扫个人 VietQR（P2P）是否被拒？P2M 的官方识别规则（service code、MCC、59 等）是什么？
- NAPAS：境外合作网络（GLN、Liquid 模式）的接入条件、技术报文（ISO 8583 还是 ISO 20022）、账户名查询接口、汇率由谁报、结算频率与币种、单笔和单日限额、退款与撤销流程分别如何？
- NAPAS 与 SBV：日本对口安排目前由谁推进（PJA、NETSTARS、日本官方，还是商业机构）？INSPAY 能否作为日方网络或聚合方单独与 NAPAS 签约？
- SBV：Decree 52/2024 修订草案（2026-07）何时定稿？“境外机构经国际金融交换服务商接入”的具体条件、外资持股与注册资本门槛是什么？
- 越南：结算行（Vietcombank、BIDV、VietinBank）能否接受以境外 USD 或 JPY 头寸（由稳定币在境外兑换而来）结算？是否需要 SBV 外汇专项批准或报备？
- 越南：VNPAY-QR（tag 26，A000000775）商户能否经 NAPAS 跨境通道受理？NAPAS 与 VNPAY 2026-03 协议是否包含互通？
- 越南：首张加密资产交易所牌照是否已于 2026 年下半年发出？持牌 CASP 能否为境外机构提供稳定币与 VND 之间的兑换或托管？
- 越南：Decree 53/2022 对跨境支付服务商的数据境内存储要求是否适用于 INSPAY？
- NBC：日柬 Phase 2（日本人扫 KHQR）的上线时间与技术方案，以及日方发行侧是否只限 NETSTARS 接入？
- NBC：入境跨境 KHQR 是否只能以 KHR 结算？美元标价的 KHQR 商户码能否被外国钱包支付？
- NBC：本地合作银行（ACLEDA、Sathapana、ABA）能否在 Prakas 下经批准接受 Group 1b 稳定币（如 USDC）作为跨境结算头寸？3% CET1 上限的实际额度是多少？银行是否还需单独申请 CASP 牌照？
- NBC：外国网络（非央行）直接与 NBC 签跨境 MoU 的条件（Ant、UnionPay、Weixin Pay 的先例），以及与日本 PJA“国家对口”角色是否冲突？
- Bakong Open API：交易状态查询（md5）、deeplink、账户查询的正式接口文档与跨境商户可用的权限范围？
- Ant 与 PayPay：Alipay+ 是否计划把 PayPay 海外支付扩展到越南（VietQRGlobal）和柬埔寨（KHQR）？时间表如何？
- 两国各跨境通道的入境游客单笔和单日限额、FX 加点与费率结构，本轮均未查到

</details>

## 菲律宾 / 缅甸

事实 35 条（高 2 / 中 25 / 低 8）。

| # | 事实 | 置信度 | 来源 | 日期 | 备注 |
|---|---|---|---|---|---|
| 1 | Wise 于 2024-11-04 宣布获得 InstaPay 直连，并直接在 BSP 的 PhilPaSSplus 结算 | 高 | [链接](https://www.businesswire.com/news/home/20241101510219/en/Wise-Granted-Direct-Access-to-Philippines-Instant-Payments-Infrastructure-Gets-Settlement-Account-With-BSP) | 2024-11-04 | Wise 官方新闻稿（搜索摘要） |
| 2 | MAS 与 BSP 于 2021-11 签署增强版 FinTech 合作协议，要联通实时支付和 QR 支付系统 | 高 | [链接](https://www.mas.gov.sg/news/media-releases/2021/mas-and-bsp-to-pursue-cross-border-payment-linkages) | 2021-11 |  |
| 3 | QR Ph P2M 码用 MAI tag 28，子 00 GUID 是 'ph.ppmi.p2m'；P2P 码用 tag 27，GUID 是 'com.p2pqrpay' | 中 | [链接](https://www.npmjs.com/package/@qrph/qrph) | 2025-01-03 | 开源库 schema.ts 加上 14 个真实商户码样例（GCash/Maya/BPI/BDO/Security Bank/AUB/ShopeePay/PayMongo），我在本地做了 TLV 解析并校验 CRC |
| 4 | tag 28/27 子 01 是 11 位 BIC 格式的收单/InstaPay 参与者代码：GCash=GXCHPHM2XXX，Maya=PAPHPHM1XXX，ShopeePay=SHPHPHM2XXX，BPI=BOPIPHMMXXX，BDO=BNORPHMMXXX，Security Bank=SETCPHMM000，AUB=AUBKPHMMXXX，PayMongo=PAEYPHM2XXX | 中 | [链接](https://www.npmjs.com/package/@qrph/qrph) | 2025-01-03 | 从样例观察得出；子标签官方名称未核实 |
| 5 | QR Ph 的 tag 62 子 00 也带 GUID（ph.ppmi.qrph / com.paymaya.qr / com.ppmi.qrph），05 是 Reference Label，03 是 Store Label，07 是 Terminal Label；值为 '***' 时提示付款方输入；tag 88 带 ph.ppmi.qrph 加商户标识 | 中 | [链接](https://www.npmjs.com/package/@qrph/qrph) | 2025-01-03 | 真实样例观察 |
| 6 | 样例中 P2P 码 MCC 都是 6016，个人名掩码（如 'BR****N S.'）；P2M 用真实 MCC | 中 | [链接](https://www.npmjs.com/package/@qrph/qrph) | 2025-01-03 |  |
| 7 | 开源注册表里 GCash 的 SWIFT 是 GLTEPHMT，和 QR 码中的 GXCHPHM2XXX 不同，说明码里的是 InstaPay/PPMI 参与者代码，不能直接用 SWIFT 映射 | 中 | [链接](https://www.npmjs.com/package/@ph-dev-utils/banks) | 2026-04-30 |  |
| 8 | QR Ph 由 BSP Circular No. 1055（2019 年 10 月）确立为国家互通 QR 标准，由 PPMI 推出；P2M 于 2021 年 4 月起试点 | 中 | [链接](https://www.transfi.com/blog/qr-ph-explained-how-p2p-and-p2m-qr-payments-work-for-individuals-and-merchants) |  | 二手摘要 |
| 9 | 2025 年 QR Ph 交易 24.7 亿笔、₱1.16 万亿；数字支付占零售交易笔数 64.69% | 中 | [链接](https://mb.com.ph/2026/08/17/digital-payments-hit-647-of-philippine-retail-transactions-nearing-bsps-70-target) | 2026-08-17 | 媒体转述 BSP |
| 10 | InstaPay 是实时 7x24 贷记推送，单笔上限 ₱50,000 | 中 | [链接](https://www.bpi.com.ph/personal/bank/remit-and-transfer/interbank-fund-transfer-terms-and-conditions) |  |  |
| 11 | InstaPay 参与者名单由 BancNet 发布，PESONet 名单由 PCHC 发布（截至 2026-04-30）；InstaPay 94 家、PESONet 123 家 | 中 | [链接](https://www.npmjs.com/package/@ph-dev-utils/banks) | 2026-04-30 | 开源包打包的 BSP 名单 |
| 12 | Alipay Philippines, Inc. 是 InstaPay 参与者，但标注为 receiver-only（截至 2026-04-30）；Wise Pilipinas、DCPAY Philippines（Coins.ph）、PDAX、PayMongo、GCash、Maya 都是 InstaPay 参与者 | 中 | [链接](https://www.npmjs.com/package/@ph-dev-utils/banks) | 2026-04-30 |  |
| 13 | MUFG、Mizuho、SMBC 马尼拉分行只参与 PESONet，不在 InstaPay 名单 | 中 | [链接](https://www.npmjs.com/package/@ph-dev-utils/banks) | 2026-04-30 |  |
| 14 | PPMI 与 Ant International 于 2026-09-01 在 QR Ph 上启用 Alipay+，海外钱包用户可以直接扫全国 QR Ph 商户，商户不需要新码 | 中 | [链接](https://fintech.global/2026/09/01/alipay-opens-philippine-merchants-to-global-shoppers/) | 2026-09-01 | 多家媒体报道；结算机构和支持钱包未查到 |
| 15 | BSP 计划 2026 年上线与马来西亚的 QR 联通（DuitNow App 扫 QR Ph，经 InstaPay 桥接），与 Nexus 并行 | 中 | [链接](https://www.philstar.com/business/2026/02/01/2504833/bsp-roll-out-cross-bank-auto-debit-year/amp/) | 2026-02-01 | 截至 2026-10 是否上线未查到 |
| 16 | 菲律宾计划 2027 年年中接入 Nexus（连接新、马、泰、印、印尼的快速支付系统） | 中 | [链接](https://fintechnews.ph/70353/digital-payments/philippines-targets-mid-2027-for-project-nexus-cross-border-payments/) | 2026-03 |  |
| 17 | GCash 和 HelloMoney by AUB 可以经 Alipay+ 在日本 PayPay 商户使用；PayPay 加盟店手续费 1.98% | 中 | [链接](https://paypay.ne.jp/help-merchant/b0076/) |  |  |
| 18 | PayPay 出境'海外決済モード'于 2025 年 9 月末在韩国上线；在菲律宾的可用性未查到 | 中 | [链接](https://www.watch.impress.co.jp/docs/news/1564491.html) | 2025-09 |  |
| 19 | SEC CASP Rules（MC No.4 s.2025）与 Guidelines（MC No.5 s.2025）于 2025-07-05 生效，要求实缴资本 ≥ ₱1 亿、境内有办公室 | 中 | [链接](https://insightplus.bakermckenzie.com/bm/financial-institutions_1/philippines-sec-issues-rules-and-guidelines-on-crypto-asset-service-providers-casp) | 2025-06 |  |
| 20 | BSP 于 2025-09 把新 VASP 牌照暂停期延长为无限期（原从 2022-09-01 起暂停 3 年） | 中 | [链接](https://newsbytes.ph/2025/09/02/bsp-extends-moratorium-on-new-vasp-licenses/) | 2025-09-02 |  |
| 21 | BSP 征求意见稿（2026-09）：拟暂停新 OPS 注册 12 个月；做商户收单的受监管机构只能和持牌 VASP 合作，并须强化尽调、设交易和结算限额 | 中 | [链接](https://cointelegraph.com/news/philippines-payment-operator-freeze-vasp-checks) | 2026-09-07 | 草案，未定稿 |
| 22 | Coins.ph 的 PHPC 于 2025-06 出 BSP 沙盒；储备在 UnionBank 和 Security Bank；沙盒上限 1 亿枚 | 中 | [链接](https://fintechnews.ph/67165/crypto/coins-ph-phpc-progresses-beyond-bsp-sandbox/) | 2025-06 |  |
| 23 | BSP 在审多个稳定币提案，大多是美元稳定币，以沙盒评估为主，态度审慎 | 中 | [链接](https://fintechnews.ph/69153/crypto/bsp-reviews-stablecoins-proposals-philippines-cautious-approach/) |  |  |
| 24 | BPI 与 Meridian 于 2026-07 宣布用稳定币作为入境汇款结算层，到账时换成比索入账，计划 2026-11 ASEAN 峰会前推广 | 中 | [链接](https://mb.com.ph/2026/07/23/bpi-taps-meridian-to-use-stablecoins-for-remittances) | 2026-07-23 |  |
| 25 | MMQR（MyanmarPay）由 CBM 制定，规范 v1.0 于 2019-01 发布，2025-02-27 在内比都正式推出，基于 EMVCo | 中 | [链接](https://wavemoney.com.mm/media-center/mmqr-with-wave) | 2025-02-27 | Wikipedia 写的是 2025-03-04 |
| 26 | Yoma Bank MMQR 动态码有效期 120 秒，过期须 renewQr；生产 API 是 paymenthubapi.yomabank.com | 中 | [链接](https://www.npmjs.com/package/@laranex/myanmar-payments) | 2026-10-16 | 开源 SDK |
| 27 | 缅甸自 2022-10 起列入 FATF call for action，2026-06-19 全会继续保留，要求强化尽调，未要求反制措施 | 中 | [链接](https://fiaumalta.org/news/fatf-public-statements-19th-june-2026/) | 2026-06-19 |  |
| 28 | P2M 子 03 是商户收款账户或商户号（开源库当作 account number），子 05 是 3 位标志，取值有 000/010/300/310/311，含义未核实（疑似 proxy-notify flag 或 merchant criteria）；P2P（GCash）子 04 是每个用户唯一的 17 位账户/代理 ID | 低 | [链接](https://www.npmjs.com/package/react-native-instapay-qr) | 2022-02-06 | 官方规范原文未查到，子标签语义是根据样例推断的 |
| 29 | 较早报道：P2M 商户网点 47.3 万个、参与机构 17 家 | 低 | [链接](https://www.bworldonline.com/?p=455504) |  | 日期不明，已过时 |
| 30 | 未核实：InstaPay for Business 于 2026-07-29 推出，合资格企业账户单笔上限 ₱500,000 | 低 | [链接](https://www.paymongo.com/blog/instapay-vs-pesonet) | 2026-07 | 只有 PayMongo 博客提到，未经 BSP/PPMI 核实 |
| 31 | Ronin 钱包计划 2026 年经 PHPC 打通 QR Ph 支付，前提是取得 BSP 许可 | 低 | [链接](https://bitpinas.com/feature/ronin-qr-ph/) |  |  |
| 32 | PHPX：UnionBank、RCBC 等银行在 Hedera 上的比索代币，是否获批未查到 | 低 | [链接](https://fintechnews.ph/65433/crypto/phpx-stablecoin-launch-hedera-network/) |  |  |
| 33 | 2025 年 FX Manual 修订（MB Res. 243，2025-03-06）把 FX 衍生品限于对冲和融资需要，并更新 NDF 报告要求 | 低 | [链接](https://regalert.today/document/d6ab2094-ced0-4a15-8297-78f37665b4ca/text) | 2025-03-06 | 第三方汇编 |
| 34 | 没有查到任何 MMQR 跨境 QR 联通 | 低 | [链接](https://en.wikipedia.org/wiki/ASEAN_Integrated_QR_Code_Payment_System) |  | 负面结论 |
| 35 | 未核实：Payplus 于 2021 年被选为缅甸数字支付交换机运营方 | 低 | [链接](https://en.wikipedia.org/wiki/MyanmarPay) |  |  |

<details><summary>待确认问题</summary>

- 向 PPMI 索取 QR Ph P2M/P2P 规范原文与当前版本：tag 28/27 子 02/04/05 的官方定义（05 取值 000/010/300/310/311 的含义），是否有跨境专用 GUID 或字段，是否有 CPM
- Alipay+ × QR Ph（2026-09）的结算机构是谁？Alipay Philippines 是否已从 receiver-only 升级为发送方？报价、限额、退款怎么处理？PPMI 是否愿意给第二个跨境网络（INSPAY）相同的安排？
- PPMI/BancNet 规则是否允许 InstaPay 发送方参与者为境外钱包用户发起 QR Ph 付款（issuer-sponsor 模式）？BSP 会把它定性为跨境支付、汇款还是别的？需要什么牌照？
- InstaPay 的结算模式（轧差还是预存资金、PhilPaSSplus 每天几个窗口、周末怎么处理）与 ISO 20022 报文版本
- 参与者代码（如 GXCHPHM2XXX）到机构的权威映射表从哪里拿
- BSP 2026-09 OPS 注册冻结草案何时定稿？对'受监管机构与持牌 VASP 合作'的要求里，日本的電子決済手段等取引業者是否算 'other relevant authority' 许可？
- Coins.ph / PDAX 能否接收 USDC 或日元稳定币并在境内换成比索付款？需要 BSP 额外批准吗？外汇申报怎么做？
- InstaPay for Business（₱500,000）是否真的已上线，是否适用于 P2M QR
- 菲律宾—马来西亚 DuitNow 联通是否已上线？报价和结算模式（是否 LCS）？
- PayPay 出境模式是否经 Alipay+ 覆盖菲律宾？时间表如何？
- BSP 对支付数据境内处理、外包上云的要求（条文）
- MMQR 的 GUID、子标签与样例；MPU 在 MMQR 中的角色；缅甸受制裁银行最新清单及日本监管对缅甸业务的态度

</details>

## 日本 / PayPay（第一轮）

事实 57 条（高 7 / 中 19 / 低 31）。

| # | 事实 | 置信度 | 来源 | 日期 | 备注 |
|---|---|---|---|---|---|
| 1 | PayPay 于 2025-09-16 宣布'海外支払いモード'，2025-09-30 起对完成 eKYC 的用户在韩国正式提供 | 高 | [链接](https://paypay.ne.jp/notice/20250930/f-overseaspayment/) | 2025-09-30 | 经 WebSearch 摘要核实（官方公告及 appllio/travelvoice 报道一致）；原文页面因 WebFetch DNS 失败未能直接打开 |
| 2 | PayPay 韩国海外支付经 Alipay+ 实现，可在贴有 Alipay+ 与 zero pay 标识的 200 万家以上店铺使用；ZeroPay 店铺仅支持用户扫店铺码（MPM） | 高 | [链接](https://about.paypay.ne.jp/en/pr/20250916/01/) | 2025-09-16 | WebSearch 摘要；另见 https://fintechnews.hk/35571/fintechkorea/paypay-south-korea-alipayplus-2025/ 与 BusinessWire 20250915612411 |
| 3 | 海外支払いモード汇率 = 海外网络事业者或海外收单机构按日提示的汇率 + 海外事务手续费 3.85%（含税），以日元显示 | 高 | [链接](https://paypay.ne.jp/notice/20260427/f-overseaspayment/) | 2026-04-27 | 韩国与台湾两次公告措辞一致（WebSearch 摘要引用原文） |
| 4 | 2026-04-27 起 PayPay 在台湾提供海外支払いモード，可在贴 TWQR 标识的店铺使用，经 HIVEX 国际网络覆盖 40 万处以上 | 高 | [链接](https://paypay.ne.jp/notice/20260427/f-overseaspayment/) | 2026-04-27 | WebSearch 摘要引用官方公告 |
| 5 | 台湾海外模式同时支持 CPM（ストアスキャン）与 MPM（ユーザースキャン），可用 PayPay残高払い 与 PayPayクレジット | 高 | [链接](https://paypay.ne.jp/notice/20260427/f-overseaspayment/) | 2026-04-27 | WebSearch 摘要引用官方公告 |
| 6 | PayPay 于 2026-03-03 启动 IPO 路演 | 高 | [链接](https://group.softbank/en/news/press/20260303) | 2026-03-03 | 软银官方新闻稿标题 |
| 7 | PayPay ADS 于 2026-03-12（美东时间）在 Nasdaq Global Select Market 上市，代码 PAYP | 高 | [链接](https://group.softbank/en/news/press/20260312) | 2026-03-12 | 软银官方新闻稿 |
| 8 | PayPay 官方帮助：海外支払いモード于 2025-09-24 以后顺次可用；需在日本完成本人确认，海外不能新注册或 eKYC；海外模式仅提供支付、送る・受け取る、交易记录、充值（仅已登记方式）、利用可能额设定等功能 | 中 | [链接](https://paypay.ne.jp/help/c0478/) | 2025-09 | WebSearch 摘要引用 paypay.ne.jp 帮助页；具体帮助页 URL 对应关系未能打开确认 |
| 9 | 海外消费同样发放 0.5–2.0% 的 PayPayポイント；不支持在当地 ATM 充值，只能用日本已登记的充值方式 | 中 | [链接](https://appllio.com/news/2025-09-30-67941-paypay-overseas-payment) | 2025-09-30 | 媒体报道，与官方台湾公告一致 |
| 10 | 海外模式只能在日本使用的同一终端上使用，海外不能在新终端登录 | 中 | [链接](https://appllio.com/news/2025-09-30-67941-paypay-overseas-payment) | 2025-09-30 | 媒体报道 |
| 11 | HIVEX® 是软银出资的美国公司 TBCASoft 开发运营的区块链底层国际支付基础设施，可吸收各国 QR 规格差异 | 中 | [链接](https://www.softbank.jp/en/sbnews/entry/20260423_01) | 2026-04-23 | WebSearch 摘要（软银新闻/日媒）；是 INSPAY 的直接竞品/潜在伙伴 |
| 12 | 台湾财金资讯公司（FISC）'TWQR Inbound'于 2026-04-14 正式开通，首波串接 PayPay，清算银行为玉山银行 | 中 | [链接](https://www.inside.com.tw/tag/1350-%E8%A1%8C%E5%8B%95%E6%94%AF%E4%BB%98?page=2) | 2026-04-14 | 台湾媒体（inside/远见）报道；PayPay 英文新闻稿 https://about.paypay.ne.jp/en/pr/20260414/01/ |
| 13 | PayPay 用户数突破 7,300 万、日本市占率逾六成（FISC 发布会表述） | 中 | [链接](https://www.gvm.com.tw/article/129405) | 2026-04 | 二手转述，需以 PayPay 20-F/官方数据核实 |
| 14 | 截至 2026-06 的检索结果，PayPay 海外支払いモード只覆盖韩国与台湾；未查到泰国、新加坡、香港或其他东南亚国家的上线或计划 | 中 | [链接](https://about.paypay.ne.jp/en/pr/20260629/01/) | 2026-06-29 | 基于检索结果'未显示'，不排除有未检索到的公告 |
| 15 | 2026-06-29 PayPay 宣布访日游客的 8 成可通过 PayPay 使用本国支付服务；新增 5 国 7 个服务（3 个新国家），含经 Alipay+ 的越南服务、ShopeePay（新加坡、泰国）、SCB PLANET PLUS（泰国）及乌兹别克斯坦、巴基斯坦服务 | 中 | [链接](https://about.paypay.ne.jp/en/pr/20260629/01/) | 2026-06-29 | WebSearch 摘要；具体服务清单需打开原文核对 |
| 16 | 2024-01-29 PayPay 宣布新增与 4 国 8 个无现金支付服务对接（inbound），AlipayHK 等早已在列 | 中 | [链接](https://about.paypay.ne.jp/en/pr/20240129/01/) | 2024-01-29 | WebSearch 摘要 |
| 17 | The Asian Banker 报道 PayPay 与 Alipay+ 将电子钱包受理扩展至日本 300 万商户 | 中 | [链接](https://www.theasianbanker.com/press-releases/paypay-and-alipay-expand-e-wallet-payments-to-3-million-merchants-in-japan) | 未查到 | 仅见标题，日期未查到 |
| 18 | PayPay IPO 定价 16 美元，低于 17–20 美元区间；首日开盘 19 美元、收盘 18.16 美元 | 中 | [链接](https://www.iposcoop.com/?p=37944) | 2026-03-12 | IPOScoop |
| 19 | IPO 募资约 8.8 亿美元（含软银系卖方），发行价估值约 107 亿美元；开盘估值约 127 亿美元；基石投资者含 Visa 与阿布扎比、卡塔尔主权基金 | 中 | [链接](https://cdn.dealstreetasia.com/stories/softbank-backed-paypay-valued-at-12-7b-as-shares-surge-on-nasdaq-debut-475780) | 2026-03-12 | 估值口径不同来源不一；软银披露 'JPY 94.6 billion (USD 603 million) net' 口径待核 |
| 20 | PayPay IPO 原计划 2025 年 12 月，因美国政府停摆导致审核延迟 | 中 | [链接](https://cdn.dealstreetasia.com/stories/softbank-backed-paypay-valued-at-12-7b-as-shares-surge-on-nasdaq-debut-475780) | 2026-03 | 媒体报道 |
| 21 | 哪些余额类型（マネー/マネーライト/ポイント）可用于海外支払いモード：未查到；官方台湾公告只写'PayPay残高払い'与'PayPayクレジット' | 中 | [链接](https://paypay.ne.jp/notice/20260427/f-overseaspayment/) | 2026-04-27 | 前半为'未查到' |
| 22 | JPQR Global（NETSTARS 运营）自 2025-08-17 起支持印尼 QRIS，首先在大阪・关西万博印尼馆等店铺，访日印尼人用本国 QRIS App 扫 JPQR 码，金额以印尼盾显示 | 中 | [链接](https://paymentnavi.com/?p=164513) | 2025-08-17 | 多家媒体一致（paymentnavi、Metro TV、investortrust） |
| 23 | 印尼央行 BI 于 2025-08-25 在万博印尼馆举行 QRIS–Japan 启动仪式；日本是 QRIS 在东南亚以外首个落地国家 | 中 | [链接](https://investortrust.id/international/76025/qris-now-accepted-in-japan-marking-a-milestone-on-indonesias-80th-independence-day) | 2025-08 | 媒体报道 |
| 24 | 柬埔寨 KHQR 自 2025-07-05 起经 JPQR Global 在万博会场可用 | 中 | [链接](https://paymentnavi.com/?p=164513) | 2025-07-05 | paymentnavi 报道 |
| 25 | 日本人在印尼用本国 App 扫 QRIS（outbound）在同一框架下'计划'实现，截至检索未查到已上线 | 中 | [链接](https://indonesiabusinesspost.com/5021/markets-and-finance/bi-expands-qris-to-japan-boosting-cross-border-payment-connectivity) | 2025-08 | 上线状态未查到 |
| 26 | PayPay 海外模式已分别使用 Alipay+（韩国）与 HIVEX（台湾）两张网络，说明其后端可接入多张跨境网络，汇率由'海外ネットワーク事業者/海外アクワイアラー'提示 | 中 | [链接](https://paypay.ne.jp/notice/20260427/f-overseaspayment/) | 2026-04-27 | 由已核实事实推导 |
| 27 | 海外支払いモード专属的金额上限未查到；非官方解说的残高付款上限（过去24小时50万日元/过去30日200万日元）是一般上限，非海外专属 | 低 | [链接](https://appllio.com/rd/paypay-usage-limit) | 未查到 | 需查 PayPay 官方'利用上限'帮助页 |
| 28 | PayPay 由 SoftBank Corp. 合并、LY Corporation 为重要股东，SoftBank Group 间接持有；上市前后精确持股未查到 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 未查到 | 建议查 PayPay F-1/20-F |
| 29 | PayPay 为资金移动业者（据记忆第二种，单笔≤100 万日元），PayPayマネー 以此为法律基础；登记编号未查到 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 未查到 | 未核实；建议查 PayPay 会社概要与 20-F |
| 30 | PayPay 为前払式支払手段（第三者型）发行者，PayPayマネーライト 属前払式支払手段、不可出金 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 未查到 | 未核实 |
| 31 | PayPayポイント 为奖励积分（无对价），不属前払式支払手段，不可出金；国内扣减顺序据记忆为 ポイント→マネーライト→マネー | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 未查到 | 未核实 |
| 32 | PayPay 2024-08 前后获厚生劳动省首批'给与数字支付'指定资金移动业者指定 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2024-08 | 未核实 |
| 33 | PayPay for Developers 开放 API 仅面向商户侧（Dynamic QR、Web Payment、App Invoke、Native Payment、Preauth、Continuous Payment、Refund、Cancel、Webhook 等，HMAC 认证）；未见面向钱包/发卡侧的公开 API | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 未查到 | 未核实；需打开 developer.paypay.ne.jp 确认 |
| 34 | PayPay 店铺静态码为 PayPay 专有 URL 型码（qr.paypay.ne.jp），非 EMVCo MPM 格式 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 未查到 | 未核实 |
| 35 | JPQR 由一般社団法人キャッシュレス推進協議会策定，2019-03 公布统一技术规格指南，分 CPM 与 MPM，MPM 基于 EMVCo | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2019-03 | 未核实 |
| 36 | JPQR MPM 的 Merchant Account Information tag 编号与 GUID 原文：未查到 | 低 | 未查到 | 未查到 | 需打开 JPQR 规范 PDF |
| 37 | JPQR 与老挝、泰国、越南等的联通计划：未查到 | 低 | 未查到 | 未查到 | 检索预算耗尽前未覆盖 |
| 38 | 经产省无现金比例 2024 年约 42.8%，提前达成 2025 年 40% 目标 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2025-03 | 未核实 |
| 39 | 2022 年改正资金结算法于 2023-06-01 施行，定义'電子決済手段'（第 2 条第 5 项）分 1–4 号：1 号通货建可买卖支付价值（银行/资金移动业者发行型）、2 号可与 1 号相互交换者、3 号特定信託受益権（信托型）、4 号内阁府令指定 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2023-06-01 | 未核实；建议查金融庁 |
| 40 | 電子決済手段的流通中介为'電子決済手段等取引業者'（金融庁登记） | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2023-06-01 | 未核实 |
| 41 | 资金移动业分三类：第一种（单笔>100 万日元，认可制）、第二种（≤100 万日元，登记）、第三种（≤5 万日元），2021-05 施行 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2021-05-01 | 未核实（法律常识级，但未在线核对） |
| 42 | '為替取引'依最高裁 2001 年判例定义，只有银行或资金移动业者可从事，跨境汇款亦属之 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2001-03-12 | 未核实 |
| 43 | 外国稳定币经電子決済手段等取引業者处理，需发行人受同等外国监管、取引業者负保全/补偿义务，且转移/支付每笔不超过 100 万日元 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2023-06 | 未核实；对 B2B 大额结算是关键约束 |
| 44 | SBI VC Trade 2025 年取得日本首个電子決済手段等取引業登记并开始 USDC 服务 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2025-03 | 未核实；具体日期与编号未查到 |
| 45 | JPYC 株式会社 2025-08 取得资金移动业者登记，2025-10-27 发行合规日元稳定币 JPYC（经 JPYC EX 发行/赎回，支持 Ethereum/Avalanche/Polygon） | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2025-10-27 | 未核实；最新流通规模未查到 |
| 46 | 2025 年改正资金结算法：信托型稳定币准备金可最多约 50% 投资短期国债与可解约定期存款；新设暗号资产・电子决济手段仲介业；规制跨境收纳代行；暗号资产交换业者国内保有命令 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2025-06 | 未核实；施行日期未查到 |
| 47 | 犯収法 Travel Rule 自 2023-06-01 适用于暗号資産交換業者与電子決済手段等取引業者；金额门槛未查到 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2023-06-01 | 未核实 |
| 48 | 外為法：对非居民/海外支付超过 3,000 万日元需提交支付等报告；电子决济手段被纳入支付手段，取引業者负制裁确认义务 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2023-06-01 | 未核实 |
| 49 | Project Pax：Progmat、Datachain、TOKI 推进，基于 SWIFT API 的信托型稳定币跨境汇款方案 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2024 | 未核实；SEA 通道与上线状态未查到 |
| 50 | Progmat 株式会社 2023-10 自 MUFG 信托独立，由 MUFG、SMBC、瑞穗、SBI、NTT Data、JPX、Datachain 等出资，提供 Progmat Coin（信托型稳定币）平台 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2023-10 | 未核实 |
| 51 | DCJPY 为 DeCurret DCP 的代币化存款平台，GMOあおぞらネット銀行 首发 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2024 | 未核实 |
| 52 | 三大行（MUFG/SMBC/瑞穗）据报 2025 年末获金融庁 Payment Innovation Project 支持共同发行日元稳定币 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2025-11 | 未核实 |
| 53 | SBI Remit 以 RippleNet/ODL 运营日本→菲律宾、越南、印尼等汇款通道；SBI 与 Ripple 2025 年签署在日本分销 RLUSD 的备忘录 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2025 | 未核实 |
| 54 | 日本人出国人数 2019 年约 2,008 万人，2024 年约 1,300 万人 | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2025-01 | 未核实；需 JNTO 统计 |
| 55 | 2024 年日本游客主要东南亚目的地量级：泰国约 100 万、越南约 70 万、新加坡约 50–60 万、菲律宾约 40 万、印尼约 35–40 万、马来西亚约 30–35 万（另：韩国约 320 万、台湾约 130 万） | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 2025 | 未核实，量级仅供参考 |
| 56 | 日本信用卡海外事务手续费一般约 1.6–2.2%，低于 PayPay 海外模式的 3.85% | 低 | 未核实-记忆（WebFetch 不可用且检索预算耗尽） | 未查到 | 未核实 |
| 57 | 推荐结构：INSPAY 境外实体作为 PayPay 的'海外网络事业者'，PayPay 作为资金移动业者承担用户段為替取引；PayPay→INSPAY 日元净额结算在境外完成或用信托型日元稳定币，避免境内 USDC 100 万日元/笔限制与 INSPAY 日本实体的资金移动业/跨境收纳代行问题 | 低 | 分析推导（非一手来源） | 2026-10-18 | 需日本律师意见 |

<details><summary>待确认问题</summary>

- PayPay 海外支払いモード可用哪些余额类型（PayPayマネー / マネーライト / ポイント）？前払式的マネーライト用于海外商户时 PayPay 如何履行加盟店管理义务？
- PayPay 的资金移动业类型（第一种/第二种）与登记编号；是否持有或计划申请電子決済手段等取引業登记？（建议查 PayPay 20-F 的 Regulation 章节）
- 海外支払いモード的单笔/日/月专属上限、退款时的汇率规则（原交易汇率还是退款时汇率）、冲正时限
- PayPay 与 Alipay+、HIVEX 之间的结算币种、结算周期、谁承担 FX 风险；3.85% 中网络方分成比例
- PayPay 是否愿意接入第三张跨境网络？HIVEX（TBCASoft，软银系）是否计划把 PayPay 扩展到东南亚国家码？
- INSPAY 若以日本法人收取 PayPay 日元并支付海外商户，是否构成為替取引而需第一种资金移动业认可？是否落入 2025 改正的'跨境收纳代行'规制？施行日期？
- INSPAY 以自有资金为自身结算义务兑换 JPY↔USDC/JPYC，是否构成電子決済手段等取引業？
- 外国稳定币 100 万日元/笔限制的确切适用范围（仅对用户转移？对取引業者自营/B2B 是否适用？）以及 2025–2026 年是否有放宽
- JPYC 的单笔上限执行方式与 2026 年流通规模；JPYC 是否可用于企业间大额结算
- 三大行/Progmat 信托型日元稳定币的上线时间、是否开放给非银行企业、跨境使用条件
- Project Pax 的商用状态与东南亚对接银行/通道
- JPQR MPM 的 tag 结构与 GUID 原文；PayPay 店铺码与 JPQR 的兼容性（若做日本 inbound 需要）
- JPQR Global（NETSTARS）对 QRIS/KHQR 的结算方式与 FX 定价方；日本人 outbound 扫 QRIS 的上线计划与日本侧钱包
- 日本政府（总务省/经产省/金融庁）与老挝、泰国、越南、菲律宾等的 QR 互联备忘录现状
- 犯収法 Travel Rule 是否有金额门槛；对境外非托管/托管钱包的确认义务细则
- 外為法：稳定币跨境转移的支付报告方式与 3,000 万日元门槛的计算（按笔还是合计）
- JNTO/法务省 2025 年日本人出国人数与按目的地分布（需以各接待国统计核实）
- PayPay 上市后的股权结构（SoftBank Corp./LY Corp./SoftBank Group 持股比例）及 Visa 基石投资是否附带商业合作条款

</details>

## 日本 / PayPay（核实轮）

事实 47 条（高 8 / 中 35 / 低 4）。

| # | 事实 | 置信度 | 来源 | 日期 | 备注 |
|---|---|---|---|---|---|
| 1 | SBI VC Trade 的電子決済手段等取引業登録编号为 関東財務局長 第00001号（日本第1号） | 高 | [链接](https://corp.sbishinseibank.co.jp/ja/news/news/20260430a/main/01/link/260430_AP_VC_USDC.pdf) | 2026-04-30 | 核实：原 low→high；登録日未查到（记忆为2025-03初，未核实） |
| 2 | 2024-01-01起，向国外转移电子决济手段须提交「国外電子決済手段移転等調書」，价额100万日元以下免交（国外送金等调书法政令） | 高 | [链接](https://www.mof.go.jp/tax_policy/tax_reform/outline/fy2023/seirei/youkou/16kokusoukin.pdf) | 2023 | 新增；财务省政令改正要綱；是税务报告门槛而非交易上限 |
| 3 | 2025年改正资金结算法于2025-06-06成立、2025-06-13公布；金融庁2025-12-16征求政令/府令案意见，2026-05-22公布政令与意见结果，2026-06-01施行 | 高 | [链接](https://www.fsa.go.jp/news/r7/sonota/20260522/20260522.html) | 2026-05-22 | 核实：原 low→high（施行日此前'未查到'） |
| 4 | JPYC株式会社于2025-08-18依资金结算法第37条登録为资金移动业者 | 高 | [链接](https://coinpost.jp/?p=709070) | 2025-08 | 核实：原 low→high（多源一致）；资金移动业类型（第二种）未在一手来源核实 |
| 5 | JPYC 于2025-10-27正式开始发行，同时正式发布发行/赎回平台 JPYC EX | 高 | [链接](https://ascii.jp/elem/000/004/336/4336809/) | 2025-10-27 | 核实：原 low→high；另有一则摘要称 JPYC EX 于8-18公开，表述冲突 |
| 6 | JPYC 发行上限原为每日100万日元，2026-05-15 JPYC EX 大更新后改为每次100万日元，并禁止短时间连续申请；适用于所有链；同时新增 Kaia 链（Chain ID 8217） | 高 | [链接](https://prtimes.jp/main/html/rd/p/000000315.000054018.html) | 2026-05-15 | 新增/更正种子中'单笔100万'的模糊描述 |
| 7 | PayPay为赁金数字支付的指定资金移动业者，指定编号 厚生労働大臣 第00001号，指定日2024-08-09 | 高 | [链接](https://www.mhlw.go.jp/content/11200000/001662519.pdf) | 2025 | 核实：原 low→high（厚労省 PDF） |
| 8 | 2025年访日游客确定值（JNTO）：总数42,683,301；泰国1,233,103（+7.3%）、菲律宾885,023、新加坡726,251、越南678,594、印尼640,577（+23.7%）、马来西亚636,575（+25.6%） | 高 | [链接](https://asset.japan.travel/image/upload/v1769050010/pdf/Number_of_visitor_arrivals_to_Japan_in_December_2025.pdf) | 2026-01 | 新增（反方向数据）：12月速报 PDF 为推计值，确定值取自 JNTO 统计文件摘要 |
| 9 | 资金移动业分三种：第一种无每笔上限（登録+业务实施计划认可，认可制，有滞留规制、每日计算履行保证金保全额），第二种每笔≤100万日元（登録），第三种每笔≤5万日元（登録，可用存款分别管理） | 中 | [链接](https://www.shigyo.co.jp/kyoninka/remittance/3_remittance_max_amount.html) | 未查到 | 核实：原 low→medium（行政书士专业网站，非金融庁原文）；类型由2020年改正设立、2021年施行，具体施行日2021-05-01仍未核实 |
| 10 | 改正资金结算法2022-06成立、2023-06-01施行，在第2条第5项第1–4号定义「電子決済手段」（与法币价值挂钩、承诺按券面额兑付的稳定币及准于此者）；1–3号为价值稳定、预计广泛用于送金结算者 | 中 | [链接](https://www.pwc.com/jp/ja/knowledge/prmagazine/pwcs-view/202403/49-05.html) | 2024-03 | 核实：原 low→medium；1–4号结构已确认，各号条文原文（3号=特定信託受益権）未直接看到 |
| 11 | 相关府令为「電子決済手段等取引業者に関する内閣府令」；電子決済手段等取引業者的行为规制在资金结算法62条之10至62条之17，须分别管理客户资产 | 中 | [链接](https://www.nishimura.com/sites/default/files/newsletters/file/finance_law_230807_ja.pdf) | 2023-08-07 | 核实：原 low→medium（律所解说摘要） |
| 12 | SBI VC Trade 自2025-03-26起在交易服务中取扱 USDC | 中 | [链接](https://coinpost.jp/?p=600000) | 2025-03 | 核实：原 low→medium（媒体引述 SBI 说明） |
| 13 | SBI VC Trade 自2026-03-19起提供 USDC レンディング 服务 | 中 | [链接](https://www.sbbit.jp/article/fj/182847) | 2026-03-18 | 媒体报道 |
| 14 | SBI VC Trade 2026-06改订的电子决济手段交易说明书写明可能限制外国電子決済手段的新规預託与新规購入 | 中 | [链接](https://www.sbivc.co.jp/assets/docs/comparison20260624_manual-ex_electric-payment-instrument.pdf) | 2026-06-24 | 一手文件的搜索摘要 |
| 15 | 2025改正允许特定信託受益権（信托型稳定币）准备资产运用于一定国债及可中途解约的定期存款，运用对象、上限组入比率、防止本金损失要件由府令规定 | 中 | [链接](https://www.fsa.go.jp/news/r7/sonota/20251216/20251216.html) | 2025-12-16 | 核实：原 low→medium；种子中'最多约50%'的具体比例未查到，仍为 low |
| 16 | 2025改正新设「電子決済手段・暗号資産サービス仲介業」：只做媒介、不保管客户资产，登録制，不设财务规制；解说称不直接承担 AML 义务 | 中 | [链接](https://kpmg.com/jp/ja/insights/2026/04/epis-cryptoasset-intermediary.html) | 2026-04 | 核实：原 low→medium；AML 部分来自律所/解说摘要 |
| 17 | 2025改正：为不涉及自身的交易做结算、跨境汇款的收纳代行（クロスボーダー収納代行），除府令适用除外类型外适用资金移动业规制 | 中 | [链接](https://lfb.mof.go.jp/kantou/kinyuu/pagekt_cnt_20250516001sikinidou.html) | 2025-05-16 | 核实：原 low→medium；与金融庁法案说明 https://www.fsa.go.jp/common/diet/217/02/setsumei.pdf 一致 |
| 18 | 府令案中クロスボーダー収納代行的适用除外类型：(1)再委托银行/资金移动业者、(2)伴随 escrow、(3)平台事业者等、(4)与受款人有经济一体性者、(5)由其他法令降低风险者（如国际卡组织清算） | 中 | [链接](https://amt-law.com/asset/pdf/bulletins2_pdf/260316.pdf) | 2026-03-16 | 律所对府令案的解说；最终府令是否一致未核实；对 INSPAY 日本实体是否需资金移动业登録很关键 |
| 19 | 2025改正为暗号资产交换业者与電子決済手段等取引業者引入资产国内保有命令（改正资金结算法62条之21之2、63条之16之2） | 中 | [链接](https://www.amt-law.com/asset/pdf/bulletins2_pdf/250530002.pdf) | 2025-05-30 | 核实：原 low→medium |
| 20 | JPYC 官方 GitHub 列有 Ethereum、Avalanche C-Chain 合约；用户间链上转移不设金额限制 | 中 | [链接](https://github.com/jpycoin) | 未查到 | Polygon 支持只来自记忆，未核实 |
| 21 | JPYC 取引时确认统一使用マイナンバーカード公的个人认证（JPKI）；发行流程为 JPYC EX 预约→银行转账→发行到已登记钱包 | 中 | [链接](https://www.watch.impress.co.jp/docs/news/2058390.html) | 2025-10 | 媒体报道 |
| 22 | JPYC EX 累计发行额：25亿日元（2026-05-18）、30亿日元以上（2026-06，口座1.9万）、突破100亿日元（2026-09-18）；2026-02 口座1.3万、持有地址约8万 | 中 | [链接](https://paymentnavi.com/?p=182688) | 2026-09 | 均为累计发行额；发行余额（扣除赎回）未查到 |
| 23 | JPYC 支付用例：LINE NEXT 'Unifi' 钱包可在 LINE App 内支付/送金 JPYC；Diners 积分兑换；Series B 累计约50亿日元（2026-05） | 中 | [链接](https://thebridge.jp/2026/05/jpyc-series-b-funding-50-billion-yen) | 2026-05 | 法人间大额结算数据未查到 |
| 24 | 金融庁'決済高度化プロジェクト（PIP）'第一号案件为 MUFG/SMBC/瑞穗共同发行日元稳定币的实证（三菱商事、Progmat、三菱UFJ信托参与），报道自2025-11起 | 中 | [链接](https://bitbank.cc/knowledge/breaking/article/lsu5w4vnvm1) | 2025-11 | 核实：原 low→medium（二手报道，一手新闻稿未直接看到） |
| 25 | 据日经2026-06-09报道，三大行签署 MoU（报道日期2026-06-10）设立协议会，目标在2026财年末（2027-03）前在 Progmat 上以信托型日元稳定币开始法人交易（B2B/跨境） | 中 | [链接](https://stablecoininsider.org/japans-three-largest-banks-mufg-smbc-and-mizuho-announce-joint-yen-stablecoin-targeting-march-2027/) | 2026-06-10 | 新增；二手来源，信托结构说法不一，需查三大行官方新闻稿 |
| 26 | Progmat 于2023-10从三菱UFJ信托分拆，股东包括三井住友信托、瑞穗信托等 | 中 | [链接](https://www.dextools.io/news/japan-three-megabanks-joint-stablecoin-progmat-2026-ja) | 2026-06 | 部分核实：原 low→medium；种子所列完整股东名单未逐一核实 |
| 27 | PayPay株式会社为资金移动业者，登録编号 関東財務局長 第00068号（2019-09-25登録） | 中 | [链接](https://www.lycorp.co.jp/ja/news/release/016863/) | 2024 | 核实：原 low→medium（多份公开资料一致）；第一种/第二种类别未查到原文，'第二种'仍是推定 |
| 28 | PayPay为前払式支払手段（第三者型）发行者，登録编号 関東財務局長 第00710号（2018-10-05） | 中 | [链接](https://edinetdb.jp/company/E41128/history) | 未查到 | 核实：原 low→medium |
| 29 | PayPay另有登録：電子決済等代行業（電代）第109号（2023-02）、銀行代理業（銀代）第396号（2020-11-26）、金融商品仲介業（金仲）第942号（2021-06-25） | 中 | [链接](https://edinetdb.jp/company/E41128/history) | 未查到 | 核实：原 low→medium；未查到 PayPay 持有電子決済手段等取引業登録 |
| 30 | PayPay海外支払いモード可用支付方式包括 PayPayマネーライト 与 PayPayポイント（及 PayPayクレジット） | 中 | [链接](https://paypay.ne.jp/help/c0478/) | 2025-09 | 推翻：种子 fact 25 的'未查到'；来自官方帮助页摘要，原文未打开 |
| 31 | PayPay海外支払いモード上限与国内合并计算：付款100万日元/24小时、200万日元/过去30日；未登记PayPayクレジット者50万日元/24小时；送余额（已登PayPayクレジット）30万/24h、100万/30日 | 中 | [链接](https://paypay.ne.jp/help/c0478/) | 2025-09 | 推翻：种子 fact 6 的'海外专属上限未查到/50万·200万'，实为海外与国内合算 |
| 32 | 2025年起，未完成eKYC用户的PayPayマネーライト送金（譲渡）上限为每日10万日元、每月30万日元 | 中 | [链接](https://paypay.ne.jp/notice/20241113/f-ekyc/) | 2024-11-13 | 官方公告摘要 |
| 33 | 截至2026-10检索，PayPay海外支払いモード仍只覆盖韩国（Alipay+）和台湾（HIVEX/TWQR），未见泰国、越南、新加坡、香港、夏威夷等第3弹公告 | 中 | [链接](https://www.businessinsider.jp/article/2605-cashless-travel-taiwan-paypay/) | 2026-05 | 维持 medium；基于'未检出' |
| 34 | 2026-02-12 PayPay 与 Visa 合作，分析称为 NFC 和 QR 的全球使用增加路径，首先研究美国钱包推出 | 中 | [链接](https://sacra.com/chat/h/32c22911-db91-4624-9ce7-a4744b0bdc3f/) | 2026-02-12 | 新增；二手分析，具体合作条款未查到 |
| 35 | キャッシュレス推進協議会于2019-03-29制定 JPQR「コード決済に関する統一技術仕様ガイドライン」（利用者提示型CPM、店舗提示型MPM）与统一用语集；Ver.2.0 2020-04-27（新增請求書払い）、Ver.3.0 2022-11-08 | 中 | [链接](https://www.soumu.go.jp/main_content/000844779.pdf) | 2022-11-08 | 核实：原 low→medium（总务省所载 PDF 的摘要，原文未打开） |
| 36 | JPQR MPM 采用 EMVCo 式 TLV，在 ID 26（Merchant Account Information）嵌套表示 JPQR 识别号码；总务省资料中 ID26 的 GUID 例为「jp.or.paymentsjapan」 | 中 | [链接](https://www.soumu.go.jp/main_content/000844782.pdf) | 2022 | 部分核实：原 low（未查到）→medium；另见 PayPay 博客 https://blog.paypay.ne.jp/en/paypay-adapting-to-jpqr/；子字段编号与统一店铺识别码的对应关系未确认 |
| 37 | PayPay 已适配 JPQR（工程博客'PayPay adapting to JPQR'） | 中 | [链接](https://blog.paypay.ne.jp/en/paypay-adapting-to-jpqr/) | 未查到 | 种子 fact 28（PayPay 店铺码为专有 URL 型）既未推翻也未核实，维持 low |
| 38 | 2025年日本人出国者数约1,473万人，较2019年减少27%（JNTO推计）；2025-01 91万、2025-08 165万、2025-09 139.45万、2025-12 130万 | 中 | [链接](https://www.travelvoice.jp/tags/JNTO?page=4) | 2026-01 | 核实/新增：2025年数据此前未查到；由-27%反推2019约2,018万，与种子2,008万基本一致；2024年约1,300万仍未直接核实 |
| 39 | 泰国接待日本游客：2025-Q1 316,744人，1–4月374,896人，1–5月444,274人（排第9） | 中 | [链接](https://www.nationthailand.com/news/tourism/40050808) | 2025-06 | 部分核实种子 fact 53（泰国约100万量级合理）；全年数未查到 |
| 40 | 越南接待日本游客：2025年1–5月约34.2万人（+18.3%），上半年排第5；越南2025全年国际游客约2,117万（+20.4%） | 中 | [链接](https://news.tuoitre.vn/print/vietnam-leads-global-tourism-growth-in-h1-2025-103250913105530525.htm) | 2025-09 | 部分核实种子 fact 53；全年日本客数未查到（全年总数见 https://asgam.com/2026/01/08/vietnam-books-all-time-visitor-arrival-record-in-2025-aided-by-strong-growth-from-china/） |
| 41 | 外為法：经日本境内银行等与非居民之间超过3,000万日元相当额的支付/收款须报告，经银行时由银行等提交日本银行；3,000万以下免报 | 中 | [链接](https://www.boj.or.jp/about/services/tame/index.htm) | 未查到 | 核实：原 low→medium（财务省 https://www.mof.go.jp/about_mof/other/regulation_reform/gaiyou_20211018d.pdf 与日银资料摘要） |
| 42 | 日银报告用换算汇率页面将「電子決済手段等」定义为稳定币、比特币、以太坊等（外為法第6条第1项第9号的電子決済手段及暗号資産），并提供报告用换算汇率 | 中 | [链接](https://www.boj.or.jp/about/services/tame/tame_rate/exhou.htm) | 未查到 | 部分核实种子 fact 46：表明稳定币支付在支払等報告体系内；不经银行时自行报告的细则未核实 |
| 43 | JVCEA 于2025-11制定规则，规定第一种会员（電子決済手段）依外為法办理支付与资本交易时的遵守事项 | 中 | [链接](https://jvcea.or.jp/cms/wp-content/themes/jvcea/images/pdf/F17_20251114.pdf) | 2025-11-14 | 新增 |
| 44 | 外国稳定币经取引業者转移/支付每笔不超过100万日元的府令要求 | 低 | 未查到 | 未查到 | 未核实：2次检索未找到府令原文；检索中出现的100万日元门槛是国外送金等调书法的报告门槛（另一制度） |
| 45 | 新加坡、印尼、菲律宾、马来西亚、柬埔寨、老挝2024/2025年日本人入境数 | 低 | 未查到 | 未查到 | 未查到；种子量级仍为记忆，未核实 |
| 46 | '為替取引'依最高裁2001年判例定义，只有银行或资金移动业者可从事；境外网络运营方（Alipay+等）在日本是否需要牌照 | 低 | 未核实-记忆 | 未查到 | 未核实：本轮额度不够，未检索；Alipay+在日本的牌照状况未查到 |
| 47 | 犯収法 Travel Rule 自2023-06-01适用于暗号資産交換業者与電子決済手段等取引業者 | 低 | 未核实-记忆 | 2023-06-01 | 未核实：本轮未检索；金额门槛未查到 |

<details><summary>待确认问题</summary>

- PayPay 资金移动业的种类（第一种/第二种）原文依据（20-F Regulation 章节或関東財務局登録簿）；PayPay 是否计划申请電子決済手段等取引業登録
- マネーライト（前払式）与ポイント 在海外加盟店使用时的法律属性：PayPay 如何履行前払式发行者的加盟店管理义务，是否另行构成為替取引
- 外国稳定币每笔转移/支付100万日元上限的府令条文（电子决济手段府令第30条附近？）原文、适用范围（只对用户转移，还是也适用于 B2B 与取引業者自营）及2025–2026是否放宽
- 2025改正府令最终版：特定信託受益権准备资产中国债/定期存款的上限组入比率（是否为50%）
- 2025改正府令最终版中クロスボーダー収納代行的适用除外类型是否与案文一致；QR 跨境网络的清算能否类比'国际卡组织清算'获豁免；INSPAY 日本实体做技术/营业支持而不碰资金是否安全
- 境外网络运营方（Alipay+/HIVEX/INSPAY 境外实体）与日本资金移动业者合作时是否需要日本牌照，有无金融庁事务指南、无异议函或先例
- JPYC 发行余额（扣除赎回）、资金移动业类型、企业间大额结算是否可行（每次100万日元发行上限与禁止短时连发对 B2B 的影响）
- 三大行与 Progmat 信托型日元稳定币的官方新闻稿、上线时间（2027-03目标）、是否向非银行企业（如 PayPay、INSPAY）开放、跨境使用条件
- JPQR MPM ID26 的子字段定义（Sub-ID 01以后、统一店铺识别码位置）及其他 tag 约束，需打开总务省所载 JPQR 指南原文 PDF
- PayPay 自有店铺码的格式（URL 型还是 EMVCo），与 JPQR 码在店头的并存情况
- 外為法：用稳定币链上直接转移、不经银行时的支払等報告方式（自行报告、期限）及3,000万日元按笔还是合计计算
- 新加坡、印尼、菲律宾、马来西亚、柬埔寨、老挝2024/2025年日本人入境数（各国官方统计）；泰国、越南2025全年日本人入境数
- PayPay×Visa（2026-02）合作是否覆盖东南亚 NFC/QR 受理，是否会挤压国家 QR 互联路线
- 犯収法 Travel Rule 的金额门槛与对境外钱包的确认义务细则

</details>

## Alipay+（第一轮）

事实 50 条（高 15 / 中 9 / 低 26）。

| # | 事实 | 置信度 | 来源 | 日期 | 备注 |
|---|---|---|---|---|---|
| 1 | MPP 侧 userInitiatedPay 接口为 POST /aps/api/v1/payments/userInitiatedPay：MPP 把订单码发给 Alipay+，由 Alipay+ 解码并返回支付信息；同时覆盖 MPM（用户扫商户码）与 Cashier（从商户 App/网站跳转）两类流程。 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/api_mpp/pay_private_order_code) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | 经 WebSearch 摘要与原文片段核实，未直接打开页面（WebFetch DNS 失败） |
| 2 | Alipay+ API 的所有请求参数都是 string 类型；布尔值 true 须写成 "true"。 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/api_mpp/pay_private_order_code.md) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | 官方原文片段 |
| 3 | MPP 码识别通过 Alipay+ Server SDK 完成：先调用 ac.code.service.CodeIdentificationService#init 初始化，再调用 #identifyCode；请求只有一个必填字段 codeValue（string，最长 8192 字符）。 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/sdk_mpp/identify_code) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | 官方文档摘要 |
| 4 | identifyCode 返回 isSupported 与 postCodeMatchActionType：DECODE 表示订单码，MPP 须调用 userInitiatedPay 解码；OPEN_URL 表示 MPP 须用 Alipay+ client SDK 的 launch API 打开入口码 URL；isSupported=false 时 MPP 应拒绝该码。 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/integration_merchant_mode_mpp/alipayplus_code_rules) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | 官方原文片段 |
| 5 | 码识别结果状态：S 成功，F 失败，U 未知异常（MPP 可查日志并重试）；init 返回 F/U 时会阻断应用启动。 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/sdk_mpp/identify_code) | 页面未标注日期（2026-10-18 经 WebSearch 检索） |  |
| 6 | Alipay+ 角色：ACQP（为商户处理支付的收单服务商）、MPP（TSP 模式下通常为数字钱包，示例 GCash）、TSP（为 ACQP 提供开发、测试等技术服务的机构）、Merchant。 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/integration_tsp/overview) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | 官方原文片段 |
| 7 | TSP 模式支持 AutoDebit、User-presented Mode Payment、Merchant-presented Mode Payment 三类产品。 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/integration_tsp/overview) | 页面未标注日期（2026-10-18 经 WebSearch 检索） |  |
| 8 | 在部分国家/地区，出于法律或合规原因，支付相关的商户信息须先由 ACQP 登记并经 MPP 审批，MPP 才能处理该笔支付。 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/registration_acq) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | 官方原文片段 |
| 9 | User-presented Mode（CPM）下，ACQP 调用 POST /aps/api/v1/payments/pay（ACQP→Alipay+）发起支付；同一 API 列表还包括 inquiryPayment、cancelPayment、refund。 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/integration_user_mode_acq/api.md) | 页面未标注日期（2026-10-18 经 WebSearch 检索） |  |
| 10 | UPM 中结果未知时，应使用与上次相同的 paymentRequestId 重试（幂等）；未完成的支付可调用 cancelPayment 关闭。 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/integration_user_mode_acq/accept_payment) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | 官方原文片段；超时秒数与撤销时间窗未查到 |
| 11 | ACQP 必须对 API 请求签名，并验证 Alipay+ 响应的签名。 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/integration_user_mode_acq/accept_payment) | 页面未标注日期（2026-10-18 经 WebSearch 检索） |  |
| 12 | MPP 侧 pay（UPM）：由 Alipay+ 向 MPP 发起请求，使用付款码从用户的 MPP 账户扣款。 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/api_mpp/pay) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | 官方原文片段 |
| 13 | Signature 请求头由逗号分隔的 key=value 对组成；algorithm 目前支持 RSA256（即 SHA256withRSA），值大小写不敏感。 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/api_acq_ns/signature) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | 官方原文片段 |
| 14 | 新版 API 的 Signature 请求头含 keyVersion：维护密钥版本时填最新版本号，否则填 1。 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/api_acq_unified_1.3.0_beta/signature) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | 官方原文片段 |
| 15 | Client-Id 是 Alipay+ 分配给合作方的唯一 ID，与签名密钥关联，在 Alipay+ Developer Center 的 Integration Settings 页面获取；Request-Time 为 ISO 8601 时间戳（文档示例 2019-04-04T12:08:56+05:30）。 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/api_mpp/api_overview) | 页面未标注日期（2026-10-18 经 WebSearch 检索） |  |
| 16 | 监管合规升级版 userInitiatedPay（MPP 侧）的响应含 acquirerId、pspId、codeType（有效值 ORDER_CODE）、paymentRequestId。 | 中 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/upgrading_for_regulatory_compliance_mpp/user_initiated_pay) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | WebSearch 摘要；完整字段表未读到 |
| 17 | Alipay+ 文档存在多套 API 版本并存（api_mpp、api_acq、api_acq_unified、api_acq_unified_1.3.0_beta、api_acq_older_edition、api_acq_ns、api_acq_tile、upgrading_for_regulatory_compliance_mpp 等）；同名接口（如 userInitiatedPay）在 MPP 侧是 MPP→Alipay+，在 ACQP 侧（私有订单码）是 Alipay+→ACQP。 | 中 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/api_acq_unified/pay_private_order_code) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | 由检索结果 URL 列表与摘要归纳 |
| 18 | identifyCode 的 beta 版请求类为 CodeIdentificationIdentifyRequest，增加 openId 字段用于判断用户是否在灰度比例或白名单内；该字段不发送给 Alipay+。 | 中 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/server_sdk_mpp_beta/identify_code) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | WebSearch 摘要 |
| 19 | MPP 可以通过 inquiryCodeRules API 获取 Alipay+ 码规则并在本地同步（Use Alipay+ code rules locally），以替代每次调 SDK；MPP 自家码和白名单码先由 MPP 自身业务逻辑处理。 | 中 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/integration_cashier_mpp/identify_code) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | WebSearch 摘要；码规则的具体格式未查到 |
| 20 | UPM 流程：商户扫描 MPP App 上的用户付款码并发送给 ACQP，ACQP 根据码识别 MPP 并路由支付。 | 中 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/integration_user_mode_acq/accept_payment) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | WebSearch 摘要 |
| 21 | ACQP 侧 MPM 的 entry code 与 order code 支付页面同样使用 POST /aps/api/v1/payments/pay 路径。 | 中 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/api_acq/pay_entry_code) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | WebSearch 摘要；调用方向与字段未核实 |
| 22 | ACQP 侧文档描述了私有订单码（private order code）流程：由 Alipay+ 调用 ACQP 解码 ACQP 自有格式的订单码。 | 中 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/api_acq/pay_private_order_code) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | WebSearch 摘要 |
| 23 | 待签内容由 HTTP method 与 path、Client-Id、Request-Time、原始请求 body 组成，用 SHA256withRSA 签名；必须使用原始 body，不能重新序列化 JSON。 | 中 | [链接](https://hookdeck.com/webhooks/platforms/guide-to-alipay-webhooks-features-and-best-practices) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | 二手来源（Hookdeck）；官方签名拼接格式（记忆中为 <METHOD> <URI>\n<Client-Id>.<Request-Time>.<BODY>）未核实 |
| 24 | Alipay+ 文档包含 Cashier Payment（从商户 App/网站跳转支付）、Alipay+ Gateway（网关模式）及 ACQP 侧 Tax refund（beta）等产品页。 | 中 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/gateway_tile/gateway_overview_tile) | 页面未标注日期（2026-10-18 经 WebSearch 检索） | 存在性已核实；内容未读 |
| 25 | MPP 侧 inquiryPayment、cancelPayment、refund 由 Alipay+ 调用 MPP，notifyPayment 由 MPP 向 Alipay+ 通知结果。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实；方向为推断 |
| 26 | 不能确认 consultExchangeRate / inquiryExchangeRate 是否为 Alipay+ 官方接口名。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未查到 |
| 27 | Alipay+ 支付报文中有 paymentQuote / settlementQuote 等报价对象（含 quoteId、quotePrice、quoteCurrencyPair、有效期），用户确认时锁定汇率。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实，字段名凭记忆 |
| 28 | Alipay+ 与 MPP、ACQP 分别做双边清算，按日经 SFTP 提供交易明细与结算汇总文件；结算周期 T+1 至 T+N，结算币种多为 USD 或当地币。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实 |
| 29 | cancelPayment 有时间窗（如交易当日或若干小时），超过只能 refund；退款可部分、多次，期限常见 ≤365 天。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实，行业惯例推断 |
| 30 | Alipay+ 约在 2020 年推出；Ant International 总部位于新加坡；合作钱包约 40 家、用户账户约 18 亿（不同年份口径不同）。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实，数字不可直接引用 |
| 31 | PayPay 受理支付宝及 Alipay+ 合作钱包（PayPay 作为 Alipay+ ACQP 角色），约始于 2018–2019 年。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实 |
| 32 | Alipay+ 与韩国 ZeroPay 运营方有合作，Alipay+ 钱包可在 ZeroPay 商户付款。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实，日期未知 |
| 33 | 马来西亚 PayNet 与 Alipay+ 合作，Alipay+ 钱包可在 DuitNow QR 商户付款；Touch 'n Go eWallet 是 Alipay+ MPP。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实 |
| 34 | Alipay+ 钱包能否直接扫 Thai QR/PromptPay、QRIS、QR Ph、VietQR、KHQR、JPQR：本次均未查到官方信息。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未查到 |
| 35 | DANA（印尼）、GCash（菲律宾）、Touch 'n Go（马来西亚）、TrueMoney（泰国）、Kakao Pay、Naver Pay、Toss（韩国）、AlipayHK、MPay（澳门）等为 Alipay+ 合作钱包。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 仅 GCash 作为 MPP 示例已在官方文档核实，其余未核实 |
| 36 | Ant International 的 Whale 是基于区块链的跨境资金与流动性管理平台，用于集团内部及银行间资金调拨。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实；处理比例和金额未知 |
| 37 | Ant International 是 HSBC 香港代币化存款服务（Tokenised Deposit Service）的首批企业客户（约 2025 年上半年）。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实 |
| 38 | 约 2025 年 6 月，媒体报道 Ant International 计划在香港《稳定币条例》（2025-08-01 生效）下申请稳定币牌照，并考虑新加坡等地。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实 |
| 39 | 约 2025 年 10 月，媒体报道中国内地监管要求蚂蚁、京东等暂停在香港的稳定币计划。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实；2026 年后续未查到 |
| 40 | EMVCo MPM 规范为 UnionPay 预留 Merchant Account Information tag 15–16；UnionPay International 有自有 QR 规范（MPM/CPM）。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实 |
| 41 | PayPal World 约于 2025 年 7 月宣布，互联 PayPal、Venmo、Mercado Pago、NPCI International（UPI）、Tenpay Global（Weixin Pay）。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实；上线状态未知 |
| 42 | Thunes（Direct Global Network）、TerraPay、Nium 为 B2B 跨境支付基础设施，连接钱包、银行与卡。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实；Thunes 是否有名为 Pay-by-QR 的产品未核实 |
| 43 | Kakao Pay、Naver Pay、Toss 的海外线下支付主要借道 Alipay+，部分经 UnionPay 或自建合作。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实 |
| 44 | 巴西 Pix 的 BR Code 基于 EMV MPM，tag 26 GUID 为 br.gov.bcb.pix。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实 |
| 45 | Bitget Wallet 约于 2025 年推出扫码付款，支持巴西 Pix 等本地码：由钱包的本地持牌合作方以本币支付给商户，钱包扣减用户稳定币。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实；合作方与规模未知 |
| 46 | Binance Pay、OKX、RedotPay 在巴西或东南亚有本地支付或转账功能；是否支持扫商户本地码未核实。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实 |
| 47 | Coins.ph 持 BSP 的 EMI 与 VASP 牌照，可付 QR Ph；在 BSP 沙盒中发行 PHPC 比索稳定币（约 2024 年）。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实；与 PH-MM 报告交叉核对 |
| 48 | Triple-A、FOMO Pay 持新加坡 MAS MPI 牌照，提供商户侧加密收款并兑换成法币结算。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实 |
| 49 | 巴西央行 2025 年的 VASP 规则把稳定币支付或转账纳入外汇监管。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实 |
| 50 | Visa+ 提供钱包间互转能力；卡组织在推进稳定币结算。 | 低 | N/A（凭记忆，未能在线核实） | N/A | 未核实；见 STABLECOIN-INFRA 报告 |

<details><summary>待确认问题</summary>

- 【补检优先】重新打开 docs.alipayplus.com 原文（WebFetch 本次 DNS 失败、搜索配额用尽）：MPP 侧与 ACQP 侧完整 API 列表、各接口方向、请求和响应字段表、resultCode 枚举。
- Alipay+ 官方签名拼接格式（<METHOD> <URI>\n<Client-Id>.<Request-Time>.<BODY>？）、签名值编码（Base64 + URL encode？），以及 keyVersion 轮换流程。
- UPM/MPM 的超时秒数、inquiryPayment 轮询间隔、cancelPayment 的时间窗、退款期限、部分退款次数上限。
- Alipay+ 汇率相关的官方接口名（是否存在 consultExchangeRate / inquiryExchangeRate）、报价对象字段（paymentQuote / settlementQuote?）、汇率有效期，以及谁承担 FX 风险。
- Alipay+ 清算文件格式（字段、命名、交付方式 SFTP/API）、清算周期（T+1? T+2?）、结算币种，以及与 MPP 的预付或保证金安排。
- Alipay+ 码规则（inquiryCodeRules）的数据结构：是正则、前缀，还是 EMV TLV 字段匹配？是否包含各国国家码 GUID？
- Alipay+ 与各国国家码或交换机的实际合作：韩国 ZeroPay、新加坡 SGQR、泰国 PromptPay（ITMX）、马来西亚 DuitNow（PayNet）、印尼 QRIS、菲律宾 QR Ph、柬埔寨 KHQR（NBC）、越南 NAPAS、日本 JPQR。每项需要合作方、上线日期，以及钱包是直接扫国家码还是扫商户另贴的码。
- PayPay 在 Alipay+ 中的确切角色（ACQP 受理 inbound？是否也作为 MPP 支持 PayPay 用户出境？）及其出境支付的技术合作方。
- Ant International Whale 平台的公开规模数据、链类型、参与银行，以及是否用于 Alipay+ 合作方结算。
- Ant International 香港和新加坡稳定币牌照申请的最终状态（2025 年 10 月传闻叫停后，2026 年是否有进展），以及 HKMA 首批持牌名单。
- PayPal World 的上线状态与覆盖国家；是否允许第三方钱包或网络接入。
- Thunes、TerraPay、Nium 是否提供“境外钱包扫东南亚国家码”的现成产品，以及其本地清算合作方。
- Bitget Wallet、Binance Pay、OKX、RedotPay 等的“扫本地码付稳定币”产品：在哪些国家上线、本地合作方是谁、是否持牌、交易规模，以及监管是否已有表态。
- 在禁止加密资产作为支付手段的国家（泰、印尼、越等），本地合作方以本币支付商户、境外完成稳定币扣款的模式，监管如何定性？是否需要外汇或跨境汇款报送？
- 我们的网络能否以 ACQP 等价角色直接接入各国国家码交换机？还是只能通过已是交换机参与者的银行或钱包？哪些国家只允许央行间双边安排？
- 日本侧：作为 MPP 的 PayPay 与我们网络之间，谁是“为替取引”主体？JPY→稳定币的兑换由谁完成？需与 JP-PAYPAY 报告交叉确认。
- 商户登记与 MPP 审批（Alipay+ 有此流程）在我们网络里如何实现，才能满足日本钱包对境外商户的 KYC 和制裁筛查要求？

</details>

## Alipay+ 与竞品（核实轮）

事实 49 条（高 22 / 中 25 / 低 2）。

| # | 事实 | 置信度 | 来源 | 日期 | 备注 |
|---|---|---|---|---|---|
| 1 | 韩国 ZeroPay 运营方 Korea Easy Payment Foundation 于 2023-08-31 宣布在 170 万以上商户引入 Alipay+；首批 6 个 Alipay+ 钱包（摘要列出 Alipay、AlipayHK、MPay、TrueMoney、Touch 'n Go）用户在柜台扫 ZeroPay QR、自输金额完成支付（MPM） | 高 | [链接](https://www.businesswire.com/news/home/20230831026956/en/ZeroPay-Introduces-Alipay-at-1.7-Million-Merchants-in-South-Korea-Promoting-Convenient-Experience-for-Asian-Tourists) | 2023-08-31 | 核实：原 low→high。第 6 个钱包名称未在摘要中出现；济州推广期为 11 个钱包（日期未查到） |
| 2 | PayPay 海外支付模式（2025-09-30 起）经 Alipay+ 可在韩国贴 Alipay+ 与 zero pay 标识的 200 万家以上店铺使用，ZeroPay 店铺仅支持 MPM | 高 | [链接](https://about.paypay.ne.jp/en/pr/20250916/01/) | 2025-09-16 | 引自 JP-PAYPAY 种子（high），未重复检索 |
| 3 | 柬埔寨 NBC（Bakong/KHQR）与 Alipay+ 于 2024-10 正式上线跨境 QR：12 个 Alipay+ 合作 App（含 Alipay、GCash、TnG、Kakao Pay、Toss Pay）用户可扫 KHQR 在 100 万以上商户付款；出境方向为完成全 KYC、持瑞尔账户的 Bakong 用户在 Alipay+ 全球商户付款；此前 2023 年 SFF 期间 NBC 与 Alipay+ 签 MoU | 高 | [链接](https://www.ttgasia.com/2024/10/18/alipay-facilitates-cross-border-mobile-payments-in-cambodia/) | 2024-10-18 | 核实：原 low→high。各来源的 App 数与日期略有出入；NBC 与 Ant International 另签 MoU 的日期未查到 |
| 4 | 菲律宾 PPMI（QR Ph 管理方）与 Ant International 的 Alipay+ 于 2026-09 初连通：海外游客用 Alipay+ 合作钱包扫商户现有 QR Ph 码付款，走本地银行和 EMI 共用的国家 QR 基础设施，无需本地账户，商户无需新码或新硬件 | 高 | [链接](https://fintech.global/2026/09/01/alipay-opens-philippine-merchants-to-global-shoppers/) | 2026-09-01 | 推翻种子“未查到”。开放钱包名单、是否经 InstaPay、结算行均未查到 |
| 5 | NITMX–Ant International–Krungthai 的 PromptPay 联通（2025-10-26 宣布）一期只覆盖中国内地 Alipay 用户扫 PromptPay 码，Krungthai 为结算行；截至检索未查到扩展到 Kakao Pay、TnG 等其他 Alipay+ 钱包 | 高 | [链接](https://www.businesswire.com/news/home/20251026429360/en/NITMX-Ant-International-and-Krungthai-Bank-Expand-Payment-Connectivity-Between-Thailand-and-China-via-PromptPay) | 2025-10-26 | 回答任务问题：仅 Alipay。“未扩展”属于检索未检出（medium）；另有 Nation Thailand 报道称 NITMX 与 UnionPay International、Ant（via Alipay under Alipay+）、Tenpay 建立战略合作 |
| 6 | 越南 NAPAS、Vietcombank 与 Ant International 于 2026-04-03 宣布：中国游客可在 Alipay App 中扫 VietQR Global 码，在 NAPAS 网络商户付款；Vietcombank 为结算行；CNY 与 VND 直接兑换，无中间货币；反向（越南人在中国）规划中 | 高 | [链接](https://vietnamnews.vn/economy/1778741/napas-expands-cross-border-qr-payment-connectivity-between-viet-nam-and-china.html) | 2026-04-03 | 推翻种子“未查到”。报道未提 Alipay+ 字样；未查到对其他 Alipay+ 钱包开放 |
| 7 | 印尼央行 BI 于 2026-04-30 启动 QRIS–中国双向联通：Alipay 与 UnionPay 用户可在 4,000 万以上 QRIS 商户付款，印尼用户可扫中国 8,000 万以上 Alipay/UnionPay 码；Alipay+ 为连接两个生态的技术层；在 BI 与 PBOC 指导下，由 BI、ASPI 与印尼银行/支付业界合作；WeChat Pay 仍在技术评审；中国是第 6 个接入 QRIS 的国家（另 5 个为泰、新、马、日、韩） | 高 | [链接](https://secure.businesswire.com/news/home/20260507883208/en/IndonesiaChina-Launch-Cross-Border-Payments-Connectivity-Connecting-Millions-of-Merchants-via-Ant-Internationals-Alipay) | 2026-04-30 / 2026-05-07 | 核实：原 low→high。商户数为 medium；未查到非中国 Alipay+ 钱包可扫 QRIS |
| 8 | Alipay+ ACQP 的 pay 请求含 settlementStrategy，用于指定 ACQP 希望结算的币种（settlementCurrency）；不填或为 null 时，以 paymentAmount.currency 作为 settlementCurrency；结算金额按支付金额和结算币种与支付币种之间的汇率计算 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/api_acq_ns/pay_auto_debit) | 未查到 | 官方文档原文片段（搜索摘要），未打开全文 |
| 9 | Alipay+ ACQP 清结算：每 T+1 日清算前一 UTC+8 自然日（含节假日）；结算默认 T+2（结算日须为 Common Business Day）；一个结算周期可包含多个清算周期 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/reconcile_acq/reconcile_overview) | 未查到 | 推翻种子“T+1 至 T+N”：ACQP 默认 T+2。来源为文档原文片段；WebFetch 打开该页失败（ENOTFOUND） |
| 10 | Alipay+ MPP 结算默认 T+1（结算日须为 Local Business Day）；Settlement Report 在约定结算日的 08:00（UTC+8）生成，仅在 Local Business Day 生成 | 高 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/reconcile_mpp/reconcile_overview) | 未查到 | 文档片段 |
| 11 | 2024-10-28 HSBC 与 Ant International 在 HKMA Ensemble Sandbox 完成 HKD 跨行区块链测试交易；Ant 的 Whale 平台连通 HSBC 与恒生银行网络，实现 24/7 实时跨行转账 | 高 | [链接](https://www.about.hsbc.com.hk/news-and-media/hsbc-and-ant-international-complete-hkd-denominated-cross-bank-blockchain-test-transactions) | 2024-10-28 | 新增 |
| 12 | Ant International 是 HSBC 香港 Tokenised Deposit Service 的首个企业客户（2025-05）：区块链账本上的公司账户间实时 HKD/USD 支付；首笔集团内即时调拨由 Whale 发起，Ant 存在 HSBC 的 USD 存款在 HSBC 的 DLT 上代币化 | 高 | [链接](https://www.businesswire.com/news/home/20250522743088/en) | 2025-05-22 | 核实：原 low→high |
| 13 | 卢森堡 CSSF 于 2025-09-16 向 Alipay (Europe) Limited 授予 MiCA EMT 授权（该公司 2018-12 起持 EMI 牌照）；代币为 Bettr Settlement Token（BREUR），锚定欧元，仅限获批的 Ant International 关联方之间批发使用，不上公开交易所、不对零售 | 高 | [链接](https://en.paperjam.lu/article/cssf-grants-alipay-e-money-licence-paving-way-for-euro-stablecoin) | 2025-09-16 | 新增，重要。BREUR 细节来自代币文件转载（MEXC），为 medium |
| 14 | FT（2025-10）报道 PBOC 与国家网信办指示 Ant Group 与京东暂停香港稳定币计划，理由是担心科技集团和券商发行任何形式的货币；Reuters 转述但未能独立核实；两家公司未回应；HKMA 不评论传闻 | 高 | [链接](https://fintechnews.hk/35975/blockchain/ant-group-jd-com-china-stablecoins-pause/) | 2025-10 | 核实：原 low→high（报道层面）；报道点名的是 Ant Group，未明确是否涵盖 Ant International |
| 15 | MAS BLOOM（2025-10-16）参与者含 Ant International | 高 | [链接](https://www.mas.gov.sg/news/media-releases/2025/mas-launches-bloom-initiative-to-extend-settlement-capabilities) | 2025-10-16 | 引自 SG-MY/STABLECOIN-INFRA 种子 |
| 16 | Bitget Wallet 于 2025-09-19 宣布接入巴西 Pix，与本地持牌伙伴 AEON 合作；用户用 USDT/USDC（多链）支付，商户收 BRL | 高 | [链接](https://www.pymnts.com/cryptocurrency/2025/bitget-wallet-integrates-pix-enable-crypto-payments-brazil/) | 2025-09-19 | 核实：原 low→high |
| 17 | Binance Pay 于 2025-05 接入巴西 Pix（首次接入国家支付基础设施）：用户可把 100 多种加密资产换成 BRL，经 Pix 付给任何银行账户或 Pix 商户；2023-08 已在巴西推出商户 Binance Pay | 高 | [链接](https://www.crowdfundinsider.com/2025/05/239838-binance-pay-introduces-instant-crypto-payments-to-brazil-via-pix/) | 2025-05 | 核实：原 low→high；本地出款方未查到 |
| 18 | HIVEX 是区块链驱动、面向移动支付业者的互操作跨境 QR 支付网络：允许不同 QR 格式互操作，钱包方无需采用新码格式，商户无需改 POS 或既有码；以分布式账本传输数据、建立互信 | 高 | [链接](https://fintechnews.sg/?p=117407) | 2025 | 链类型、共识机制、节点运营方、清算资产均未查到 |
| 19 | HIVEX 于 2023-08 在台湾首发，与街口支付、全支付、玉山银行合作；2023-10 上线后，台湾钱包可在日本 PayPay 商户扫码付款；2024-02 底启用日本反扫（CPM） | 高 | [链接](https://www.cna.com.tw/news/firstnews/202308230196.aspx) | 2023-08-23 | 上线与反扫时间来自 managertoday、technews，为 medium |
| 20 | 台湾财金资讯（FISC）TWQR Inbound 于 2026-04-14 开通，首波串接 PayPay，清算银行为玉山；PayPay 用户 2026-04-27 起经 HIVEX 在台湾贴 TWQR 标识的 40 万处以上店铺付款 | 高 | [链接](https://paypay.ne.jp/notice/20260427/f-overseaspayment/) | 2026-04-27 | 引自 JP-PAYPAY 种子 |
| 21 | TBCASoft 与 StraitsX（新加坡 MPI，发行 XSGD/XUSD）签署 Project HIVEX StableLink MOU：用受监管稳定币实现即时 FX 与结算终局，目标连通日本、台湾、香港、泰国、美国等法域的受监管稳定币发行方；称 HIVEX 自 2023 年起已用稳定币技术做跨境清算 | 高 | [链接](https://technode.global/2025/09/03/straitsx-partners-tbcasoft-for-multi-currency-stablecoin-driven-cross-border-payments/) | 2025-08-31 / 2025-09-03 | MOU 存在为 high；“2023 起用稳定币清算”为自述（medium）；2026 年上线或获批情况未查到 |
| 22 | JPQR Global（NETSTARS 运营）自 2025-08-17 起支持印尼 QRIS 入境（BI、ASPI、METI、PJA、Netstars 合作），日本成为首个接入 QRIS 的东盟外国家；与 Alipay+ 无关 | 高 | [链接](https://www.bi.go.id/en/publikasi/ruang-media/news-release/Pages/sp_2719325.aspx) | 2025-08-17 | 引自 ASEAN-LINK 种子；可作为“日本 ↔ 东南亚国家码”的官方框架先例 |
| 23 | Alipay+ 于 2023-04 经 NETS 接入 SGQR，覆盖约 11,000 个熟食摊，首批 6 个钱包（Alipay、AlipayHK、TnG、GCash、TrueMoney、Kakao Pay），游客直接扫 SGQR 标签 | 中 | [链接](https://fintechnews.sg/71856/payments/alipay-integrates-with-sgqr-to-enable-qr-payments-at-11000-hawkers/) | 2023-04 | 核实：原 low→medium（引自 SG-MY 种子，本次未复检） |
| 24 | PayNet × Ant：2023-10-31 起 Alipay+ 钱包（Alipay、AlipayHK、HelloMoney、Hipay、MPay、Naver Pay、Toss Pay、TrueMoney 等）可扫 DuitNow QR；Alipay+ 占 DuitNow 入境跨境 QR 支付的 80% 以上 | 中 | [链接](https://paynet.my/press-release/2023/Travellers-from-7-Key-Asian-Travel-Corridors-Can-Now-Enjoy-Seamless-Digital-Payments-in-Malaysia-More-Travel-Corridors-in-the-Pipeline.pdf) | 2023-10 | 核实：原 low→medium（引自 SG-MY 种子，本次未复检） |
| 25 | Ant International 2026-09 口径：Alipay+ 连接超过 20 亿消费者账户、50 家以上移动支付提供方、10 个以上国家支付交换机 | 中 | [链接](https://www.crowdfundinsider.com/2026/09/304558-alipay-connects-with-philippines-qr-ph-for-cross-border-payments/) | 2026-09 | 公司自述数字 |
| 26 | PayPay 作为 Alipay+ ACQP 受理入境钱包（2026-06-29 合计 17 个国家/地区 35 项服务），作为 MPP 出境（韩国经 Alipay+、台湾经 HIVEX）；PayPay 最早受理 Alipay 的年份未核实 | 中 | [链接](https://about.paypay.ne.jp/en/pr/20260629/01/) | 2026-06-29 | 入境与出境事实引自 JP-PAYPAY 种子（high）；“始于 2018–2019”仍为 low，未核实 |
| 27 | Alipay+ UPM pay 中的 settlementQuote 表示结算币种与支付币种之间的汇率 | 中 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/api_acq_ns/pay_user_presented_mode) | 未查到 | 部分核实：种子 low 条目“paymentQuote/settlementQuote”中，settlementQuote 已核实存在，子字段未读到；paymentQuote、quoteId、quoteExpiryTime 仍未查到 |
| 28 | Alipay+ MPP 侧非 SDK API inquiryForeignExchangeQuote（POST /aps/v1/payments/inquiryForeignExchangeQuote）用于查询两种货币之间的汇率，必填 sellCurrency、buyCurrency（ISO 4217），可选 paymentFactor；返回汇率仅供参考 | 中 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/api_non_sdk_mpp/inquiry_quote) | 未查到 | 推翻种子“consultExchangeRate/inquiryExchangeRate 未查到”：实际接口名为 inquiryForeignExchangeQuote。路径前缀 /aps/v1 与其他接口的 /aps/api/v1 不一致，待核 |
| 29 | Alipay+ 结算币种按合同约定；Settlement Report 给出净额，USD 以分表示；结算为扣费后净额，ACQP 承担 wallet interchange fee 与 Alipay+ service fee，从结算款中扣除；Settlement Report 不含汇率，跨币种时使用与原交易相同的汇率 | 中 | [链接](https://docs.alipayplus.com/alipayplus/alipayplus/reconcile_acq) | 未查到 | 修正种子 low 条目“结算币种多为 USD 或当地币”。文件交付方式（SFTP/API）与字段表仍未查到 |
| 30 | Ant International 称 2024 年其 treasury 转账中超过三分之一经 Whale 在链上执行；WhaleRTP 有 20 家以上银行伙伴（含 HSBC），支持 17 种以上货币实时调拨 | 中 | [链接](https://ibsintelligence.com/ibsi-news/ant-international-expands-hsbc-partnership-for-tokenised-treasury-services/) | 2026-10 | 核实：原 low→medium（公司自述数据） |
| 31 | 2026-10-06 Ant International 与 HSBC 将实时 treasury 服务扩展至中东：完成 UAE↔香港两条走廊试点，其中一条是 USD 代币化存款在 UAE 与香港、新加坡等市场之间转账，经 WhaleRTP 在 HSBC TDS 基础设施上实时执行；Ant 为 HSBC 中东首个 TDS 客户 | 中 | [链接](https://www.sttinfo.fi/tiedote/72389235/ant-international-and-hsbc-expand-real-time-treasury-management-services-to-the-middle-east) | 2026-10-06 | 新增；新闻稿级，规模未独立核实 |
| 32 | Bloomberg（2025-06）报道 Ant International 计划在香港、新加坡、卢森堡申请稳定币发行牌照 | 中 | [链接](https://www.theblock.co/post/361951/jack-ma-ant-international-circle-usdc-stablecoin) | 2025-06 / 2025-07-10 | 核实：原 low→medium（经 The Block 转述 Bloomberg） |
| 33 | Bloomberg/The Block（2025-07-10）：Ant International 与 Circle 合作，待 USDC 满足美国监管要求后接入其区块链，用于商户与银行的资金管理与结算 | 中 | [链接](https://www.theblock.co/news/business/2025-07-10-jack-ma-ant-international-circle-usdc-stablecoin-361951) | 2025-07-10 | 双方未正式证实 |
| 34 | CSSF 于 2025-05 因反洗钱缺陷对 Alipay (Europe) 罚款 €214,000 | 中 | [链接](https://en.paperjam.lu/article/alipay-bets-on-eu-stablecoin-and-why-luxembourg-matters) | 2025-05 | 新增 |
| 35 | Bitget Wallet 帮助中心列出支持的国家 QR：越南 VietQR、菲律宾 QR Ph、巴西 Pix；仅支持 Base、BNB Chain、Ethereum、Solana、Tron 上的 USDT/USDC；QR 付款为链上交易，需付 gas | 中 | [链接](https://web3.bitget.com/pt/helpCenter/193) | 未查到 | 帮助中心摘要；越南、菲律宾的上线日期与本地出款方未查到 |
| 36 | Bitget 交易所 App 的 Scan to Pay 只支持 USDT；越南最低 0.2 USD、菲律宾最低 0.05 USD，单笔上限 500 USD；需 L1 身份认证；页面声明 Bitget 在上述法域不作为支付服务提供商运营；按市场标注 VietQR (NAPAS)、QR Ph (InstaPay) | 中 | [链接](https://www.bitget.com/support/articles/12560603881473) | 未查到 | WebFetch 失败（ENOTFOUND），仅凭搜索摘要 |
| 37 | Binance Pay 于 2025-12 允许阿根廷用户在巴西用 Pix 进行加密支付（跨境扫本地码） | 中 | [链接](https://www.crowdfundinsider.com/2025/12/256097-binance-pay-allows-argentinians-to-use-pix-for-making-crypto-payments-in-brazil/) | 2025-12 | 仅凭标题与摘要 |
| 38 | RedotPay Scan to Pay 支持各国国家 QR：越南 VietQR、菲律宾 QR PH、巴西 Pix、哥伦比亚 Bre-B、秘鲁 QR Perú、坦桑尼亚 TANQR、肯尼亚 KE-QR；从加密余额支付，需 KYC；例：菲律宾单笔 ≤50,000 PHP，Pix 单笔 ≤22,000 BRL | 中 | [链接](https://helpcenter.redotpay.com/pt/articles/14133264-comece-a-usar-pagamentos-instantaneos-por-qr-code) | 未查到 | 核实：原 low→medium；上线日期与本地出款方未查到 |
| 39 | RedotPay 2026-08 招聘信息显示，海外 Scan to Pay 业务计划连接 SGQR、UPI、PromptPay、DuitNow 等国家 QR 标准（尚未上线） | 中 | [链接](https://jobs.accel.com/companies/redotpay-2/jobs/90481068-product-lead-scan-to-pay) | 2026-08 | 招聘信息只反映计划 |
| 40 | OKX SG 于 2025-09 在新加坡 GrabPay 商户推出 USDC/USDT 支付，先兑换成 XSGD，商户收 SGD | 中 | [链接](https://www.nst.com.my/amp/business/corporate/2025/09/1284336/okx-singapore-launches-stablecoin-payments-local-grabpay) | 2025-09 | 引自 SG-MY 种子 |
| 41 | TBCASoft 为美国公司，2016 年由吴陵（Ling Wu）创立；股东或战略投资方包括软银、Naver、富士康、远传电信 | 中 | [链接](https://www.gvm.com.tw/article/116425) | 未查到 | 多来源一致（fintechnews、managertoday、gvm），未读原文 |
| 42 | 2026-02-03 台新 Pay+ 与全盈+PAY 开通日本 PayPay 服务（经 HIVEX）；HIVEX 台湾参与方另有一卡通 iPASS MONEY | 中 | [链接](https://www.ctee.com.tw/news/20260203701784-430303) | 2026-02-03 | 工商时报摘要 |
| 43 | 2025-09 起 Weixin Pay（微信支付）用户可经 HIVEX 在日本 PayPay 商户扫码付款 | 中 | [链接](https://finance.technews.tw/2025/09/07/paypay/) | 2025-09-07 | 台湾媒体摘要 |
| 44 | 全支付与韩国 ZeroPay、ICB 合作，经 HIVEX 系统推出跨境支付（2025） | 中 | [链接](https://www.managertoday.com.tw/topic/view/198/post/70566) | 2025 | 方向与上线细节未查到 |
| 45 | TBCASoft 与 RCBC 及本地网关 Novus Technologies 合作，把 HIVEX 跨境 QR 连接引入菲律宾 | 中 | [链接](https://www.digitimes.com/news/a20231128PR200.html?chid=9) | 2023-11-28 | 是否覆盖 QR Ph、是否已上线未查到 |
| 46 | StraitsX × Ant International（Alipay+）× Grab（2024-11-05）：后台以 XSGD + Purpose Bound Money 在 Avalanche 上清结算，商户实时收 SGD | 中 | [链接](https://www.straitsx.com/case-study/alipay-grab) | 2024-11-05 | 引自 SG-MY 种子；StraitsX 同时是 Alipay+ 与 HIVEX 的稳定币伙伴 |
| 47 | Alipay+ 在“全钱包开放”的国家（韩、新、马、柬、菲）以国家交换机或码运营方作为受理侧接入；在泰、越、印尼则只开放中国 Alipay（央行间双边框架、本币直接兑换、本地结算行） | 中 | [链接](https://www.businesswire.com/news/home/20251026429360/en/NITMX-Ant-International-and-Krungthai-Bank-Expand-Payment-Connectivity-Between-Thailand-and-China-via-PromptPay) | 2026-10-18（归纳） | 根据本表各条已核实事实归纳；“泰、越、印尼不对其他钱包开放”属于未检出，不是官方否定 |
| 48 | HKMA 预期 2026 年发出首批稳定币牌照；有报道标题称香港错过 3 月目标；Ant 是否获香港牌照未查到 | 低 | [链接](https://cointelegraph.com/news/hong-kong-missed-march-target-stablecoin-licenses) | 2026 | 仅凭搜索结果标题，未读到正文 |
| 49 | Alipay+ 于 2026-04 推出 AI agent 支付协议 AMP，一期 10 个钱包、7 个收单方支持 | 低 | [链接](https://www.finextra.com/company-news/4979/ant-group) | 2026-04 | 来自搜索综述片段，原文未读到，未核实 |

<details><summary>待确认问题</summary>

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

</details>

## 东盟互联 / Nexus

事实 60 条（高 29 / 中 25 / 低 6）。

| # | 事实 | 置信度 | 来源 | 日期 | 备注 |
|---|---|---|---|---|---|
| 1 | Bank Indonesia 于 2026-02 初由 Nexus 特别观察员转为 Nexus Global Payments 正式成员，下一步把本国即时支付系统接入 Nexus | 高 | [链接](https://www.bi.go.id/en/publikasi/ruang-media/news-release/Pages/sp_282426.aspx) | 2026-02-02 | 核实：解决 ASEAN-LINK 种子中“印尼加入 vs 仍为观察员”的冲突（原 medium→high）。另见 fintechnews.sg/125444 |
| 2 | NGP 2026-02-09 任命 PayNet–NETS 合资公司为 Nexus Technical Operator，Endava 负责工程、AWS 提供云；技术开发 2026 年初开始，目标 2027 年上线（2024 年 BIS 原目标为 2026 年） | 高 | [链接](https://www.businesswire.com/news/home/20260209818123/en/Nexus-Global-Payments-Appoints-Technical-Operator) | 2026-02-09 | 种子已为 high，本轮未重复检索；本轮检索摘要未在 BI 原文中看到 2027 字样 |
| 3 | Nexus 中，SAP 为非该 IPS 成员的第三方 FXP（及部分外国 PSP）提供账户；SAP 只处理本国货币、不做换汇；SAP 必须是至少一个国内 IPS 的成员（即须为 PSP）；Nexus 不指定 SAP，由 FXP 或外国 PSP 自选 | 高 | [链接](https://docs.bis.org/nexus/settlement-access-provision/role-of-the-settlement-access-provider-sap) | 未标注（BIS 文档，检索于 2026-10） | 核实：原 low→high（WebSearch 摘要直接引用 BIS 文档原文；WebFetch DNS 失败） |
| 4 | Nexus 首版支持 pacs.008、pacs.002、acmt.023、acmt.024 报文；acmt.023/024 用于别名解析（身份核验请求与报告）；pacs.008 引用 FXP 在源国和目标国 SAP 处持有的账户；Nexus 规范未覆盖之处遵循 CPMI 协调的 ISO 20022 数据要求 | 高 | [链接](https://docs.bis.org/nexus/messaging-and-translation/general-usage-of-iso-20022/adherence-to-cpmi-harmonised-iso-20022-data-requirements) | 未标注（检索于 2026-10） | 核实：ASEAN-LINK 种子原 low→high |
| 5 | Nexus 第三方 FX Provider 须为持牌、受监管实体，但不必是银行或非银 PSP；满足资格并遵守 Nexus Scheme 的 FXP 均可提供 FX；有的国家只允许银行加入 IPS，非银 FXP 须经 SAP 间接接入；资格可能因国而异 | 高 | [链接](https://docs.bis.org/nexus/fx-provision/role-of-the-fx-provider) | 未标注（检索于 2026-10） | 另见 https://docs.bis.org/nexus/fx-provision/accessing-instant-payment-systems ；docs 声明 Nexus 尚未运营、设计可能调整 |
| 6 | Nexus 支付范围为账户到账户的 P2P/C2C、B2B、P2B、B2P，由付款人在 PSP App 中输入别名或账户信息发起；每条 pacs.008 只含单笔交易，不接受批量 | 高 | [链接](https://docs.bis.org/nexus/payment-setup/scope-of-nexus-payments) | 未标注（检索于 2026-10） | 未见 EMVCo 商户 QR 流程 |
| 7 | 印尼 QRIS 与新加坡 NETS QR 跨境联通于 2023-11-17 在新加坡金融科技节由 BI 行长 Perry Warjiyo 与 MAS 董事总经理 Ravi Menon 现场启动，双向；BI–MAS 另设 IDR/SGD 本币结算框架配套 | 高 | [链接](https://www.bi.go.id/en/publikasi/ruang-media/news-release/Pages/sp_2531023.aspx) | 2023-11-17 | 核实：SG-MY 种子原 low→high |
| 8 | 印尼–韩国 QRIS 跨境联通 2026-04-01 正式运营，参与方为 BI、BOK、ASPI、KFTC 及参与机构；在 LCT 框架下 IDR/KRW 直接兑换、不经美元；首期为印尼人在韩国用本国 App 付款 | 高 | [链接](https://www.bi.go.id/en/iru/highlight-news/Pages/Indonesia-and-South-Korea-Officially-Connect-with-QR-Payments,-Enabling-More-Convenient,-Affordable-and-Faster-Cross-Border.aspx) | 2026-04 | 另见 indonesiabusinesspost 6424、crowdfundinsider 2026-04；Bisnis 2026-03-19 标题称韩国居民仍在等待（反向未上线） |
| 9 | 柬埔寨–日本跨境 QR 2025-07-04 在大阪启动：一期 Bakong、ACLEDA mobile、Sathapana mobile 用户可在日本扫 JPQR；二期将让 JPQR 侧用户扫 KHQR | 高 | [链接](https://fintechnews.sg/113469/cambodia/cambodia-japan-qr/) | 2025-07 | 推翻/修正：JP-PAYPAY 种子写 2025-07-05（paymentnavi，可能为实际可用日）；ASEAN-LINK“日本唯一国家级联通是 QRIS”被推翻。另见 b2b-cambodia、paymentsjapan.or.jp/?p=18380；二期上线未查到 |
| 10 | 越南 NAPAS、Ant International、Vietcombank 2026-04-03 扩展越中 QR 联通：中国游客用 Alipay 在 NAPAS 网络商户付款，Vietcombank 为结算行，RMB–VND 直接兑换；越南出境方向由 Sacombank 与 NAPAS 计划 2026 年完成 | 高 | [链接](https://en.napas.com.vn/napas-expands-cross-border-qr-payment-between-vietnam-and-china-18426041513535516.htm) | 2026-04 | 反向见 https://www.sacombank.com.vn/en/home/news/sacombank-news/2026/sacombank-pioneers-cross-border-qr-payment-connectivity-between-vietnam-and-china.html |
| 11 | 越南–韩国跨境 QR 服务 2026-04-23 正式上线，由 NAPAS 与 GLN International、BIDV、Hana Bank 组织，SBV 副行长出席；韩国游客可在越南扫码付款 | 高 | [链接](https://www.sbv.gov.vn/w/cross-border-qr-payment-service-between-vietnam-and-south-korea-officially-launched-1) | 2026-04-23 | 结算行角色未明示 |
| 12 | 越南–柬埔寨跨境 QR 联通 2023-12-03 在暹粒正式启动（MoU 2022-11-08）；柬埔寨人可在越南经 VietQR 以瑞尔付款，越南人可在柬埔寨经 KHQR 以越南盾付款 | 高 | [链接](https://vietnamnews.vn/economy/1637543/viet-nam-cambodia-launch-cross-border-qr-payment-link.html) | 2023-12 | 核实：ASEAN-LINK 种子原 low→high |
| 13 | 马来西亚–柬埔寨跨境 QR 联通一期 2024-09-19 由 BNM 与 NBC 启动（柬→马），二期 2025-04 上线（马→柬） | 高 | [链接](https://www.bnm.gov.my/-/khqr-pr) | 2024-09-19 | 种子一期写 2024-09，本轮细化到日；二期见 https://www.bis.org/review/r250409e.htm |
| 14 | 印度 UPI 与柬埔寨 KHQR 联通 2026-06-02 在金边上线，为 NIPL 与 ACLEDA Bank Plc. 合作的一期：印度 UPI App 用户可在 450 万+ 柬埔寨商户付款；二期让柬埔寨游客在印度付款 | 高 | [链接](https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62857) | 2026-06 | 另见 medianama 2026-06；同期 UPI–尼泊尔 NPI（P2P）2026-06 上线、UPI–乌兹别克 UZQR 2026-08-30 签约（low） |
| 15 | MAS 与 BSP 于 2021-11 签署加强版金融科技合作协议，推进两国实时支付与 QR 支付系统联通 | 高 | [链接](https://www.mas.gov.sg/news/media-releases/2021/mas-and-bsp-to-pursue-cross-border-payment-linkages) | 2021-11 | 截至 2026-10 未查到上线 |
| 16 | DuitNow 官方：跨境 QR 入账商户账户为 MYR；退款受商户政策约束；收单方可能有不同费率结构。Alliance Bank：商户费率与本地 QR 相同 | 高 | [链接](https://duitnow.my/Cross-Border/index.html) | 未标注 | 另见 https://www.alliancebank.com.my/digital/business-banking/Trade-Digitally/alliance-bizsmart-qr_duitnow_cross_border-qr |
| 17 | 泰–新 PromptPay–PayNow P2P 2021-04-29 上线，上限 S$1,000 或 THB25,000/日 | 高 | [链接](https://www.bot.or.th/en/news-and-media/news/news-20210429.html) | 2021-04-29 | 引用种子 high，未重复检索 |
| 18 | 泰–马跨境 QR 一期 2021-06-18（泰国用户扫 DuitNow），PayNet 与 NITMX 运营，CIMB Group 与 CIMB Thai 为跨境结算行；马方出境 RM3,000/笔 | 高 | [链接](https://www.bot.or.th/en/news-and-media/news/news-20210618.html) | 2021-06-18 | 引用种子；日限额按银行 RM10k–50k（medium） |
| 19 | 泰–印尼 QR 2021-08-17 试点（双向：印尼用户扫 Thai QR，泰国用户扫 QRIS），2022-08-29 进入实施阶段（76 家机构） | 高 | [链接](https://www.bot.or.th/en/news-and-media/news/news-20210817-2.html) | 2021-08-17 | 种子 high；本轮检索再次确认了双向 |
| 20 | 泰–老 QR：2024-04-03 一期（老挝用户扫泰国码），2024-06 底二期（泰国用户扫 LAO QR）；NITMX 与 LAPNet 运营；结算行 KBank、BCEL | 高 | [链接](https://www.bot.or.th/en/news-and-media/news/news-20240403.html) | 2024-04-03 | 引用种子 |
| 21 | 泰–中 QR 2025-10-30 上线：NITMX 连 Alipay、UnionPay、WeChat Pay，结算行 Bangkok Bank、Krungthai；首批只能扫 6 家银行的商户码 | 高 | [链接](https://www.bot.or.th/en/news-and-media/news/news-20251030.html) | 2025-10-30 | 引用种子 |
| 22 | PromptPay × 香港 FPS 2023-12-04 上线，双向扫码，HKICL 与 NITMX 运营；报道称结算行为 HSBC、Bangkok Bank，香港用户上限 HK$10,000/日 | 高 | [链接](https://www.hkma.gov.hk/eng/news-and-media/press-releases/2023/12/20231204-3/) | 2023-12-04 | 引用种子；结算行与限额为 medium |
| 23 | 泰–日：泰国游客在手机银行生成 MyPrompt QR（CPM），日本商户扫码；由泰国商业银行与日本服务商在 BOT 支持下建立，仅泰国人出境方向 | 高 | [链接](https://www.bot.or.th/en/financial-innovation/digital-finance/digital-payment/cross-border-payment.html) | 2026-05 | 引用种子；Krungsri 限额 THB10 万/笔、50 万/日（medium） |
| 24 | 柬–老跨境 QR：一期 2023-08（ACLEDA Bank Plc. 与 ACLEDA Bank Lao 为结算行），二期 2025-12-19 老挝用户可扫 KHQR | 高 | [链接](https://www.nbc.gov.kh/english/news_and_events/news_info.php?id=877) | 2025-12-19 | 引用种子 |
| 25 | 越–老跨境 QR 2025-01 上线：越南用户扫 LaoQR，7 家越南银行、14 家老挝银行，LAK/VND 本币按实时汇率；反向为后续阶段 | 高 | [链接](https://vietnamnews.vn/economy/1690482/seven-banks-allow-customers-to-pay-by-qr-codes-in-laos.html) | 2025-01-11 | 引用种子 |
| 26 | UnionPay International（银联，非印度 UPI）与 LAPNet 2024-12-19 启动 QR 互联，银联系钱包可扫 Lao QR | 高 | [链接](https://www.globenewswire.com/news-release/2024/12/25/3001834/0/en/Lao-QR-Merchants-Now-Accept-Payments-by-UnionPay-Powered-Wallets-UnionPay-International-and-LAPNet-Launch-Payment-Linkage.html) | 2024-12-25 | 引用种子；提醒不要与印度 UPI 混淆 |
| 27 | 马–新 DuitNow QR ↔ NETS QR 2023-03-31 上线，双向 | 高 | [链接](https://www.bnm.gov.my/-/qrcode-connectivity-my-sg) | 2023-03-31 | 引用种子 |
| 28 | PayNet 与 NPCI International 2026-02 签约：一期印度游客用 UPI 扫 DuitNow，二期马来西亚人在印度扫 UPI QR；截至检索未确认上线 | 高 | [链接](https://paynet.my/about-us/media-centre/press-release/payments-network-malaysia-and-india-npci-international-sign-agreement-to-enable-cross-border-qr-payments.html) | 2026-02 | 签约事实 high；上线未查到 |
| 29 | PayNow 跨境 P2P 有 UPI、DuitNow、PromptPay 三条走廊，2025 年跨境约 S$3.71 亿 | 高 | [链接](https://www.mas.gov.sg/news/media-releases/2026/mas-and-abs-chart-instant-payments-enhancements-with-paynow-generation-2-study) | 2026-06-25 | 引用种子；PayNow–UPI 上线日 2023-02-21 与限额为记忆（low，未核实） |
| 30 | 截至 2025-12，东盟区域内及与外部伙伴共建立 29 条 QR 支付与 P2P 即时支付联通；2025 年跨境 QR 3,620 万笔/7.164 亿美元，P2P 160 万笔/3.057 亿美元；东盟在推进 Roadmap for Instant Payment Connectivity 并完成 regulatory comparison dashboard | 中 | [链接](https://theedgemalaysia.com/node/687012) | 2026（第13届AFMGM） | 媒体转述联合声明，未见原文；29 条逐条清单未查到。另见 https://fintechnews.sg/129690/payments/asean-qr-payments/ |
| 31 | ECB 继续研究与 Nexus 连接的可行性；NGP 与拉美储备基金（FLAR）签 MoU，探索与其成员国连接 | 中 | [链接](https://fintechnews.sg/125444/payments/nexus-global-payments-indonesia/) | 2026-02 | 二手媒体 |
| 32 | BIS Nexus 宣传册称 Nexus 用例将超越 A2A，扩展到 QR 商户支付等功能（未给时间） | 中 | [链接](https://bis.org/innovation_hub/projects/nexus_brochure.pdf) | 未查到 | 推翻：上一轮“未查到 Nexus P2M 计划”的说法需修正为“有方向、无时间表” |
| 33 | BIS Nexus 报告设想每个 Nexus Gateway 默认云托管，并可为多个 IPS 处理支付；报告含 Reference data、Proxy、Payment、FX service 等章节 | 中 | [链接](https://www.bis.org/publ/othp62.pdf) | 2023（BIS othp62） | 仅见目录和摘要 |
| 34 | 截至 2026-04 初，QRIS 跨境入境交易约 590 万笔，印尼人出境交易约 170 万笔 | 中 | [链接](https://indonesiabusinesspost.com/6424/markets-and-finance/indonesia-south-korea-operationalize-cross-border-qris-payments) | 2026-04 | 媒体报道 |
| 35 | BI 于 2026-04-30 启动 QRIS 跨境中国实施：双向，印尼 QRIS App 可在中国扫 Alipay 与 UnionPay 码，反之亦然 | 中 | [链接](https://investortrust.id/macro/101858/bi-luncurkan-qris-antarnegara-china-dapat-digunakan-mulai-30-april-2026) | 2026-04 | 印尼媒体；结算行与 FX 未查到 |
| 36 | BI 2026 年目标是与 8 个国家合作 QRIS 跨境，另提及印度（密集磋商）、香港、东帝汶（2026-05）及沙特（2025-10） | 中 | [链接](https://pasardana.id/news/2026/5/21/bi-targetkan-tahun-ini-qris-bisa-dipakai-di-india-hingga-timor-leste) | 2026-05-21 | 计划，未上线 |
| 37 | QRIS 日本方向：2025-08-17 起印尼用户扫 JPQR Global（BI、ASPI、METI、PJA、Netstars）；2026-03 BI 称其与“日本 switching 公司 Netstars”已取得双向交易所需许可，但首期只做印尼出境；2026-04-22 BI 副行长 Filianingsih 称已获日本 FSA 许可实施日本游客在印尼使用（Indonesia inbound），“很快”上线 | 中 | [链接](https://www.metrotvnews.com/read/N6GCVl8e-turis-jepang-bisa-iscani-qr-saat-belanja-di-ri-qris-segera-berlaku) | 2026-04-22 | 截至检索未见日本→印尼方向的正式上线公告；Bisnis 2026-03-19 标题与此矛盾：https://ekonomi.bisnis.com/read/20260319/9/1961425/turis-jepang-bisa-gunakan-qris-warga-korsel-masih-menunggu |
| 38 | 2026-08 报道称柬埔寨已与五个东盟国家建立双边跨境 QR 联通：老挝、马来西亚、新加坡、泰国、越南 | 中 | [链接](https://en.vietstock.vn/2026/08/cambodia-expands-asean-cross-border-qr-payment-links-52000-640103.htm) | 2026-08 | 柬–新联通的细节与日期未查到（low） |
| 39 | 柬埔寨 Bakong 与 Ant International 的 Alipay+ 于 2024-10 启动跨境 QR 支付（中国等 Alipay+ 钱包入柬） | 中 | [链接](https://ibsintelligence.com/ibsi-news/alipay-launches-khqr-to-facilitate-cross-border-payments-into-cambodia) | 2024-10 | 二手媒体 |
| 40 | 菲律宾 BSP 称 2026 年内上线与马来西亚的联通：马来西亚 DuitNow 用户扫菲律宾 QR，经 InstaPay 桥接到马来西亚系统；该项目与 Nexus 并行推进 | 中 | [链接](https://www.philstar.com/business/2026/02/01/2504833/bsp-roll-out-cross-bank-auto-debit-year/amp/) | 2026-02-01 | 计划；截至检索未查到上线。QR Ph 无任何已上线国家级跨境联通 |
| 41 | 2026-07 RCBC、HIVEX（TBCASoft）与 Novus 签 MOU，探索菲律宾跨境 QR 连接，让 HIVEX 钱包用户在海外 HIVEX 受理市场（日本、韩国、台湾、中国及其他东南亚国家）付款 | 中 | [链接](https://diskartech.ph/?p=2927) | 2026-07 | MOU 阶段；HIVEX 是 INSPAY 的直接竞品 |
| 42 | TWQR Inbound 于 2026-04-14 正式启用，首波合作对象为日本 PayPay 与新加坡 NETS；FISC 计划拓展东南亚、港澳、韩国的 Inbound | 中 | [链接](https://ctee.com.tw/news/20260415700113-430301) | 2026-04-15 | 新增：新加坡 NETS→台湾这条线；种子只记录了 PayPay |
| 43 | 台湾央行《金融稳定报告》（2026-05）：FISC 自 2021 年推动 TWQR 跨国购物，出境（Outbound）已在日本、韩国提供服务 | 中 | [链接](https://www.cbc.gov.tw/dl-227220-2de59958b3454ab8abf2101bb780c458.html) | 2026-05 | 官方报告，OCR 有缺字 |
| 44 | HIVEX 跨境支付平台 2025-01 在韩国上线；2024-10 台湾玉山银行、街口、全支付经 HIVEX 与 PayPay 合作，让台湾用户在日本 PayPay 商户付款 | 中 | [链接](https://technews.tw/2024/10/20/hivex-paypay/) | 2024-10-20 | 韩国上线日期来自检索摘要 |
| 45 | 截至检索，PayPay 海外支払いモード只覆盖韩国（Alipay+，2025-09-30）和台湾（HIVEX/TWQR，2026-04-27）；未查到泰、越、港、新等新增；2026-06-29 的越南、泰国名字属于入境（MoMo、VCB Digibank、Zalopay、ShopeePay（新、泰）、SCB Planet Plus 经 Alipay+ 在 PayPay 商户付款） | 中 | [链接](https://paypay.ne.jp/notice/20260427/f-overseaspayment/) | 2026-04-27 | 基于检索未见；入境清单见 https://about.paypay.ne.jp/en/pr/20260629/01/ |
| 46 | 马来西亚出境 DuitNow 跨境 QR：外币交易按 PayNet 设定的汇率、在交易入账日换算为 MYR（CIMB FAQ） | 中 | [链接](https://cimb.com.my/en/personal/help-support/faq/mobile-banking/cimb-octo-app/duitnow-qr/cross-border-qr/what-is-the-foreign-exchange-rate-that-is-being-used-for-duitnow-cross-border-qr-cbqr-payment.html) | 未标注（检索于 2026-10） | 与 TH-LA 种子“汇率由付款方银行/钱包报价”的表述有张力：可能是 PayNet 取价后银行执行 |
| 47 | DuitNow 跨境 QR 退款须向外国商户申请；退款金额可能与原付款不同，因为 PayNet 汇率在购买与退款之间会变动 | 中 | [链接](https://www.hlb.com.my/content/dam/hlb/my/images/Personal/duitnow/hlb-duitnow-qr-faq.pdf) | 未标注 | 银行 FAQ；推断退款按退款时汇率反向贷记 |
| 48 | 马–印尼 QR 联通：试点 2022-01-27，商用 2023-05-08；汇率由 LCS 框架下的 ACCD 银行提供 | 中 | [链接](https://selangorjournal.my/2023/05/malaysia-indonesia-launch-cross-border-qr-payment-linkage/) | 2023-05-08 | 引用种子 |
| 49 | Wise 2026-07-30 宣布直连 PayNet（全球第 9 个直连的本地支付系统），支持扫 DuitNow QR 与 DuitNow 转账 | 中 | [链接](https://newsroom.wise.com/en-CAS/268696-wise-connects-directly-to-paynet-malaysia-s-national-payments-network/) | 2026-07-30 | 引用种子；是外国非银网络直连国家交换机的先例 |
| 50 | 日本财务省与 BNM 2026-09-15 签署本币结算合作备忘录 | 中 | [链接](https://www.businesstoday.com.my/2026/09/15/malaysia-japan-deepen-financial-ties-with-local-currency-push-us6-billion-swap-deal/) | 2026-09-15 | 引用种子；对日元→林吉特 FX 通道有意义 |
| 51 | PayNet FAQ：商户开通 DuitNow QR 受理即自动受理跨境 QR、按 MYR 入账；入境来源国为印尼、新加坡、泰国、中国、柬埔寨、韩国；韩国 BC Card 一期入境已上线 | 中 | [链接](https://knowledgebase.paynet.my/hc/en-us/articles/49748850759577-Frequently-Asked-Questions-FAQs) | 2026 | 引用种子 |
| 52 | 东盟双边联通没有公开的接口或报文规范；Nexus 的完整设计文档公开在 docs.bis.org/nexus，是唯一公开的跨境 IPS 互联规范 | 中 | [链接](https://docs.bis.org/nexus/introduction) | 检索于 2026-10 | 双边部分属于“未查到”的推断 |
| 53 | 日本未见加入 Nexus 或成为观察员的计划 | 中 | [链接](https://www.bi.go.id/en/publikasi/ruang-media/news-release/Pages/sp_282426.aspx) | 2026-02 | 基于成员、观察员名单与检索未见日本相关报道 |
| 54 | DuitNow QR 内无跨境专用字段，跨境体现在交易码 031（cross-border POS）、521（cross-border account enquiry）；SGQR 无跨境专用 GUID，境外钱包解析 SG.COM.NETS 载荷后经本国交换机转发 NETS | 中 | [链接](https://github.com/deadboy18/malaysia-pay-kit/blob/main/docs/paynet-developer-docs.md) | 2026-05-04 | 引用种子（第三方整理的 PayNet 开发者文档） |
| 55 | Netstars FY2025 资料称为入境需求连通了印尼与柬埔寨，并称卡塔尔门店数较 2023 年增 112.2% 至 3,000+ | 低 | [链接](https://envalith.com/en/companies/5590/reports/019c5146-a5cb-7621-b72c-3c21a9486d15) | 2026（FY2025 决算） | 第三方财报摘要，需对照 Netstars 决算说明资料原文 |
| 56 | DuitNow QR 与日本 JPQR 互通：2024 年报道称“2025 财年实现”，截至 2026-10 检索未查到上线证据 | 低 | [链接](https://www.imoney.my/articles/duitnow-payment-japan-cashless-travel) | 2024-03 | 仅计划；IDE 政策简报（2025-04）称日本目标 2025 财年与更多东盟国家实现 QR 互操作 |
| 57 | 有报道称 Reuters 2026-02 报道印度当局与 RBI 正与 Ant International 的 Alipay+ 磋商 | 低 | [链接](https://www.medianama.com/2026/06/223-india-launches-upi-qr-payments-cambodia/) | 2026-06 | 转述，未核实 |
| 58 | 第三方 HitPay 称马来西亚商户的跨境到账以 MYR 按 T+2 结算 | 低 | [链接](https://hitpayapp.com/blog/cross-border-payments-malaysia) | 未标注 | 单一第三方说法，与具体收单合同有关 |
| 59 | 阿联酋 Aani/Jaywan（Al Etihad Payments，央行子公司）未查到与任何东盟国家的跨境 QR 联通；2026-07 银联与阿联酋央行、Al Etihad Payments、中银阿布扎比签 3 份 MoU（国家 QR 互操作、Jaywan 全球受理、跨境结算） | 低 | [链接](https://www.thenationalnews.com/business/banking/2026/08/03/uae-expands-federal-payment-channels-with-aani-and-jaywan/) | 2026-08-03 | 银联 MoU 来自聚合站摘要；维基 QRIS 条目称截至 2024-08 印尼与阿联酋签过 MoU（未核实） |
| 60 | 马来西亚–越南 DuitNow–VietQR 直连：2023 年报道称“即将”，截至检索未查到上线 | 低 | [链接](https://technave.com/tag/Malaysia-Vietnam-QR-payment-cross-border) | 2023-08 | 基于未见 |

<details><summary>待确认问题</summary>

- 东盟官方“29 条联通（截至 2025-12）”的逐条清单是什么？2026 年新增（ID–KR、ID–CN、VN–CN、VN–KR、IN–KH 等）是否已计入新的官方口径？需要第 13 届 AFMGM 联合声明原文或 ASEAN Secretariat 文件。
- QRIS 的“日本游客在印尼付款”方向是否已在 2026-05 至 10 月间正式上线？日本侧发卡方是谁（PayPay？银行 App？Netstars 自有钱包？）FSA 许可的具体形式是什么（资金移动业的哪类业务）？
- KHQR–JPQR 二期（JPQR 侧用户扫 KHQR）的时间表和日本侧发卡方；Netstars 是否愿意引入第三方 FX、结算或稳定币清算服务商？
- JPQR Global 码与普通 JPQR 的结构差异（GUID、tag）；Netstars 在 QRIS、KHQR 联通中的确切角色（交换机、收单聚合方还是结算方）及其持有的牌照。
- QRIS–JPQR、QRIS–KFTC、QRIS–中国线的 FX 报价方、结算行、结算周期；是否使用 BI 与日本财务省的 JPY/IDR LCT 框架？
- 各联通的游客限额：多数东盟国家对（ID–SG、VN–KH、ID–KR、VN–KR、IN–KH 等）的单笔和日限额均未查到。
- 泰–柬、柬–新联通的准确上线日期、方向与运营方；泰–越 2021-03-26 联通各方向的上线阶段。
- 马来西亚–菲律宾（DuitNow–QR Ph/InstaPay）是否已在 2026 年内上线？菲律宾侧交换机（BancNet/InstaPay）对私营跨境网络的接入政策是什么？
- NGP 规则书（Nexus Scheme Rulebook）何时公开？FXP 资格的国别差异、是否允许稳定币用于 FXP 头寸再平衡、P2M 路线图时间表、非成员国（日本）接入条件。
- 2027 年 Nexus 首批上线的三个国家是哪三个？印尼 BI-FAST 接入时间表？
- 交换机之间的 scheme/switching fee 分摊、退款报文（反向贷记还是专用冲正）与争议处理规则：需向 PayNet、NITMX、NAPAS、Bakong、ASPI 直接索取接入文档。
- 各国交换机对“外国私营网络”接入的准入条件（参照 Alipay+、GLN、HIVEX、Wise 先例）：是否要求本地法人、本地结算行、数据本地化、央行批准？
- HIVEX（TBCASoft）在东南亚国家码的扩展计划（菲律宾 RCBC MOU 之后），以及 PayPay 是否会经 HIVEX 或 Alipay+ 把海外模式扩展到泰、越等国。
- PayNow–UPI 上线日（记忆 2023-02-21）与当前限额；UPI 在新加坡商户 QR 侧的受理方式（是否经 NETS）。

</details>

## 稳定币基础设施

事实 61 条（高 19 / 中 36 / 低 6）。

| # | 事实 | 置信度 | 来源 | 日期 | 备注 |
|---|---|---|---|---|---|
| 1 | SBI VC Trade 于 2025-03-04 登记为日本首家電子決済手段等取引業者（关东财务局长第 00001 号），可处理的電子決済手段为 USDC | 高 | [链接](https://www.fsa.go.jp/menkyo/menkyoj/denshikessaisyudan.pdf) | 2025-03-04 | 核实：原 low→high（日期由“2025-03”精确到 2025-03-04）。依据是搜索摘要中引用的 FSA 登记名单；WebFetch 打开该 PDF 返回 DNS 失败 |
| 2 | SBI VC Trade 原定 2025-03-12 系统维护后以限定用户的 beta 版开始处理 USDC，2025-03-26 全面开始；Circle 新闻稿（2025-03-24）称 Binance Japan、bitbank、bitFlyer 也计划上线并分销 USDC，Circle 在日本设有子公司 Circle Japan KK | 高 | [链接](https://www.businesswire.com/news/home/20250324944828/en) | 2025-03-24 | Circle 官方新闻稿，经搜索摘要核实。上述三家交易所在 2026 年是否已实际上线 USDC 未查到 |
| 3 | Ripple 与 SBI Group 于 2026-06-24 宣布，RLUSD 经 JFSA 批准在日本上线，通过 SBI VC Trade 向机构和个人提供；这是 2025-08 MOU（原目标 2026 Q1）的落地 | 高 | [链接](https://ripple.com/ripple-press/ripple-and-sbi-group-partner-to-launch-ripple-usd-in-japan/) | 2026-06-24 | 核实：原 low（“SBI 将分销 RLUSD”）→high，已上线 |
| 4 | 2025 年资金结算法修正案于 2025-06-06 成立、06-13 公布，2026-06-01 施行 | 高 | [链接](https://www.fsa.go.jp/common/diet/217/02/setsumei.pdf) | 2025-06 / 2026-06-01 | 核实：原 low→high。coinpost 报道与 SBI 新生信托的 JPYSC 资料都写明 2026-06-01 施行 |
| 5 | 修正后，信托型稳定币储备最多 50% 可投到剩余期限不超过 3 个月的短期国债或定期存款；SBI 新生信托银行已把 JPYSC 储备中的 10 亿日元投到短期国债 | 高 | [链接](https://paymentnavi.com/?p=182200) | 2026 | 核实：原 low（“约 50%”）→high。条文和内阁府令原文未读 |
| 6 | JPYSC：SBI 新生信托银行发行、SBI VC Trade 负责流通的信托型日元稳定币，2026-06-24 发行；先行阶段只能在 SBI VC Trade 账户内使用，不能出库到外部钱包，法律和税务理顺后转到公链 | 高 | [链接](https://corp.sbishinseibank.co.jp/ja/news/news/20260624b/main/01/link/20260624_JPYSC.pdf) | 2026-06-24 | 新事实（上一轮和种子都没有）。报道称公链目标为 Ethereum（bitbank），一手资料未写明 |
| 7 | 截至 2026-09-07，JPYSC 发行余额约 201 亿日元；另有 JPYSC 借贷申请约 69 亿日元，合计约 270 亿日元 | 高 | [链接](https://www.sbigroup.co.jp/news/pdf/group/2026/0907_a.pdf) | 2026-09-07 | SBI 集团 PDF，经搜索摘要核实 |
| 8 | JPYC EX 累计发行额在 2026-09-18 超过 100 亿日元（2026-02-02 约 10 亿、2026-04-15 为 21 亿） | 高 | [链接](https://paymentnavi.com/?p=182688) | 2026-09-18 | 更新上一轮 medium 的 2026-05 数据。依据是 JPYC 公司公告经 dime.jp、paymentnavi 转载；累计发行额不等于流通余额 |
| 9 | 三菱 UFJ 银行、瑞穗银行、三井住友银行于 2026-06-10 共同宣布：在 2026 财年内以三行共同发行的信托型稳定币开始实际交易，并设协议会研究发行基础、制度设计和治理；受托信托银行和系统基础提供方今后选定 | 高 | [链接](https://www.bk.mufg.jp/news/news2026/pdf/news0610.pdf) | 2026-06-10 | 推翻/修正：原 low“经 Progmat 联合发行”→ 官方称基础平台未定，部分海外网站写“基于 Progmat”与此不符 |
| 10 | 三大行于 2025-11-07 宣布，在金融厅“FinTech 実証実験ハブ”支持下开展稳定币实证：由三菱 UFJ 信托银行发行，Progmat 提供技术支持 | 高 | [链接](https://www.mizuhobank.co.jp/release/pdf/20251107release_jp.pdf) | 2025-11-07 | 修正：原 low 称“FSA Payment Innovation Project 支持”，搜索摘要显示官方表述为 FinTech 実証実験ハブ；“Payment Innovation Project”是否为其下的项目名未核实 |
| 11 | 日本犯收法 Travel Rule：2023-06-01 起，暗号資産交換業者和電子決済手段等取引業者负有通知义务；只对 FSA 告示列明的同等规制法域的外国业者通知，对其他法域须收集并保存信息（施行规则第 24、32 条）；2025-06 FSA 曾提出追加法域的告示案 | 高 | [链接](https://www.fsa.go.jp/news/r4/sonota/20230526-2/20230526-2.html) | 2023-05-26 / 2025-06-25 | 核实：原 low→high（制度框架部分） |
| 12 | HKMA 于 2026-04-10 向 Anchorpoint Financial（渣打、HKT、Animoca 合资）和 HSBC 发出首批稳定币发行人牌照，申请者共 36 家 | 高 | [链接](https://www.theblock.co/post/396990/hsbc-and-anchorpoint-financial-gain-first-hong-kong-stablecoin-issuer-licenses) | 2026-04-10 | 核实：原 medium→high（The Block、fintechnews.hk、Charltons 等多源一致）；hkma.gov.hk 原文未打开 |
| 13 | MAS 于 2026-09-01 就修改 PS Act、落地稳定币框架征求意见（截止 2026-10-16），新设稳定币发行牌照，只有持牌者可用“MAS-regulated stablecoin”标签 | 高 | [链接](https://www.mas.gov.sg/news/media-releases/2026/mas-consults-on-legislative-amendments-to-implement-stablecoin-regulatory-framework) | 2026-09-01 | 来自种子 SG-MY（high），未重查；说明 StraitsX 目前只有 in-principle approval，正式 SCS 牌照尚未立法 |
| 14 | MAS 于 2025-10-16 启动 BLOOM，用代币化银行负债和受监管稳定币做结算，参与者包括 Circle、DBS、OCBC、Partior、Stripe、UOB、Ant International、StraitsX、Coinbase | 高 | [链接](https://www.mas.gov.sg/news/media-releases/2025/mas-launches-bloom-initiative-to-extend-settlement-capabilities) | 2025-10-16 | 来自种子 SG-MY（high），未重查 |
| 15 | Circle 于 2026-02-17 宣布 CPN 新的本币出金伙伴已在印度（Saber）、新加坡、菲律宾、阿联酋、欧盟、美国上线；此前已有巴西、中国、哥伦比亚、香港、尼日利亚及拉美部分国家 | 高 | [链接](https://www.circle.com/blog/circle-payments-network-expands-local-currency-payout-corridors-across-asia-the-middle-east-europe-and-the-us) | 2026-02-17 | 核实：原 medium→high（补充了国家清单）。新加坡伙伴名称未查到 |
| 16 | Mastercard 于 2026-06-03 允许发卡方和收单方在法币结算与链上稳定币结算之间选择，首批支持 USDC、PYUSD、USDG、USDP、RLUSD、SoFiUSD，链包括 Ethereum、Solana、XRPL，并支持日间、周末和节假日结算；首批参与方为 ARQ、CBW Bank、Cross River、Lead Bank、Nuvei（美国、拉美），其他市场视当地审批逐步推进 | 高 | [链接](https://www.theblock.co/post/403474/mastercard-expands-stablecoin-settlement-options-with-usdc-pyusd-and-rlusd) | 2026-06-03 | 核实并更新原 low（Mastercard MTN、Crypto Credential 等）。The Block 与 CoinMarketCap 一致；亚太参与方未查到 |
| 17 | BIS 于 2026-05-27 发布 Project Agorá 报告：原型证明可用代币化央行准备金和代币化商业银行存款，完成批发跨境交易的原子结算；两层结构，每家央行运行自己的账本，保持对本币的控制；参与方为英格兰银行、纽约联储、法兰西银行（代表欧元体系）、日本银行、韩国银行、墨西哥银行、瑞士央行，以及 40 多家私营金融机构 | 高 | [链接](https://www.bis.org/press/p260527.htm) | 2026-05-27 | 核实：原 low→high（成员名单与记忆一致） |
| 18 | Project Agorá 下一步计划做涉及部分货币和参与方的真实价值交易，加拿大央行将加入 | 高 | [链接](https://www.bis.org/press/p260527.htm) | 2026-05-27 | BIS 新闻稿，经搜索摘要核实 |
| 19 | FATF 于 2025-06-18 发布修订后的 Recommendation 16，改名为“Payment transparency”，目的扩展到洗钱及欺诈等上游犯罪，并提高付款报文中付款人和收款人基本信息的内容和质量 | 高 | [链接](https://www.fatf-gafi.org/en/publications/Fatfrecommendations/update-Recommendation-16-payment-transparency-june-2025.html) | 2025-06-18 | FATF 官方页面出现在搜索结果中；WebFetch 打开时 DNS 失败 |
| 20 | 日本外国稳定币（USDC，以及 2026 年上线的 RLUSD）经 SBI VC Trade 转账时，每笔上限约 100 万日元 | 中 | [链接](https://stablecoininsider.org/ripples-rlusd-goes-live-in-japan-after-jfsa-approval-as-first-type-4-electronic-payment-instrument/) | 2025-03 / 2026-06 | 核实：原 low→medium。USDC 上线时的报道（coinpost、icobench）与 2026 年 RLUSD 报道都提到这一上限；是否约束法人或 B2B 转账、是否已放宽，均未查到 |
| 21 | 有报道称 RLUSD 在日本只上了 Ethereum（不含 XRPL），是日本首个“4 号電子決済手段”，每笔约 100 万日元上限；Ripple 称 RLUSD 市值约 17 亿美元 | 中 | [链接](https://stablecoininsider.org/ripples-rlusd-goes-live-in-japan-after-jfsa-approval-as-first-type-4-electronic-payment-instrument/) | 2026-06 | 单一二手来源。同一报道称分销从 2026-03-31 开始，与 06-24 的新闻稿日期冲突；“4 号”的法律定性需律师确认 |
| 22 | 2025 年修正还新设暗号資産・電子決済手段等的中介业，把跨境收纳代行纳入监管，并扩大资产国内保有命令的范围 | 中 | [链接](https://coinpost.jp/?p=684383) | 2025-06 | 核实：原 low→medium。跨境收纳代行规制直接关系 INSPAY 在日本的收款结构，必须律师确认 |
| 23 | 据 JPYC info 链上数据，JPYC 流通量 2026-06-26 超过 10 亿日元，2026-08-18 约 28.3 亿日元 | 中 | [链接](https://jp.bloomingbit.io/feed/news/118550) | 2026-08-18 | 二手报道链上数据；2026-10 的数值未查到 |
| 24 | 共同社报道，三大行共同稳定币初期由野村证券、大和证券等 5 家金融机构用于股票和投资信托买卖结算 | 中 | [链接](https://www.oanda.jp/lab-education/market_news/kn_2026061001000720/) | 2026-06-10 | 媒体报道。初期是证券结算场景，不是跨境支付 |
| 25 | 三菱 UFJ 信托银行另行研究面向企业国际结算的日元稳定币（XJPY）和美元稳定币（XUSD） | 中 | [链接](https://bitbank.cc/knowledge/breaking/article/8no7c7ctkzuw) | 2025-2026 | 媒体报道；进度未查到；与 StraitsX 的 XUSD 同名，需注意区分 |
| 26 | Project Pax 于 2024-09 启动，由 Progmat 与 Datachain 开发、TOKI 参与：银行通过 SWIFT 现有 API 框架发指令，后台用 Progmat 发行的 JPY/USD/EUR 稳定币结算，TOKI 用流动性池做跨链和换币；三大行支持，10 多家银行参与试验；原目标 2025 年商用 | 中 | [链接](https://www.theblock.co/post/315058/japans-three-major-banks-to-test-cross-border-stablecoin-transfer-platform) | 2024-09 | 核实：原 low→medium（The Block、Cointelegraph、fintechnews.hk 一致）。2026 年是否已商用未查到 |
| 27 | USDT 市值约 1,831 亿美元，流通量约 1,832 亿枚（2026-08-13）；2025-10-10 约 1,784 亿美元 | 中 | [链接](https://delta.app/en/crypto/tether/) | 2026-08-13 | 更新：原 low“2025 年底约 1,800 亿美元以上”→medium（聚合站数据）。2026-10 的数值未查到 |
| 28 | USDC 流通量约 730 亿美元（截至 2026-10-08 的一周） | 中 | [链接](https://www.kucoin.com/news/flash/usdc-circulation-drops-by-800m-in-7-days-as-redemptions-exceed-issuance) | 2026-10-08 | 沿用上一轮，本轮未重查 |
| 29 | Anchorpoint 的港元稳定币 HKDAP 已开始第一阶段，只面向机构分销商和专业投资者，零售预计稍后（有报道称 2026 年底前） | 中 | [链接](https://www.kucoin.com/news/flash/hong-kong-s-first-regulated-stablecoin-launched-excludes-retail-investors) | 2026（具体日期未查到） | 转述 Reuters；所用链未查到 |
| 30 | HSBC 计划 2026 年下半年推出港元稳定币，截至检索没有查到上线报道 | 中 | [链接](https://fintechnews.hk/38270/blockchain/hong-kong-stablecoin-licence-hsbc-anchorpoint-hkma/) | 2026-04 | “未上线”是未查到型结论 |
| 31 | 2025-12 时 XSGD 市值约 1,300 万美元，XUSD 约 5,000–5,200 万美元；两者累计链上交易额超过 180 亿美元；XSGD 在 Ethereum、Polygon、XRPL 等链上，XUSD 在 Ethereum、BSC 上；原计划 2026 年初上 Solana | 中 | [链接](https://cointelegraph.com/news/straitsx-xsgd-xusd-solana-stablecoin-launch-2026) | 2025-12 | Solana 是否已上线、2026 年的规模都未查到 |
| 32 | IDRX 是 1:1 卢比储备的印尼盾稳定币，2026-07 在新加坡 MASA 2026 展示跨境汇款和 IP 代币化用例，2026-09-15 上线 Celo | 中 | [链接](https://www.idnfinancials.com/ar/news/65586) | 2026-07 / 2026-09-15 | 媒体报道；规模和持牌状态未查到 |
| 33 | 印尼的稳定币可归入 OJK 监管的“Digital Financial Assets”，可作交易资产，但受 BI 支付系统限制，不能作支付工具；目前没有储备和面值赎回的专门框架 | 中 | [链接](https://gpg-pdf.chambers.com/fintech-2026/401/) | 2026 | 部分核实原 low。搜索摘要称监管于“2026-01”从 Bappebti 移交 OJK，与记忆中的 2025-01（POJK 27/2024）不符，疑为摘要错误，移交日期按 low 处理 |
| 34 | BI 在 Project Garuda 下研究以数字卢比和国债支撑的“国家版稳定币”，试点持续到 2026 年；IDRQ 正参加 OJK 沙盒 | 中 | [链接](https://www.regulationasia.com/articles/indonesia-to-launch-bond-backed-stablecoin-via-digital-rupiah-cbdc) | 2025-2026 | IDRQ 部分来自项目方页面，偏 low |
| 35 | Coins.ph 的比索稳定币 PHPC 已从 BSP 监管沙盒毕业（2024-04 进入沙盒，原计划同年 6 月退出）；储备为境内银行账户中的现金及现金等价物；Coins.ph 持 BSP 的 VASP 与 EMI 资格 | 中 | [链接](https://www.ledgerinsights.com/coins-ph-launches-first-philippines-regulated-stablecoin/) | 2024-2025 | 核实：原 low→medium。毕业的具体日期和当前规模未查到 |
| 36 | Coins.ph 是 CPN 在菲律宾的 beneficiary financial institution，可向 120 多家银行和电子钱包以 PHP 出金；新银行 Munify 于 2026-06-10 宣布接入 CPN，让用户把 USDC 换成比索出金 | 中 | [链接](https://www.rutlandherald.com/news/business/munify-integrates-with-circle-payments-network-to-enable-usdc-powered-local-payout-in-the-philippines/article_745cfcad-d318-55f2-83a2-683fa542441a.html) | 2026-06-10 | 转载的 BusinessWire 新闻稿；T+0 SLA 与费用未查到 |
| 37 | 本轮没有查到 CPN 在印尼、泰国、日本、马来西亚、越南的本币出金伙伴 | 中 | [链接](https://www.circle.com/blog/cpn-momentum-and-upcoming-roadmap) | 2026-10-18 检索 | 未查到型结论 |
| 38 | CPN 中 Circle Technology Services 只是技术服务提供方，不持有资金；使用 CPN 受 CPN Rules 和 Participation Agreement 约束 | 中 | [链接](https://www.circle.com/blog/circle-payments-network-partners-grow-with-circle) | 2025-2026 | 沿用上一轮 |
| 39 | Mastercard 于 2026-03 同意以最高 18 亿美元（15 亿基础价 + 最多 3 亿业绩对价）收购 BVNK；另有报道称在洽谈以 15–20 亿美元收购 Zero Hash | 中 | [链接](https://coinmarketcap.com/academy/article/mastercard-adds-usdc-pyusd-rlusd-settlement) | 2026-03 | BVNK 交易被描述为待完成；Zero Hash 只是报道，日期未核实 |
| 40 | Mastercard EEMEA 于 2025-08 与 Circle 推出计划，允许收单方用 USDC 或 EURC 结算并从这些余额直接付款给商户 | 中 | [链接](https://www.theblock.co/post/403474/mastercard-expands-stablecoin-settlement-options-with-usdc-pyusd-and-rlusd) | 2025-08 | 经搜索摘要转述 |
| 41 | Visa 在美国上线 USDC 结算，首批银行 Cross River 与 Lead Bank 经 Solana 结算；截至 2025-11-30，月度稳定币结算量的年化运行率超过 35 亿美元；此前在拉美、欧洲、亚太、CEMEA 有试点，亚太先例是 Crypto.com 在澳大利亚用 USDC 履行 Visa 结算义务 | 中 | [链接](https://www.theasianbanker.com/press-releases/visa-brings-usdc-settlement-to-the-us-expanding-stablecoins-into-core-institutional-payments) | 2025-12 | 本轮复查没有找到 2026 年新加坡、日本或东南亚的收单方或发卡方参与信息 |
| 42 | 据 Atlantic Council（2026-01），mBridge 累计处理 4,000 多笔跨境交易，金额约 555 亿美元，其中 e-CNY 约占 95% | 中 | [链接](https://www.theblock.co/post/386057/china-led-cross-border-cbdc-platform-mbridge-surges-past-55-billion-in-transaction-volume-reuters) | 2026-01 | The Block 转述 Reuters 与 Atlantic Council |
| 43 | PBOC 官员（2026-06）称，mBridge 在 2024-06 至 2025 年底结算约 5,000 亿元（约 690 亿美元），49 家商业银行参与（其中 21 家外资）；BIS 于 2024 年底退出该项目 | 中 | [链接](https://san-1510.aid.brainsum.com/news/top-news/chinas-mbridge-cbdc-platform-settled-69bn-18-months-pboc-official-says) | 2026-06 | 核实：BIS 退出部分由原 low→medium；来源为二手聚合站 |
| 44 | 越南：财政部 2026-01-20 发布 Decision 96/QD-BTC，公布加密资产交易所试点的许可程序并开始受理申请；2026-03 从 7 家申请者中选出 5 家基本合格的（VIXEX、LPEX、CAEX、TCEX、Vietnam Digital Assets JSC）；最低实缴资本 10 万亿越南盾，外资持股不超过 49%；试点排除以法币为底层的资产（稳定币）；截至检索未见发牌 | 中 | [链接](https://theinvestor.vn/vietnam-considers-pilot-licenses-for-5-digital-asset-exchanges-d18648.html) | 2026-01 / 2026-03 | 核实：原 low→medium（Tuoi Tre、Cointelegraph、The Investor 一致）。“未发牌”是未查到型结论 |
| 45 | BOT 行长 Vitai 于 2026-06-26 确认推进泰铢稳定币监管框架：1:1 泰铢储备存放在持牌金融机构；第一阶段只允许金融机构用于结算，由持牌私营机构发行；2026 年内公开征求意见，正式规则在 2026 年或 2027 年初；BOT 沙盒第二阶段于 2026-04 启动 | 中 | [链接](https://www.thestar.com.my/aseanplus/aseanplus-news/2026/06/27/bank-of-thailand-to-unveil-thai-baht-stablecoin-rules) | 2026-06-27 | 与种子 TH-LA（medium）一致并补充细节；第一阶段是否包括跨境结算未查到 |
| 46 | Lightnet（曼谷，Stellar 系）与 SCB 于 2024-10 宣布推出“泰国首个稳定币”跨境转账服务；2026-04 KuCoin 宣布与 Lightnet 探讨在东南亚的合作 | 中 | [链接](https://www.asiaasset.com/digital-assets/thai-fintech-lightnet-and-siam-commercial-bank-launch-countrys-first-stablecoin/) | 2024-10 / 2026-04 | 所用代币、THB 本币出金能力、牌照范围都未查到 |
| 47 | 修订后的 R.16 保留卡类购物交易的豁免并澄清其范围；卡类取现：境内只需随附卡号或账号，跨境需随附卡号，并在收单方请求时 3 个工作日内提供持卡人姓名 | 中 | [链接](https://finreg.aoshearman.com/fatf-updates-standards-on-payment-transparency) | 2025-06 | 律所摘要（A&O Shearman、Dudkowiak）；扫码钱包支付是否适用卡类豁免未核实 |
| 48 | R.16 修订须在 2030 年底前落实，FATF 计划 2026 年发布实施指引，并在 2025-10 全会后发布评估方法论 Annex IV | 中 | [链接](https://bankingjournal.aba.com/2025/06/fatf-releases-revisions-to-international-standard-for-payments-transparency/) | 2025-06 / 2025-10 | 2026 年实施指引是否已发布未查到 |
| 49 | 新加坡 Travel Rule 门槛为 S$1,500：低于门槛只需姓名和账号，高于门槛需完整信息；依据 MAS Notice PSN02，2020-01-28 起执行 | 中 | [链接](https://wiki.private.law/en/travel-rule.md) | 2020-01-28 | 二手汇编；MAS 原文未打开 |
| 50 | 菲律宾 BSP Circular 1108（2021）规定，PHP 50,000 及以上的虚拟资产转账，VASP 须取得并传递付款人和收款人信息，且所有 VA 转账都视为跨境电汇；之后的 Circular 1206 把相关条文并入 MORNBFI-M | 中 | [链接](https://lpr.adb.org/resource/guidelines-virtual-asset-providers-bangko-sentral-ng-pilipinas-circular-no-1108) | 2021-01-26 | 新事实。Shyft 称没有最低门槛、超过 5 万比索后要求更多信息，属于少数说法；CryptoSlate 称 2025-09-01 起暂停发放新 VASP 牌照，未核实 |
| 51 | Circle 的 L1 区块链 Arc 于 2026-09-16 主网上线（USDC 付 gas，亚秒级终局，兼容 EVM）；创始验证者包括 SBI Group、住友商事、Visa、Mastercard、渣打、BlackRock 等 | 中 | [链接](https://www.theblock.co/news/ecosystems/2026-09-16-circle-launches-arc-mainnet-with-blackrock-and-visa-among-validators-mints-10-billion-arc-tokens-415250) | 2026-09-16 | 沿用上一轮，本轮未重查 |
| 52 | Stripe 与 Paradigm 的支付专用 L1 Tempo 于 2026-03-18 主网上线，同时推出 Machine Payments Protocol | 中 | [链接](https://www.bankless.com/es/read/news/stripe-deploys-tempo-blockchain-to-mainnet-introduces-machine-payments-protocol.md) | 2026-03-18 | 沿用上一轮；本轮没有查到在亚洲的进展 |
| 53 | StraitsX × Ant International（Alipay+）× Grab 案例（2024-11-05）：后台用 XSGD 加 Purpose Bound Money 在 Avalanche 上清结算，商户实时收 SGD | 中 | [链接](https://www.straitsx.com/case-study/alipay-grab) | 2024-11-05 | 来自种子 SG-MY，未重查；是“稳定币后台、两端法币”的东南亚直接先例 |
| 54 | 设计结论：日本侧大额净额结算不在日本境内用外国稳定币完成，改为法币日元在日本结算，由 INSPAY 新加坡或香港实体在境外换成 USDC；中期评估把 JPYSC 或三大行共同稳定币作为日元腿 | 中 | N/A（本报告分析推论） | 2026-10-18 | 分析推论，以外国稳定币每笔约 100 万日元上限（medium）和 JPYSC 不能出库（high）为前提 |
| 55 | 设计结论：东南亚出金按国家分两类。菲律宾、新加坡、香港可以用稳定币或 CPN 出金；泰国、印尼、马来西亚、越南、老挝、柬埔寨走法币腿 | 中 | N/A（本报告分析推论） | 2026-10-18 | 分析推论，依据各国稳定币和支付禁令的事实 |
| 56 | JPYC 株式会社于 2025-08 登记为资金移动业者，2025-10-27 开始发行 JPYC（1 号電子決済手段），链为 Ethereum、Avalanche、Polygon | 低 | N/A（凭记忆） | 2025-10-27 | 未核实（本轮没有检索这一条）。2026 年多篇报道提到 JPYC EX 在运营、发行额持续增长，间接说明已在发行，但日期和链清单未核实 |
| 57 | 日本 Travel Rule 不设金额门槛；日本交易所主要用 TRUST 与 Sygna 方案 | 低 | N/A（凭记忆） | 未核实 | 未核实。本轮检索没有找到写明门槛的资料 |
| 58 | 本轮检索只见 SBI VC Trade 处理 USDC、RLUSD、JPYSC，没有查到日本登记业者以電子決済手段身份处理 USDT | 低 | [链接](https://www.fsa.go.jp/menkyo/menkyoj/denshikessaisyudan.pdf) | 2026-10-18 检索 | 属于“未查到”型结论，不能证明不存在；登记名单 PDF 未能打开 |
| 59 | Partior 已上线 USD、EUR、SGD，计划增加 JPY、MYR、AUD、CNH 等；Deutsche Bank 于 2025-09-25 与 DBS 完成首笔 EUR 交易，成为 EUR 结算行；Emirates NBD 自 2026-07-14 起把 USD 区块链支付投入生产；2025-06 起接入 OSTTRA 与 Baton 的 FX PvP 网络；2024 年 Series B 融资 6,000 万美元（Peak XV 领投） | 低 | [链接](https://wiki.private.law/en/partior) | 2024-2026 | 主要依据单一 wiki 来源，没有找到 Partior 官方新闻稿；上一轮“2021 年由 JPM、DBS、渣打、Temasek 成立”仍未核实 |
| 60 | 修订后的 R.16 要求跨境支付超过 USD/EUR 1,000 时随附付款人姓名、账号或唯一参考号，以及地址或出生日期等信息，并鼓励收款人姓名核验和结构化地址 | 低 | N/A（凭记忆） | 未核实 | 未核实，需对照 R.16 及 INR.16 原文 |
| 61 | 泰国 SEC 要求所有 VASP 转账都提供 Travel Rule 数据（门槛 THB 0） | 低 | [链接](https://www.spark.money/tools/travel-rule-lookup) | 未查到 | 只有一份比较表，没有第二来源 |

<details><summary>待确认问题</summary>

- 【日本，最关键】外国電子決済手段（USDC、RLUSD）每笔约 100 万日元的上限，是否也约束法人对法人的转账？2026-06-01 修正法施行后是否有放宽？信托型（3 号，如 JPYSC、三大行共同币）跨境转账有没有同类上限？
- INSPAY 日本实体（或合作资金移动业者）从钱包运营方收日元、再在境外换成 USDC 的结构，是否落入 2026-06-01 起的“跨境收纳代行规制”或为替取引？需要第一种还是第二种资金移动业牌照？
- SBI VC Trade 处理 USDC、RLUSD 支持哪些链（Ethereum、Solana 等）？法人 RFQ、出库额度、费用、处理速度如何？JPYSC 什么时候转到公链、在哪条链？
- 三大行共同稳定币选哪家受托信托银行和哪个基础平台（Progmat 或其他）？何时开放给支付或跨境场景？Project Pax 2026 年是否已商用、有没有东南亚通道？
- JPYC EX 对法人的单笔和单日发行赎回上限是多少？JPYC 发行方的资金移动业类别（第一种还是第二种）如何？有没有持牌的 JPYC↔USDC 兑换对手方？
- CPN 新加坡出金伙伴是谁？非银机构以 OFI 身份接入 CPN 的条件和费用是什么？CPN 是否计划开通泰国、印尼、马来西亚、越南、日本的通道？
- Coins.ph 作为 CPN BFI 向第三方商户收单方出金：是否支持 InstaPay 实时到账、单笔上限和费用多少？PHPC 何时毕业、规模多大、在哪些链上？
- FATF R.16 修订版的卡类豁免能否适用于钱包扫 MPM 码的商户支付？FATF 2026 实施指引有没有对 QR 或钱包支付作说明？日本、泰国、新加坡、菲律宾的国内落实时间表是什么？
- 日本 Travel Rule 是否确实没有门槛？日本（TRUST、Sygna）与新加坡、菲律宾、泰国交易所使用的 Travel Rule 协议能否互通？机构间净额结算是否要附带底层零售交易明细？
- 泰国：BOT 泰铢稳定币征求意见稿是否已发布？第一阶段是否允许外国机构以稳定币结算后在泰国兑换泰铢？2026 Q4 起的稳定币资金流管控具体义务是什么？Lightnet/SCB 稳定币服务能否给 PromptPay 收单方出金？
- 印尼：OJK 是否发布稳定币（储备、赎回）专门规则？Bappebti→OJK 移交的准确日期（2025-01 还是 2026-01）是哪个？IDRX 的持牌状态如何？
- 香港：HKDAP 发行在哪条链、何时开放零售？HSBC 港元稳定币何时上线？香港能否作为美元、港元的第二结算枢纽？
- Visa 和 Mastercard 的稳定币结算何时扩展到亚太、东南亚收单方？INSPAY 能否借卡组织的稳定币结算窗口（周末、节假日）补充流动性？
- Arc 主网的实际稳定性、费用、隐私功能如何？SBI 是否会在 Arc 上支持 USDC 出入库？
- Partior 2026 年是否上线 JPY 或 MYR？非银机构能否经结算银行间接使用其 PvP？
- USDC 和 USDT 2026-10 的最新流通量，需在 Circle 透明度页、CoinGecko 上核对
- MAS SCS 立法完成后，StraitsX 是否取得正式牌照？INSPAY 新加坡实体做结算枢纽，需要 MPI（跨境汇款 + DPT）还是要额外许可？

</details>
