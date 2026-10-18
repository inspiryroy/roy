# 菲律宾 & 缅甸：国家二维码 / 支付轨道 / 跨境 / 监管研究（截至 2026-10-18）

## 0. 方法与局限
- **WebSearch 用了 24 次（已到上限）**，WebFetch 试了 2 次（developers.paymongo.com、technode.global），都 ENOTFOUND；curl 走代理访问 bsp.gov.ph、ecommpay、tazapay 都被拒（CONNECT 403）。官方 PDF/页面一份也没能打开原文，结论都来自搜索摘要。
- **开源二手证据（medium）**：从 npm registry 下载、只读不执行的包有：`@qrph/qrph@0.0.2`、`@qrph/emv-qr@0.0.2`（2025-01，内含 14 个真实商户码样例）、`neuz-qrph@1.0.1`、`react-native-instapay-qr@2.0.0`、`@ph-dev-utils/banks@0.1.0`（打包了 BancNet 发布的 InstaPay 参与者名单和 PCHC 发布的 PESONet 参与者名单，均截至 2026-04-30）、`mmpay-node-sdk@1.1.4`、`@laranex/myanmar-payments@4.0.0-dev.17`。我用自己写的 TLV 解析器逐个拆解了样例 payload，也做了 CRC 校验：14 个样例里 13 个 CRC-16/CCITT-FALSE 正确，PayMongo 那个动态码样例不对，可能是脱敏过的。
- **没查到的内容**：QR Ph 官方规范原文（子标签的官方名称、当前版本号）；QR Ph 是否有 CPM；2025 年商户数和用户数；QR Ph 有没有跨境专用 GUID；Alipay+ 接入 QR Ph 用的是哪家本地结算或参与机构；菲律宾—马来西亚 QR 联通是否已上线；BSP 数据本地化条文；比索离岸限制和 EMI 资本金的条文；MMQR 的 GUID 和样例 payload；缅甸受制裁银行清单的最新状态。

---
## A. 菲律宾

### A1. 国家二维码标准：QR Ph
- **名称、治理与运营**：QR Ph 是国家统一 QR 标准，由 BSP 通过 **Circular No. 1055（2019 年 10 月）** 强制推行。标准由 PPMI（Philippine Payments Management, Inc.）在 BSP 指导下制定和管理；PPMI 也是 InstaPay 和 PESONet 的支付系统管理机构（PSMB）。
- **两个子标准**：**QR Ph P2P** 先推出（2019 年）；**QR Ph P2M** 于 **2021 年 4 月** 开始试点（来源：maya.ph、transfi 等摘要，medium）。
- **技术基础**：两者都基于 **EMVCo MPM**（TLV 结构，payload 以 `000201` 开头，tag 63 是 CRC）。**CPM 未查到**，没有证据显示 QR Ph 有 CPM 版本。
- **静态码与动态码**：两种都支持。tag 01=`11` 是静态码（无金额，付款方自己输入），`12` 是动态码（带 tag 54 金额）。
- **当前规范版本号**：未查到。
- **规模**：
  - 2025 年 QR Ph 共 **24.7 亿笔、₱1.16 万亿**，首次超过借记卡和信用卡交易笔数（BSP 2026 年 8 月发布，见 mb.com.ph 2026-08-17、Tribune 2026-08-19）。
  - 2025 年数字支付占零售交易笔数的 **64.69%**（BSP 目标 70%）。
  - 某二手报道称 2025 年 P2M 达 29.3 亿笔、价值 132 亿美元，与上面 BSP 的总数对不上，不建议采用。
  - Alipay+ 新闻稿称 "QR Ph 交易在 2025 年增长 13 倍以上"，口径不明。
  - 商户数：只查到一篇较早、日期不明的 BusinessWorld 报道，称 **47.3 万个 P2M 商户网点、17 家参与机构**；2025–2026 年的商户数和用户数未查到。

