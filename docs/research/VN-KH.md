# 越南 VietQR 与柬埔寨 KHQR 调研报告（INSPAY「稳定币版 Alipay+」）

截至 2026-10-18

## 0. 方法与局限

- **搜索用量**：用了 30 次 WebSearch，已到上限。WebFetch 试了 2 次，都是 DNS 失败（ENOTFOUND）：tilleke.com 上 Decree 52 修订草案的分析、bis.org 上 NBC 行长在 Bakong–Alipay+ 上线仪式的讲话。这两处只能依靠搜索摘要。
- **开源实现**：通过 npm registry 下载了 4 个包并解压，只读不执行，放在 `/tmp/claude-0/-home-user-roy/bae04deb-36b8-5b47-bbfe-be5b01336a0d/scratchpad/r2/vn_kh/`。
  - `bakong-khqr@1.0.20`：package.json 里的 repository 是 `git@gitlab.nbc.gov.kh:khqr/sdk-javascript.git`，即 NBC 自家 GitLab，基本可认定为官方 SDK。
  - `ts-khqr@2.2.3`：第三方 TypeScript 重写版。
  - `vietnam-qr-pay@1.5.1`：VietQR 和 VNPAY-QR 的编解码库，2026-07 仍在更新。
  - `napas-qr@1.0.4`。
  - 我另写了一个 TLV 解析脚本，在包外的独立目录 `.../scratchpad/r2/vn_kh_scripts/tlv.py`。用它逐字段解码了 8 个样例 payload，并用 CRC16-CCITT（多项式 0x1021，初值 0xFFFF）逐一复算，**全部吻合**。
  - 这类证据统一标 medium。
- **没查到或未核实的内容**：
  - NAPAS VietQR 规范 PDF 原文（字段官方命名、P2M 专用规则、规范版本号）。
  - Napas 247 的报文标准（是否 ISO 20022）及其与 SBV IBPS 的结算细节。
  - Decree 52/2024 关于境外机构的条文原文。
  - NBC 2025 年报原文。
  - 日柬 Phase 2（日本人在柬扫 KHQR）是否已上线。
  - KHQR 与韩国、印度联通的现状。
  - 越泰联通的方向与日期。
  - 各通道的入境游客限额。
  - 越南是否已发出首张加密资产交易所牌照（截至 2026 年年中的报道仍是“尚未发牌”）。
- **置信度标注**：凭记忆的内容标“未核实”。

---

## A. 越南

### A1. 国家二维码标准

**名称与运营方**
- 名称：**VietQR**，由 **NAPAS**（National Payment Corporation of Vietnam，越南国家支付公司，SBV 主导；具体持股未核实）运营。
- 2021 年 6 月以“统一转账二维码”品牌推出（VTV 2021-06-21 报道）。
- 截至 2026 年，NAPAS 在对外宣传中把业务分成三块：
  - **VietQR**：转账。
  - **VietQRPay**：境内支付。
  - **VietQRGlobal**：跨境受理品牌（2026-06 NAPAS「Digital Finance Day」报道）。

**技术基础**
- 基于 EMVCo MPM，并遵循 SBV 的二维码基本标准。搜索摘要提到 NAPAS 规范对应 EMVCo 1.5.2 版本（medium-low）。SBV 标准编号据记忆为 TCCS 03:2018/NHNN（未核实）。
- 支持静态码（`01=11`）和动态码（`01=12`）。
- 未查到 VietQR 有 CPM（被扫）标准。

**并行网络：VNPAY-QR**
- 越南还有一张独立的 **VNPAY-QR** 网络：tag 26，GUID `A000000775`。
- 2026-03 NAPAS 与 VNPAY 签署了全面合作协议。
- 很多商户贴的码是 VNPAY-QR，而不是 VietQR。

**规模数据（均为 NAPAS 自报）**
- 2025 全年，NAPAS 系统整体：笔数 +23.7%，金额 +8.7%，日均 >3,200 万笔。
- 2025 全年，Napas 247：笔数约 +27%，金额约 +8%。
- 2025 年 1–10 月，VietQR：笔数同比 +52%，金额同比 +85%。
- 截至 2025-10，约 **9,000 万**手机银行账户使用 VietQR 扫码。
- 2024 年，VietQR 笔数为 2023 年的 2.2 倍，金额为 2.6 倍。
- **商户数：未查到。**

