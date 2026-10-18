# Netstars / JPQR 与 HIVEX 现状核查（截至 2026-10-18）

> 证据说明：本轮用了 20 次检索。WebFetch 打开 paymentnavi、impress、prtimes、paypay.ne.jp 时全部 DNS 失败（ENOTFOUND），所有事实都来自检索摘要。逐条来源与置信度见同目录的 `competitors.json`（COMPETITORS-01~51）。

## 一句话结论

创始人的判断**只部分成立**：

- 在**境外钱包入境受理**上，HIVEX 确实远强于 Netstars 的 JPQR Global。
- 但“HIVEX 手续费约 1%”在日本商户端**不成立**。经 HIVEX 的交易按 PayPay 费率收，即 1.60% 或 1.98%。
- “Netstars 海外没有进展”**与证据不符**：有进展，但规模小，偏政府项目。
- 更重要的是，**两家在 2026 年都已上线稳定币通道**，INSCREEN 面对的竞争格局已经变了。

## 1. 两家公司在日本处在不同层

| 维度 | Netstars（StarPay / JPQR Global） | HIVEX（TBCASoft） |
|---|---|---|
| 角色 | 国内收单和聚合网关，自己签约商户 | 跨境 QR 网络，不签约日本商户 |
| 日本覆盖 | StarPay 约 70 万账户（2025-12，含售货机，第三方摘要）；JPQR Global 首批只有 35 家商户 | 等于 PayPay 全部线下加盟店，默认开启，商户无需申请（PayPay 用户 7,400 万） |
| 商户费率 | 各品牌另计；Stablecoin Pay 为 0.98% | 与 PayPay 同率：1.60%（ライトプラン，月费 1,980 日元）或 1.98% |
| 公司体量 | 东证 Growth 5590；FY2025 营收约 48 亿日元，扭亏为盈 | 美国公司，软银等出资；交易量未公开 |

所以：

- 就“外国游客的本国钱包能在多少日本店里用”而言，HIVEX 和 Alipay+ 经 PayPay 的覆盖都远大于 JPQR Global。
- 但 Netstars 作为国内网关并不弱，HIVEX 根本不在这个赛道。

**JPQR** 本身现在主要是两样东西：一是码规格标准（包括地方税 eL-QR），二是 JPQR Global 这个跨境交换品牌。総務省的普及事业累计只导入约 1.5 万店（2023 年度末），FY2025 是否继续未查到。

## 2. 海外进展

**Netstars 已上线的**（在 METI 政府间框架下）：

- 柬埔寨 KHQR 入境（2025-07-04）。
- 印尼 QRIS 入境（2025-08-17，首批 35 店、14 家银行，GoPay 2025-09 跟进）。
- 卡塔尔 QNB 接入 StarPay，印度 UPI 可在卡塔尔全境受理（2025-09，首家为 Qatar Duty Free）。
- 柬埔寨 ACLEDA 采用 StarPay 作为 WeChat Pay 网关（2024）。

**Netstars 未上线的**：

- 印尼反向（日本游客在印尼扫 QRIS）：BI 2026-04 称已获 FSA 许可，但未见上线。
- KHQR 二期、马来西亚 DuitNow、老挝、越南：均未见上线。
- “卡塔尔 3,000+ 店”只有第三方摘要，置信度 low。

**HIVEX 的进展**：

- 已接入日本 PayPay 加盟店的境外钱包：台湾多家钱包、WeChat Pay（2025-09-16）、UnionPay App（2026-09-03）、Binance Pay（2026-09-30）。
- 为 PayPay 用户上线了台湾 TWQR 出境（2026-04-27，40 万+ 店）。
- 已在韩国上线；菲律宾仍是 MOU 阶段。

HIVEX 的海外钱包网络更宽，商业化程度也更高。

## 3. 稳定币就绪度（本轮最重要的新事实）

**Netstars 的 Stablecoin Pay（2026-07-13 正式提供）**：

- 商户费率 0.98%，支持 USDC、USDT、JPYC，链为 Solana 和 Polygon。
- 目前是顾客出示码（CPM），商户出示码（MPM）在计划中。
- 按日元结算，无需新终端。
- 实证：羽田机场、姬路一家集换卡店、ローソン大崎的 POS 联动（2026-08-17）。
- 合作伙伴：Circle Gateway、Startale（JPYSC）、imToken。
- 这是 INSCREEN 的**直接竞品**。
- 未查到：牌照架构（日本尚未见登记业者把 USDT 作为電子決済手段处理）和导入商户数。

**HIVEX × Binance Pay（2026-09-30 上线）**：

- 外国游客可在 PayPay 线下加盟店用 USDT 付款。
- 商户收日元，零接入，按 1.60% 或 1.98% 收费。
- 日本居民不在对象内。
- StableLink（与 StraitsX 的结算层合作）仍是 MOU。

**Alipay+**：日本 300 万+ 商户、PayPay 受理 35 项境外服务，但在日本未见稳定币动作。

## 4. 对 INSCREEN 的含义（推断）

- “外国游客在普通商户付 USDT”已被 PayPay/HIVEX 以零接入的方式覆盖。
- Netstars 用 0.98% 卡住了“商户主动接入多种稳定币”的价格带。
- INSCREEN 的“0% 手续费 + 月费约 2,000 日元”是创始人的假设。它在月费上与 PayPay ライトプラン（1,980 日元，但仍收 1.60%）相当，必须先说清两件事：
  - 换汇、gas、合规和资金移动的成本由谁承担。
  - 对已经有 PayPay 的商户，增量价值在哪里。
- 可能的差异化方向：
  - 无人值守机器（售货机、游戏机）。
  - 高客单价商户（按百分比收费更痛）。
  - JPYC 居民支付。
  - 商户想直接持有稳定币，而不是收日元。

## 待核实（摘要）

1. Stablecoin Pay 的牌照与资金流，以及 0.98% 是否含换汇和 gas。
2. HIVEX 的网络费率和 Binance 通道的实际交易量。
3. JPQR Global 当前商户数，以及印尼反向、KHQR 二期的上线时间。
4. 创始人说的“HIVEX 约 1%”的出处。