### A2. 码结构细节（基于真实样例的 TLV 解析）
**国家码识别与 P2P/P2M 区分（最关键）**

| 判别项 | P2M（商户码） | P2P（个人码） |
|---|---|---|
| MAI tag | **28** | **27** |
| 子标签 00 GUID | `ph.ppmi.p2m`（11 字符） | `com.p2pqrpay`（12 字符） |
| MCC（52） | 真实 MCC，如 5812/5814/5499/4812/0742/6012 | 样例全部是 **6016**（P2P 约定值） |
| 59 名称 | 商户名，≤25 字符 | 个人名会被掩码，如 `BR****N S.` |

两种码的公共特征：53=`608`（PHP）、58=`PH`。第三方解析器还见过 `PH.PPMI.P2MEMV`、`COM.BDO.QRPH`、`COM.BPI.QRPH` 这些标识，可作为容错白名单。

**tag 28（P2M）观察到的子标签**

子标签的官方名称未核实。任务里提到的 "acquirer BIC / merchant ID / merchant credit account / proxy-notify flag" 和下面的结构吻合，但我没能核对规范原文。

| 子标签 | 样例值 | 解读 |
|---|---|---|
| 00 | `ph.ppmi.p2m` | GUID |
| 01 | 11 位 BIC 格式的**收单机构/InstaPay 参与者代码**：GCash=`GXCHPHM2XXX`，Maya=`PAPHPHM1XXX`，ShopeePay=`SHPHPHM2XXX`，BPI=`BOPIPHMMXXX`，BDO=`BNORPHMMXXX`，Security Bank=`SETCPHMM000`，AUB=`AUBKPHMMXXX`，PayMongo=`PAEYPHM2XXX` | **路由键**。注意：开源注册表里 GCash 的 SWIFT 是 `GLTEPHMT`，和码里的 `GXCHPHM2XXX` 不一样，说明码里放的是 PPMI/InstaPay 体系的参与者代码，不能直接查 SWIFT 目录来映射 |
| 02 | 样例里没出现 | 可能是 Merchant ID（未核实） |
| 03 | 商户账户/商户号，5–24 位数字或字母，如 `217020000000602433060`、`240810000002135`、`urLmCGCB…` | `@qrph/qrph` 把它当作收款账户号（account number），与 "Merchant Credit Account" 吻合 |
| 04 | 可选，如 Security Bank 是 19 位、BDO 是 `9184334027`（看起来像手机号）、PayMongo 是 10 位 | 推测是手机号或附加账户（未核实） |
| 05 | 3 位标志，样例值有 `000`（GCash）、`310`（Maya/BDO）、`010`（Security Bank/AUB/PayMongo）、`300`（ShopeePay）、`311`（BPI） | 疑似 Proxy-Notify Flag 或 merchant criteria，**含义未核实** |

**tag 27（P2P）观察到的子标签（GCash 样例）**
- 00 = `com.p2pqrpay`
- 01 = `GXCHPHM2XXX`
- 02 = `99964403`（8 位，两张码相同）
- 03 = `217020000000656`（15 位，两张码相同）
- 04 = `DWQM4TK3JDNWF7Y0M`（17 位，每个用户不同，是账户或代理 ID）。`react-native-instapay-qr` 也把 27/28 里的 04 读作账户号。