### A2. 码结构（tag 38 / GUID A000000727）

以下基于开源实现，并用真实格式样例的 CRC 复算校验（medium）。

**tag 38：VietQR 的 Merchant Account Information**

| 子标签 | 含义 | 说明 |
|---|---|---|
| `00` | GUID | `A000000727`（NAPAS） |
| `01` | 受益机构模板 | 嵌套两个子字段，见下 |
| `01.00` | 受益机构 BIN（6 位，NAPAS 成员机构代码） | 开源库命名为 beneficiaryId / BANK_BIN；官方命名未核实 |
| `01.01` | 收款账号或卡号 | 开源库命名为 receiverNumber / BANK_NUMBER |
| `02` | service code | `QRIBFTTA` = 转入账户；`QRIBFTTC` = 转入卡 |

- 判断卡还是账户：napas-qr 的规则是，号码以 `9704` 开头、长度为 16 或 19 位即视为卡。
- BIN 示例（来自 vietnam-qr-pay 内置的 62 家机构表）：
  - 970436 Vietcombank、970418 BIDV、970415 VietinBank、970405 Agribank
  - 970407 Techcombank、970422 MB、970432 VPBank、970403 Sacombank
  - 970416 ACB、970454 BVBank
  - **971025 MoMo**：电子钱包也有自己的 NAPAS BIN。

**其他字段**
- `52`、`59`、`60`：**P2P 转账码里通常完全没有**。这不符合 EMVCo 的必填要求，用严格校验器解析会被拒。
- `53`：`704`（VND，无小数）。
- `54`：整数金额。
- `58`：`VN`。
- `62` 附加数据：
  - `01` bill number
  - `05` reference label（MoMo 用 `MOMOW2W…`）
  - `07` terminal
  - `08` purpose，即转账附言，如 "Chuyen tien"。越南商户普遍靠附言或虚拟账号对账。
- `63`：CRC。
- MoMo 的旧版码还用了 unreserved tag `80`（收款人手机号后 3 位）。
- ZaloPay 的码 = BVBank BIN 970454 + `99ZP…` 账号，tag 26 里还另带一段私有信息。

**样例**（均来自开源库 README，CRC 已复算通过）

```
00020101021138530010A0000007270123000697041601092576788590208QRIBFTTA53037045802VN6304AE9F
  → 静态 P2P：ACB(970416) 账户 257678859
00020101021238530010A0000007270123000697041601092576788590208QRIBFTTA53037045405100005802VN62150811Chuyen tien630453E6
  → 动态：金额 10000 VND，62.08 附言
00020101021138620010A000000727013200069710250118PSP1234567890000000208QRIBFTTA53037045802VN62190515MOMOW2W123456786304821F
  → MoMo(971025)
00020101021126280010A0000007750110010531314453037045408210900005802VN5910CELLPHONES62600312CPSHN ONLINE0517021908061613127850705ONLHN0810CellphoneS63047685
  → VNPAY-QR：tag26 GUID A000000775、01=商户ID 0105313144、62.07 终端 ONLHN
```

**识别与路由**
1. **识别国家码**：`58=VN` 且出现 tag 38 子标签 `00=A000000727`，就是 VietQR，交给 NAPAS 处理。
2. **定位收款方**：`38.01.00` 的 BIN 指向收款行或钱包，`38.01.01` 是入账账户。
3. **VNPAY-QR**：tag 26 `A000000775` 应路由到 VNPAY。经 NAPAS 跨境通道能否支付纯 VNPAY 码，需确认。
4. **P2P 与 P2M 的区分**：码里**没有官方的显式标志**（P2M 规则未查到）。
   - 实务上可参考：是否有 `59` 商户名或非默认 MCC、`62.07` 终端、是否为收单行登记的商户或虚拟账户。
   - 外国钱包的跨境受理是“在 NAPAS 网络商户处扫 VietQRGlobal”。是否拒绝纯 P2P 个人码需要向 NAPAS 确认。
   - P2P 码没有 `59`，钱包必须先做 NAPAS 账户名查询，才能向用户显示收款人姓名。

