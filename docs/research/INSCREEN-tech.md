# INSCREEN 受理稳定币的技术设计（2026-10-18）

> 证据标注：【事实】一手或多源核实；【公司说法】；【推论】；【假设】。编号对应 `tech.json` 里的 TECH-xx。本轮用了 8 次 WebSearch。WebFetch 打开 sbivc.co.jp、developers.circle.com、zenn.dev 都失败了，相关内容只凭检索摘要和 GitHub 代码检索。

## 一句话结论

技术上不难，难在四件事：钱包兼容、确认速度、离线风险、监管边界。推荐的主路径是：**付款人签 EIP-3009 授权（收款人锁定为商户地址），INSPAY 的 relayer 先筛查再提交、代付 gas，只用终局约 5 秒以内的链**。这样同时做到四件事：付款人不需要持有 gas 币，资金进来前能先筛查，INSPAY 不经手资金，0% 手续费在技术上成立。

## 关键事实

- 【事实】新 JPYC 合约为 `0xE7C3…3c29`，官方只在 Ethereum、Avalanche、Polygon、Kaia 四条链上（Kaia 于 2026-05 加入）（TECH-06）。
- 【第三方实测】新 JPYC 支持 EIP-3009 和 EIP-2612，18 位小数，EIP-712 domain 为 `{name:"JPY Coin", version:"1"}`。`DOMAIN_SEPARATOR()` 调用会 revert，集成方要自己硬编码。目前没有发行方的正式文档（TECH-07）。
- 【事实】USDC 在 EVM 链上支持 EIP-3009（TECH-09）。Circle Paymaster 支持用 USDC 付 gas，已在 7 条链上线，加收费率的说法互相矛盾（TECH-20）。
- 【事实】SBI VC Trade × アプラス 于 2026-05 做了店铺实证：顾客从 MetaMask 转出 USDC，SBI 换成日元，アプラス 以日元入账，这是持牌伙伴方案的模板（TECH-12）。**SBI 的 USDC 支持哪些链没查到**，这是最大的待办（TECH-11）。
- 【公司说法】Ingenico × WalletConnect Pay（2026-01）在 Android POS 上以纯软件方式受理 USDC、EURC、USDT，欧洲先行（TECH-05）。终端硬件本身不构成护城河。
- 【事实】Polygon PoS 在 Heimdall v2 后终局约 5 秒，2025-09 出过一次终局延迟（TECH-16）。
- 【事实/推论】USDT 和 PYUSD 在日本没有境内出金通道（TECH-33）。Binance 用户自 2026-09-30 起已能经 PayPay×HIVEX 付 USDT（TECH-34）。

## 推荐参考架构（三种监管设计共用）

**终端**：多格式支付请求（WalletConnect、EIP-681、带 reference 的 Solana Pay、EIP-3009 签名请求）、NFC NDEF 发射、扫付款人出示的码、终端身份密钥。终端上不放任何能动用货款的私钥。

**云端**：订单签名与报价、多 RPC 链监听、匹配引擎、按链和金额分层的确认策略、EIP-3009 relayer 与 gas 钱包（KMS）、制裁和 KYT 筛查、对账账本与会计导出（freee、MF、弥生，满足电帳法）、POS API 与 webhook、伙伴适配层（SBI VC、JPYC EX、PayPay/HIVEX/Alipay+）。

| 设计 | 收款地址由谁控制 | 谁做兑换 | INSPAY 牌照 | 建议 |
|---|---|---|---|---|
| (a) 非托管 | 商户自托管（或商户控制的智能账户） | 商户自己（JPYC EX 赎回、SBI 入库） | 原则上不需要（须律师确认） | **首发** |
| (c) 持牌伙伴 | 伙伴为商户开的账户地址 | 伙伴（如 SBI×アプラス 模式） | 只提供系统时不需要；替伙伴招揽商户要登録仲介業 | **第二阶段**：USDC 自动换日元 |
| (b) INSPAY 托管 | INSPAY（MPC/HSM） | INSPAY | 電子決済手段等取引業（可能还要資金移動業） | 首发不建议 |

**首发的币和链【推论】**：JPYC 上 Polygon、Kaia、Avalanche；USDC 上伙伴支持的链（待确认）加上 Polygon、Base、Solana；USDT 不原生收，引导到 PayPay/HIVEX；JPYSC 只能和 SBI 合作做账户型对接。无人设备只用确定性终局链，出货失败时用商户的受限退款 key 自动退款。

## 离线与风险

- 可行的模式：**付款人离线、终端在线**。付款人签好 EIP-3009 授权，经 QR、NFC 或 BLE 交给终端，终端筛查后提交，几秒内就能终局。这种模式没有跨钱包标准，要靠 INSPAY 自己的钱包或 SDK（TECH-26）。
- 双方都离线时，预签授权可能落空：余额被先花掉、授权被 cancelAuthorization 撤销、地址被冻结、授权过期。只能小额、限定用户、由商户事先接受风险。托管或预存额度方案如果由 INSPAY 控制放行，可能构成管理、為替或前払式（TECH-27/28）。
- 退款要由商户密钥签名，退到付款人指定的地址，不能默认原路退回到交易所的热钱包（TECH-29）。

## 自建或采购

- **自建**：终端 App、订单匹配和确认策略、relayer、离线签名协议和钱包 SDK、对账和会计导出、POS/MDB 接口、伙伴适配层。
- **采购**：RPC 和索引、Chainalysis/TRM/Elliptic 筛查、WalletConnect、KMS/HSM、SBI VC 和 JPYC EX 的换汇与出金、PayPay/HIVEX/Alipay+ 通道。
- 只有设计(b) 才需要采购 MPC 托管和 Travel Rule 方案。

## 关于「0% 手续费 + 月费 2,000 日元（假设）」

在设计(a) 下，没有收单方抽成，所以 0% 在技术上成立。但成本并没有消失：gas 代付在低费链上每笔不到 1 日元（假设）；筛查单价未知；RPC 和运维要花钱；商户还要承担换汇点差、出金费、退款 gas 和 USDC 的汇率风险。月费能否覆盖这些，取决于筛查单价和每个商户的笔数，应交给财务模型按 10、50、200 笔每月做敏感性测算（TECH-50）。

## 最优先的待查事项

1. SBI VC Trade 的 USDC 链清单和法人入库 API（决定设计 c 能否落地）。
2. JPYC 官方确认 EIP-3009 支持和冻结函数，以及各链的流通分布。
3. Unifi 钱包的链和格式兼容性（JPYC 最大的用户群）。
4. 律师确认：relayer 代付 gas 不构成媒介或為替；托管合约和离线额度的法律定性。
5. INSCREEN 的硬件规格，以及无人机台的接口。