**其他 tag**
- **52/53/58**：MCC / `608` / `PH`。
- **54**：动态码金额，格式如 `20035.38`。
- **55**：AUB 样例出现 `01`，表示提示付款方输入小费。
- **59**：≤25 字符；**60**：≤15 字符（GCash 有时放数字编码如 `762`，不可靠）；**61**：邮编，可选。
- **62 附加数据**：子 00 也带 GUID，取值不统一：`ph.ppmi.qrph`（GCash/PayMongo）、`com.paymaya.qr`（Maya）、`com.ppmi.qrph`（Security Bank）、`ph.ppmi.p2m`（BDO）。其余子标签：03 Store Label（如 `GCRD00001`）；05 Reference Label（GCash 21 位数字、Maya 21–22 位字母数字、BDO 25 位）；07 Terminal Label（如 `GEN00008`）；08 Purpose。字段值为 `***` 时按 EMVCo 语义，要提示付款方自己输入（Security Bank、PayMongo 样例里有）。
- **80–99 自定义模板**：tag **88**（`00=ph.ppmi.qrph`，`01=`商户标识，例如 `SETCPHMM0005267377240010479`、`ShopeePay`、`COM.SWIFTPASS`）；tag **80**（AUB 样例里放的是 SwiftPass/wepayez 的 URL）。
- **63**：CRC-16/CCITT-FALSE，多项式 0x1021、初值 0xFFFF，计算范围包含 `6304`。
- **跨境专用字段/GUID**：未查到。Alipay+ 方案宣称"商户不需要新码"，说明跨境路由用的就是现有字段。

**样例（真实码，开源库收录）**
- P2M 静态（GCash 商户 Gong Cha）：`00020101021128620011ph.ppmi.p2m0111GXCHPHM2XXX032121702000000060243306005030005204581253036085802PH5908Gong Cha60037626104122462660012ph.ppmi.qrph0309GCRD0000105212170500000670039620680708GEN0000863049B84`
- P2M 静态（BPI，最简形式）：`00020101021128560011ph.ppmi.p2m0111BOPIPHMMXXX03152408100000021350503311520407425303608 5802PH5907SR MAIN6009Dumaguete63045DBE`（原文中间没有空格，这里断开只为方便阅读）
- P2P 静态（GCash 个人）：`00020101021127830012com.p2pqrpay0111GXCHPHM2XXX02089996440303152170200000006560417DWQM4TK3JDNWF7Y0M5204601653036085802PH5910DCDELIGHTS6011HOLY SPIRIT6104123463045D31`
- P2M 动态（PayMongo/Lazada）：01=`12`，54=`20035.38`，62 里带 `***`。这个样例 CRC 不匹配，可能是脱敏后的版本。

**路由逻辑**：tag 28/27 子 01 的参与者代码 → 对应的 InstaPay 接收参与者（需要 PPMI/BancNet 的代码表）→ 用 InstaPay 把款项贷记到子 03（P2M）或子 04（P2P）的账户。

### A3. 底层支付轨道
- **InstaPay**
  - 实时、7x24 的贷记推送（credit push），单笔上限 **₱50,000**（BPI 条款、Wise 公告）。
  - 未核实：PayMongo 博客称 2026-07-29 推出 "InstaPay for Business"，合资格企业账户单笔可到 ₱500,000。
  - ACH 运营方是 **BancNet**（InstaPay 参与者名单由 BancNet 发布，medium）；规则由 PPMI 制定；BSP 监管。
  - 结算：在 BSP 的 RTGS 系统 **PhilPaSSplus** 里，用参与者的结算账户进行（Wise 2024-11 公告提到 "settle directly with PhilPaSSplus"）。具体是轧差还是预存资金、每天几个结算窗口：未核实。
  - 报文标准：一般认为是 ISO 20022（**未核实**）。
- **PESONet**：批量 ACH，运营方是 **PCHC**（参与者名单由 PCHC 发布），日内多个结算窗口，单笔限额各行不一（₱200k–₱500k）。
- **参与者类型**：截至 2026-04-30，InstaPay 有 94 家、PESONet 有 123 家（开源数据集统计）。
  - 银行：全能/商业银行、储蓄银行、农村银行、数字银行，还有 HSBC、StanChart、中银香港马尼拉分行等外资行。
  - **EMI/电子钱包**：GCash（G-Xchange）、Maya Philippines、ShopeePay、GrabPay、PayMongo、Coins.ph（DCPAY Philippines）、**PDAX**、**Wise Pilipinas**，以及 **Alipay Philippines, Inc.（标注为 "receiver-only"，只能接收）**。
  - **日资银行马尼拉分行**（MUFG、Mizuho、SMBC）只参与 PESONet，**不在 InstaPay 名单里**。