**跨境专用字段**：未发现跨境专用 GUID。VietQRGlobal 指的是同一套 VietQR 码在跨境通道中被受理。

### A3. 底层轨道

- **系统**：**Napas 247**，7x24 跨行实时转账（IBFT），按账户号或卡号入账。2025 年笔数约 +27%。
- **清算与结算**：NAPAS 负责交换和清算，资金经 SBV 的银行间支付系统（IBPS）结算。7x24 场景下的多场次净额结算、担保或预存安排**均未核实**。
- **报文标准**：未查到是否已迁移 ISO 20022。业内普遍认为卡和 IBFT 走 ISO 8583 衍生报文（未核实）。
- **参与者**：商业银行、外资银行分行，以及持牌电子钱包和中间支付机构（MoMo 有 BIN 971025 就是证据）。
- **外国机构接入**：没有直接成员资格。现行模式是“境外网络或聚合方 ↔ NAPAS 跨境网关 ↔ 越南指定结算行”，并须 SBV 批准。

### A4. 跨境 QR 联通现状

| 对手方 | 方向 / 模型 | 上线 | 结算 / 合作方 |
|---|---|---|---|
| 泰国 PromptPay | 方向未核实 | 2021（Wikipedia） | 未核实 |
| 柬埔寨 KHQR | 越南用户在柬扫 KHQR、以 VND 扣款（约 180 万柬商户）；柬用户扫 VietQR（ACLEDA 指南） | 2023-12-03 暹粒 | NAPAS–Bakong |
| 老挝 LAPNet | 第一阶段仅越南用户扫 LaoQR；反向在计划中 | 2025-01-09 | 越方 7 家银行、老方 14 家银行 |
| 中国 Alipay（Ant International） | 中国游客用 Alipay 扫全国 NAPAS 网络商户的 VietQRGlobal；反向（越南人扫 Alipay 码）在计划中 | 2026-04-03 | **Vietcombank** 为结算行；CNY/VND |
| 中国 UnionPay | 银联 App 或伙伴行 App 扫 VietQR Global（试点）；越南人在华扫银联码在计划中 | MoU 2024-10；四方协议（UPI、NAPAS、ICBC、Vietcombank）2025-04 | ICBC、Vietcombank |
| 中国 Weixin Pay | 扩大入境受理 | 2026-08 | **BIDV** |
| 韩国（GLN International，隶属 Hana Financial） | 韩国 App（Toss、Hana OneQ、Hana Money、Hana Card）扫 VietQR Global；Naver Pay、KB 随后接入；反向在计划中 | 2026-04-23 | **Hana Bank 与 BIDV**，KRW–VND 实时结算；Hana Bank 是 SBV 批准的唯一韩方结算行 |
| 新加坡（Liquid Group） | 双向（细节未核实） | 2026-07-02 | **VietinBank** |
| 印度、台湾 | 计划 2026 | — | — |
| **日本** | NAPAS 2024-12 宣布“2025 年拓展至中、日、韩” | **截至 2026-10 未查到日本上线** | — |

**模型特征**
- NAPAS 作为国家交换中心，直连境外网络或聚合方（Ant、UnionPay、Weixin Pay、GLN、Liquid）。这实际上是 hub-to-network 模式，而非只限央行之间。
- 每个通道指定一家越南结算行，以本币对本币结算（CNY/VND、KRW/VND）。
- 由谁报汇率、结算频率、单笔或单日限额：**未查到**。
- 外国钱包是**直接扫越南国家码**（VietQRGlobal），不需要商户另贴品牌码。

**日本钱包要覆盖全越南商户的可行路径**

