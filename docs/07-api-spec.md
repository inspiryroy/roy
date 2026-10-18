# 07 · 接口规范（MPP / LSP / 结算）

> 本规范是方案设计稿，用于和钱包（MPP，例如 PayPay）、本地结算伙伴（LSP，各国本地持牌银行/电子钱包）做技术对齐；`reference-impl/` 中实现了其中的核心子集（见文末对照表）。字段与 Alipay+ 的 A+ 接口在语义上尽量对齐（`paymentRequestId`、`resultStatus S/F/U` 等），以降低已接过 Alipay+ 的钱包的改造成本。

## 7.1 通用约定

| 项 | 约定 |
|---|---|
| 传输 | HTTPS（TLS 1.2+），双向 TLS（mTLS）；生产环境按 MPP 白名单 IP |
| 报文签名 | 请求、响应均签名：`RSA-SHA256` 或 `ECDSA-P256-SHA256`，签名串 = `<HTTP-METHOD> <PATH>\n<Client-Id>.<Request-Time>.<Body>`；头部 `Client-Id`、`Request-Time`（ISO 8601）、`Signature: algorithm=RSA256,keyVersion=1,signature=<base64url>`；时钟偏差 ±5 分钟。参考实现用 HMAC-SHA256 代替（`Signature: t=<ms>,v1=<hex>`），仅用于本地演示 |
| 幂等 | MPP 侧 `paymentRequestId`（每笔唯一，≤64 字符）是支付幂等键；重复请求返回首次结果，不会二次入账/二次打款 |
| 金额 | `{ "currency": "THB", "value": "12050" }`，`value` 为**最小货币单位的整数字符串**（THB 2 位小数 → 120.50 THB = `"12050"`；JPY、VND 0 位小数）。不使用浮点 |
| 结果对象 | `result: { resultCode, resultStatus: "S"|"F"|"U", resultMessage }`；`U` = 未知/处理中，**MPP 不得据此释放用户资金** |
| 时区 | 所有时间戳 UTC，结算日按网络规则（见 04 章） |
| 版本 | 路径前缀 `/v1`；新增字段向后兼容，删除/语义变更升主版本 |

## 7.2 MPP → 网络

### 7.2.1 `POST /v1/qr/identify`（扫码识别，参考实现路径 `/v1/qr/decode`）

钱包扫到任何以 `000201` 开头的 EMVCo 码，且本地无法识别为自家/JPQR 码时调用。网络负责：EMVCo TLV 解析与 CRC 校验 → 识别国家码模板（GUID/AID）→ 判断 P2M/P2P、静态/动态 → 检查是否有可用路由（LSP 在线、国家开通、限额）。

请求：
```json
{
  "mppId": "PAYPAY",
  "qrCode": "00020101021230...6304ABCD",
  "scanContext": { "geo": { "lat": 13.7563, "lon": 100.5018 }, "simCountry": "JP", "networkCountry": "TH" },
  "userLocale": "ja-JP"
}
```
响应（成功）：
```json
{
  "result": { "resultCode": "SUCCESS", "resultStatus": "S" },
  "decodeId": "D...", "expiresAt": "2026-10-18T09:10:00Z",
  "scheme": { "schemeId": "TH.THAIQR", "name": "Thai QR Payment (PromptPay)", "country": "TH", "rail": "PromptPay / ITMX", "paymentType": "P2M" },
  "merchant": { "name": "SOMTAM SHOP", "city": "BANGKOK", "mcc": "5812", "localName": "ร้านส้มตำ" },
  "currency": "THB",
  "amount": { "currency": "THB", "value": "12050" },
  "amountEditable": false,
  "tipPrompt": false,
  "prompts": [],
  "warnings": []
}
```
错误码：`INVALID_QR`（TLV/CRC 错）、`UNSUPPORTED_QR`（不是已支持的国家码）、`NO_ROUTE`（识别了但该国/该轨道未开通）、`P2P_NOT_SUPPORTED`（个人收款码，不承接）、`UNKNOWN_MPP`。

钱包 UI 规则：
* 静态码（`amountEditable=true`）：钱包让用户输入**当地币种金额**，旁边实时显示折合日元（调用 7.2.2）；
* 动态码：金额不可改；
* `prompts` 中列出的附加数据（EMVCo `62` 模板里值为 `***` 的子字段，如账单号、手机号）要让用户填写；
* 显示 `merchant.name` + `localName`（若有）+ 国家旗，提醒用户与店铺核对。

### 7.2.2 `POST /v1/quotes`（锁汇报价）

```json
{ "decodeId": "D...", "amount": { "currency": "THB", "value": "100000" }, "tip": { "currency": "THB", "value": "0" } }
```
响应：
```json
{
  "quoteId": "Q...", "expiresAt": "2026-10-18T09:01:30Z",
  "payerAmount": { "currency": "JPY", "value": "4923" },
  "merchantAmount": { "currency": "THB", "value": "100000" },
  "customerRate": "4.90722656",
  "breakdown": { "principal": "4883", "fxMargin": "25", "networkFee": "15", "fixedFee": "0" },
  "settlementAsset": "USDC", "settlementAmount": "31.25"
}
```
* 有效期 = min(政策 TTL, 各段流动性提供方 firm quote 的有效期)，一般 30–60 秒；
* `payerAmount` 是**用户最终支付的日元总额**（含费用），钱包按此扣款；
* 报价单只能被一个 `paymentRequestId` 使用（单次有效）。

### 7.2.3 `POST /v1/payments`（支付）

