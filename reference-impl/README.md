# qr-bridge · 参考实现

"稳定币版 Alipay+"核心交换逻辑的**零依赖 TypeScript 参考实现**（Node ≥ 22.18 原生运行 `.ts`，无需编译）：

```
扫码(EMVCo MPM) → 国家码识别与路由 → 锁汇报价(JPY→USDC→本币) → 支付编排(幂等/风控/U状态)
   → 复式记账 → 结算周期净额 → 稳定币链上偿付本地结算伙伴
```

它的目的是把 [`docs/`](../docs) 里的设计落成可以跑、可以测的代码，用来和钱包/本地伙伴对齐接口和边界条件；**不是生产系统**（没有持久化、HSM、真实链上托管、真实轨道报文）。

## 运行

```bash
cd reference-impl
npm test            # 单元 + 流程测试（node:test）
npm run typecheck   # tsc --noEmit（需要 npm install 安装 @types/node / typescript）
npm run demo        # 端到端演示：PayPay 式日元钱包扫各国合成国家码 → 结算
npm run serve       # 启动 HTTP API（默认 :8787；MPP_SECRET=xxx 开启签名校验）
```

## 目录

| 路径 | 内容 |
|---|---|
| `src/emvco/` | EMVCo MPM TLV 编解码、CRC-16/CCITT-FALSE、字段校验、合成码生成器、ISO 4217 |
| `src/schemes/` | 各国国家码识别规则（GUID/AID → 方案、P2M/P2P、收单方/商户/账户字段提取）与注册表 |
| `src/fx/` | bigint 定点小数、两段式报价（firm RFQ，向上取整保证商户不少收） |
| `src/payments/` | 支付编排：decode → quote → pay → resolvePending → refund |
| `src/ledger/` | 多币种复式记账（每笔分录按币种借贷平衡） |
| `src/settlement/` | 结算周期：按参与者轧差、金库流动性检查、USDC 链上偿付、MPP 应收、FX 头寸再平衡 |
| `src/adapters/` | LSP / 链 / 风控 / 回调接口与内存 mock |
| `src/api/` | HTTP/JSON 接口（`/v1/qr/decode`、`/v1/quotes`、`/v1/payments`…） |
| `test/` | 测试 |

## 示例

```bash
curl -s localhost:8787/v1/qr/decode -d '{"mppId":"PAYPAY","qrCode":"<国家码字符串>"}'
curl -s localhost:8787/v1/quotes -d '{"decodeId":"D...","amount":"30000"}'
curl -s localhost:8787/v1/payments -d '{"mppId":"PAYPAY","paymentRequestId":"r-1","quoteId":"Q...","payerRef":"u1"}'
curl -s localhost:8787/v1/settlement/cycles -d '{"cycleId":"2026-10-18"}'
```

## 已知简化

* 汇率为演示用固定值（`src/network.ts` 的 `DEMO_RATES`），不是市场数据；
* 各国码的样例由 `buildMpm` 合成，商户与账户号均为虚构；
* 结算周期按"关闭时刻的余额快照"，生产需要按截止时间戳切分并持久化；
* FX 再平衡只生成指令，不执行兑换；
* 风控仅示意（单笔限额 + 名称黑名单），生产需接制裁名单、交易监控与 Travel Rule。