| 路径 | 做法 | 覆盖面 | 审批难度 / 时间 |
|---|---|---|---|
| ① 国家级双边（日本官方 ↔ SBV/NAPAS，类似日柬 METI–NBC MOC + PJA–NETSTARS 模式） | NAPAS 已把日本列为目标；日方很可能沿用 PJA/JPQR + NETSTARS 架构 | 全部 VietQRGlobal 商户 | 政府主导，INSPAY 难以主导；12–24 个月以上；可争取作为日方运营方或清算参与方 |
| ② **经 NAPAS 跨境平台做“境外合作网络”（GLN 先例）** | INSPAY 或其日本持牌主体与 NAPAS 签约，指定越南结算行（BIDV、Vietcombank、VietinBank），报 SBV 批准；下游接 PayPay 等日本钱包 | 全部 VietQRGlobal 商户 | 中高。GLN、Liquid 都是商业网络而非央行，说明可行。**2026-07 Decree 52 修订草案**拟明确允许境外机构经持牌“国际金融交换服务商”（NAPAS、MobiFone）接入，并取消“最多连 2 家交换商”的限制，这是利好；需跟踪定稿 |
| ③ 与单一本地银行或钱包合作 | 现行 Decree 52 下，境外机构须与 SBV 认可的商业银行或外资分行签约；覆盖面限于该行或该钱包（MoMo、VNPAY）的商户。银行技术上可经 Napas 247 支付任意 VietQR，但这相当于把跨境收款包装成境内转账，存在外汇和合规风险 | 小（合规方式）或全（灰色方式） | 中；合规风险高 |
| ④ 借道 Alipay+ | PayPay 已于 2025-09-30 开通 Alipay+ 海外支付（先开韩国，手续费 3.85%）；Ant–NAPAS 目前只开放 Alipay（中国）扫 VietQRGlobal | 若 Ant 把 VietQRGlobal 开放给 Alipay+ 伙伴钱包，可覆盖全部 VietQRGlobal 商户 | 对 PayPay 最简单；对 INSPAY 而言只是渠道竞争者，INSPAY 没有位置 |

### A5. 监管

**外国支付机构**
- **Decree 52/2024/ND-CP**（非现金支付，2024-07-01 生效）。依 Tilleke 的解读：
  - 境外机构**只能通过与 SBV 认可的商业银行或外资银行分行签约**进入越南市场。
  - 现行规则限制交换系统参与者最多接入 2 家交换服务商。
- 2026-07 SBV 发布修订草案（改动 38 条中的 17 条），拟允许境外机构经持牌国际金融交换服务商（NAPAS、MobiFone）接入，目的是支持区域 QR 联通。**未定稿。**
- 中间支付或电子钱包牌照要求越南法人。外资上限 49%、注册资本门槛：**未核实**。

**数据**
- 《个人数据保护法》（Law 91/2025/QH15）2026-01-01 生效。
- 跨境传输须做 Cross-Border Transfer Impact Assessment，并在 60 天内报公安部 A05。
- 罚款最高为上年营收的 5%。
- Cybersecurity Law 及 Decree 53/2022 的本地存储要求：本轮未核实。

**外汇**
- 依 Ordinance on Foreign Exchange 28/2005（2013 年修订），境内交易、计价、支付原则上只用 VND。
- 2018 年报道的罚款为 2–2.5 亿 VND（该数额可能已被后续法规调整）。
- VND 没有离岸市场。
- 出入境免申报额度：USD 5,000 或 VND 1,500 万（二手来源）。
- 结论：跨境收单只能由越南结算行完成兑换并以 VND 付款给商户。

**加密资产与稳定币**
- **《数字技术产业法》**（Law 71/2025/QH15）2026-01-01 生效。
  - 数字资产分为 virtual assets 和 crypto assets 两类。
  - 两类都不包括证券、数字形态的法币及其他金融工具。
- **Resolution 05/2025/NQ-CP**（2025-09-09）：
  - 5 年试点，最多 5 家 CASP。
  - 最低实缴资本 10 万亿 VND（约 4 亿美元），外资上限 49%。
  - 发行限越南企业；**底层资产须为真实资产，不得是证券或法币**，即不允许法币锚定稳定币发行。
  - 只向外国投资者发行，交易也只在外国投资者之间、经持牌服务商进行。
  - 首家持牌后满 6 个月，在场外交易的国内投资者将受处罚。