钱包在用户确认（生物识别/PIN）并**冻结或扣减**用户余额后调用：
```json
{
  "mppId": "PAYPAY",
  "paymentRequestId": "PP20261018090100123456",
  "quoteId": "Q...",
  "payer": { "payerRef": "hash(user-id)", "kycLevel": "FULL", "residenceCountry": "JP", "name": "YAMADA TARO" },
  "paymentExpiryTime": "2026-10-18T09:03:00Z"
}
```
响应：`200`（S 或 F）或 `202`（U，处理中）：
```json
{
  "result": { "resultCode": "SUCCESS", "resultStatus": "S" },
  "paymentId": "P...", "status": "SUCCEEDED",
  "railRef": "ITMX-20261018-000123",
  "merchantAmount": { "currency": "THB", "value": "100000" },
  "payerAmount": { "currency": "JPY", "value": "4923" },
  "settlementCycle": "2026-10-18"
}
```
* 网络在同步窗口（建议 ≤ 8 秒）内等待 LSP/本地轨道结果；超时返回 `U`，后续通过 `notifyPayment` 或 `inquiry` 给出终态；
* `payer.name` 等发起人信息用于满足各国对跨境支付的发起人信息要求（FATF R.16 / 各国外汇申报）；只在需要的区间传给 LSP，遵循最小必要原则；
* 风控拒绝：`RISK_REJECTED`（403）/`RISK_REVIEW`。

### 7.2.4 `POST /v1/payments/inquiry`
`{ "paymentRequestId": "..."}` 或 `{ "paymentId": "..." }` → 同 7.2.3 响应。MPP 在收到 `U` 后按 2s/4s/8s/… 退避查询，最长 24 小时；若仍为 `U` 进入人工对账。

### 7.2.5 `POST /v1/payments/cancel`
仅在**本地轨道尚未提交**时可成功（例如 MPP 侧超时、用户放弃）；已提交到本地轨道后不能撤销，只能走退款。网络保证"取消成功"与"打款成功"互斥。

## 7.3 网络 → MPP（回调）

| 回调 | 时机 | 要点 |
|---|---|---|
| `notifyPayment` | `U` → `S/F` 终态 | 至少一次投递，MPP 以 `paymentId` 幂等处理；重试 1m/5m/30m/2h/6h/24h |
| `notifyRefund` | 商户（经 LSP）发起退款成功 | 携带 `refundId`、`refundAmount`（日元，按 04 章退款汇率规则）|
| `notifySettlement` | 结算周期关闭 | 结算单下载地址与净额 |

## 7.4 网络 ↔ LSP（本地结算伙伴）

### 7.4.1 `POST {lsp}/v1/credits`（指示向商户入账）
```json
{
  "paymentId": "P...",
  "scheme": "TH.THAIQR",
  "routing": { "acquirerId": "...", "merchantId": "...", "account": "0105556123456", "proxyType": "BILLER_ID", "references": { "ref1": "INV001", "ref2": "T01" } },
  "amount": { "currency": "THB", "value": "100000" },
  "qrPayload": "000201010212...",
  "originator": { "name": "YAMADA TARO", "country": "JP", "institution": "PAYPAY", "purpose": "PURCHASE_OF_GOODS" },
  "settlementAsset": "USDC", "settlementAmount": "31.25"
}
```
LSP 以本地轨道报文（ISO 20022 `pacs.008` / ISO 8583 / 本地 API）发起贷记，返回 `S/F/U` 与轨道流水号。动态码必须把码内的参考号（如泰国 bill payment 的 Ref1/Ref2、EMVCo `62` 的 bill number / terminal label）原样带上，否则商户 POS 无法自动核销。

### 7.4.2 `POST {lsp}/v1/credits/inquiry`
同上，用于超时补查。

### 7.4.3 `POST /v1/lsp/refunds`（LSP → 网络）
商户在 LSP 渠道发起退款（或经争议裁决）后通知网络，网络按 04 章规则把日元退回 MPP。

### 7.4.4 结算确认
网络对 LSP 的稳定币付款，链上交易的 memo/引用 = `instructionId`；付款前通过 Travel Rule 通道（IVMS101 格式）发送发起方/受益方机构信息；LSP 收到后 `POST /v1/lsp/settlements/{instructionId}/ack`。

## 7.5 结算与对账文件

每个结算周期（默认日终，可配置为每小时）为每个参与者生成：
* `transactions.csv`：`paymentId, paymentRequestId, schemeId, status, merchantAmount, merchantCurrency, payerAmount, payerCurrency, settlementAmount, fxMargin, networkFee, railRef, createdAt, cycleId`
* `summary.json`：毛额、笔数、净额、结算资产、链上交易哈希、汇率快照
* 三方对账：MPP 文件 ↔ 网络账本 ↔ LSP 轨道流水 ↔ 链上转账，差异自动生成工单。

## 7.6 参考实现对照

| 规范接口 | `reference-impl` | 状态 |
|---|---|---|
| 7.2.1 identify | `POST /v1/qr/decode` → `PaymentService.decode` | 已实现 |
| 7.2.2 quotes | `POST /v1/quotes` → `PaymentService.quote` | 已实现 |
| 7.2.3 payments | `POST /v1/payments` → `PaymentService.pay` | 已实现（幂等、风控、U 状态） |
| 7.2.4 inquiry | `GET /v1/payments/{id}`；`resolvePending()` | 部分 |
| 7.2.5 cancel | `POST /v1/payments/cancel` → `PaymentService.cancel` | 已实现（未知请求打墓碑、拒绝迟到的 pay；处理中/已成功不可取消） |
| 7.3 回调 | `MppNotifier` 接口 + `RecordingNotifier` | 接口 |
| 7.4 LSP | `SettlementPartner` 接口 + `MockPartner` | 接口 + mock |
| 7.5 结算 | `POST /v1/settlement/cycles` → `SettlementEngine.closeCycle` | 已实现（净额、链上付款、短缺检测） |
