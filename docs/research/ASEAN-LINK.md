# 东盟区域支付互联（RPC）与 Project Nexus：联通矩阵、技术模型与 INSPAY 切入点（截至 2026-10-18）

## 0. 方法与局限

- **资料基础**：先读了同目录种子文件 TH-LA.json、SG-MY.json、JP-PAYPAY.json，以及上一轮的 ASEAN-LINK.json（只做了 6 次检索、多数条目 low）和 ALIPAYPLUS.json。种子里已是 high 的事实没有重新检索，直接引用（标“种子”）。
- **本轮检索**：WebSearch 共 25 次（达到上限后停止）。重点补了：印尼、越南、柬埔寨、菲律宾相关各对；日本相关全部（JPQR Global 与 QRIS/KHQR/DuitNow、PayPay 海外模式、TWQR/HIVEX）；Nexus 的 BIS 设计文档（docs.bis.org/nexus）与 NGP 2026 年进展；DuitNow 跨境的 FX、退款和到账规则。
- **WebFetch**：试了 1 次 docs.bis.org，DNS 失败（ENOTFOUND），之后没再试。所有“在线核实”都来自 WebSearch 返回的官方页面或权威媒体摘要，没有逐页打开原文。
- **置信度口径**：high = 官方一手（央行、交换机、BIS 文档、公司新闻稿）且检索摘要直接给出；medium = 二手权威媒体，或官方来源但细节不全；low = 记忆或单一非权威来源，note 里写“未核实”。查不到的写“未查到”，没有编造日期、数字或接口名。
- **方向记法**：“A→B”表示 **A 国用户在 B 国扫 B 国商户码**（A 出境 outbound / B 入境 inbound）。“双向”表示两个方向都已上线。
- **主要局限**：
  - 各对联通的结算周期、交换机之间的费用分摊、退款报文都**没有公开规范**；
  - 东盟官方“29 条”的逐条清单没找到原文；
  - 菲律宾、缅甸、文莱和阿联酋相关的信息很少；
  - 2026 年 7–10 月的最新动态可能有遗漏。

---

## 1. 总览与核心结论

### 1.1 规模与节奏

- **截至 2025-12，东盟区域内及与外部伙伴共有 29 条 QR 与 P2P 即时支付联通**。2025 年跨境 QR 3,620 万笔、7.164 亿美元；P2P 160 万笔、3.057 亿美元（第 13 届 AFMGM 联合声明的媒体转述，medium）。
- **2026 年新增或扩展的联通**（本轮核实）：
  - 印尼–韩国（2026-04-01）、印尼–中国（2026-04-30）；
  - 越南–中国 Alipay 扩展（2026-04-03）、越南–韩国（2026-04-23）；
  - 印度 UPI–柬埔寨 KHQR（2026-06-02）；
  - 台湾 TWQR Inbound（2026-04-14，首波为 PayPay 与新加坡 NETS）；
  - 柬埔寨–老挝二期（2025-12-19）。
  - 由此推算，截至 2026-10 的联通数已明显超过 29 条（推断）。
- **马来西亚**：2025 年跨境 QR 2,970 万笔（同比 2.5 倍），其中 Alipay+ 占入境 >80%（种子，high/medium）。
- **印尼**：截至 2026-04 初，QRIS 跨境入境约 590 万笔、出境约 170 万笔（媒体，medium）。

### 1.2 核心结论

1. **主流模型已从“央行对央行的双边 switch-to-switch”扩展为“国家交换机 ↔ 私营跨境网络 + 本地结算行”。**
   - 2024–2026 年新增联通中，一半以上的对端是私营网络或钱包，而不是外国国家交换机：
     - Alipay+/Ant（泰国 NITMX，经 Krungthai，2025-10；越南 NAPAS，经 Vietcombank，2026-04；柬埔寨 Bakong，2024-10；马来西亚 PayNet，2023-10；新加坡 NETS，2023-04）；
     - UnionPay（老挝 LAPNet、马来西亚 PayNet、泰国、新加坡 NETS）；
     - 韩国 GLN International（越南 NAPAS 2026-04、老挝 BCEL、泰国 SCB）、BC Card（PayNet）；
     - HIVEX/TBCASoft（台湾 FISC）；
     - Wise（直连 PayNet，2026-07-30）。
   - **这正是 INSPAY 可以复制的模板**：私营网络签约国家交换机的跨境网关，再指定一家本地结算行。
2. **日本是“入境多、出境近乎空白”的结构。**
   - 入境已上线：
     - 印尼 QRIS 用户扫 JPQR Global（2025-08-17）；
     - 柬埔寨 KHQR 用户扫 JPQR（2025-07-04）；
     - 泰国用户出示 MyPrompt QR，日本商户扫（CPM）；
     - 大量东南亚钱包经 Alipay+ 在 PayPay 商户付款（2026-06-29 新增越南 MoMo、VCB Digibank、Zalopay，ShopeePay（SG/TH），SCB PLANET PLUS 等）。
   - 出境方向：
     - 东南亚**无一国家码对日本钱包开放**。
     - QRIS“日本人在印尼扫码”：BI 称已拿到日本 FSA 许可、“即将”上线（2026-04-22），截至检索未见正式上线；
     - KHQR–JPQR 二期（JPQR 侧用户扫 KHQR）仍是计划；
     - PayPay 海外模式只覆盖韩国（Alipay+/ZeroPay）和台湾（HIVEX/TWQR）。
3. **Nexus**：
   - Indonesia 已于 2026-02-02 由特别观察员转为正式成员（BI 新闻稿，解决了上一轮的信息冲突）；
   - NTO 为 PayNet–NETS 合资公司，目标 2027 年上线；
   - 首版只做 A2A 账户转账，用别名或账号发起；**商户 QR（P2M）在 BIS 文档中列为未来演进**；
   - **第三方 FX Provider 只需“持牌、受监管”，不必是银行或支付机构**；在只允许银行加入 IPS 的国家，非银 FXP 须经 SAP 间接接入。
   - 日本未见加入计划。
4. **对 INSPAY**：最现实的路径是“**单国交换机跨境网关 + 本地结算行**”（Alipay+/GLN/HIVEX/Wise 模式）。稳定币用于 INSPAY 与各地结算行（或其关联 VASP）之间的跨境资金腿与净额轧差。并行做两件事：
   - 与 Netstars/PJA 合作“日本出境”方向，承接 QRIS 的日本入印尼方向和 KHQR 二期；
   - 跟踪 Nexus 的 FXP 角色。
   - 主要竞争者是 **Alipay+**（覆盖最广）和 **HIVEX**（软银系，已连 PayPay，正向菲律宾扩展）。

