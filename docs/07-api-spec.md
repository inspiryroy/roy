# 07 · 接口规范（MPP / LSP / 结算）

> 本规范是方案设计稿，用于和钱包（MPP，例如 PayPay）、本地结算伙伴（LSP，各国本地持牌银行/电子钱包）做技术对齐，**对外联调以本规范为准**。`reference-impl/` 实现了其中的核心语义子集，但报文格式与本规范不同（金额为最小单位整数字符串、时间为毫秒时间戳、没有 `result{}` 对象等），差异逐项列在 7.6。字段与 Alipay+ 的 A+ 接口在语义上尽量对齐（`paymentRequestId`、`resultStatus S/F/U` 等），以降低已接过 Alipay+ 的钱包的改造成本。

## 7.1 通用约定

| 项 | 约定 |
|---|---|
| 传输 | HTTPS（TLS 1.2+），双向 TLS（mTLS）；生产环境按 MPP 白名单 IP |
| 报文签名 | 请求、响应均签名：`RSA-SHA256` 或 `ECDSA-P256-SHA256`，签名串 = `<HTTP-METHOD> <PATH>\n<Client-Id>.<Request-Time>.<Body>`；头部 `Client-Id`、`Request-Time`（ISO 8601）、`Signature: algorithm=RSA256,keyVersion=1,signature=<base64url>`；时钟偏差 ±5 分钟，窗口内每个签名只接受一次（重放拒绝）。参考实现用 HMAC-SHA256 代替，见 7.1.1 |
| 身份与角色 | 每个 `Client-Id` 绑定一个角色：`MPP`（钱包）、`LSP`（本地结算伙伴）、`OPS`（网络内部运营）；接口按角色授权，见 7.1.1 |
| 幂等 | `paymentRequestId` **必填**，1–64 位可打印 ASCII（`^[\x21-\x7e]{1,64}$`），缺失或不合法返回 `BAD_REQUEST`；幂等范围是（MPP，`paymentRequestId`）。同号同 `quoteId` 的重复请求（含并发重试）返回首次结果，不会二次入账/二次打款；同号但 `quoteId` 不同返回 `IDEMPOTENCY_CONFLICT`。LSP 退款以 `refundRequestId`（同样 1–64 位）幂等 |
| 金额 | `{ "currency": "THB", "value": "12050" }`，`value` 为**最小货币单位的整数字符串**，指数见下表（120.50 THB = `"12050"`）。不使用浮点 |
| 结果对象 | `result: { resultCode, resultStatus: "S" / "F" / "U", resultMessage }`；`U` = 未知/处理中，**MPP 不得据此释放用户资金**。请求被拒时 `resultCode` 取 7.1.2 的错误码 |
| 时区 | 所有时间戳 UTC（ISO 8601）；结算日与截止时间按网络规则（建议 UTC 15:00 = JST 24:00，见 03 章 3.6） |
| 版本 | 路径前缀 `/v1`；新增字段向后兼容，删除/语义变更升主版本 |

**币种指数**（ISO 4217 最小单位；接口金额一律按此表表示）：

| 币种 | 指数 | 示例 | 说明 |
|---|---|---|---|
| JPY | 0 | ¥4,923 = `"4923"` | |
| VND | 0 | ₫85,000 = `"85000"` | |
| THB、MYR、SGD、PHP、USD | 2 | ฿120.50 = `"12050"` | KHQR 也可以 USD 标价 |
| IDR | 2 | Rp85,000 = `"8500000"` | 按 0 位传会差 100 倍。QRIS 只收整数卢比：`value` 须是 100 的倍数，否则拒绝（码内金额 → `INVALID_QR`，用户输入 → `AMOUNT_PRECISION`） |
| KHR | 2 | ៛16,000 = `"1600000"` | KHQR 规范要求 KHR 为整数，规则同 IDR |
| LAK | 2 | ₭150,000 = `"15000000"` | 实际是否只用整数未核实，参考实现未收窄（见 02 章 2.3 老挝） |

### 7.1.1 鉴权与角色