- **发牌进展**：
  - 依 Decision 96/QĐ-BTC，2026-01-20 开始受理申请。
  - 5 份申请被认定有效：VIX、Loc Phat（LPBank 系）、Vietnam Prosperity（VPBank 系）、Techcom（Techcombank 系）、Vietnam Digital Asset JSC。
  - 年中报道仍是“尚无持牌”。
  - Decree 284/2026/ND-CP（2026-07-16 发布，09-01 生效）：通过未持牌平台交易者罚款 3,000–5,000 万 VND。
- **支付用途**：加密资产**不得作为支付手段**（PwC 2025-12）。
- **岘港沙盒**：
  - 面向外国人的稳定币支付沙盒，2025-09-01 至 2028-08-31，限 3 个地点。
  - 2026-01 开始 USDT→VND 兑换试点（Basal Pay）。
  - 9Pay 在研究 QR 稳定币支付。
- **越南盾稳定币**：未查到。

### A6. 候选合作方

- **交换中心**：NAPAS（必经）。
- **结算行（有先例）**：
  - Vietcombank（Ant、UnionPay/ICBC）
  - BIDV（GLN/Hana、Weixin Pay）
  - VietinBank（Liquid Group）
  - Sacombank（中越 QR）
- 据记忆（未核实），日资银行持有越南大行股份：Mizuho 持 Vietcombank、MUFG 持 VietinBank、SMBC 持 VPBank。
- **钱包与网络**：MoMo、ZaloPay、VNPAY（VNPAY-QR 网络，已与 NAPAS 合作）、9Pay。
- **潜在 VASP**：上述 5 家申请人，牌照未定；岘港沙盒中的 Basal Pay。

### A7. 对 INSPAY 方案的技术含义

**接入建议**
- 首选路径 ②（NAPAS 境外合作网络 + 越南结算行），同时关注 Decree 52 修订定稿。

**稳定币只能在境外闭环**
- 越南禁止加密资产用于支付，银行也没有持有稳定币的框架。
- 稳定币只能在 INSPAY 与境外流动性方（新加坡或日本）之间流转。
- 越南结算行收到的是 USD 或 JPY 法币头寸，由其兑换成 VND 后结算给 NAPAS。

**技术坑**
1. P2P 码缺 `59/52/60`，必须调 NAPAS 账户名查询来显示收款人。
2. 静态码由用户输入金额，VND 没有小数，`54` 只能是整数。
3. 动态码没有标准有效期字段，一次性参考号放在 `62.01` 或 `62.05`，有效期规则须向 NAPAS 确认。
4. `62.08` 附言是商户对账的关键字段，跨境通道必须原样透传。
5. 退款或撤销：Napas 247 推送是终局性的，退款靠反向交易；跨境退款流程需要和 NAPAS 约定。
6. 有 VietQR 和 VNPAY-QR 两张网，部分商户码不是 VietQR。
7. 要按 BIN 表维护受益机构名称，并在 BIN 增减时及时更新。

---

## B. 柬埔寨

### B1. 国家二维码标准

**基本情况**
- 名称：**KHQR**，由 NBC 运营，2022 年 7 月推出（二手来源）。
- 基于 EMVCo MPM，但有明显偏离（见 B2）。
- 支持静态和动态码。
- 支持 **KHR（116）和 USD（840）双币**。
- 未查到 CPM 标准。

**规模数据**
- 2024（NBC 年报的转述）：
  - Bakong 交易额 1,506.1 亿美元（约 GDP 的 330%）。
  - 约 6.08 亿笔，同比 +95%。
  - 约 3,000 万个 Bakong 钱包，**450 万+ 受理商户**。
- 2025（CIR，2026-06）：
  - 约 13.3 亿笔。
  - KHR 285.9 万亿 + USD 1,528 亿。
  - 商户约 450 万。
  - 手机银行用户 >1,000 万。
  - 该文同时出现“Bakong 约 75 万用户”的口径，与上面数字冲突。
- 结论：用户口径不一，需以 NBC 年报为准。

### B2. 码结构

以下来自 NBC 官方 SDK `bakong-khqr@1.0.20` 源码与测试样例（medium-high），样例 CRC 已复算。

**字段表**

