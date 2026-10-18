# 13 · 参考案例：Paytm、TrueMoney、DANA

> 本章回答创始人的问题："印度 Paytm、TrueMoney、DANA 都是什么情况？"三家分别是印度、泰国、印尼的头部钱包。本章把它们当作 INSCREEN 设备业务和跨境网络的参照，并判断它们是伙伴还是竞争者。
>
> * **证据标注**：同 [12 章](12-inscreen-sea-dynamic-qr.md)。（已核实）一手或多源一致；（公司说法）公司自述；（媒体）媒体报道；（推断）由证据推出；（假设）测算用的设定值；（未查到）本轮没找到，**不等于不存在**；（凭记忆，未核实）不得作为决策依据。
> * **调研条件**：2026-10-18，每家做一轮调研、一轮核实，本章只采信核实后的口径，被推翻的说法只以修正后的形式出现。paytm.com、NSE、truemoney.com、restofworld.org、businesstoday.in 等域名 WebFetch 打不开（DNS 失败或代理 403），新事实几乎全部依据 WebSearch 摘要，公司 PDF 原文都没读到。审校时另用 4 次 WebSearch 抽查了 NIPL × NTT DATA、UPI 在日本是否上线、DANA 是否在 Alipay+ 日本名单、Ascend Bank 是否开业，结果已写入正文。已核实的国别事实沿用 [`docs/research/`](research/README.md)（TH-LA、ID、ALIPAY-VERIFY、JP-PAYPAY、JP-VERIFY、ASEAN-LINK、DYNQR-devices）。
> * **口径**：1 crore = 1,000 万，1 lakh crore = 1 万亿卢比。汇率假设同 12 章：1 USD ≈ ¥154 ≈ ₹87 ≈ ฿32.5 ≈ Rp16,400，只用于量级比较。INSCREEN 的"0% 手续费 + ¥2,000/月"是创始人的暂定方案，按假设处理（[11 章](11-inscreen-stablecoin-acceptance.md)）。

## 结论先行

* **Paytm（印度）**：印度第三大 UPI 应用（2026-08 笔数份额约 8%，二手整理）。设备订阅商户 1,570 万（2026-06-30，公司说法；指为音箱、刷卡音箱、POS 等设备付订阅费的商户，不是纯音箱，也不是注册商户）。PhonePe 截至 2025-09-30 部署 919 万台设备，口径是台数，不能直接比，所以"印度最大"未核实。关联银行 Paytm Payments Bank（PPBL）2024 年被 RBI 叫停，2026-04-24 被吊销牌照；Paytm 改走"四家 PSP 银行 + 子公司自持支付聚合商牌照"后恢复，2025-06 季度起连续盈利。但利润主要靠其他收入（现金投资收益）：2026 财年其他收入约 ₹854 crore，高于税前利润 ₹582 crore（二手数字）；2027 财年第一季度 PAT ₹220 crore 也高于 EBITDA ₹203 crore。2024-12 已把 PayPay 的新股预约权卖给 SoftBank，与 PayPay 不再有股权关系。UPI 在日本尚未上线：NPCI 国际子公司 NIPL 2025-10 与 NTT DATA 签了 MoU，计划试点。
* **TrueMoney（泰国）**：正大集团（CP）旗下 Ascend Money 运营，MUFG 2024 年领投 1.95 亿美元，蚂蚁是少数股东。公司称用户超过 3,000 万（口径不明）。商户侧有免费商户 QR 和按年收费的 Money Box 音箱；菲律宾业务 2026-04-30 停运；虚拟银行 Ascend Bank 推迟到"2026 年底前"（公司说法），截至 2026-10-18 未查到开业；在 BOT 沙盒里试点泰铢代币 THBT。用户 2023-06 起可经 Alipay+ 在 PayPay 商户付款（PayPay 新闻稿）。
* **DANA（印尼）**：股东是 Sinar Mas、Lazada（阿里系）、蚂蚁、Emtek（2022 年数据）。公司称 2024 年底有 2 亿账户（按手机号计，不是人数）。商户侧是静态 QRIS + 语音音箱；2026-10-01 起单笔 ≤Rp100,000 的 QRIS MDR 全部归零（媒体，BI 原文未读）。用户 2025-08-17 起可经 QRIS 跨境在日本扫 JPQR Global（Netstars）码付款，但只限张贴 JPQR Global 码的商户（首批 35 家，见 [01 章](01-architecture.md) 1.1）。2024 年 Alipay+ 公布的日本受理钱包名单里没有 DANA。未查到加密业务。
* **启示一：设备不是利润中心（推断）。** 查到的三家主力商户设备都是"静态码 + 语音播报"，用来防假截图、留住商户。有价格的只有两档：Paytm 历史月费约 USD 0.9–1.4，印尼同类音箱 GoPay Spiker 约 USD 3/月；TrueMoney（按年收费）和 DANA 的价格未查到。只有 Paytm 有财报证明利润来自金融服务分销而不是支付；TrueMoney 和 DANA 是推断。¥2,000/月（≈ USD 13）是 Paytm 历史月费的约 9–14 倍、印尼音箱月租的约 4 倍。这印证 12 章：INSCREEN 在东南亚小微段不能按 ¥2,000 卖；Paytm 的规模也不是靠设备费做出来的。
* **启示二：入境日本走聚合层，稳定币只有 TrueMoney 可谈（推断）。** 三家用户在日本付款都不经过 INSPAY。TrueMoney 走 Alipay+（PayPay 等收单方）。DANA 走 JPQR Global，但覆盖商户很少。Paytm 和其他 UPI App 还不能在日本用，入口会是 NIPL × NTT DATA，不是 Paytm。三家都曾有或仍有蚂蚁股东。INSCREEN 在日本应接 Alipay+ 收单方、NTT DATA、Netstars 这类聚合层，不逐个钱包签约；但 Netstars 同时是 INSCREEN 在日本受理稳定币上的直接竞品（[11 章](11-inscreen-stablecoin-acceptance.md)）。稳定币结算网络里，只有 TrueMoney（THBT 沙盒）可能是 PoC 对话对象；印度没有稳定币支付框架、RBI 反对，印尼稳定币不能作支付工具。
* **启示三：别学 Paytm 的监管集中。** 钱包、账户、UPI 句柄集中在一家关联银行，一纸禁令就打断了业务。INSPAY 的结算行、资金托管和稳定币兑换方都要多家冗余。单位经济也不要建立在零 MDR 或政府激励上，这两样在印度、印尼都在变：印度 PIDF 激励已停发，UPI 商户 MDR 可能部分恢复；印尼小额 MDR 刚归零。靠利息收入撑起的利润也不能当作经营能力。

## 1 一览表