| 项 | 规范（生产） | 参考实现（`src/api/server.ts`，仅限本地演示） |
|---|---|---|
| 传输 | mTLS + 白名单 IP | 明文 HTTP，只监听 127.0.0.1 |
| 头部 | `Client-Id`、`Request-Time`、`Signature: algorithm=…,keyVersion=…,signature=…` | `client-id`、`signature: t=<Unix 毫秒>,v1=<hex>`（无 `Request-Time` 头，时间戳放在 `t` 里） |
| 算法 | 非对称密钥（RSA / ECDSA），请求与响应都签名 | HMAC-SHA256 共享密钥；只验请求，响应不签名 |
| 签名串 | `<HTTP-METHOD> <PATH>\n<Client-Id>.<Request-Time>.<Body>` | `<METHOD> <PATH>\n<clientId>.<t>.<body>`；PATH 含查询串，GET 的 body 为空串 |
| 时间窗与防重放 | ±5 分钟；窗口内缓存已用签名，重放拒绝 | 同：±5 分钟，每个签名只接受一次；未知客户端、签名错、超窗、重放一律 401 `UNAUTHENTICATED` |
| 角色 | `MPP` / `LSP` / `OPS` | `mpp` / `lsp` / `ops`；角色不符返回 403 `FORBIDDEN` |
| 未配置密钥 | — | 无鉴权的本地演示模式（调用方在 body 中自报 `mppId` / `partnerId`），**不得对外暴露** |

`npm run serve` 的客户端：设置 `MPP_SECRET` → `PAYPAY`（mpp）；`LSP_SECRET` → 每个伙伴 ID（如 `LSP-THNITMX`，lsp）；`OPS_SECRET` → `OPS`（ops）。三个都不设时进入演示模式。

接口与角色：

| 接口 | 方法与路径 | 调用方角色 | 章节 |
|---|---|---|---|
| 识别 | `POST /v1/qr/identify`（参考实现 `POST /v1/qr/decode`） | MPP | 7.2.1 |
| 报价 | `POST /v1/quotes` | MPP | 7.2.2 |
| 支付 | `POST /v1/payments` | MPP | 7.2.3 |
| 查询 | `POST /v1/payments/inquiry`（参考实现 `GET /v1/payments/{paymentId}`，MPP 只能查到自己的支付） | MPP | 7.2.4 |
| 取消 | `POST /v1/payments/cancel` | MPP | 7.2.5 |
| 退款通知 | `POST /v1/lsp/refunds` | LSP | 7.4.3 |
| 结算到账确认 | `POST /v1/lsp/settlements/{instructionId}/ack` | LSP | 7.4.4（参考实现无此路由） |
| 关闭结算周期 | `POST /v1/settlement/cycles` | OPS（网络内部运营接口，不对 MPP/LSP 开放） | 7.5 |
| 网络 → LSP | `POST {lsp}/v1/accounts/inquiry`、`/v1/credits`、`/v1/credits/inquiry` | 网络作为客户端，LSP 验签 | 7.4 |

### 7.1.2 错误码与 HTTP 状态

* 规范：请求被拒（未创建支付）时返回下表 HTTP 状态，body 为 `result{ resultCode = 错误码, resultStatus: "F", resultMessage }`；已创建的支付，轨道失败返回 200 + `F`，处理中返回 202 + `U`（7.2.3）。
* 参考实现：错误码与 HTTP 状态相同，body 为 `{ "error": { "code", "message" } }`。