| Tag | 内容 |
|---|---|
| `00` | `01` |
| `01` | `11` 静态 / `12` 动态（SDK 规则：金额 >0 即视为动态） |
| `15` | UnionPay Merchant Account（可选，≤99）。**SDK 规定 USD 码不能带 UPI 字段（只允许 KHR）** |
| **`29`** | **个人（Individual）**：`00` Bakong Account ID（`name@bankdomain`，≤32）；`01` account information（≤32，如手机号或账号）；`02` acquiring bank（≤32） |
| **`30`** | **商户（Merchant）**：`00` Bakong Account ID；`01` merchant ID（≤32）；`02` acquiring bank（≤32） |
| `52` | MCC，默认 5999 |
| `53` | `116` KHR / `840` USD |
| `54` | KHR 必须为整数；USD 最多 2 位小数；长度 ≤13 |
| `58` | `KH` |
| `59` | 名称 ≤25 |
| `60` | 城市 ≤15，默认 Phnom Penh |
| `62` | `01` bill no.、`02` mobile no.、`03` store label、`07` terminal label、`08` purpose（各 ≤25） |
| `64` | Merchant Information Language Template：`00` 语言、`01` 名称、`02` 城市 |
| **`99`** | **时间戳模板**：`00` 创建时间、`01` 过期时间，均为 13 位毫秒 epoch。**动态码必须带过期时间**，过期则报 KHQR_EXPIRED |
| `63` | CRC |

**与 EMVCo 的关键偏离**
- tag 29/30 的子标签 `00` **不是 GUID/AID**，而是 Bakong 账户 ID。
- 所以 KHQR 码里**没有 AID 可查**。
- 识别国家码的方法：`58=KH` + 出现 tag 29 或 30 + 子标签 `00` 含 `@`。
- `@` 后面的域名标识参与机构，例如 `aclb` = ACLEDA、`abaa` = ABA；`devb`、`nbcq` 是测试域名。
- 所有这类码都路由到 Bakong。账户是否存在可经 NBC Open API 查询（SDK 里有 checkBakongAccount）。

**P2P 与 P2M**：码里显式区分，**tag 29 = 个人，tag 30 = 商户**。

**SDK 附带的接口与标识**
- SDK 提供 deeplink 接口，路径 `/v1/generate_deeplink_by_qr`。
- ts-khqr 生成码时同时输出整串的 **md5**。据记忆，Bakong Open API 用这个 md5 查询交易状态（未核实）。

**样例**（SDK 测试与 README，CRC 已通过）

```
ABA 格式多网络码（静态、USD、商户）：
000201010211021641277800000000980416518352888000006030470016abaakhppxxx@abaa01153166007701102420204abaa5204224253038405802KH5910USD OUTLET6010PHNOM PENH62250509115B02750070827CE19809924001339CA026411FDA6803mmp63043870
  → 同一码里并存 tag02(Visa)、04(Mastercard)、30(KHQR商户 abaakhppxxx@abaa, merchantID 316600770110242)
动态个人码（KHR 10000，含 62/64/99）：
00020101021229420013ishinvin@devb01090123456780208Dev Bank5204599953031165405100005802KH5909Ishin Vin6010Phnom Penh62680114INV-2022-12-250211855123456780310Ishin Shop07060123450807Payment64180002ZH0102文山0202金边99340013175507623233601131755076292336630416C4
```

**跨境专用字段**：除 tag 15（UPI）外，没有跨境专用 GUID。外国钱包扫的就是普通 KHQR。

### B3. 底层轨道（Bakong）

- **运营与技术**：NBC 运营，日本 **Soramitsu** 承建，基于 **Hyperledger Iroha**（许可型链）。2019 年试点，2020-10 全面上线。
- **三层架构**：
  1. NBC 维护的 Bakong Core。
  2. NBC 分配给各金融机构的 domain / payment gateway，对应 `@bank` 后缀。
  3. 机构分配给终端用户的钱包。
- 7x24 实时运行，支持 KHR 和 USD。
- 参与者包括银行、MFI 和支付机构。
- 外国机构只能经 NBC 跨境安排或本地参与行接入。
- 链上结算与 NBC 结算账户之间的对应关系：未核实。