| 项 | Paytm（印度） | TrueMoney（泰国） | DANA（印尼） |
|---|---|---|---|
| 运营主体与股东 | One 97 Communications（NSE 上市）；支付由全资子公司 Paytm Payments Services（PPSL）持牌开展 [7]。创始人 Vijay Shekhar Sharma 2023-08 受让蚂蚁旗下 Antfin 10.3% 后成为最大股东（凭记忆）；据 2025-08 报道 Antfin 出售剩余约 5.84%，是否已完成、蚂蚁是否完全退出凭记忆，未核实；SoftBank 已退出（媒体） | Ascend Money（未上市）；CP 为大股东，Bow Wave、蚂蚁为既有投资方，蚂蚁比例不明；2024-06 MUFG 领投 1.95 亿美元，未披露估值；最近公开估值 15 亿美元（2021-09）[16] | PT Espay Debit Indonesia Koe（未上市），母公司 EAN；2022-08 后股东为 Sinar Mas、Lazada、蚂蚁、Emtek（降到约 6.7%，单一来源）；2024–2026 年比例未查到 [31][32] |
| 牌照 | PPBL 银行牌照 2026-04-24 吊销；UPI 以第三方应用（TPAP）身份经 Axis、HDFC、SBI、YES 接入；PPSL 持在线、线下、跨境支付聚合商（PA）牌照；钱包（PPI）牌照称在申请（低）[6][7] | e-money（Payment Systems Act B.E.2560，凭记忆，未核实）；Ascend Bank 2025 年获 BOT 选为 3 家虚拟银行之一，截至 2026-10-18 未查到开业 [19] | 自称 BI 监管的第一类支付服务商 PJP Kategori I（公司说法，未在 BI 名单核对）[30] |
| 用户（口径） | 月交易用户（MTU，当月至少交易一次）8,000 万（2026-06 季度；上年同期 7,400 万）[1] | "超过 3,000 万用户"（2026-10，公司说法，未说明注册还是活跃）；能找到的最近 MAU 是 1,900 万（2024-01）[17] | 2 亿账户（2024 年底，按手机号计，一人可开多个，不是人数，更不是 MAU）；公司称 2024-09 日均 3,000 万笔 [33] |
| 商户 | 设备订阅商户 1,570 万（2026-06-30，公司说法；为音箱、POS 等付订阅费的商户，不是注册商户数）；商户 GMV ₹7.1 lakh crore/季（≈ USD 820 亿，+31%）[1] | 商户数未查到；公司称用 TrueMoney 扫码可在全国 700 万以上的点付款（这是付款侧受理面）[21] | 自有收单商户数未查到；全国 QRIS 商户 4,486 万（2026-06）都能受理 DANA 付款 [36] |
| 商户设备与价格 | Soundbox（静态 UPI 码 + 播报，4G）、Card Soundbox（加 NFC）、Android POS；月费 2021–2023 年报道为 ₹78–125（≈ USD 0.9–1.4），2026 年现价未查到 [4][5] | Money Box（2024-10，顶部印 PromptPay QR，到账播报，专防假截图），按年收费，金额未查到 [20] | QRIS Soundbox（2024-03 试点，静态 QRIS + 播报），价格未查到；未查到动态码设备、EDC 或 Android POS [34] |
| MDR 环境 | UPI P2M 自 2020 年起零 MDR（起始日 2020-01-01 凭记忆）；2026-08 财政部称修法后可能只对有限商户收"象征性"MDR，费率和门槛未定 [8] | TrueMoney 商户 QR 收款免费（2024-06-04 起新注册或升级的商户，公司说法）；付款方从钱包扫法人银行 QR 按金额分档收费 [21] | UMI 单笔 ≤Rp500,000 为 0%，超出 0.3%，其他类别 0.7%；2026-10-01 起所有类别单笔 ≤Rp100,000 为 0% [35] |
| 监管事件 | 2024-01-31 RBI 限制 PPBL；2026-04-24 吊销；NPCI 30% 单 App 份额上限的合规期限为 2026-12-31 [6][9] | 菲律宾 2026-04-30 停运；Ascend Bank 一再推迟，CP All 股东 2026-05-29 以 96.4% 反对票否决把 Counter Service 等并入其金融集团 [18][19] | 未查到 BI/OJK 处罚；社交媒体有"余额消失"舆情，DANA 称是"haters"放出的（日期不明）[44] |
| 跨境；用户能否在日本付款 | UPI International：阿联酋、新加坡、法国、毛里求斯、不丹、尼泊尔等（2024-11 快照），2026-06 新增柬埔寨 KHQR，都是 NIPL 方案层能力；**日本：未上线**，NIPL 2025-10-07 与 NTT DATA 签 MoU，先在 NTT DATA 收单的商户受理印度游客，媒体称计划试点，截至检索未见上线 [47][48]；未查到加入 Alipay+ [11][12] | Alipay+ 钱包；**日本：能，2023-06 起可在接入 Alipay+ 的 PayPay 商户付款**（PayPay 新闻稿，本轮未复检）；韩国 ZeroPay、新加坡 SGQR、马来西亚 DuitNow 也能 [23][26] | **日本：能，2025-08-17 起经 QRIS 跨境扫 JPQR Global（Netstars），只限张贴 JPQR Global 码的商户（首批 35 家）**；蚂蚁称也可在"支持 Alipay+ 的境外商户"付款，但 2024 年 Alipay+ 日本受理名单（16 个）里没有 DANA，能否在 PayPay 商户用未核实 [24][37][38] |
| 加密/稳定币 | 未查到业务；印度没有稳定币支付框架，RBI 反对加密合法化（二手）[14] | THBT 泰铢代币：2025-08 起在 BOT 沙盒试点，2026-09 报道第二阶段最多 2 万人 [27] | 未查到；印尼稳定币可作交易资产、不能作支付工具，稳定币 POJK 预计 2027-01 [43] |
| 对 INSPAY 的角色（推断） | 设备订阅与监管风险的参照；与 PayPay 的技术渊源已在股权上切断 [13]；印度游客在日本的入口是 NIPL × NTT DATA，不是 Paytm | 入境日本要受理的钱包；THBT 是稳定币 PoC 的对话对象；在泰国小微层不宜正面竞争 | 入境日本要受理的钱包；进入印尼时可当 PJSP 的设备伙伴候选（暂无证据） |

## 2 Paytm（印度）

| 项 | 内容 |
|---|---|
| 规模 | 2027 财年第一季度（截至 2026-06-30）：MTU 8,000 万，设备订阅商户 1,570 万，商户 GMV ₹7.1 lakh crore（公司说法）[1]。UPI 份额（NPCI 分 App 数据，二手整理）：2026-08 笔数 8.03%、金额 6.87%，排第三；PhonePe 约 46%、Google Pay 约 33%（2026-05 笔数）[10]。全国 UPI 2026-09 共 240.7 亿笔 [10] |
| 财务 | 2027 财年第一季度：收入 ₹2,448 crore（≈ USD 2.8 亿，+28%），EBITDA ₹203 crore（利润率约 8.3%，历史最高），PAT ₹220 crore（+79%）（公司说法，标题与摘要已核实）[1]。PAT 高于 EBITDA，说明其他收入（利息和投资收益）仍是利润的重要来源（推断，由两数比较得出）。2025-06 季度 PAT ₹123 crore，是 2024-09 季度（含出售票务业务的一次性收益）之后首个盈利季度，此后连续盈利 [2]。2026 财年首个全年盈利，净利润约 ₹552 crore（二手；另一来源 ₹554 crore）。但当年其他收入约 ₹854 crore，高于税前利润 ₹582 crore；按这两个二手数字，扣除其他收入后税前约为 −₹270 crore（推断；其他收入未必全是利息，公司口径未核对）[2] |
| 收入结构 | 2027 财年第一季度支付净收入 ₹601 crore（可比口径 +25%；报告口径 +13%，差额来自 PIDF 激励停发，PIDF 是 RBI 补贴受理设备部署的支付基础设施发展基金）；金融服务分销 ₹814 crore（+45%，第三方转述，中）[1]。按这两个数，金融服务（主要是贷款分销）已超过支付。设备订阅收入并在支付收入里，没有单独披露 |
| 战略 | 2026-05 业绩会称新投入"只投 AI"，把 Soundbox 定位为"小商户操作系统"；提到经 Paytm Cloud Technologies 推进国际化，目标市场和时间表未查到（公司说法；国际化部分低）[15] |

**商户与设备模式**