| HTTP | 错误码 | 含义 |
|---|---|---|
| 400 | `BAD_JSON` | body 不是 JSON 对象 |
| 400 | `BAD_REQUEST` | 必填字段缺失或格式错（如 `paymentRequestId` / `refundRequestId` 不是 1–64 位可打印 ASCII；参考实现中金额不是最小单位整数字符串） |
| 401 | `UNAUTHENTICATED` | 未知 `Client-Id`、签名错、超出时间窗或重放 |
| 403 | `FORBIDDEN` | 角色不符（例如 MPP 调结算接口、MPP 调 LSP 退款接口） |
| 403 | `RISK_REJECTED` | 风控拒绝 |
| 404 | `NOT_FOUND` | 支付不存在或不属于调用方（MPP 只能查自己的支付，LSP 只能对自己入账的支付退款）；路径不存在 |
| 404 | `DECODE_NOT_FOUND` | `decodeId` 不存在或属于其他 MPP |
| 409 | `CYCLE_CLOSED` | 结算周期号已关闭过 |
| 422 | 识别：`UNKNOWN_MPP`、`INVALID_QR`、`UNSUPPORTED_QR`、`NO_ROUTE`、`P2P_NOT_SUPPORTED`、`QR_EXPIRED`、`MCC_NOT_SUPPORTED`、`AMOUNT_LIMIT` | 见 7.2.1 |
| 422 | 报价：`DECODE_EXPIRED`、`QR_EXPIRED`、`AMOUNT_REQUIRED`、`AMOUNT_PRECISION`、`AMOUNT_MISMATCH`、`TIP_NOT_ALLOWED`、`AMOUNT_LIMIT` | 见 7.2.2 |
| 422 | 支付：`QUOTE_NOT_FOUND`、`QUOTE_USED`、`QUOTE_EXPIRED`、`QR_EXPIRED`、`IDEMPOTENCY_CONFLICT`、`PAYMENT_CANCELLED`、`RISK_REVIEW` | 见 7.2.3 |
| 422 | 取消：`CANCEL_NOT_ALLOWED_PROCESSING`、`CANCEL_NOT_ALLOWED_REFUND` | 见 7.2.5 |
| 422 | 退款：`NOT_REFUNDABLE`、`REFUND_EXCEEDS`、`REFUND_UNSUPPORTED`、`REFUND_FAILED` | 见 7.4.3 |
| 500 | `INTERNAL` | 未预期错误 |

## 7.2 MPP → 网络

### 7.2.1 `POST /v1/qr/identify`（扫码识别，参考实现路径 `/v1/qr/decode`）