---

## 2. 跨境 QR / P2P 联通矩阵（截至 2026-10）

> 来源编号见 §2.9。“结算/FX”一栏写已公开的结算行、本币结算框架或报价方，未公开的写“未查到”。限额指游客侧的公开限额。

### 2.1 东盟内部（泰国为枢纽）

| 国家对 | 联通 | 上线 | 方向 | 运营方 | 结算 / FX | 游客限额 | 来源 | 置信度 |
|---|---|---|---|---|---|---|---|---|
| 泰–新 | PromptPay ↔ PayNow（P2P，手机号） | 2021-04-29 | 双向 | NITMX ↔ 新方 PayNow 运营方（ABS/BCS，记忆） | 参与银行报价（未查到细节） | S$1,000 或 THB25,000/日 | S1 | high（运营方 low） |
| 泰–新 | Thai QR ↔ NETS QR（P2M） | 2018 计划；2022-08-04 扩展 | 双向（新→泰：DBS PayLah!/OCBC，800 万+ 泰国受理点；泰→新：扫 NETS QR） | NITMX ↔ NETS | 未查到 | 未查到 | S18 | medium |
| 泰–马 | PromptPay/Thai QR ↔ DuitNow QR | 一期 2021-06-18（泰→马）；二期马→泰日期未查到，现已有 Public Bank 等提供 | 双向 | NITMX ↔ PayNet | **CIMB Group / CIMB Thai 为跨境结算行**；马来西亚出境汇率为“PayNet 设定、入账日汇率”（CIMB FAQ） | 马方 RM3,000/笔；日限 RM10k–50k，按银行不同 | S3、S50 | high / medium |
| 泰–印尼 | Thai QR ↔ QRIS | 试点 2021-08-17；实施 2022-08-29（76 家机构） | 双向 | NITMX ↔ ASPI（BI/BOT 指导） | 本币结算（BI–BOT LCS 框架，记忆 low） | 未查到 | S4 | high（LCS low） |
| 泰–越 | Thai QR ↔ VietQR | 2021-03-26 | 双向（分阶段细节未查到） | NITMX ↔ NAPAS | 未查到 | 未查到 | S2 | high（方向 medium） |
| 泰–柬 | Thai QR ↔ KHQR | 2023（见报 2023-06；维基表列 2020） | 双向 | NITMX ↔ NBC/Bakong | 未查到 | 泰国用户 THB10 万/笔、50 万/日（种子） | 种子 TH-LA、S17 | medium |
| 泰–老 | Thai QR ↔ LAO QR | 一期 2024-04-03（老→泰）；二期 2024-06 底（泰→老，Krungsri 首家） | 双向 | NITMX ↔ LAPNet | 结算行 **KBank、BCEL** | 未查到 | S5 | high |
| 泰–菲 / 泰–缅 / 泰–文莱 | — | 未查到 | — | — | — | — | — | — |
| 马–新 | DuitNow QR ↔ NETS QR | 2023-03-31 | 双向（线下 + 跨境电商） | PayNet ↔ NETS | 结算行未查到 | 未查到 | S9 | high |
| 马–新 | DuitNow ↔ PayNow（P2P） | 2023-11-17 | 双向 | PayNet ↔ PayNow 体系 | 未查到 | RM3,000 / S$1,000 每日 | S10 | medium |
| 马–印尼 | DuitNow QR ↔ QRIS | 试点 2022-01-27；商用 2023-05-08 | 双向 | PayNet ↔ ASPI | **LCS 框架下由 ACCD 银行报价** | 马方 RM3,000/笔 | S11 | medium |
| 马–柬 | DuitNow QR ↔ KHQR | 一期 2024-09-19（柬→马，Bakong 扫 DuitNow）；二期 2025-04-08（马→柬） | 双向 | PayNet ↔ NBC | 未查到 | 未查到 | S12 | high |
| 马–越 | — | 2023 起称“即将”，**未查到上线** | — | — | — | — | technave 2023 | low |
| 马–菲 | DuitNow ↔ QR Ph（经 InstaPay 桥接） | BSP 称“2026 年内上线”（2026-02），**未查到已上线** | 规划：马→菲 | PayNet ↔ BancNet/InstaPay（推断） | 未查到 | 未查到 | S41 | medium（计划） |
| 印尼–新 | QRIS ↔ NETS QR | **2023-11-17**（新加坡金融科技节现场，BI 行长与 MAS 董事总经理共同启动） | 双向（经各自手机银行 App） | ASPI ↔ NETS | BI–MAS 另设 **IDR/SGD 本币结算框架**配套 | 未查到 | S13 | **high（种子 low→high）** |
| 越–柬 | VietQR ↔ KHQR | **2023-12-03**（暹粒）；MoU 2022-11-08 | 双向（柬→越以瑞尔付，越→柬以越南盾付） | NAPAS ↔ NBC | 本币计价 | 未查到 | S14 | high |
| 越–老 | VietQR ↔ LAO QR | 2025-01 | 越→老已上线；老→越为后续阶段 | NAPAS ↔ LAPNet | LAK/VND 本币，实时汇率；7 家越南银行、14 家老挝银行 | 未查到 | S15 | high |
| 柬–老 | KHQR ↔ LAO QR | 一期 2023-08；二期 2025-12-19（老→柬，约 450 万 KHQR 商户） | 双向 | NBC ↔ LAPNet（BOL） | 结算行 **ACLEDA Bank Plc. / ACLEDA Bank Lao** | 未查到 | S16 | high |
| 柬–新 | KHQR ↔（NETS？） | 2026-08 报道称柬埔寨已与新加坡建立双边 QR 联通，细节未查到 | 未查到 | 未查到 | 未查到 | 未查到 | S17 | low |
| 新–菲 | PayNow/QR ↔ InstaPay/QR Ph | 2021-11 MAS–BSP 同意推进，**未查到上线** | — | — | — | — | S42 | medium（计划） |
| 印尼–越/菲/柬/老 | — | 未查到 | — | — | — | — | — | — |
| 菲律宾 QR Ph（全部对） | — | **未查到任何已上线的国家级双边联通**；私营方面有 RCBC–HIVEX–Novus MOU（2026-07，探索） | — | — | — | — | S41、S43 | medium |
| 缅甸 MMQR / 文莱 | — | 未查到 | — | — | — | — | — | — |