* **产品线**（媒体）：静态 QR 立牌、Soundbox（4G + SIM，到账语音播报）、Card Soundbox（2023 年推出，加 NFC 刷卡）、Android POS [5]。音箱配的是静态 UPI 码（12 章）。带屏动态码机型的规格和价格未查到。
* **装机**：设备订阅商户 2023-06 为 790 万（BSE 申报，已核实），2026-03 为 1,510 万，2026-06 为 1,570 万（公司说法）[3][1]。这是付订阅费的商户数，含音箱、刷卡音箱和 POS，各设备分项未披露。三年翻倍，中间经历了 PPBL 危机（推断）。对照：PhonePe 招股文件称截至 2025-09-30 净部署 919 万台设备（含 SmartSpeaker 和 EDC，DYNQR-devices 转述）。一个是商户数、一个是台数，不能直接排名。
* **价格**：月费报道值 ₹78–125（2021–2023 年）。同一篇 Rest of World 在不同调研里被引成"2023 年平均 ₹125"和"2021 年 ₹125、后降到 ₹78"，原文打不开，只能给区间（低-中）[4]。2026 年现价、一次性费用、单台成本、回本期都未查到。**"商户数 × 月费"推订阅收入的做法不可靠，本章不用。** 对照：PhonePe ₹125/月，或 ₹999 一次性 + ₹25/月 [4]。
* **为什么这么便宜**（推断）：UPI 商户零 MDR，设备费是商户侧少数能收的钱。Paytm 用低价设备和地推铺商户，再交叉销售商户贷款，利润来自金融服务分销 [1][8]。
* **壁垒是地推网络，不是设备**（媒体 + 推断）：2024-02 PPBL 危机时，银行和金融科技公司以更低的订阅价在街头挖 Paytm 商户（Inc42 称 "Loot On Streets"）[5]。商户换机成本低，铺设和维护网络本身才是壁垒。地推人数、渠道结构和获客成本未查到。

**监管**

* **PPBL**（媒体，多源一致；RBI 新闻稿原文未打开）：PPBL 由 One97 持股 49%、Vijay Shekhar Sharma 持股 51%，自 2022-03 起已被禁止新增客户。RBI 2024-01-31 宣布它停止吸收存款、充值和贷记交易（期限后延至 2024-03-15）[6]。2026-04-24 RBI 吊销其银行牌照，理由是不满足牌照条件、违反《1949 年银行监管法》多项条款、管理方式损害存款人利益，并将申请清盘 [6]。One97 称已于 2024-03-31 全额减值，App、UPI、Soundbox、支付网关照常运行（公司说法）。
* **重建**（媒体）：NPCI 2024-03 批准 One97 以 TPAP 身份经四家 PSP 银行接入 UPI，2024-04 批准把 "@paytm" 用户迁移过去 [7]；2024-10 前后获准重新拉新（凭记忆，未核实）。PPSL 的 PA 申请 2022-11 曾因外资合规（与蚂蚁持股有关）被驳回，2025-11-26 获在线 PA，2025-12-17 获线下和双向跨境 PA [7]。钱包（PPI）牌照"已申请"只有一条 X 帖子作来源（低）。
* **UPI 规则**：零 MDR 自 2020-01-01 起（凭记忆）。2026-08 财政部称，《2026 年税收及其他法律（修正）法案》通过后，由 NPCI 牵头的 UPI and Services Steering Committee 决定是否对超过门槛的有限商户交易收"象征性"MDR，P2P 继续免费；费率和门槛未定 [8]。网上流传的"2026-10-15 起 ₹2,000 以上收 0.4%"只有博客来源、没有通函，**不可引用** [8]。NPCI 30% 份额上限的合规期限 2024-12-31 已延至 2026-12-31（已核实），2026 年的新通函未查到；此前已延两次（推断再延可能性不低）[9]。上限真正执行时对第三名 Paytm 相对有利（推断）。

**跨境**

* **出境**（已核实）：2024-11 起 Paytm 用户可在阿联酋、新加坡、法国、毛里求斯、不丹、尼泊尔（部分报道含斯里兰卡）扫当地码，需一次性激活（有效期 1–90 天），从印度账户扣卢比 [11]。这是 NIPL 方案层能力，对所有开通 UPI International 的 App 生效，国家表应以 NIPL 最新清单为准，例如 UPI–柬埔寨 KHQR 2026-06-02 上线 [12]。UPI–马来西亚 DuitNow 2026-02 签约、未确认上线；印尼 QRIS–UPI 2026-10 报道仍受阻（[05 章](05-country-playbooks.md)、ASEAN-LINK）。
* **日本**：截至本轮检索，Paytm 或其他 UPI App 的用户还不能在日本付款，也未查到 Paytm 是 Alipay+ 钱包。
  * **MoU**（公司说法，官方新闻稿摘要）：NTT DATA 2025-10-07 宣布与 NIPL 签 MoU，先在 NTT DATA 收单的商户受理 UPI，初期只限印度游客，之后再评估在全日本推广 [47]。
  * **进度**（媒体）：2025-10 至 2026-01 的报道称先试点，未给上线日期；未查到上线公告或首笔交易 [48]。
  * **背景**：NTT DATA 运营日本最大的卡处理网络 CAFIS；泰国 MyPrompt QR 在日本也经 NETSTARS/NTT DATA 受理（01 章 1.1）。NTT DATA 称 2025-01–08 访日印度游客超过 20.8 万人，同比 +36%（公司说法，未与 JNTO 原表核对）。
  * **含义**（推断）：印度游客在日本的受理入口是 NIPL 和日方收单巨头，不是 Paytm，也不是 INSPAY。
* **PayPay**（已核实）：PayPay 2018 年上线时由 Paytm 提供技术，Paytm Singapore 以此换得新股预约权（SAR，完全稀释约 7.2%），从未持有普通股；2024-12 以约 ₹2,364 crore（约 ¥419 亿）售予 SoftBank Vision Fund 2 [13]。此后双方没有股权关系；技术合同是否存续未查到。

**加密与稳定币**

* 未查到 Paytm 的加密或稳定币产品、合作或表态（未查到）。
* 印度没有稳定币支付框架，稳定币不是 RBI 授权的支付工具；VDA 收益按 30% 征税并扣 1% TDS（《2022 年财政法》，凭记忆）。加密媒体称 RBI 2026-07-02 向议会财政委员会表示 VDA 不应获合法地位（二手，低）[14]。PPBL 刚被吊销、钱包牌照还在申请，Paytm 碰加密的监管风险很高（推断）。

## 3 TrueMoney（泰国）

| 项 | 内容 |
|---|---|
| 主体与股东 | Ascend Money 运营，属 CP 旗下 Ascend Group。Forbes：CP 为大股东，Bow Wave Capital、蚂蚁为既有投资方 [16]。蚂蚁比例没有权威来源：PitchBook 只写"少数股东"，网上"约 20%""25–30%"的说法都没有出处，不用。2021-09 融资 1.5 亿美元、估值 15 亿美元；2024-06-26 MUFG 领投、Krungsri Finnovate 管理的 Finnoventure 基金参投，合计 1.95 亿美元，未披露估值 [16] |
| 用户 | 公司说法：2024-01 钱包用户 3,000 万、MAU 1,900 万 [17]；2026-10 与 DriveWealth 合作（美股投资）时称"超过 3,000 万用户"，口径不明 [17]；Antom 文档写"2,700 万用户、1,700 万活跃"，数据日期不明。推断（低）：注册口径两年多基本持平，2024 年底 3,500 万的目标没有公开达成记录 |
| 财务 | 2024、2025 年经审计收入和利润未查到（可向泰国 DBD 调取）；第三方估计不可用。2024 年称两年内在 Nasdaq 上市，之后未查到进展（公司说法）[17] |
| 海外 | 菲律宾 2026-04-30 停止商业运营（媒体转述公司声明）[18]；官网"6 国"的说法已过时，柬、缅、印尼、越的现状未核实 |
| 虚拟银行 | BOT 2025 年选出 3 家：CP 系 ACM Holding（Ascend）、Krungthai 联合 AIS 和 PTT OR、SCB X 联合 KakaoBank 和 WeBank [19]。Krungthai 一方的 Clicx Bank 2026-06-19 开业。BOT 2026-05 允许虚拟银行推迟 2–3 个月开业；Ascend Bank 从 7 月推迟到"2026 年底前"（True Corp CEO 说法）。原因之一：BOT 要求金融业务单独成组，CP All 股东 2026-05-29 以 96.4% 反对票否决把 Counter Service、Thai Smart Card、CP Axtra 并入 ACM Holding [19]。Bangkok Biznews 2026-09-08 引 Ascend Bank CEO 称"已接近重要一步"，没给日期 [19]。截至 2026-10-18 未查到开业或正式获牌。BOT 5 月给的宽限若从原定约 6 月的期限起算，年底开业就需要再次延期（推断，低） |