### B4. 跨境联通现状

| 对手方 | 方向 | 日期 | 备注 |
|---|---|---|---|
| 泰国 PromptPay | 至少是柬→泰 | 2020（Wikipedia） | 低置信 |
| 越南 NAPAS | 双向 | 2023-12-03 | 越南人以 VND 扫 KHQR |
| 老挝 LAPNet | Phase I：柬→老；Phase II：老挝用户扫 KHQR（约 450 万商户） | Phase I 2023-08；Phase II 2025-12-19 | — |
| 马来西亚 DuitNow | Phase 1：柬用户扫 DuitNow（Bakong 或 Maybank M2U KH）；Phase 2（马→柬）无时间表 | MoU 2024-02；Phase 1 2024-09 | — |
| UnionPay | 银联持卡人或 App 扫 KHQR（约 180 万商户） | 日期未核实 | tag 15 |
| **Alipay+** | 12 个钱包（Alipay、AlipayHK、Touch 'n Go、GCash、Kakao Pay 等）扫 KHQR；全 KYC 的 KHR 账户 Bakong 用户可在 Alipay+ 商户付款 | MoU 2023-11-15；上线 2024-10-17 | — |
| Weixin Pay | 入境游客扫 KHQR（第一阶段，全国） | 2026-08（单一来源） | — |
| 韩国 | 2024-09 有协议 | 现状未查到 | — |
| 印度 | — | 未查到 | — |
| **日本 JPQR** | **Phase 1（2025-07-04，大阪世博）：柬用户扫 JPQR**；Phase 2：日本用户扫 KHQR，原计划“2025 年底前”，**截至 2026-10 未查到上线** | 2023-12-18 METI–NBC MOC；2025-04-21 NBC–PJA MoU | 日方运营商 **NETSTARS**，日方结算行 **SMBC**；柬方 **ACLEDA**、**Sathapana** |

**补充**
- **Bakong Tourists App**：2024-08-19 在暹粒软启动。
  - 游客用邮箱注册，用本国 Visa、Mastercard、UnionPay 卡充值后扫 KHQR，覆盖 330 万+ 商户。
  - 支持 USD/KHR 兑换，与 Mastercard 合作。
- 据 ACLEDA 用户指南，**跨境扫码只能从 KHR 账户扣款**。再结合 SDK 中“UPI 只允许 KHR”的规则，可以推断：跨境 KHQR 以 KHR 结算，这是 NBC 去美元化政策的一部分。

**日本游客在柬扫 KHQR 是否可行**
- 今天可以：通过 Bakong Tourists App 用信用卡充值后支付。
- 如果是 Alipay+ 伙伴钱包：PayPay 已是 Alipay+ 的 outbound 钱包，但只开通了韩国。Alipay+ 已接 KHQR，所以 **PayPay 开通柬埔寨在技术上只差 Ant 与 PayPay 的商务决定**。
- JPQR Phase 2 是官方路线，但尚未上线。

**日本钱包覆盖全柬商户的路径**

| 路径 | 覆盖面 | 难度 |
|---|---|---|
| ① 加入 JPQR–KHQR Phase 2（PJA / NETSTARS / SMBC ↔ NBC / ACLEDA / Sathapana），INSPAY 作为日方发行侧参与者，或通过 NETSTARS 接入 | 全部 KHQR（约 450 万商户） | 日方已指定 NETSTARS 为运营商，INSPAY 需与之合作或竞争 |
| ② INSPAY 作为“网络”与 NBC 签跨境 MoU（Ant、UnionPay、Weixin Pay 都有先例），由本地 sponsor 银行结算 | 全部 KHQR | 高；且与 PJA 的“国家对口”定位可能冲突 |
| ③ 与单一银行合作（ACLEDA、ABA、Sathapana），由银行经 Bakong 推送到任意 KHQR | 技术上可覆盖全部；合规须 NBC 批准跨境入境业务 | 中 |
| ④ 借道 Alipay+ | 全部 KHQR（Alipay+ 已接） | 对 PayPay 最容易，INSPAY 没有位置 |