- **外国机构如何接入**：设立本地法人，拿 BSP 牌照（EMI 或银行），成为 InstaPay 直接参与者，并在 BSP 开结算账户。先例：**Wise** 在 2024-11-04 宣布获得 InstaPay 直连，并在 PhilPaSSplus 开了结算账户（它的第 6 个本地系统直连）。

### A4. 跨境 QR 联通现状
- **Alipay+ × QR Ph**：PPMI 与 Ant International 在 **2026-09-01** 宣布在 QR Ph 上启用 Alipay+。海外用户用自己的钱包或银行 App 可以直接扫**全国任何受理 QR Ph 的商户**，商户不需要新码或新硬件。这是目前查到的唯一已上线的"外国钱包直扫 QR Ph"安排。哪家本地机构负责结算、支持哪些钱包、限额多少：未查到。
- **马来西亚 DuitNow**：BSP 在 2026-02 表示年内上线。马来西亚的 DuitNow App 扫 QR Ph，交易经 InstaPay 桥接到马方系统，**与 Nexus 并行，不属于 Nexus**。截至今天是否已上线：未查到。
- **新加坡**：MAS 与 BSP 在 2021-11 签了 FinTech 合作协议，要联通实时支付和 QR。上线情况未查到。
- **Nexus**：BSP 副行长 Tangonan 在 2026-03 表示菲律宾计划 **2027 年年中**上线，接入新、马、泰、印、印尼的快速支付系统；新加坡的运营公司已经成立，技术运营商已选定。
- **泰国/印尼/日本**：都没有查到双边 QR Ph 联通。
- **日本方向的反向案例**：GCash、HelloMoney by AUB 从 2023-06 起可经 Alipay+ 在 PayPay 商户使用（这是菲律宾钱包到日本消费）。PayPay 自己的出境"海外決済モード"2025 年 9 月末先在韩国上线；在菲律宾能不能用未查到。
- **日本钱包覆盖菲律宾全部 QR Ph 商户的几条路径**

| 路径 | 覆盖面 | 审批/实施难度 | 说明 |
|---|---|---|---|
| ① 央行双边安排（BSP–日本） | 理论上全量 | 极高、周期以年计 | 日本不在 Nexus 里，也没有类似 PromptPay/DuitNow 的国家级 IPS-QR 对接方 |
| ② 经 PPMI 的跨境平台（复制 Alipay+ 模式） | **全量 P2M** | 高：要和 PPMI 谈商业与规则、拿 BSP 认可，还需要一家本地 InstaPay 发送方参与者负责比索段结算 | 已有 Alipay+ 先例，是最"正统"的全量路径 |
| ③ 经单一本地 InstaPay **发送方**参与者做 issuer 侧 sponsor | 技术上可以付给**任何** QR Ph 商户（InstaPay 贷记推送给码里子 01 指定的参与者） | 中高：合作方要承担跨境与 AML 责任，可能被 BSP 视为跨境支付或汇款业务 | 合作方可选 Coins.ph、PDAX、Wise Pilipinas、银行等。需要 PPMI 是否允许"境外发起"的规则口径 |
| ③' 与单一收单行/钱包合作（只覆盖其商户） | 只覆盖该收单方的商户，例如 GCash 或 Maya 名下的商户 | 中 | 用户体验割裂。码是互通的，扫到其他收单方的码时无法区分处理 |
| ④ 借道 Alipay+ | 全量（如 Alipay+ 所述） | 对 PayPay 而言低（PayPay 已是 Alipay+ 生态伙伴） | 对 INSPAY 来说是被绕开的风险，稳定币结算层没有位置 |