钱包扫到以 `000201`（EMVCo 标准）或 `000202`（马来西亚 DuitNow，PFI=02）开头的码，且不是自家码、也不是 JPQR（含 ID 26 GUID `jp.or.paymentsjapan`，由钱包自己处理）时调用。**钱包侧不得对 PFI 做 `01` 等值校验**，否则马来西亚码永远到不了网络（判断流程见 [02 章](02-qr-interoperability.md) 2.2）。网络负责：EMVCo TLV 解析与 CRC 校验 → 识别国家码模板（GUID/AID）→ 判断 P2M/P2P（同一张贴纸上有商户模板时商户模板优先）、静态/动态 → 校验码有效期、MCC、轨道单笔上限 → 检查是否有可用路由（LSP 在线、国家开通、限额）→ 经 7.4.0 向 LSP 查询商户名（码内无 `59` 时必需）。

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
  "scheme": { "schemeId": "TH.THAIQR", "name": "Thai QR Payment", "country": "TH", "rail": "PromptPay (NITMX)", "paymentType": "P2M" },
  "merchant": { "name": "SOMTAM SHOP", "city": "BANGKOK", "mcc": "5812", "localName": "ร้านส้มตำ" },
  "currency": "THB",
  "amount": { "currency": "THB", "value": "12050" },
  "amountEditable": false,
  "tipPrompt": false,
  "prompts": [],
  "warnings": []
}
```
* `expiresAt` = min（会话 TTL，码自身过期时间 − 安全余量）；带过期时间的码：KHQR `99-01`、PayNow `04`（参考实现会话 TTL 10 分钟、余量 5 秒）；
* 响应还包括：`amountStep`（轨道接受的最小金额步长，按最小单位；IDR、KHR 为 `"100"`，即只收整数）、`maxAmount`（轨道单笔上限，有则返回，如 QR Ph/InstaPay ₱50,000）、`convenienceFee`（码内 `55`=02/03 的商户便利费，加在金额之上）。

错误码（HTTP 状态见 7.1.2）：
* `INVALID_QR`：TLV/CRC 错；或识别了方案但该码不可付，`resultMessage` 写明原因——币种/国家与方案不符、QRIS 的 NMID 不是 `ID` + 13 位数字、泰国跨境 Bill Payment 变体 `A000000677012006`（待 BOT/NITMX 确认入境用途前不承接）、KHQR 为动态码或带金额却无 `99-01` 过期时间；
* `UNSUPPORTED_QR`：不是已支持的国家码；
* `NO_ROUTE`：识别了，但该国/该轨道未开通，或只连了收单行级伙伴而码不是合作行发出的（路径 B1，02 章 2.2；参考实现只按泰国 tag 31 的银行代码识别合作行码）；
* `P2P_NOT_SUPPORTED`：只剩个人收款码，不承接；
* `QR_EXPIRED`：码已过期，请商户重新出码；
* `MCC_NOT_SUPPORTED`：汇款/取现/准现金 MCC（4829/6010/6011/6012/6051）；
* `AMOUNT_LIMIT`：动态码金额超过轨道单笔上限；
* `UNKNOWN_MPP`。

钱包 UI 规则：
* 静态码（`amountEditable=true`）：钱包让用户输入**当地币种金额**（按 `amountStep` 取整），旁边实时显示折合日元（调用 7.2.2）；
* 动态码：金额不可改；
* `prompts` 中列出的附加数据（EMVCo `62` 模板里值为 `***` 的子字段，如账单号、手机号）要让用户填写；
* 显示 `merchant.name` + `localName`（若有）+ 国家旗，提醒用户与店铺核对。码内没有 `59`（泰国很多商户码如此）时，网络经 7.4.0 查询商户名回显；查不到时在 `prompts` 中返回人工核对提示，并对该码执行首笔限额。

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
* 有效期 = min（政策 TTL，各段流动性提供方 firm quote 的有效期，码自身过期时间 − 安全余量），一般 30–60 秒；`pay` 时再校验一次码是否过期（`QR_EXPIRED`）；
* `payerAmount` 是**用户最终支付的日元总额**，钱包按此扣款；网络汇差与网络费已含在内（`breakdown`，10 章 10.1）；
* 静态码金额须为 `amountStep` 的整数倍（`AMOUNT_PRECISION`），不传金额返回 `AMOUNT_REQUIRED`；动态码不传金额或传与码内相同的金额（否则 `AMOUNT_MISMATCH`）；`tip` 只在 `tipPrompt=true` 时允许（`TIP_NOT_ALLOWED`）；
* 报价单只能被一个 `paymentRequestId` 使用（单次有效，`QUOTE_USED`）；
* `settlementAsset` / `settlementAmount` 是网络枢纽内部的结算资产，仅供对账，MPP 不经手稳定币；电汇国家（含本例泰国）是否经 USDC 中转，由 10 章 10.6 的法币基准对照决定；
* **锁价的前提**（04 章 4.6）：LP firm quote 只有 30–60 秒有效，网络须按笔/按分钟与 LP 背靠背成交，或批量成交并设敞口限额与对冲；法币模式国家（泰、马、印尼、越、柬、老）的本币腿须有境内结算行"交易日锁价、T+n 交割"的书面承诺，否则不得向用户承诺锁定汇率。

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
* 幂等见 7.1：同号重试返回首次结果；同号不同 `quoteId` → `IDEMPOTENCY_CONFLICT`；已被 7.2.5 取消的号 → `PAYMENT_CANCELLED`；
* `payer.name` 等发起人信息用于满足各国对跨境支付的发起人信息要求（FATF R.16 / 各国外汇申报），按最小必要原则传递：LSP 只收付款人姓名、国家和网络内部 `payerRef`（7.4.1 `originator`），`kycLevel` 等只留在网络侧用于风控。PayPay 把这些数据提供给境外网络、网络再传给目的国 LSP，属个人信息保护法第 28 条"向外国第三方提供"，前提（用户同意或接收方同等体制、数据处理协议）见 [06 章 6.7](06-compliance-risk.md)，需日本律师确认；
* 风控：`RISK_REJECTED`（403）/ `RISK_REVIEW`（422）；两者都释放报价，处理后可在报价未过期时用同一报价重试。

### 7.2.4 `POST /v1/payments/inquiry`
`{ "paymentRequestId": "..."}` 或 `{ "paymentId": "..." }` → 同 7.2.3 响应。MPP 在收到 `U` 后按 2s/4s/8s/… 退避查询，最长 24 小时；若仍为 `U` 进入人工对账。

### 7.2.5 `POST /v1/payments/cancel`
请求 `{ "paymentRequestId": "..." }`，成功响应 `cancelled: true`。
* 只在网络**尚未开始处理**该 `paymentRequestId`（例如 MPP 侧超时、请求未到达网络、用户放弃）或该笔已明确失败时成功。对未见过的号，网络记下墓碑，之后迟到的同号 `pay` 返回 `PAYMENT_CANCELLED`；
* 处理中或 `U` 状态返回 `CANCEL_NOT_ALLOWED_PROCESSING`，只能等终态；已成功返回 `CANCEL_NOT_ALLOWED_REFUND`，只能走退款（03 章 3.4）；
* 网络保证"取消成功"与"打款成功"互斥。

## 7.3 网络 → MPP（回调）

| 回调 | 时机 | 要点 |
|---|---|---|
| `notifyPayment` | `U` → `S/F` 终态 | 至少一次投递，MPP 以 `paymentId` 幂等处理；重试 1m/5m/30m/2h/6h/24h |
| `notifyRefund` | 商户（经 LSP）发起退款成功 | 携带 `refundId`、`refundAmount`（日元，按 [03 章 3.4](03-payment-flows.md) 退款汇率规则）|
| `notifySettlement` | 结算周期关闭 | 结算单下载地址与 JPY 净额（MPP 按约定以日元银行电汇付款） |

## 7.4 网络 ↔ LSP（本地结算伙伴）

LSP 按接入路径（[01 章 1.5](01-architecture.md#15-接入各国国家码的四种路径)）分三类，接口相同、路由键不同：路径 A 的境内结算行（交换机级，覆盖参与跨境受理银行的全部商户码）；B1 收单行 on-us（只入账该行自己发出的商户码）；B2 发卡侧赞助行（本国快速支付系统直连成员代境外钱包向任意国家码商户发起贷记，需央行/交换机确认"境外发起"口径与外汇定性）。结算方式按国家分两种：新加坡、菲律宾的伙伴链上收 USDC；泰国、马来西亚、印尼、越南、柬埔寨、老挝的伙伴收离岸出金方的 USD 电汇，**稳定币不入境**（7.4.4）。本节接口按泰国结构设计，新加坡、马来西亚、越南、菲律宾、老挝结构相同；印尼、柬埔寨的推荐路径经日方 Netstars/JPQR Global 枢纽（01 章 1.5 路径 C，05 章 5.5、5.7），由当地银行按本币直接汇率报价（印尼为 LCS 框架下的 ACCD 银行；柬埔寨的汇率安排未查到，推断类似），路由、FX 与结算都与泰国不同，对接方与报文另定。

### 7.4.0 `POST {lsp}/v1/accounts/inquiry`（收款方/商户名查询）

**Phase 1 必需**：泰国很多商户码不带 `59`，防贴码诈骗的商户名回显依赖这一查询。**参考实现尚未实现。**
```json
{ "scheme": "TH.THAIQR", "routing": { "acquirerId": "...", "merchantId": "...", "account": "010555612345601", "proxyType": "BILLER_ID" }, "qrPayload": "000201010211..." }
```
响应：
```json
{ "result": { "resultCode": "SUCCESS", "resultStatus": "S" }, "merchantName": "SOMTAM SHOP", "merchantNameLocal": "ร้านส้มตำ", "accountStatus": "ACTIVE" }
```
* 网络在 identify（7.2.1）阶段同步调用，超时 ≤ 1 s（建议值）；查不到商户名时 identify 在 `prompts` 中返回人工核对提示，并对该码执行首笔限额；
* 各国实现：泰国经 NITMX 跨境网关或结算行/收单行 API 查询（设计假设，接口待与对方确认）；马来西亚经 PayNet 跨境账户查询（交易码 521，据第三方转述，中等置信度）；老挝经 LAPNet INQUIRY（据第三方开源实现，低置信度，见 02 章 2.3 老挝）。

### 7.4.1 `POST {lsp}/v1/credits`（指示向商户入账）
```json
{
  "paymentId": "P...",
  "scheme": "TH.THAIQR",
  "routing": { "acquirerId": "...", "merchantId": "...", "account": "010555612345601", "proxyType": "BILLER_ID", "references": { "ref1": "INV001", "ref2": "T01" } },
  "amount": { "currency": "THB", "value": "100000" },
  "qrPayload": "000201010212...",
  "originator": { "name": "YAMADA TARO", "country": "JP", "payerRef": "<网络内部 payerRef>", "institution": "PAYPAY", "purpose": "PURCHASE_OF_GOODS" },
  "settlementMode": "FIAT_WIRE"
}
```
LSP 以本地轨道报文（ISO 20022 `pacs.008` / ISO 8583 / 本地 API）发起贷记，返回 `S/F/U` 与轨道流水号。动态码必须把码内的参考号（如泰国 bill payment 的 Ref1/Ref2、EMVCo `62` 的 bill number / terminal label）原样带上，否则商户 POS 无法自动核销。
* `originator` 只含付款人姓名、国家、网络内部 `payerRef` 与机构信息（7.2.3 最小化）；
* `settlementMode`：`ONCHAIN`（新加坡、菲律宾，周期净额以 USDC 链上偿付）或 `FIAT_WIRE`（泰、马、印尼、越、柬、老，周期净额由离岸出金方 USD 电汇，逐笔指令里不出现稳定币金额）。

### 7.4.2 `POST {lsp}/v1/credits/inquiry`
同上，用于超时补查。

### 7.4.3 `POST /v1/lsp/refunds`（LSP → 网络）
商户在 LSP 渠道发起退款，或商户向 LSP 回款账户做反向贷记后由 LSP 匹配（[03 章 3.4](03-payment-flows.md)），LSP 以 LSP 身份签名通知网络：
```json
{ "refundRequestId": "R20261018-0001", "paymentId": "P...", "refundAmount": { "currency": "THB", "value": "50000" }, "railRef": "<反向贷记流水号>" }
```
响应：
```json
{ "result": { "resultCode": "SUCCESS", "resultStatus": "S" }, "refundId": "...", "refundAmount": { "currency": "THB", "value": "50000" }, "payerRefundAmount": { "currency": "JPY", "value": "2441" } }
```
* 幂等键 =（`paymentId`，`refundRequestId`），重复请求返回首次结果；
* 只能退调用方 LSP 自己入账、且已成功的支付（否则 `NOT_FOUND` / `NOT_REFUNDABLE`）；累计退款不得超过原商户金额（`REFUND_EXCEEDS`）；
* 网络按 03 章 3.4 的规则把日元退回 MPP（`notifyRefund`）。参考实现采用规则 A：按原交易汇率按比例退本金，费用不退，部分退款累计后与全额退款一致（上例退一半本金：4883 × 50% 向下取整 = 2441 日元）；
* 退款冲减网络对该 LSP 的应付；周期内退款多于付款（负净额）时，链上伙伴以 USDC 回款，电汇伙伴经离岸出金方以电汇回款，不向其收取稳定币（7.4.4）。

### 7.4.4 结算确认
每个周期网络为每个 LSP 出具一条结算指令（`instructionId`），按结算方式分两种：
* **链上伙伴（新加坡、菲律宾）**：USDC 链上转账，memo/引用 = `instructionId`；付款前通过 Travel Rule 通道（IVMS101 格式）发送发起方/受益方机构信息；使用保证金合约的伙伴，该批次改由 `settle()` 按累计目标值付款（每个伙伴只付 `target − paid`）并计入已付，链上引用为 `batchId` + `manifestHash`（04 章 4.4）；
* **电汇伙伴（泰国、马来西亚、印尼、越南、柬埔寨、老挝，含 Phase 1 泰国）**：网络把 USDC 转给离岸出金方（memo = `instructionId`，Travel Rule 信息随这笔机构间转账发送），出金方以 USD 电汇到 LSP 结算账户、附言带 `instructionId`（T+0–T+1 工作日），由境内结算行兑本币；伙伴侧不出现稳定币。Phase 1 泰国的垫付担保用结算行保函/SBLC 或 NRQC 泰铢预存，不用链上保证金合约（04 章 4.4）；
* LSP 到账后 `POST /v1/lsp/settlements/{instructionId}/ack`（链上确认或电汇入账流水号 + 轨道日终文件核对结果）；
* 负净额（退款多于付款）时指令方向为回收：链上伙伴以 USDC 回款，电汇伙伴经出金方以 USD 电汇回款。

## 7.5 结算与对账文件

每个结算周期为每个参与者生成文件。周期频率因国而异：链上伙伴（新加坡、菲律宾）可日内多次甚至每小时；电汇伙伴按其工作日日结，Phase 1 泰国按泰国工作日日结、截止时间与节假日日历对齐结算行，**不做小时结**（03 章 3.6、04 章 4.3）。周期号唯一，重复关闭返回 409 `CYCLE_CLOSED`；金库稳定币不足时整个周期中止、不提交任何分录，补足后可用同一周期号重试。
* `transactions.csv`：`paymentId, paymentRequestId, schemeId, status, merchantAmount, merchantCurrency, payerAmount, payerCurrency, settlementAmount, fxMargin, networkFee, railRef, createdAt, cycleId`
* `summary.json`：毛额、笔数、净额、结算资产与路径（链上 / 出金方电汇）、链上交易哈希或电汇流水号（`wireRef`）、汇率快照
* 三方 + 链上四方对账：MPP 文件 ↔ 网络账本 ↔ LSP 轨道流水 ↔ 链上转账（电汇伙伴另核出金方电汇流水与伙伴到账确认），差异自动生成工单（04 章 4.8）。

## 7.6 参考实现对照

参考实现与本规范的报文差异以本表为准；对外联调以本规范为准。共性差异：金额为最小单位整数字符串（请求 `amount` / `tip`，响应 `amountMinor` 等），币种由 `currency` 字段或上下文给出，不是 `{currency, value}` 对象；时间为 Unix 毫秒时间戳，不是 ISO 8601；成功响应没有 `result{}` 对象，错误为 `{ "error": { "code", "message" } }`（错误码与 HTTP 状态见 7.1.2）；支付状态为 `PROCESSING` / `SUCCEEDED` / `FAILED`，对应规范的 `U` / `S` / `F`。

| 规范接口 | `reference-impl` | 状态与差异 |
|---|---|---|
| 7.1 签名与鉴权 | `src/api/server.ts` | 演示级：HMAC-SHA256、`client-id` + `signature: t=<毫秒>,v1=<hex>`，±5 分钟、签名单次有效，角色 mpp / lsp / ops，所有路由（含结算）都验签；无 mTLS，响应不签名；未配置密钥时为无鉴权演示模式（7.1.1） |
| 7.1 幂等 | `PaymentService.pay` | 已实现：`paymentRequestId` 必填（1–64 位可打印 ASCII），按（mppId，paymentRequestId）去重，并发重试共享一次执行，同号不同 `quoteId` → `IDEMPOTENCY_CONFLICT` |
| 7.2.1 identify | `POST /v1/qr/decode` → `PaymentService.decode` | 语义已实现（TLV/CRC、各国 profile、P2M 优先、码有效期、准现金 MCC、轨道精度与单笔上限）；请求只读 `qrCode`（MPP 身份取自 `client-id`），`scanContext`、`userLocale` 未用；响应字段为 `amountMinor`、`amountStepMinor`、`maxAmountMinor`，`expiresAt` 为毫秒；**商户名查询（7.4.0）未实现** |
| 7.2.2 quotes | `POST /v1/quotes` → `PaymentService.quote` | 语义已实现（firm quote、有效期受码过期约束、单次有效）；请求 `amount` / `tip` 为整数字符串，传对象返回 `BAD_REQUEST`；响应为 `payer{currency, amountMinor}`、`merchant{…}`、`breakdown.*Minor`、`rawRate`，另含 `legs`（LP 名称与各段汇率，生产不应返回给 MPP） |
| 7.2.3 payments | `POST /v1/payments` → `PaymentService.pay` | 部分：幂等、风控、U 状态（202）、支付前码过期复核已实现；请求只读顶层 `payerRef`（按规范放在 `payer{}` 里会被忽略、记为空串），`payer{name, kycLevel, residenceCountry}` 与 `paymentExpiryTime` 未实现；无 ≤ 8 秒同步窗口计时（适配器返回 UNKNOWN 或抛错即记为处理中）；响应是内部 `Payment` 对象（含 `quote`、`scheme`） |
| 7.2.4 inquiry | `GET /v1/payments/{paymentId}`；`resolvePending()` | 部分：只能按 `paymentId` 查、MPP 只能查到自己的支付（否则 404）；`resolvePending()` 逐笔向 LSP 补查处理中的交易，由调用方定时触发，退避节奏未实现 |
| 7.2.5 cancel | `POST /v1/payments/cancel` → `PaymentService.cancel` | 已实现：请求 `{paymentRequestId}`，响应 `{cancelled, status?}`；未知请求记墓碑、拒绝迟到的 pay；处理中/已成功不可取消 |
| 7.3 回调 | `MppNotifier` 接口 + `RecordingNotifier` | 接口：事件 `{paymentRequestId, paymentId, status, at}`，退款以 `status = "REFUNDED:<日元>"` 通知；无 HTTP 投递与重试；`notifySettlement` 未实现 |
| 7.4.0 商户名查询 | — | 未实现 |
| 7.4.1 / 7.4.2 credits | `SettlementPartner.credit` / `inquire` 接口 + `MockPartner` | 接口 + mock：`CreditInstruction` 带方案、路由、金额、商户名与原始码，**没有 `originator`**（FATF R.16 发起人信息未传给 LSP）；结算方式是伙伴属性 `settlementMode: onchain / fiat`，不在逐笔指令里 |
| 7.4.3 LSP 退款 | `POST /v1/lsp/refunds` → `PaymentService.refund` | 已实现（规则 A）：仅 LSP 角色，只能退自己入账的支付；请求 `{paymentId, amount, refundRequestId}`（`amount` 为整数字符串，无 `railRef`），先查归属、再按（paymentId，refundRequestId）幂等（其他 LSP 重放已有的键得到 `NOT_FOUND`）；响应 `{refundId, refundRequestId, amountMinor, payerRefundMinor}`；收到后再经 `SettlementPartner.refund` 向该伙伴确认，失败返回 `REFUND_FAILED` |
| 7.4.4 结算确认 | `SettlementEngine.confirmPayout` / `confirmCollection` | 部分：链上转账 memo 与出金方电汇附言都是 `instructionId`；伙伴确认只有引擎方法，没有 HTTP `ack` 路由；Travel Rule 报文未实现；引擎直接从枢纽钱包转账，未调用 `SettlementVault` 的 `settle()` / `recordReceipt()` |
| 7.5 结算 | `POST /v1/settlement/cycles` → `SettlementEngine.closeCycle` | 部分：运营接口，须 OPS 身份，不属于 MPP 接口；周期号重复返回 409；按参与者净额，新/菲伙伴链上付 USDC，其余伙伴 USDC 交出金方后 USD 电汇，负净额出具回收指令（电汇伙伴以电汇回款）；金库不足返回 `ABORTED_SHORTFALL` 且不提交分录、不占用周期号（可重试）；返回 JSON 周期报告（指令、流动性、FX 头寸），不生成 `transactions.csv` / `summary.json` |