### 2.2 东盟–日本（重点）

| 对 | 联通 | 上线 | 方向 | 运营方 / 参与方 | 结算 / FX | 限额 | 来源 | 置信度 |
|---|---|---|---|---|---|---|---|---|
| 印尼→日 | QRIS App 扫 **JPQR Global** | 2025-08-17（BI 新闻稿）；2025-08-25 BI 雅加达仪式 | 仅印尼用户在日本付款（日本入境） | BI、ASPI；METI、PJA（一般社団法人キャッシュレス推進協議会）、**Netstars** | 日元标价，实时换算扣 IDR；FX 报价方与结算行**未查到**；BI–日本财务省 LCT（JPY/IDR）是否用于本联通：未查到 | 未查到 | S19 | high（细节 medium） |
| 日→印尼 | 日本 App 扫 QRIS | **未上线**。2026-03 BI 称其与“日本 switching 公司 Netstars”已取得双向交易所需许可，但首期只做出境；2026-04-22 BI 副行长称已获日本 **FSA** 许可、“很快”上线；Bisnis 2026-03-19 标题称“日本游客可用 QRIS”，与此矛盾 | 计划：日本出境 | 同上 | 未查到 | 未查到 | S20 | medium |
| 柬→日 | Bakong、ACLEDA mobile、Sathapana mobile 扫 JPQR | **2025-07-04**（大阪启动；种子写 07-05 起可用，取仪式日 / 可用日之别） | 一期：柬埔寨用户在日本付款 | NBC；PJA / Netstars（种子） | 未查到 | 未查到 | S21 | high（日期）/ medium |
| 日→柬 | JPQR 用户扫 KHQR | 二期**计划**，未查到上线 | 计划：日本出境 | 同上 | 未查到 | 未查到 | S21 | medium |
| 泰→日 | 泰国用户在手机银行出示 **MyPrompt QR（CPM）**，日本商户扫 | Krungsri 2019 试点；2022 前后接入 NETSTARS；BOT 跨境页（2026-05） | 仅泰国出境 | 泰国商业银行 + 日本服务商（NETSTARS、NTT DATA），BOT 支持 | 泰国银行侧 | Krungsri：THB10 万/笔、50 万/日；约 9,000 家日本门店（2026-02） | S8、种子 | high / medium |
| 马→日 | DuitNow 在日本 | 2024 年报道称“2025 财年实现”，**未查到上线** | 计划 | PayNet / METI | — | — | S22 | low |
| 越→日 | NAPAS“2025 年扩展至日本” | 前瞻表述，**未查到上线** | 计划 | NAPAS | — | — | S32 引 Vietnam News | low |
| 东南亚钱包→日（私营） | 经 Alipay+ 在 PayPay 商户付款 | 持续扩展；2026-06-29 新增 MoMo、VCB Digibank、Zalopay（越）、ShopeePay（新、泰）、SCB PLANET PLUS（泰）等 | 日本入境 | Alipay+（MPP）→ PayPay（ACQP） | Alipay+ 体系 | — | S25 | medium-high |
| 日→新/马/泰/越/菲/老/柬/印尼 | PayPay 等日本钱包扫东南亚国家码 | **全部未上线**（PayPay 海外模式不含东南亚） | — | — | — | — | S23、S24 | medium（基于检索未见） |

**JPQR Global 与 Netstars 的定位**：
- BI 把 Netstars 称作“日本的 switching 公司”，承担日本侧交换和网关角色（S20）。
- Netstars FY2025 资料称“为入境需求连通了印尼和柬埔寨”，并在卡塔尔有 3,000+ 门店（二手财报摘要，low–medium，S55）。
- **日本没有央行运营的国家 QR 交换机。** JPQR 是 PJA 制定的标准，跨境入口实际由 Netstars 这家私营公司承担，这和东盟“央行背书的国家交换机”结构不同。

### 2.3 东盟–韩国

| 对 | 联通 | 上线 | 方向 | 运营方 | 结算 / FX | 来源 | 置信度 |
|---|---|---|---|---|---|---|---|
| 印尼↔韩 | QRIS ↔ 韩国（KFTC） | **2026-04-01** | 已上线：印尼→韩（印尼人在韩国用 QRIS App）；韩→印尼：2026-03 报道称“韩国居民仍在等待” | BI、BOK、ASPI、**KFTC（금융결제원）** | **LCT 框架，IDR/KRW 直接兑换**，不经美元 | S26 | high（反向 medium） |
| 韩→越 | 韩国钱包扫 VietQR | **2026-04-23** | 韩国游客在越南付款 | NAPAS × **GLN International**、BIDV、Hana Bank；SBV 副行长出席 | BIDV / Hana（推测为结算行，未明示） | S27 | high |
| 韩→泰 | KB Wallet（GLN）扫 Thai QR | 2023 | 韩→泰 | SCB × KB Kookmin × GLN | 免手续费 | 种子 TH-LA | medium |
| 韩→老 | GLN 钱包扫 BCEL OnePay 码，并可在 BCEL ATM 扫码取现 | 2022-12 | 韩→老 | BCEL × GLN | 未查到 | S29 | medium |
| 韩→马 | BC Card（Paybooc）扫 DuitNow | 一期已上线（日期未查到）；二期出境未定 | 韩→马 | PayNet × BC Card | 未查到 | S30 | medium |
| 韩→新/柬/菲等 | Kakao Pay、Naver Pay、Toss 经 Alipay+ 扫 SGQR（NETS）等 | 2023-04 起（SGQR） | 私营 | Alipay+ | Alipay+ 体系 | 种子 SG-MY | medium |
| 日→韩 | **PayPay 海外支払いモード** | 2025-09-30 | 日本出境 | **Alipay+**；Alipay+ 与 ZeroPay 标识店铺 200 万+；ZeroPay 店仅支持 MPM | 网络或收单方日汇率 + **3.85%** 海外事务手续费 | S23 | high |

### 2.4 东盟–中国