### A5. 监管
- **外国机构受理 QR Ph**：没有让外国钱包直接受理的牌照。实际做法有两种：
  - 本地设立 EMI/OPS，参照 RA 11127《国家支付系统法》下的 OPS 注册以及 EMI 牌照，然后成为 InstaPay 参与者；
  - 与本地参与者合作。
- **2026-09 BSP 征求意见稿**（Cointelegraph 2026-09-07 等报道）：
  - 拟**暂停 12 个月受理和处理新的 OPS 注册申请**，从终稿发布后第 15 天起算。
  - 银行和其他受 BSP 监管、做商户收单的机构，**只能和 BSP、SEC 或其他相关主管机关许可的 VASP 合作**，并要加强尽调、设交易和结算限额。
  - 这直接影响新设本地 OPS 的路线，也影响 INSPAY 作为稳定币交易对手的合规要求。
- **VASP/CASP**：
  - BSP 的 VASP 规则：Circular 1108（2021）。新 VASP 牌照从 2022-09-01 起暂停，**2025-09 延长为无限期**并定期复审（newsbytes 2025-09-02）。
  - SEC 的 **CASP Rules（SEC MC No.4 s.2025）及 Guidelines（MC No.5 s.2025）于 2025-07-05 生效**：要求实缴资本 ≥ ₱1 亿、境内有实体办公室，向菲律宾居民提供服务的境外平台也要注册。
- **稳定币**：
  - Coins.ph 的 **PHPC**：2024 年进入 BSP 沙盒，上限 1 亿枚；**2025-06 出沙盒**；后续要持续披露、定期向 BSP 报告、做独立审计；储备放在 UnionBank 和 Security Bank。Ronin 钱包计划 2026 年经 PHPC 打通 QR Ph 支付，但要等 BSP 许可。
  - **PHPX**：UnionBank、RCBC 等组成的银行联盟，在 Hedera 上，是否获批未查到。
  - BSP 立场：副行长 Abenoja 表示在审多个提案，大多是美元稳定币，以审慎态度和沙盒为主。
  - **BPI × Meridian**（2026-07）：稳定币只作为入境汇款的结算层，到账时换成比索入 BPI 账户，计划在 2026-11 的 ASEAN 峰会前推广。这和 INSPAY 的"稳定币只在持牌机构之间流转"是同一种模式。
  - Cebuana Lhuillier 在 2026-07 宣布与 Fireblocks 合作做 Solana 汇款通道（medium-low）。
  - GCash GCrypto（PDAX 提供）、Maya 的加密业务：凭记忆，未核实。
- **外汇**：
  - 2025 年 FX Manual 修订（MB Res. 243，2025-03-06）：FX 衍生品限于真实对冲和融资需要，NDF 报告要求更新（二手，low-medium）。
  - 比索不可离岸交割、跨境结算必须在境内换汇，这是常识判断，**条文未核实**。入境方向（外币换比索）一般限制较少。
- **数据本地化**：没有查到 BSP 的强制本地化条文。一般理解是：《数据隐私法》RA 10173 不强制数据留在境内，BSP 的 IT/外包规则要求报备和可审计（**未核实**）。

### A6. 候选合作方与先例
- **Coins.ph（DCPAY Philippines）**：BSP 许可的 VASP 兼 EMI，InstaPay 和 PESONet 双参与者，PHPC 发行方。"收稳定币 → 付 QR Ph 商户"的链条在它一家内部就能闭合，是首选。
- **PDAX**：VASP，InstaPay 和 PESONet 双参与者。
- **BPI**：Meridian 稳定币结算试点；码里的收单代码是 `BOPIPHMMXXX`。
- **UnionBank / Security Bank**：PHPC 储备行，UnionBank 是 PHPX 牵头行之一；Security Bank 本身也是 QR Ph 收单方。
- **GCash（G-Xchange）/ Maya**：最大的收单和钱包机构；GCash 已是 Alipay+ 伙伴。
- **Wise Pilipinas**：外资背景直连 InstaPay 的先例。
- **Alipay Philippines**：InstaPay 参与者，2026-04 时是只收不发。
- 日资银行马尼拉分行只有 PESONet，不适合做实时 QR 结算。

