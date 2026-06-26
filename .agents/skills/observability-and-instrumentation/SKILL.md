---
name: observability-and-instrumentation
description: Add logs, metrics, tracing, and runtime signals so shipped systems are diagnosable.
---

# observability-and-instrumentation

看得到，才能安全上線。

## 最小觀測集

- 結構化 log、錯誤追蹤、核心成功 / 失敗指標、外部依賴錯誤、發版後 smoke signal

## 規則

- 不把敏感資料打進 log
- 不追所有東西，先追關鍵路徑
- 沒有足夠 runtime 訊號時，不宣稱「可安全上線」