**商户与设备模式**

* **Money Box**（媒体）：TrueMoney for Business 2024-10 推出 "มันนี่ บ็อกซ์"，竖式盒子，顶部印 PromptPay QR，到账语音播报，主打防假转账截图；按年收费，金额未查到 [20]。从描述看是"静态码 + 音箱"，不是动态码屏（推断）。True Business 页面上的 TrueMoney Box 应是同类产品。
* **费率**（公司说法）：2024-06-04 起新注册或升级的 "ร้านค้าทรูมันนี่" 用 TrueMoney 商户 QR 收款免费，顾客用 TrueMoney 或银行 App 都能扫 [21]。付款方要付费：钱包付给个人银行账户每月 1–30 笔免费，付给银行发出的法人或商户 QR 按金额分档收费 [21]。装机量、商户数、设备收入未查到。Bangkok Bank 的"每笔 0.35% 或 ฿5"出自其 EDC 页面，不宜当泰国商户 QR 的通用 MDR 基准。
* **网关**：TrueMoney QR 可经 Opn（Omise）、Adyen、HitPay 受理，商户出示码、顾客扫 [22]；INSCREEN 可以经网关 API 取码显示（推断）。
* **变现**（推断）：商户收款免费、设备按年收费，变现靠贷款、理财和待开业的 Ascend Bank；分销依托 CP 零售（7-Eleven 柜台）、True 电信和代理网络。

**跨境**

* **Alipay+ 钱包**（已核实）：韩国 ZeroPay（2023-08-31）、新加坡 SGQR 经 NETS（2023-04）、马来西亚 DuitNow（2023-10-31）都受理 TrueMoney [26]。出境全部经 Alipay+，未查到自建双边通道。
* **日本**：2023-06 起 TrueMoney 用户可在接入 Alipay+ 的 PayPay 商户付款（PayPay 新闻稿，本轮未复检，中-高）[23]；Alipay+ 2024-03 称 TrueMoney 是访日游客最常用的钱包之一（公司说法）[24]。2026-06-29 起 ShopeePay TH、SCB PLANET PLUS 也进入 PayPay 商户，在日本受理的泰国钱包至少 3 家 [25]。PayPay 商户受理 Alipay+ 的费率为 1.98%（税別）[46]。与 JPQR Global 的连接未查到。另一条泰国通道是银行 App 的 MyPrompt QR：顾客出示码（CPM），由 Krungsri 等泰国银行与 NETSTARS/NTT DATA 合作受理（01 章 1.1）；TrueMoney 是钱包，未查到它参与（推断）。2025 年访日泰国游客 123.3 万人次（JNTO）[42]。
* **入境泰国**：TrueMoney 是否作为 Alipay+ 收单方在泰国受理外国钱包，未查到。

**稳定币**

* **THBT**（媒体）：2025-08 在 BOT Enhanced Regulatory Sandbox 内试点泰铢代币 [27]。2026-09 媒体报道第二阶段：最多 2 万名泰国及外国参与者，Fireblocks 钱包嵌在 App 内，可买数字券或与 6 种数字资产互换，兑换由 Ascend Bit 在 SEC 沙盒内提供 [27]。调研稿写的"2026-08"没有对应来源，按 2026-09 报道写。发行实体、储备、公链和 6 种资产名单未查到。
* 与 StraitsX 合作把 THBT 换成新元出金只是路线图（公司说法，低）[28]；与 TouristDigiPay 的关系未查到。
* **规则张力**（同 [06 章](06-compliance-risk.md) 6.3）：SEC 2022 禁止数字资产业者为加密支付提供便利；BOT 2026-06 称持牌 PSP 只处理泰铢；BOT 2026-06-26 称泰铢稳定币第一阶段只给持牌金融机构用于结算；2026 Q4 起管控稳定币资金流 [29]。THBT 是面向零售的沙盒，走出沙盒的路径要看 BOT 正式规则。

## 4 DANA（印尼）

| 项 | 内容 |
|---|---|
| 主体 | PT Espay Debit Indonesia Koe，自称 BI 监管的 PJP Kategori I（公司说法）[30]。App 内给 UMKM 发 QRIS 码，2024 年起有 Soundbox，可见它也做收单（推断）。Founder & CEO Vincent Henry Iswaratioso，2026-02 仍在任 [44] |
| 股东（2022 年数据） | 2022-08-10 Emtek 子公司 KMK 把部分 EAN 股份卖给 Lazadapay，作价 Rp4.53 万亿（约 US$3.045 亿）。这是买老股，钱给了 Emtek，没有进 DANA（已核实）[31]。KMK 持股由 49% 降到约 6.7%（单一来源）[32]。Sinar Mas（DSSA 经 DSST）投 US$2 亿（Rp2.95 万亿），称已是最大股东之一 [31]；按合计数推算，Sinar Mas 一份可能是 US$2.5 亿 [32]。DANA 这一轮实际收到的新资金约 Rp2.87 万亿（CEO 2023-01 口径）[32]。蚂蚁约 45% 是 2021 年前后的报道，之后可能已被稀释（低）。2024–2026 年比例未查到 |
| 用户 | 公司说法，按手机号计：2022-02 1 亿，2022-08 约 1.15 亿，2024-09 1.8 亿（日均 3,000 万笔），2024 年底 2 亿 [33]。MAU、TPV、收入、利润未查到 |
| 商户 | 自有收单商户数未查到。全国 QRIS（BI，2026-06）：商户 4,486 万（96.68% 为 UMKM），用户 6,577 万 [36] |
| 其他业务 | 2024 年起与 STAR AM 在 App 内卖基金；约 2020–21 年与 Pluang 合作推出 DANA eMAS（公司说法） |

**商户与设备模式**

* **QRIS Soundbox**（媒体）：2024-03 先向 UMKM 试点，静态 QRIS 码 + 语音播报 [34]。"按月租"只出自 detikInet 2025-11-12 对 BCA、BRI、Mandiri、DANA、OVO 的笼统描述，DANA 自己的收费方式和金额未查到 [34]。未查到动态码设备、EDC、Android POS、装机量，也未查到它采购第三方终端。印尼能量化的对标是 GoPay Spiker：Rp49,000/月 + 开通费 Rp100,000（推广性质来源，低）[45]。
* **MDR**（媒体，BI 原文未读）：BI 2026-08-17 宣布，2026-10-01 起 UKE、UME、UBE 单笔 ≤Rp100,000 由 0.7% 降为 0%；UMI 单笔 ≤Rp500,000 为 0% 不变，超出部分 0.3%；其他类别 >Rp100,000 仍为 0.7% [35]。商户不得把 MDR 转嫁消费者。DANA 公开表示支持，称在等细则 [35]。
* **含义**（推断）：QRIS MDR 由发卡方、收单方、交换机分成，DANA 作为收单方和付款钱包两头分到的小额 MDR 都归零。设备只能靠月租和交叉销售回本，补贴设备的空间变小。

