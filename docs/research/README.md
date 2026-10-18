# 原始调研输出

这里是各调研 agent 的原始输出（`*.json` 为事实清单，`*.md` 为报告），按主题分文件：

| 文件 | 主题 |
|---|---|
| `TH-LA` | 泰国 Thai QR / PromptPay、老挝 LAO QR |
| `SG-MY` | 新加坡 SGQR / PayNow、马来西亚 DuitNow |
| `ID` | 印尼 QRIS |
| `VN-KH` | 越南 VietQR / NAPAS、柬埔寨 KHQR / Bakong |
| `PH-MM` | 菲律宾 QR Ph、缅甸 MMQR |
| `ASEAN-LINK` | 东盟区域跨境 QR 联通、Project Nexus |
| `JP-PAYPAY`、`JP-VERIFY` | 日本法规与 PayPay（第一轮与核实轮） |
| `ALIPAYPLUS`、`ALIPAY-VERIFY` | Alipay+（第一轮与核实轮） |
| `STABLECOIN-INFRA` | 稳定币基础设施、出入金、Travel Rule |

**结论以正文（`docs/01`–`10`）为准。** 原始输出中有被核实轮推翻的条目，也有与正文不同的推荐（例如 `ASEAN-LINK.md` 以路径 A 为主、把柬埔寨列入首批）。[09 资料来源](../09-sources.md) 由这些 `*.json` 汇总生成，并标注了置信度。