| 对 | 联通 | 上线 | 方向 | 运营方 | 结算 / FX | 来源 | 置信度 |
|---|---|---|---|---|---|---|---|
| 中→泰 | Alipay / UnionPay / WeChat Pay 扫 PromptPay 商户码 | **2025-10-30**（Ant 线 2025-10-26 宣布） | 中→泰；泰国出境规划 2026–2027 | NITMX + Alipay、UnionPay、WeChat Pay | 结算行 **Bangkok Bank、Krungthai**（Ant 线为 Krungthai）；首批只能扫 6 家银行的商户码 | S7 | high |
| 中↔印尼 | QRIS ↔ Alipay / UnionPay | **2026-04-30**（BI 正式启动，此前试点） | 双向（印尼 QRIS App 可在中国扫 Alipay/UnionPay 码，反之亦然） | BI、ASPI；Alipay、UnionPay | 未查到（推测为 IDR/CNY LCT，low） | S31 | medium |
| 中→越 | Alipay 用户扫 NAPAS 网络商户码 | **2026-04-03** 扩展 | 中→越；越→中由 Sacombank 等 2026 年推进 | NAPAS × Ant International | 结算行 **Vietcombank**，RMB–VND 直接兑换 | S32 | high（反向 medium） |
| 中→马 | UnionPay 扫 DuitNow；Alipay 经 Alipay+ 扫 DuitNow | 2023-09（银联）；2023-10-31（Alipay+） | 中→马；反向“稍后” | PayNet × UnionPay International / Ant | 未查到 | S33 | medium |
| 新→中 | OCBC 用户在中国微信支付商户扫码 | 2025-11-28 签约，计划 2026 Q1 | 新→中 | UnionPay International × NETS | 未查到 | S34 | medium |
| 中→柬 | Alipay+ ↔ Bakong / KHQR | 2024-10 | 中（Alipay+ 钱包）→柬 | NBC × Ant International | 未查到 | S35 | medium |
| 中→老 | UnionPay App、经 MobileWallet Connect 的中国钱包扫 LAO QR | 2024-12-19 | 中→老 | **UnionPay International**（注意：不是印度 UPI）× LAPNet | 未查到 | S36 | high |
| 中–菲 | — | 未查到 | — | — | — | — | — |

### 2.5 东盟–印度

| 对 | 联通 | 上线 | 方向 | 运营方 | 结算 / FX | 限额 | 来源 | 置信度 |
|---|---|---|---|---|---|---|---|---|
| 新–印 | PayNow ↔ UPI（P2P） | 2023（记忆：2023-02-21） | 双向 | 新方 PayNow 体系 ↔ NPCI/NIPL | 参与银行报价（记忆） | 记忆：约 S$1,000/日，未核实 | S37（走廊存在：high）；日期与限额为记忆 | 走廊 high / 日期 low |
| 印→马 | UPI App 扫 DuitNow | 2026-02 签约；一期印→马，二期马→印；**上线未确认** | 计划 | PayNet × NIPL | 未查到 | 未查到 | S38 | high（签约） |
| 印→柬 | UPI App 扫 **KHQR**（450 万+ 商户） | **2026-06-02**（金边） | 一期印→柬；二期柬→印 | **NIPL × ACLEDA Bank Plc.** | ACLEDA 为柬方合作行 | 未查到 | S39 | high |
| 印–印尼 | — | BI 称“密集磋商”，2026 年目标，**未上线** | — | — | — | — | S40 | medium |
| 印–泰/越/菲/老 | — | 未查到（老挝“UPI”新闻实为 UnionPay International） | — | — | — | — | — | — |
| Nexus | 印度 RBI 为 NGP 创始成员；下一阶段预计接入 UPI | — | 多边 | NGP | — | — | 种子 | medium |

### 2.6 东盟–香港、台湾、阿联酋

| 对 | 联通 | 上线 | 方向 | 运营方 | 结算 / FX | 限额 | 来源 | 置信度 |
|---|---|---|---|---|---|---|---|---|
| 港↔泰 | FPS ↔ PromptPay（扫码） | 2023-12-04 | 双向 | HKICL ↔ NITMX | 结算行 HSBC、Bangkok Bank（报道） | 香港用户 HK$10,000/日；7 家银行 + 2 家 SVF | S6 | high / medium |
| 港–印尼 | — | BI 2026 年目标（与印度、东帝汶并列），**未上线** | — | — | — | — | S40 | medium（计划） |
| 港–其他东盟 | AlipayHK 经 Alipay+ 在多国受理 | — | 私营 | Alipay+ | — | — | 种子 | medium |
| 新→台 | NETS 用户扫 **TWQR** | **2026-04-14**（TWQR Inbound 首波：PayPay 与新加坡 NETS） | 新→台 | 财金资讯（FISC）× NETS | 台方清算行为玉山银行（PayPay 线；NETS 线未查到） | 未查到 | S24 | medium |
| 台→东南亚 | TWQR Outbound 目前只有日本、韩国 | — | — | FISC | — | — | S44 | medium |
| 台–菲（私营） | RCBC、HIVEX、Novus MOU：探索让 HIVEX 钱包用户在 HIVEX 受理市场付款 | 2026-07 MOU | 探索 | TBCASoft（HIVEX） | — | — | S43 | medium |
| 日↔台 | PayPay 用户在台湾扫 TWQR（经 HIVEX）；台湾玉山、街口、全支付用户在 PayPay 商户付款（经 HIVEX，2024-10 起） | 出境 2026-04-27；入境 2024-10 | 双向（经私营网络） | HIVEX × FISC × PayPay | 日汇率 + 3.85%（PayPay 侧） | 未查到 | S24、technews 2024-10 | high / medium |
| 阿联酋–东盟 | — | **未查到任何已上线联通**。维基 QRIS 条目称截至 2024-08 印尼与韩国、阿联酋签过 MoU（韩国已于 2026-04 落地）；阿联酋 2026-07 与银联签 3 份 MoU（国家 QR 互操作等），对象是中国 | — | Al Etihad Payments（Aani/Jaywan） | — | — | S45 | low–medium |

### 2.7 日本出境（日本钱包付海外）全景

| 渠道 | 覆盖 | 性质 | 状态 |
|---|---|---|---|
| PayPay 海外支払いモード × Alipay+ | 韩国（Alipay+ 与 ZeroPay 店铺 200 万+） | 私营网络 | 2025-09-30 上线（high） |
| PayPay 海外支払いモード × HIVEX | 台湾（TWQR 40 万+ 处，支持 CPM 和 MPM） | 私营网络对国家码 | 2026-04-27 上线（high） |
| JPQR Global → QRIS | 印尼 | 国家级（BI 与 METI/PJA/Netstars） | 获 FSA 许可，“即将”（2026-04），未见上线（medium） |
| JPQR → KHQR（二期） | 柬埔寨 | 国家级 | 计划（medium） |
| 东南亚其余国家码 | 泰、马、新、越、菲、老 | — | 无（medium） |