**监管**

* 非银行 PJP 外资 ≤85%、本国持股 ≥15%、有表决权股份的 51% 须由本国持有（PBI 22/23/2020）；DANA 有本国股东 Sinar Mas 和 Emtek，与此相符（推断）。境内交易须经 GPN 处理（05 章 5.5）。
* 未查到 BI/OJK 处罚、数据泄露或重大故障；"余额消失"舆情见一览表（低）[44]。

**跨境**

* **日本**（媒体；框架已核实）：2025-08-17 起 DANA 用户可在日本扫 JPQR Global 码（BI–ASPI–METI–PJA 框架，日方 Netstars），App 内换算成卢比；DANA 自称第一家做到的非银行 PJP（公司说法）[37]。只限张贴 JPQR Global 码的商户：QRIS 首批 35 家，多在大阪世博会场，此后未见公开商户数；日本商户普遍张贴的是 PayPay 等自有码（[01 章](01-architecture.md) 1.1、[05 章](05-country-playbooks.md) 5.5）。DANA 在日本的交易量未查到。2025 年访日印尼游客 640,577 人次（+23.7%，JNTO）[42]。
* **Alipay+**：蚂蚁的 Antom 页面称，DANA 用户可在日、韩、马、泰、新"支持 Alipay+ 的境外商户"付款，按 IDR 结算（合作方说法）[38]。Alipay+ 在日本经 PayPay 和其他收单方受理 [39]，所以这不等于 DANA 一定能在 PayPay 商户用。反向证据（中）：2024 年 Alipay+ 公布的日本受理名单（16 个钱包和银行 App）里没有印尼钱包 [24]。DANA 是否在 PayPay 2026-06-29 的 35 项服务名单里，未核实。Antom 也把 DANA 作为线上支付方式提供给境外商户（单笔 Rp300–1,000 万，每日 ≤Rp2,000 万，可退款，不支持拒付）[38]。2024-04 蚂蚁称正与 Bank Mandiri 和 DANA 洽谈在印尼运营 Alipay+ [40]；最后落地的是 2026-04-30 的 QRIS–中国线，DANA 是否参与未查到。
* **入境印尼**：DANA 允许外国手机号注册并绑 Visa、Mastercard、Amex、JCB 卡付 QRIS（厂商说法）[30]。日本钱包扫 QRIS 尚未上线：BI 2026-04-22 称已获日本 FSA 许可，之后未见上线公告 [41]。

**加密与稳定币**

* 未查到 DANA 的加密产品（核实轮没有专门检索）。
* 印尼规则：数字金融资产监管 2025-01-10 由 Bappebti 移交 OJK 和 BI；稳定币可作 OJK 监管的交易资产，不能作支付工具（中）；《货币法》要求境内支付用卢比；BI 禁止 PJP 处理虚拟货币（低，凭记忆）；稳定币 POJK 预计 2027-01（单一来源）[43]。所以 DANA 和 INSCREEN 在印尼都不能让商户收稳定币（推断）。

## 5 对 INSPAY 的启示

### 5.1 设备订阅的经济账

| 参照 | 价格 | 约合日元/月 | ¥2,000/月 相当于 |
|---|---|---|---|
| Paytm Soundbox（2021–2023 报道值）[4] | ₹78–125/月 | ¥138–221 | 9–14 倍 |
| PhonePe SmartSpeaker [4] | ₹125/月；或 ₹999 一次性 + ₹25/月（按 36 个月摊销约 ₹53/月，摊销期为假设） | ¥221；约 ¥94 | 9–21 倍 |
| GoPay Spiker（印尼；DANA 价格未查到）[45] | Rp49,000/月 + 开通费 Rp100,000 | ¥460 | 约 4 倍 |
| TrueMoney Money Box [20][21] | 年费，金额未查到；商户 QR 收款免费 | — | — |
| PayPay ライトプラン（日本，参照）[46] | 每店 ¥1,980/月，全部门店加入后 MDR 1.60% | ¥1,980 | 约 1 倍 |
| INSCREEN（暂定，假设） | 0% 手续费 + ¥2,000/月（税別） | ¥2,000（≈ USD 13 ≈ ₹1,130 ≈ ฿420 ≈ Rp21 万） | — |

读法（推断）：

1. **三家的设备都不是利润中心。** 只有 Paytm 有财报数字：支付净收入（₹601 crore/季，含设备订阅、卡和在线 MDR、政府激励）已低于金融服务分销（₹814 crore/季，第三方转述）[1]。TrueMoney 商户收款免费、设备按年收费；DANA 的小额 MDR 归零；两家的设备收入都未查到。设备是获客和留存的入口，利润来自贷款、理财或银行业务（TrueMoney、DANA 这一点是推断）。INSCREEN 没有这些交叉销售，¥2,000/月要靠自己站住；而 11 章 3.2 的测算是，柜台租赁在 4% 月流失下月费须 ≥ ¥3,670 才能 60 个月打平（假设），比 ¥2,000 还高。
2. **印度、印尼小微段音箱的已知价格是约 USD 0.6–3/月**，东南亚其他国家多为银行免费送或一次性约 USD 12–65（12 章 12.2）。¥2,000/月是印度、印尼月费的约 4–21 倍，与 12 章一致。查到的三家主力设备都是静态码 + 播报，未查到哪家把动态码屏当小微主力产品；Paytm 有 Android POS 和 Card Soundbox，但带屏动态码机型的规格和销量未查到。
3. **日本不同，但缺的那一块正是 Paytm 的利润来源。** 日本商户本来就付 MDR（PayPay 1.98% 税別，Alipay+ 1.98%），订阅定价空间比印度大。但这份空间要靠多通道收单分润兑现（11 章 3.4："唯一有量级的一条"），稳定币单一受理撑不起来。Paytm 的做法是设备、收单和金融服务一起卖，单卖设备撑不起规模。

### 5.2 分销

* **地推是 Paytm 的壁垒，也是成本。** 商户换机成本低，2024 年竞争对手用更便宜的订阅在街头挖角 [5]。INSPAY 在日本若自建地推，CAC（11 章假设 ¥3 万/台）决定生死；更现实的是经收单方、POS 厂商、连锁总部做 B2B2M（12 章）（推断）。
* **TrueMoney 和 DANA 靠生态分销。** TrueMoney 依托 CP 零售、True 电信和 True Business；DANA 靠 App 内自助开通 QRIS。东南亚小微设备多由银行、钱包补贴（12 章 12.4.1）。INSCREEN 在东南亚小微段更现实的是做银行或 PJSP 的设备供应商，价格对标一次性约 USD 12–65 一台。若成本接近 11 章假设的 ¥2.5 万/台（约 USD 162），就是这个价格锚的 2.5–13.5 倍（12 章 12.4.1）（推断）。

### 5.3 合作选项（推断）