### A7. 对我们方案的技术含义
1. **接入建议**：
   - 短期选路径③：与 Coins.ph、PDAX 或一家 InstaPay 发送方参与者签 issuer-sponsor 和稳定币结算协议，先做 P2M。
   - 同时与 PPMI 谈路径②（对标 Alipay+）。
   - **P2P 码（`com.p2pqrpay`）不建议接**：跨境付给个人很可能被认定为汇款，需要另外的牌照。
2. **识别逻辑**：`58=PH && 53=608 && (28.00=ph.ppmi.p2m → P2M | 27.00=com.p2pqrpay → P2P)`；路由用子 01（要维护参与者代码 → 机构的映射表）；收款账户 P2M 取子 03，P2P 取子 04。
3. **静态码金额**：01=11 时由用户输入 PHP 金额，App 实时显示日元报价并锁汇，单笔不能超过 InstaPay 的 ₱50,000。
4. **动态码**：01=12，带 54 金额和 62.05 一次性 Reference Label。EMVCo 码里没有有效期字段，有效期由收单方后台控制；要按 62.05 去重、防止重复支付。
5. **`***` 字段**：62 子字段为 `***` 时要提示用户输入，否则交易可能被拒。55=`01` 时提示输入小费；56/57 是便利费。
6. **商户名显示**：59 最多 25 字符，60 不可靠，GCash 有时是数字编码；P2P 名字是掩码。最好用 InstaPay 账户核验返回的名称来显示。
7. **退款与撤销**：InstaPay 贷记推送不可撤销，退款要由商户的收单方反向发起一笔贷记，需要和合作方约定跨境退款接口和对账字段。
8. **流动性**：InstaPay 7x24 需要比索结算头寸，而稳定币到账是 T+0。周末和节假日比索头寸、PhilPaSSplus 结算窗口、换汇时点是主要的运营风险。
9. **监管风险**：2026-09 的 OPS 冻结草案，以及"收单方只能和持牌 VASP 合作"的要求；INSPAY 在日本要具备对应资质（电子决済手段等取引業等）才能当稳定币交易对手。

---
## B. 缅甸（简要）
- **标准**：**MMQR**（品牌名 MyanmarPay），由缅甸央行 CBM 制定。规范 v1.0 于 2019-01 发布；2025-02-27 在内比都正式推出（Wikipedia 写的是 2025-03-04）。基于 EMVCo MPM。
- **码结构**：MMQR 的 GUID 和子标签**未查到**。按 ISO 推断货币应为 104（MMK）、国家码 `MM`，未在 MMQR 样例中核实。
- **运营与规模**：Wikipedia 称 2021 年选定 Payplus 为交换机运营方（low）；**MPU**（Myanmar Payment Union，国家卡组织和交换机）在 MMQR 中扮演什么角色未查到。规模只查到 AYA Bank 自称 2 万多家商户。
- **动态码**：Yoma Bank 的 MMQR 动态码有效期 **120 秒**，过期要调用 `renewQr` 重新生成（开源 SDK，medium）。
- **跨境**：没有查到任何 MMQR 跨境联通。
- **FATF**：2022-10 起列入 **"call for action"（黑名单）**，2026-06-19 全会**继续保留**，要求成员采取与风险相称的强化尽调（EDD），未要求反制措施。
- **制裁**：美国 OFAC 在 2023 年制裁了 MFTB 和 MICB（凭记忆，未核实）。缅元有严格外汇管制，官方汇率与市场汇率严重背离（未核实）。CBM 对加密资产是禁止立场（凭记忆，未核实）。
- **结论**：日本持牌机构做缅甸业务，要面对 FATF 黑名单下的 EDD、代理行去风险、制裁筛查和外汇管制。**可行性很低，建议不列入第一期。**

### OPEN QUESTIONS
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