### 2.8 矩阵观察

- **泰国（NITMX）连接面最广**：新、马、印尼、越、柬、老、港、中，加上日本单向 CPM。之后是马来西亚（PayNet）、柬埔寨（Bakong）和印尼（ASPI）。印尼 2026 年扩张最快，目标是全年与 8 个国家合作。
- **菲律宾是最大空白**：QR Ph 无任何已上线跨境联通；马来西亚线计划 2026 年内上线。
- **越南补齐了中、韩两条线**，但没有和马、新、印尼的联通。
- **2026 年新增联通多为外部伙伴**（中、韩、印），且私营网络（Ant、GLN、银联）成为国家交换机的主要对端。

### 2.9 来源编号

| 编号 | 来源 | 日期 |
|---|---|---|
| S1 | BOT news-20210429 | 2021-04-29 |
| S2 | BOT news-20210324-1 | 2021-03-24 |
| S3 | BOT news-20210618 | 2021-06-18 |
| S4 | BOT news-20210817-2；news-20220829-1 | 2021-08-17；2022-08-29 |
| S5 | BOT news-20240403 | 2024-04-03 |
| S6 | HKMA 20231204-3；aseanbriefing | 2023-12-04 |
| S7 | BOT news-20251030；BusinessWire 20251026 | 2025-10 |
| S8 | BOT cross-border-payment 页 | 2026-05 |
| S9 | BNM qrcode-connectivity-my-sg | 2023-03-31 |
| S10 | MAS 2023 media release | 2023-11-17 |
| S11 | selangorjournal | 2023-05-08 |
| S12 | BNM khqr-pr；BIS review r250409e | 2024-09；2025-04 |
| S13 | BI sp_2531023（BI–MAS 联合新闻稿） | 2023-11-17 |
| S14 | vietnamnews 1637543 等 | 2023-12 |
| S15 | vietnamnews 1690482 | 2025-01-11 |
| S16 | NBC news_info id=877 | 2025-12-19 |
| S17 | vietstock（柬埔寨扩展东盟跨境 QR） | 2026-08 |
| S18 | fintechnews.sg 63141 | 2022-08 |
| S19 | BI sp_2719325；antaranews | 2025-08 |
| S20 | Metro TV；Bisnis 20260319 | 2026-04-22；2026-03-19 |
| S21 | fintechnews.sg 113469；b2b-cambodia；paymentsjapan.or.jp | 2025-07 |
| S22 | imoney；IDE Policy Brief 242 | 2024-03；2025-04 |
| S23 | PayPay 20250916 / 20250930 | 2025-09 |
| S24 | PayPay 20260427；ctee 20260415 | 2026-04 |
| S25 | PayPay pr 20260629 | 2026-06-29 |
| S26 | BI IRU highlight；indonesiabusinesspost 6424；crowdfundinsider | 2026-04 |
| S27 | SBV | 2026-04-23 |
| S29 | tourismlaos | 2022-12-27 |
| S30 | PayNet FAQ（种子 SG-MY） | 2026 |
| S31 | investortrust 101858 | 2026-04 |
| S32 | NAPAS 18426041513535516；Sacombank 2026 | 2026-04 |
| S33 | PayNet 2023 新闻稿 | 2023 |
| S34 | OCBC | 2025-11 |
| S35 | ibsintelligence | 2024-10 |
| S36 | GlobeNewswire | 2024-12-25 |
| S37 | MAS PayNow Gen2 | 2026-06-25 |
| S38 | PayNet–NIPL | 2026-02 |
| S39 | RBI prid=62857；medianama | 2026-06 |
| S40 | pasardana | 2026-05-21 |
| S41 | Philstar | 2026-02-01 |
| S42 | MAS–BSP | 2021-11 |
| S43 | diskartech | 2026-07 |
| S44 | 台湾央行《金融穩定報告》 | 2026-05 |
| S45 | The National；UnionPay–UAE | 2026-07/08 |
| S50 | CIMB / HLB / DuitNow / Alliance FAQ | — |
| S55 | Netstars FY2025 摘要（envalith） | — |

URL 见 facts 清单。

---

## 3. 双边联通的技术模型

### 3.1 三种拓扑（据公开案例归纳）

1. **switch-to-switch（央行背书的国家交换机直连）**：
   - 例：NITMX↔PayNet、PayNet↔NETS、ASPI↔NETS、NAPAS↔LAPNet、NBC↔LAPNet、ASPI↔KFTC。
   - 两端各自在本国 IPS 内完成国内腿；交换机之间按约定周期轧差，经双方指定的结算行（或本币结算框架下的指定银行）结算。
2. **network-to-switch（私营跨境网络接国家交换机）**：
   - 例：Ant/Alipay+↔NITMX（Krungthai）、Ant↔NAPAS（Vietcombank）、Alipay+↔Bakong、Alipay+/UnionPay↔PayNet、GLN↔NAPAS（BIDV/Hana）、HIVEX↔FISC（玉山）、Wise↔PayNet（直连）。
   - 私营网络扮演“对端交换机”，钱包侧是该网络的 MPP。**这是 INSPAY 最直接可复制的模型。**
3. **CPM / 银行直签（不经国家交换机）**：
   - 例：泰国 MyPrompt QR 在日本（泰国银行 + NETSTARS/NTT DATA），韩国 KB/GLN 与 SCB。
   - 由单一银行和单一外国服务商合作，覆盖面取决于合作方的商户网络。

### 3.2 报文与处理流程（MPM，付款方扫商户码）

据公开描述归纳，各对的接口规范均未公开，以下为推断（low），已核实的片段另行标注。

1. **扫码与识别**
   - 付款方 App 扫外国商户码，用 EMVCo TLV 解析，依据 58（Country Code）、53（Currency）和 26–51 模板中的 GUID/AID 判断为外国码。
   - **识别规则各国不同（种子已核实）**：
     - DuitNow QR **没有跨境专用字段**，商户用同一张码；跨境体现在交易层：交易码 031（cross-border POS）、521（cross-border account enquiry），以及新、印尼、泰、中的跨境响应码（medium）。
     - SGQR **没有跨境专用 GUID**，境外钱包解析 `SG.COM.NETS` 载荷后，经本国交换机转发给 NETS（medium）。
     - Thai QR 的 tag 30 另有跨境 AID `A000000677012006`，配合 62-08 使用，似乎用于“境外商户出示泰式码、泰国用户付款”（medium）。
     - 印尼用户在日本扫的是 **JPQR Global** 码，不是普通 JPQR（high），说明日本侧为跨境专设了受理标识。