### B5. 监管

**支付机构**
- 依 2017-06-14 的 Prakas on the Management of Payment Service Providers，提供支付服务须向 NBC 申请牌照，申请材料包括三年预测的商业计划、资本证明等。
- 电子货币只能由银行或持牌支付机构发行。
- 单用途电子货币上限 KHR 20 万。
- 是否有 2024 年新版 Prakas：未查到。
- 外国钱包只能经 NBC 跨境安排或本地持牌机构受理 KHQR。

**数据本地化**：未查到明确要求，柬埔寨尚无综合性数据保护法（未核实）。

**外汇**：经济高度美元化，USD 在境内流通合法；NBC 在推 KHR 使用（跨境 QR 以 KHR 结算）。KHR 离岸流动性很低。

**加密资产与稳定币**：Prakas on Transactions Related to Cryptoassets，2024-12-26（个别报道写成 2025-12-26，以 2024 为准）。
- **分类**：
  - Group 1a：代币化传统资产。
  - Group 1b：有有效稳定机制、锚定传统资产的稳定币（排除算法稳定币）。
  - Group 2：其余资产，包括无支撑币。
- **银行**：
  - 经 NBC 事先批准，可自营或为客户提供 Group 1 服务。
  - 不得发行加密资产，不得做 Group 2 及其衍生品。
  - 敞口上限：**1a ≤5% CET1，1b ≤3% CET1**。
  - 须按季报告。
- **CASP**：交换、转移、托管须持牌，规则延伸适用于支付服务机构。
- **罚款**：KHR 2,000 万–5 亿。
- **沙盒**：SERC 的 FinTech 沙盒内只有 2 家机构，且不得把加密资产兑成法币。
- 《数字资产法》在起草中（未核实）。
- **KHR 稳定币**：未查到。
- **含义**：零售支付层面没有明确放开，但持牌银行**有法定路径持有并处理合格稳定币**，这一点明显优于越南。

### B6. 候选合作方

- **ACLEDA**（`aclb`）：日柬 Phase 1 主力行。
- **Sathapana Bank**：日柬通道参与行。据记忆为日本 Maruhan 系（未核实）。
- **ABA**（`abaa`）：最大零售行之一。
- Maybank Cambodia（M2U KH）、Wing 等支付机构。
- 日本侧：NETSTARS、SMBC。
- Bakong 的建设方 Soramitsu 是日本公司，可作为与 NBC 沟通的纽带。

### B7. 技术含义

1. **解析器**：必须专门支持“tag 29/30 中没有 GUID”的 KHQR；遇到同一码里有 Visa/Mastercard/KHQR 多网络并存时，要优先选 KHQR。
2. **币种**：静态 USD 码在 KHR-only 的跨境通道下能否支付，需要向 NBC 确认。如果只能付 KHR 码，会损失大量美元标价商户。
3. **动态码**：校验 `99.01` 过期时间（毫秒）。交易状态可用 md5 查询（待核实）。
4. **商户名**：`59` ≤25 字符，`64` 提供高棉语或中文别名。
5. **退款**：Bakong 推送是终局的，退款靠反向交易，需要在跨境协议中约定。

---

## C. 总结建议

- **越南**：走 NAPAS「境外合作网络」路线（GLN 先例），在越南指定结算行。稳定币只在境外流转，越南境内全部为 VND 法币结算。时间点上要盯 Decree 52 修订定稿，以及 NAPAS 的日本对口安排（谁来对接日方：PJA、NETSTARS 还是商业机构）。
- **柬埔寨**：最现实的切入是参与 JPQR–KHQR Phase 2（与 NETSTARS 合作，或作为其发行侧伙伴）。同时可以和 ACLEDA 或 Sathapana 探讨在 NBC 批准下用 Group 1b 稳定币做跨境头寸结算（3% CET1 上限）、再以 KHR 经 Bakong 付给商户的方案。
- **两国共同风险**：Ant/Alipay+ 一旦把 PayPay 开通到越南、柬埔寨，INSPAY 在 PayPay 这个渠道上的切入空间会被大幅压缩。


### OPEN QUESTIONS
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