| 场景 | 选项 | 判断 |
|---|---|---|
| 泰国游客在日本付款（2025 年 123.3 万人次，JNTO） | INSCREEN 经 Alipay+ 收单方（含 PayPay）受理 TrueMoney | 最短路径，不必直连 TrueMoney；费率基准 1.98%。TrueMoney 已被 Alipay+ 覆盖日、韩、新、马，管理层精力在 Ascend Bank 和集团结构上，接第二张网络的动力有限。泰国银行用户另有 MyPrompt QR（CPM，经 NETSTARS/NTT DATA），INSCREEN 要受理须能扫顾客码 |
| 印尼游客在日本付款（64.1 万人次，JNTO） | INSCREEN 显示 JPQR Global（Netstars）码 | 已确认可用，但前提是商户经 Netstars 受理 JPQR Global，目前张贴商户很少；Netstars 也是 INSCREEN 在日本受理稳定币的直接竞品（11 章）。2024 年 Alipay+ 日本名单里没有 DANA，确认前不把 Alipay+ 算作 DANA 的通道 |
| 印度游客在日本付款（NTT DATA 称 2025-01–08 超过 20.8 万人） | 经 NTT DATA（NIPL 的日方伙伴）受理 UPI | MoU 已核实（2025-10-07），试点未见上线 [47][48]；要问 NTT DATA 能否把 UPI 下发到第三方终端；不找 Paytm 单家（UPI 走廊对所有 UPI App 生效） |
| 稳定币机构间结算 | 与 TrueMoney 谈 THBT ↔ 日元稳定币 PoC；日方切入点可考虑领投股东 MUFG | 可作沙盒对话，不是近期商业伙伴：THBT 仍在沙盒，BOT 第一阶段只许持牌金融机构用，SEC 禁止为加密支付提供便利 |
| 印度、印尼的结算 | 不做稳定币环节 | 印度没有稳定币支付框架、RBI 反对（二手）；印尼稳定币不能作支付工具；按"法币电汇 + 境内持牌银行"处理，与 README 中泰、马、印尼等"稳定币不入境"国家的做法相同 |
| 东南亚商户 | 经 Opn/Adyen 下发 TrueMoney QR；做 DANA、BRI 等 PJSP 的设备伙伴 | TrueMoney 用户扫法人银行 QR 要付费，INSCREEN 显示 TrueMoney 商户码能替付款人省这笔钱，是个小切入点；DANA 采购第三方终端没有证据 |

### 5.4 竞争威胁（推断）

* **Alipay+ 是入境方向的在位者。** 三家都曾有或仍有蚂蚁股东（Paytm 的 Antfin 据报 2025-08 退出；TrueMoney 少数股东；DANA 2022 年仍是股东），TrueMoney、DANA 已在 Alipay+ 体系内。本网络在东南亚→日本方向很难从 Alipay+ 手里抢这些钱包，差异化仍在日本钱包出境一侧（README）。
* **日方收单巨头也在入境方向布局。** NTT DATA × NIPL（UPI，MoU 阶段）、NETSTARS/NTT DATA（MyPrompt QR）、Netstars（JPQR Global，另有 Stablecoin Pay）。INSCREEN 在日本受理入境钱包，大概率要接这些聚合方，而它们自己也卖终端和受理服务。
* **泰国小微层**：TrueMoney 商户 QR 免费、Money Box 专治假截图，加上各银行的免费音箱和 App 播报。INSCREEN 若在泰国做"到账确认屏"，会正面撞上它们。
* **Paytm 出海**：Paytm 称经 Paytm Cloud 推进国际化、输出 AI 软件，可能成为东南亚商户设备和软件的竞争者或供应商，但未查到任何海外部署（低）[15]。
* **不是竞争者的地方**：在日本，TrueMoney 和 DANA 是要受理的入境钱包；DANA 只做印尼。

### 5.5 不要照搬的

1. **监管集中度（Paytm PPBL）。** 钱包、账户、UPI 句柄集中在一家关联银行，2024 年一纸禁令打断业务，UPI 份额从约 13%（凭记忆）降到约 8%，2026-04 牌照被吊销；之后靠四家 PSP 银行和 PPSL 全类 PA 牌照恢复 [6][7][10]。INSPAY 的结算行、资金托管和稳定币兑换方都应至少两家，避免一个持牌主体出事就整网停摆。
2. **把补贴和费率当常量。** Paytm 的支付收入受 PIDF 激励停发影响（报告口径 +13%，可比口径 +25%）[1]；印度 UPI 商户 MDR 可能部分恢复 [8]；印尼小额 MDR 刚降到零 [35]。规则一变，设备经济就变；INSPAY 的模型应对费率规则做敏感性。
3. **用利息收入撑利润。** Paytm 2026 财年的全年盈利含约 ₹854 crore 其他收入，高于税前利润 ₹582 crore（二手）[2]。11 章已把"自己托管或浮存收益"排除在 INSCREEN 收入之外，应保持。
4. **多国自持牌照扩张。** TrueMoney 退出菲律宾 [18]，Ascend Bank 被集团结构卡住 [19]。本网络在商户侧用当地持牌参与者的做法（README 第 2 条）是对的，不要改成在各国自持钱包或银行牌照。

### 5.6 待核实（按对决策的影响排序）

1. NIPL × NTT DATA 的 UPI 受理：MoU 已核实，还要查试点和上线时间、覆盖哪些商户、能否下发到第三方终端（如 INSCREEN）、结算币种（NTT DATA、NIPL 新闻稿）。
2. DANA 是否在 2026 年的 Alipay+ 官方钱包名单和 PayPay 2026-06-29 的 35 项服务名单里（2024 年名单中没有）；JPQR Global 的当前受理商户数；DANA 在日本的交易量。
3. 三家音箱的现价（一次性 + 月费或年费）、装机量、单台成本；Paytm ₹78、₹100、₹125 的引述冲突（Rest of World 原文）。
4. 《2026 年税收及其他法律（修正）法案》进度、UPI 商户 MDR 的门槛和费率；NPCI 30% 上限到 2026-12-31 是执行还是再延期。
5. Ascend Bank 是否开业；THBT 第二阶段原始公告、发行实体、储备、公链，以及 BOT 零售沙盒与"第一阶段只给金融机构"如何衔接。
6. 最新股权：Antfin 是否已全部退出 Paytm（NSE 股权结构文件）；蚂蚁在 Ascend Money、DANA 的比例（DSSA、EMTK 年报附注）。
7. Paytm 2027 财年第二季度业绩（预计 2026-10 下旬；"10-27"只来自 Screener）及国际化计划；PPSL 钱包牌照是否获批。

## 资料来源

置信度口径同 [09 章](09-sources.md)：高 = 官方一手且在线核实；中 = 二手权威或官方页面摘要；低 = 单一来源、推广性质或未核实。几乎所有链接只读到 WebSearch 摘要。