2. **上送与路由**：钱包把原始 payload 上送本国交换机（或私营网络），由其路由到对端交换机。钱包不需要维护各国解析器——这是交换机识别模式，Alipay+ 也是同一逻辑。
3. **商户查询**：对端交换机返回商户名、收单方等信息（DuitNow 用 521 cross-border account enquiry，medium）。
4. **FX 报价**：在确认前向付款人展示本币扣款金额（QRIS–日本：日元标价、实时显示 IDR，medium-high）。
5. **确认与入账**：付款人确认 → 本国扣款 → 跨境支付请求 → 对端交换机 → 收单方/商户银行以本币入账。DuitNow：商户“按 MYR 入账”（high，DuitNow 官方页）。
6. **清算与结算**：交换机之间对账、轧差，经指定结算行结算：
   - 泰马线：CIMB / CIMB Thai；
   - 泰老线：KBank / BCEL；
   - 泰港线：HSBC / BBL；
   - 泰中线：BBL / KTB；
   - 越中 Ant 线：Vietcombank；
   - 柬老线、印柬线：ACLEDA；
   - 台湾 TWQR Inbound：玉山。
   - **结算周期未公开**。第三方 HitPay 称马来西亚商户的跨境到账为 T+2（low–medium，与收单合同有关）。

### 3.3 FX 报价时点与报价方

| 联通 | 报价方 / 汇率来源 | 时点 | 来源 |
|---|---|---|---|
| 马来西亚出境（DuitNow 跨境） | **PayNet 设定的汇率**，按交易**入账日**汇率换算（CIMB FAQ）。种子另称“付款方银行/钱包报价”；可能是 PayNet 从 ACCD/结算行取价，再由银行加点 | 入账日（说明并非都在扫码时锁价） | S50（medium-high） |
| 马–印尼 | LCS 框架下的 ACCD 银行 | 未查到 | S11（medium） |
| 印尼–韩国 | LCT 框架，IDR/KRW 直接兑换 | 未查到 | S26（high） |
| 越南–中国（Ant） | Vietcombank，RMB–VND 直接兑换 | 未查到 | S32（high） |
| 越南–老挝 | 实时汇率 LAK/VND | 实时 | S15（high） |
| PayPay 海外模式 | 海外网络或收单方**按日**提示的汇率 + 3.85%（含税） | 日汇率 | S23、S24（high） |
| Nexus（参考） | 多家 FXP 报价，Source PSP 选价，付款前披露 | 报价有有效期（时长未查到） | §4 |

**结论**：央行主导的联通普遍套用**本币结算（LCS/LCT）框架**，由指定银行直接报两种本币的价，不经美元；私营网络（Ant、GLN）则由其结算行报价。**报价方在交易时点锁价并不普遍**，马来西亚出境就按入账日汇率。这正是稳定币网络可以提供“可锁定报价”差异化的地方。

### 3.4 商户到账与手续费分摊

- 商户以本币全额收款，**费率与境内 QR 相同**：
  - 印尼 BI：入境交易的 MDR 与境内相同（high，种子）；
  - 马来西亚 Alliance Bank：“与本地 QR 交易同费率”，DuitNow 官方称“收单方可能另有费率结构”（medium-high）。
- 付款人承担 FX 点差，以及发卡侧可能收取的跨境费（PayPay 为 3.85%）。
- 交换机之间的 scheme/switching fee 及分摊规则：**未查到公开文件**。

### 3.5 退款、争议与对账

- **退款**（DuitNow，已核实为银行 FAQ）：
  - 退款须向外国商户申请，受商户退款政策约束；
  - **退款金额可能与原付款不同**，因为 PayNet 汇率在购买和退款之间会变动，FX 风险由付款人承担（HLB FAQ，medium-high）。
  - 这说明退款很可能是**按退款时汇率的反向贷记**，而不是按原交易汇率冲正（推断）。
- **争议**：各联通的 chargeback / 争议规则未查到公开文件。A2A 即时支付本身没有卡组织式的 chargeback。
- **对账**：交换机日终清算文件 + 结算行净额，细节未公开。

### 3.6 公开技术规范

- **双边联通**：未查到任何一对的公开接口或报文规范，都是交换机之间的双边协议。PayNet 有开发者文档（交易码 031/521，种子经第三方 GitHub 转述）。
- **东盟层面**：
  - AFMGM 提到 **Roadmap for Instant Payment Connectivity**（欺诈等跨境风险、监管协调、能力建设）和正在完成的 **regulatory comparison dashboard**（medium）；
  - ASEAN Payment Policy Framework 等文件名称为记忆（low）。
- **BIS**：Nexus 文档完整公开在 **docs.bis.org/nexus**（high），包括 FX provision、Settlement access provision、Payment setup、Messaging & translation、Unsuccessful payments/exceptions 等章节，是目前唯一公开的跨境 IPS 互联规范，可直接作为 INSPAY 的接口设计参考。

---

## 4. Project Nexus / Nexus Global Payments（NGP）

### 4.1 治理与成员（2026-10）

| 项目 | 内容 | 置信度 |
|---|---|---|
| 法律实体 | NGP，新加坡注册的非营利担保有限公司；2025-04-03 注册 | medium |
| 创始成员 | RBI（印度）、BNM（马来西亚）、BSP（菲律宾）、MAS（新加坡）、BOT（泰国） | high |
| 印尼 | **2026-02-02 BI 新闻稿：由特别观察员转为正式成员**，下一步把本国即时支付系统（BI-FAST）接入 Nexus。上一轮种子的“成员还是观察员”冲突至此解决 | high |
| 其他 | ECB 继续研究连接可行性；NGP 与拉美储备基金（FLAR）签 MoU，探索与其成员国连接（fintechnews.sg） | medium |
| 董事会 | 2026-02-01 任命 José Beltrán 为首位独立董事会主席（种子） | medium |
| CEO | Andrew McCormack | high |
| 日本 | **未查到加入或观察员计划**；日本 FSA/BOJ 未见相关表态 | medium（基于未见） |

### 4.2 技术运营方与时间表

- **2026-02-09**：NGP 宣布 **PayNet（马）与 NETS（新）的合资公司**为 Nexus Technical Operator（NTO），经全球竞标选出；Endava 负责端到端设计与工程，AWS 提供云基础设施（high，种子）。
- NTO 职责：建设、运营、维护 Nexus，协调各国 IPS 运营方的接入，使各国 IPS 内的银行和非银参与者能够参与（high）。
- **时间表**：技术开发 2026 年初开始，**目标 2027 年上线**（NGP 新闻稿，种子 high）；2024 年 BIS 曾说 2026 年上线，已推迟。CEO 称 2027 年至少连接三个亚洲国家（medium）。
- 有二手分析称目标清算时间低于 60 秒（low）。

### 4.3 BIS 设计要点（docs.bis.org/nexus，本轮核实）

- **Nexus Gateway**：“connect once”，每个 IPS 接一次即可触达所有成员。默认每个 Gateway 云托管，可服务多个 IPS（BIS Nexus 报告，medium）。
- **资金流**：一笔跨境支付 = 源国 IPS 内一笔即时支付（付款 PSP → FXP 在源国的账户）+ 目标国 IPS 内一笔即时支付（FXP 在目标国的账户 → 收款 PSP）。**pacs.008 中引用 FXP 在源国和目标国 SAP 处持有的账户**（high）。没有跨境结算资产移动，FXP 须在两端预置本币流动性（docs 的“Managing liquidity”章节）。
- **FX Provider（FXP）**：
  - 第三方 FXP 须为**持牌、受监管实体**，但**不必是银行或非银 PSP**（high）；
  - 满足资格并遵守 Nexus Scheme 的 FXP 均可为 Nexus 支付提供 FX（high）；
  - 有的国家只允许银行加入 IPS，**非银 FXP 须经 SAP 间接接入**；非银外汇商通常在任何 IPS 都无直接资格（high）；
  - **资格可能因国而异**（high）。
- **Settlement Access Provider（SAP）**（high）：
  - 为不是该 IPS 成员的第三方 FXP（以及部分外国 PSP）提供账户；
  - 只处理本国货币，不做换汇；
  - 必须是至少一个国内 IPS 的成员，即本身须是 PSP；
  - **Nexus 不指定 SAP，由 FXP 或外国 PSP 自选**。
- **报文**：**首版支持 pacs.008、pacs.002、acmt.023、acmt.024**。acmt.023/024 是身份核验请求与报告，用于别名解析。Nexus 规范未覆盖之处遵循 CPMI 协调的 ISO 20022 数据要求（high）。
- **Proxy Resolution**：付款人输入别名（手机号等）或账户信息，经 acmt.023/024 解析，返回收款人信息供确认（high：报文对；具体时序 medium）。
- **范围**：
  - 支持账户到账户的 P2P/C2C、B2B、P2B、B2P，**用别名或账户信息发起**（high）；
  - 每条 pacs.008 只含一笔交易，不接受批量（high）；
  - 文档把销售点（point-of-sale）支付列为时效敏感的例子，但**没有 QR 商户流程**；
  - **BIS 宣传册称 Nexus 用例将“超越 A2A，扩展到 QR 商户支付等功能”**（medium-high）。
- **结论**：2027 年首发 = A2A（含 P2B，即付款人用别名向商户账户付款），**不是 EMVCo MPM 商户 QR 受理**。没有收单方、MDR、商户结算、退款/撤销等 P2M 要素；P2M 何时上线未查到。

### 4.4 私营机构能否参与

| 角色 | 规则（BIS docs） | INSPAY 可行性 |
|---|---|---|
| Source/Destination PSP | 须为成员国 IPS 参与者 | 日本不是成员，PayPay/INSPAY 无法在日本侧作为 PSP 接入。只能在成员国（新、马等）设持牌实体服务当地用户，与“日本用户出境”无关 |
| **FX Provider** | 持牌受监管即可，不必是银行；须遵守 Nexus Scheme；在只允许银行加入的 IPS 经 SAP 接入；资格分国认定 | **可行性最高的角色**。例如 INSPAY 在新加坡的持牌实体（MAS MPI，具跨境转账/换汇资质）申请 SGD/MYR/THB/PHP/INR/IDR 等币对 FXP。稳定币可用于 FXP 在各 SAP 账户之间的**头寸再平衡**，替代代理行调拨；但须各国监管与 NGP 规则允许（未查到明文） |
| SAP | 须为 IPS 成员（PSP），只处理本币 | 私营非银只有在允许非银加入 IPS 的国家才可能担任，难度大 |
| 日本接入 | 须日本 IPS（全銀系统 / ことら等）作为成员接入 | 未见计划。即使接入，首发也不是 P2M |

---

## 5. 空白、原因与“稳定币版 Alipay+”的切入点

### 5.1 仍未打通的国家对（截至 2026-10）

- **菲律宾 QR Ph**：与所有国家均无已上线联通（马来西亚线计划 2026 年内）。
- **越南**：与马来西亚、新加坡、印尼、菲律宾均无联通。
- **印尼**：与越南、菲律宾、柬埔寨、老挝、印度、香港、阿联酋均未通（印度、香港为 2026 年目标）。
- **缅甸、文莱**：未查到联通。
- **印度**：与泰国、越南、菲律宾、印尼未通。
- **阿联酋**：与东盟各国均未通。
- **韩国**：韩→印尼已通，**印尼→韩方向（韩国人在印尼）仍待上线**；韩国与菲律宾、柬埔寨的国家级联通未查到。
- **日本出境**：日本钱包在东南亚**全部未通**（印尼“即将”，柬埔寨二期为计划）。

### 5.2 日本出境为何缺失（分析）

1. **结构原因：日本没有央行运营的国家 QR 交换机或 IPS 级 QR 方案。**
   - JPQR 是 PJA 的标准，跨境入口由私营 Netstars 担任。东盟的双边联通以“央行签 MoU + 国家交换机对接”为前提，日本没有对等主体；
   - METI 只和 BI（2022-12）、NBC（2023-12）签过合作备忘录（种子）。
2. **发卡侧碎片化**：日本最大的钱包 PayPay 使用自有码体系，出境选择私营网络（Alipay+、HIVEX），而不是 JPQR Global。银行 App 几乎没有 QR 出境功能。JPQR Global 的出境需要日本发卡方逐家加入。
3. **监管门槛**：
   - 日本钱包向海外商户付款属于“為替取引”（资金移动业），前払式余额不能用于这类用途（种子，low–medium）；
   - BI 明确说 QRIS“日本入印尼”方向需要并已取得**日本 FSA 许可**（2026-04），说明日本出境方向要专门做监管安排。