| # | 来源 | 日期 | 置信度 |
|---|---|---|---|
| 1 | Paytm 2027 财年第一季度业绩：IR 博客 https://paytm.com/blog/investor-relations/paytm-q1-fy27-results-revenue-grows-28-to-2448-crore-highest-ever-quarterly-ebitda-at-203-crore/ ；Earnings Release https://paytm.com/document/ir/financial-results/Paytm_Earning-Release_Q1-FY-2027.pdf ；MTU、商户 GMV、设备商户 https://newsable.asianetnews.com/business/paytm-q1-fy27-results-ebitda-hits-record-rs-203-crore-revenue-up-28-percent-articleshow-z9d1rbr ；金融服务 ₹814 crore https://www.multibagg.ai/market-pulse/articles/paytm-q1fy27-profit-revenue-growth-cmrux4kv70070kj0j12mfo3xd | 2026-07 | 中-高（₹814 crore 为中） |
| 2 | Paytm 盈利走势：2025-06 季度 https://paytm.com/blog/investor-relations/paytm-turns-profitable-with-rs123cr-pat-in-q1fy26/ ；2026 财年 https://scanx.trade/stock-market-news/companies/one-97-communications-reports-fy26-consolidated-net-profit-of-552-crores-reverses-prior-year-loss/39636517 ；https://inc42.com/features/paytms-profitability-milestone-comes-with-caveats/ | 2025-07 / 2026-05 | 中（2026 财年为二手） |
| 3 | Paytm 设备商户：Q1 FY24 BSE 经营更新（790 万，12 章 [46]）；2026 财年第四季度 https://nsearchives.nseindia.com/corporate/PAYTM_06052026202426_EarningsRelease.pdf | 2023-07 / 2026-05-06 | 高 / 中 |
| 4 | 印度音箱价格：https://www.business-standard.com/companies/news/paytm-can-add-15-million-new-customers-for-soundbox-in-next-2-3-years-123062500361_1.html ；https://restofworld.org/2023/india-sound-boxes-paytm-phonepe/ ；PhonePe https://cms.phonepe.com/en/mx/merchant-help/phonepe-smartspeaker/about-phonepe-smartspeaker/what-are-charges-applicable-phonepe-smartspeaker | 2023 / 检索于 2026-10 | 低-中（Paytm 引述冲突） |
| 5 | Paytm 设备与地推竞争：https://www.businessworld.in/article/paytm-soundbox-vs-the-rest-battle-heats-up-with-card-payment-introduction-490024 ；https://inc42.com/buzz/paytm-crisis-chaos-on-streets-as-banks-fintechs-lure-merchants-with-cheaper-subscriptions/ | 2023 / 2024-02 | 中 |
| 6 | PPBL：https://theprint.in/economy/rbi-cancels-paytm-payments-bank-licence-citing-rule-violations/2914153/ ；https://www.businesstoday.in/latest/corporate/story/no-impact-on-operations-paytm-after-rbi-cancels-payments-bank-licence-527406-2026-04-24 ；https://www.business-standard.com/companies/news/paytm-payments-bank-licence-cancellation-impact-one97-strategy-126042800606_1.html | 2024-01-31 / 2026-04-24 | 高（RBI 新闻稿原文未打开） |
| 7 | Paytm 牌照重建：TPAP https://www.medianama.com/2024/04/223-paytm-user-migration-psp-banks-npci-approval/ ；PA https://www.angelone.in/news/stocks/rbi-authorises-paytm-payments-services-to-operate-as-payment-aggregator-for-offline-and-cross-border-transactions ；https://www.business-standard.com/amp/companies/news/rbi-clears-paytm-arm-ppsl-as-payment-aggregator-for-offline-transactions-125121800385_1.html ；PPI 申请 https://x.com/REDBOXINDIA/status/2075137178200629470 | 2024-04 / 2025-11–12 / 2026-07 | 中-高（PPI 为低） |
| 8 | UPI 商户 MDR：https://ianslive.in/no-charges-on-upi-transactions-for-users-limited-merchant-mdr-possible-govt--20260808185557 ；https://www.angelone.in/news/economy/will-upi-payments-above-2-000-attract-charges-finance-minister-explains-proposed-mdr-framework ；"0.4%"传闻 https://payu.in/blog/upi-mdr-2026-what-the-new-charge-means-for-businesses/ | 2026-08 / 2026-09 | 中（传闻为低，不可引用） |
| 9 | NPCI 30% 上限延至 2026-12-31：https://www.businesstoday.in/amp/tech-today/news/story/npci-extends-30-upi-market-share-cap-deadline-on-3rd-party-apps-to-december-2026-459171-2024-12-31 | 2024-12-31 | 高 |
| 10 | UPI 分 App 份额与总量：https://www.oxigenwallet.com/upi/apps-market-share/ ；https://startuptalky.com/india-upi-transactions-september-2026/ | 2026-08 / 2026-09 | 中（二手整理，以 NPCI 为准） |
| 11 | Paytm UPI International：https://www.dtnext.in/news/business/paytm-users-can-now-make-international-upi-payments-in-uae-sri-lanka-singapore-france-mauritius-bhutan-and-nepal-812803 | 2024-11-21 | 高 |
| 12 | UPI–KHQR 上线：https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62857 | 2026-06 | 高 |
| 13 | Paytm 出售 PayPay SAR：https://www.medianama.com/2024/12/223-paytm-singapore-offloads-paypay-japan-stake-softbank-rs-2364-cr/ | 2024-12-06 | 高 |
| 14 | RBI 对加密与稳定币：https://www.cryptowire.in/blog/rbi-doubles-down-on-crypto-prohibition-as-parliamentary-panel-report-nears/ ；https://cryptodaily.co.uk/2026/07/rbi-crypto-ban-stablecoin-wall | 2026-07 | 低（加密媒体二手） |
| 15 | Paytm AI 与国际化：https://www.medianama.com/2026/05/223-paytm-agentic-ai-wealthtech-growth-q4-fy26/ | 2026-05 | 中（国际化部分低） |
| 16 | Ascend Money 股东与融资：https://www.forbes.com/sites/phisanuphromchanya/2024/06/27/mufg-invests-195-million-in-cp-group-backed-thai-unicorn-ascend-money/ ；https://techcrunch.com/2021/09/26/thailands-fintech-startup-ascend-money-lands-150m-at-a-1-5b-valuation/ ；https://pitchbook.com/profiles/company/161471-35 | 2021-09 / 2024-06 | 高（蚂蚁比例低） |
| 17 | TrueMoney 用户与上市：https://www.bangkokpost.com/business/general/2762969/ascend-money-targets-nasdaq-listing ；https://www.wealthtechstrategy.com/post/drivewealth-and-truemoney-to-bring-u-s-stock-investing-to-30-million-digital-wallet-users ；https://docs.antom.com/ac/antomop/truemoney | 2024 / 2026-10 / 日期不明 | 中（Antom 为低） |
| 18 | TrueMoney 菲律宾退出：https://fintechnews.ph/71228/lending/truemoney-philippines-operations-exit/ | 2026-04/05 | 中 |
| 19 | 泰国虚拟银行：https://www.nationthailand.com/business/banking-finance/40048844 ；https://www.nationthailand.com/business/banking-finance/40067592 ；https://www.bangkokpost.com/business/general/3249732/virtual-banks-allotted-more-time ；https://fintechnews.sg/134596/thailand/ascend-bank-launch-delay/ ；Ascend Bank CEO 表态 https://www.bangkokbiznews.com/finance/1250875 | 2025 / 2026-05–09 | 中（BOT 原文未打开；2026-09 一条只见摘要） |
| 20 | Money Box：https://www.techoffside.com/2024/10/truemoney-money-box-for-modern-businesses/ ；https://droidsans.com/true-money-box-for-business/ | 2024-10 | 中 |
| 21 | TrueMoney 费率与受理面：https://www.truemoney.com/a/sme-activity-03/ ；https://www.truemoney.com/fee/ ；https://www.truemoney.com/qr-payment/ ；https://support.truemoney.com/knowledge-base/ | 2024-06 起 | 中（公司说法） |
| 22 | TrueMoney QR 网关文档：https://docs.opn.ooo/truemoney-qr ；https://docs.adyen.com/payment-methods/truemoney.md ；https://docs.hitpayapp.com/payments/cross-border/truemoney | 2025–2026 | 中 |
| 23 | PayPay 商户受理 TrueMoney：https://about.paypay.ne.jp/en/pr/20230615/01/ | 2023-06-15 | 中-高（本轮未复检） |
| 24 | Alipay+ 在日本 200 万商户、16 个钱包（名单中没有印尼钱包，据审校时的搜索摘要）：https://www.businesswire.com/news/home/20240327604903/en/Alipay-Connects-2-Million-Merchants-in-Japan-as-Global-Tourists-Travel-to-the-Country-for-Cherry-Blossom-Season ；PayPay × Alipay 300 万商户 https://www.businesswire.com/news/home/20241105682881/en | 2024-03-27 / 2024-11-05 | 中 |
| 25 | PayPay 新增 ShopeePay、SCB PLANET PLUS（35 项服务）：https://about.paypay.ne.jp/en/pr/20260629/01/ | 2026-06-29 | 高 |
| 26 | Alipay+ × ZeroPay：https://www.businesswire.com/news/home/20230831026956/en/ZeroPay-Introduces-Alipay-at-1.7-Million-Merchants-in-South-Korea-Promoting-Convenient-Experience-for-Asian-Tourists ；SGQR、DuitNow 见 ALIPAY-VERIFY | 2023-04 至 2023-10 | 高（SGQR、DuitNow 为中） |
| 27 | THBT：https://www.brandbuffet.in.th/2025/08/truemoney-launched-thbt-as-a-pilot-test-in-the-enhanced-regulatory-sandbox/ ；https://technode.global/2026/09/15/truemoney-fireblocks-thbt-thailand-blockchain-payments/ | 2025-08 / 2026-09-15 | 中 |
| 28 | THBT × StraitsX 路线图：https://www.asiatechreview.com/p/thailands-true-money-wants-to-use | 2025–2026 | 低 |
| 29 | 泰国规则：https://blockchain.bakermckenzie.com/2022/03/27/thai-sec-bans-cryptocurrency-as-a-means-of-payment ；https://www.thestar.com.my/aseanplus/aseanplus-news/2026/06/27/bank-of-thailand-to-unveil-thai-baht-stablecoin-rules ；https://www.sec.or.th/EN/Pages/Shortcut/TouristDigiPay.aspx | 2022-03 / 2026-06 | 高（BOT 部分为中） |
| 30 | DANA 公司页与游客指南：https://www.dana.id/corporate/biz-group ；https://www.dana.id/blog/can-tourist-use-qris-in-indonesia/ | 检索于 2026-10 | 中（公司说法） |
| 31 | DANA 2022 年股权交易：https://market.bisnis.com/read/20220811/192/1565601/grup-emtek-emtk-jual-saham-dana-rp45-triliun-ke-lazada ；https://market.bisnis.com/read/20220811/192/1565693/grup-sinarmas-dssa-rampungkan-akuisisi-dana-rp295-triliun | 2022-08-11 | 高 |
| 32 | DANA 股权补充：https://dealstreetasia.com/?p=303979 ；https://investasi.kontan.co.id/news/dian-swastatika-dssa-kembali-menyuntikkan-investasi-us-200-juta-ke-dana ；https://finansial.bisnis.com/read/20230122/563/1620547/ceo-dana-beberkan-penggunaan-investasi-dari-sinar-mas-dan-lazada-rp287-t | 2022-08 / 2023-01 | 中 |
| 33 | DANA 用户：https://finansial.bisnis.com/read/20250128/563/1835241/dana-klaim-miliki-200-juta-pengguna-begini-dasar-perhitungannya ；https://teknologi.bisnis.com/read/20240926/84/1802754/dana-klaim-punya-180-juta-pengguna-kelola-30-juta-transaksi-per-hari ；https://teknologi.bisnis.com/read/20220224/266/1504446/dana-umumkan-telah-tembus-100-juta-pengguna | 2022-02 至 2025-01 | 中（公司说法） |
| 34 | DANA Soundbox：https://keuangan.kontan.co.id/news/tingakatkan-kepercayaan-pelaku-usaha-dana-luncurkan-soundbox-qris ；https://selular.id/2024/04/teknologi-qris-soundbox-dana-beraksi-di-kedai-kopi/ ；https://inet.detik.com/business/d-8207135/cara-kerja-qris-soundbox-lindungi-pedagang-dari-bukti-transfer-palsu/amp | 2024-03/04 / 2025-11-12 | 中 |
| 35 | QRIS MDR 0% 扩大与 DANA 回应：https://infobanknews.com/bi-bebaskan-tarif-mdr-qris-transaksi-rp100-ribu-mulai-1-oktober-2026 ；https://keuangan.kontan.co.id/news/ini-respons-dana-soal-perluasan-kebijakan-mdr-qris-0-mulai-oktober-2026 ；BCA 通知见 12 章 [2] | 2026-08/09 | 中（BI 原文未读） |
| 36 | QRIS 全国数据（BI，Kontan 引用）：https://keuangan.kontan.co.id/news/ini-respons-dana-soal-perluasan-kebijakan-mdr-qris-0-mulai-oktober-2026 | 2026-06 数据 | 中 |
| 37 | DANA 在日本付款：https://www.indotelko.com/read/1755732009/kini-bayar-qris-di-jepang-bisa-pakai-dana | 2025-08-21 | 中 |
| 38 | Antom 的 DANA 页面与支付方式文档：https://knowledge.antom.com/dana ；https://global.alipay.com/docs/ac/payment_method/DANA | 日期不明 | 中（合作方说法） |
| 39 | Alipay+ 在日本经 PayPay 及其他收单方受理：https://www.alipayplus.com/news/detail/paypay-accepted-in-south-korea ；https://about.paypay.ne.jp/en/pr/20250916/01/ | 2025-09 | 中-高 |
| 40 | 蚂蚁与 Mandiri、DANA 洽谈 Alipay+：https://www.freemalaysiatoday.com/category/business/2024/04/19/chinas-ant-group-in-talks-to-launch-alipay-in-indonesia | 2024-04-19 | 中 |
| 41 | 日本→印尼入境方向（BI 副行长）：https://www.metrotvnews.com/read/N6GCVl8e-turis-jepang-bisa-iscani-qr-saat-belanja-di-ri-qris-segera-berlaku | 2026-04-22 | 中 |
| 42 | JNTO 2025 年访日人数：https://asset.japan.travel/image/upload/v1769050010/pdf/Number_of_visitor_arrivals_to_Japan_in_December_2025.pdf | 2026-01 | 高 |
| 43 | 印尼稳定币规则：https://ojk.go.id/en/berita-dan-kegiatan/siaran-pers/Pages/Bappebti-Transfers-Regulation-and-Supervision-Duties-on-Digital-Financial-Assets-Crypto-Assets-and-Derivatives-to-OJK-BI.aspx ；https://gpg-pdf.chambers.com/fintech-2026/401/ ；https://investortrust.id/market/118744/pojk-stablecoin-terbit-januari-2027-begini-kabar-terbaru-dari-ojk-termasuk-soal-rupiah-digital | 2025-01-10 / 2026 | 中 |
| 44 | DANA 舆情与 CEO：https://investortrust.id/financial/42144/ramai-kabar-saldo-pengguna-hilang-di-medsos-dana-itu-dihembuskan-haters ；https://investortrust.id/financial/94361/founder-dan-ceo-dana-vincent-henry-iswaratioso-lebih-banyak-pemain-lebih-baik | 日期不明 / 2026-02-11 | 低 / 中 |
| 45 | GoPay Spiker 价格：见 12 章 [10] | 2025–2026 | 低（推广性质） |
| 46 | PayPay 加盟店费率、ライトプラン、Alipay+ 1.98%：见 11 章 [28] | 2026 | 高 |
| 47 | NTT DATA × NIPL MoU（UPI 在 NTT DATA 收单商户受理，初期限印度游客）：https://www.nttdata.com/global/en/news/press-release/2025/october/100700 ；https://ianslive.in/npci-international-ntt-data-japan-sign-pact-for-upi-acceptance-in-japan--20251014140730 | 2025-10-07 / 2025-10-14 | 中-高（官方新闻稿，只读到摘要） |
| 48 | UPI 在日本试点、未见上线：https://www.business-standard.com/finance/personal-finance/japan-to-accept-upi-soon-making-payments-easier-for-indian-tourists-125102000368_1.html ；https://www.angelone.in/news/economy/upi-set-for-trial-launch-in-japan-to-support-rising-indian-tourist-footfall ；https://www.freepressjournal.in/amp/business/indias-upi-likely-to-launch-in-japan-after-trial-with-ntt-data-report | 2025-10 至 2026-01 | 中（媒体；"未上线"是截至检索未见） |