4. **东盟的优先级**：各国央行优先服务本国居民出境（泰国 MyPrompt QR 在日本、印尼和柬埔寨用户扫 JPQR），日本入境需求（东南亚游客赴日）大于日本游客的出境需求。
5. **商业**：日本游客出境偏好信用卡；PayPay 3.85% 的费率模型下，出境由 PayPay 自选网络谈判，不依赖国家级联通。

### 5.3 切入点比较（更新版）

| 路径 | 做法 | 先例（本轮核实） | 门槛 | 稳定币作用 | 评估 |
|---|---|---|---|---|---|
| **A. 接入各国交换机的跨境平台（network-to-switch）** | INSPAY 作为“境外网络”签约 PayNet、NITMX、NAPAS、Bakong、ASPI、LAPNet、NETS 的跨境网关，每国指定一家本地结算行 | Alipay+（NITMX/Krungthai、NAPAS/Vietcombank、Bakong、PayNet、NETS）、GLN（NAPAS/BIDV+Hana）、BC Card（PayNet）、HIVEX（FISC/玉山）、**Wise 直连 PayNet（2026-07-30）** | 中–高：要交换机认可与央行默许；各国要求本地结算行；印尼、泰国等有外汇和本币限制 | **核心**：INSPAY 与本地结算行（或其关联持牌 VASP）之间的跨境净额用稳定币结算，替代代理行预付 | **主干路径**。先选泰国（NITMX 已对多个私营网络开放）、越南（NAPAS 2026 年连接 Ant、GLN）、柬埔寨（Bakong 对私营网络开放、美元化程度高）、马来西亚（PayNet 跨境网关成熟） |
| **B. 借道已有双边通道** | 日本侧借 JPQR Global（Netstars）既有的 QRIS、KHQR 联通开出境方向；INSPAY 做 Netstars 的 FX/结算/稳定币清算服务方，或推动 PayPay 接入 | QRIS–JPQR Global（BI 称已获 FSA 许可）、KHQR–JPQR 二期 | 中：需 Netstars/PJA 合作；日本侧牌照 | 中：JPY↔IDR/KHR（或 USD）的跨境腿可用 JPYC/USDC，但对端（ASPI/NBC）多半仍要本币或美元 | **并行推进**。印尼和柬埔寨是日本出境最先可能打开的两个国家 |
| **C. Nexus 参与者** | 以新加坡等持牌实体申请 FXP，经 SAP 接入 | BIS docs 允许持牌第三方 FXP | 高：规则书未公开；2027 年起步；首发只有 A2A，不是 P2M；日本不是成员 | 用于 FXP 的多币种头寸再平衡 | **观察**。中长期可作为 FX 能力的变现渠道，不解决 PayPay 扫码问题 |
| **D. 单一收单行合作** | 每国与 1–2 家收单行或钱包签约，由其在国内交换机完成付款 | 泰国 MyPrompt QR 在日本（反方向）、KB/GLN×SCB、BCEL×GLN | 低–中：商业合同即可起步 | 高：与合作行用稳定币净额结算 | **最快的试点路径**，但覆盖面受限于合作行的商户（例如泰中线首批只能扫 6 家银行的商户码）。适合先做 MVP |
| （不建议）转售他国居民通道 | 用东盟某国发卡方的通道服务日本用户 | — | 合规风险大：双边通道只服务本国 IPS 参与者的客户 | — | 不建议 |

### 5.4 对 INSPAY 的具体建议

1. **产品形态**：对标 PayPay“海外支払いモード”的后端接口，成为 PayPay 的第三张“海外ネットワーク”（继 Alipay+、HIVEX 之后）。卖点：
   - 东南亚国家码覆盖面不比 Alipay+ 差（重点是 Alipay+ 未覆盖或只覆盖中国钱包的通道，例如 NITMX–Ant 一期只对中国 Alipay 开放）；
   - **可锁定报价**（对比 DuitNow 出境按入账日汇率）；
   - 稳定币结算降低资金成本，使 PayPay 可以保持或扩大 3.85% 下的毛利。
2. **首批国家**：泰国（日本游客最多，NITMX 开放）、越南（NAPAS 2026 年连接私营网络积极）、柬埔寨（Bakong 对接灵活，与 JPQR 有央行 MoU）、印尼（借道 Netstars/JPQR Global）。
3. **竞争监测**：
   - HIVEX：已连 PayPay 和 FISC，2025-01 在韩国上线，2026-07 与 RCBC 签菲律宾 MOU；
   - Alipay+：2026 年在越南 NAPAS 扩展；PayNet 推进马来西亚出境；
   - Wise：直连 PayNet。

---

## 6. 事实核查摘要（相对种子与上一轮）

- **核实（low→high）**：
  - QRIS–NETS 上线日 2023-11-17（BI–MAS 联合新闻稿）；
  - 越–柬 2023-12-03；
  - Nexus 首版报文为 pacs.008/pacs.002/acmt.023/acmt.024；
  - SAP 与 FXP 角色定义；
  - 印尼为 NGP 正式成员（2026-02-02）。
- **推翻或修正**：
  - 上一轮称“日本唯一国家级联通是 JPQR–QRIS”——实际还有 **KHQR→JPQR（2025-07-04）** 和泰国 MyPrompt QR（CPM）；
  - 上一轮称“未查到 Nexus P2M 计划”——BIS 宣传册写明 QR 商户支付是未来扩展方向（时间未定）；
  - 上一轮称“印尼成员身份冲突”——已解决，为正式成员；
  - 种子 KHQR–JPQR 日期 2025-07-05，应为 2025-07-04 启动（07-05 可能是实际可用日）。
- **新增**：印尼–韩（2026-04-01，KFTC，LCT）；印尼–中（2026-04-30）；越–中 Ant（2026-04-03，Vietcombank）；越–韩（2026-04-23，GLN/BIDV/Hana）；印–柬 UPI–KHQR（2026-06-02，NIPL×ACLEDA）；TWQR Inbound 首波含新加坡 NETS；菲–马计划 2026；HIVEX–RCBC MOU；日本 FSA 已许可 QRIS 日本入印尼方向；DuitNow 退款汇率规则。


### OPEN QUESTIONS
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