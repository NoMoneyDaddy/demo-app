---
name: api-and-interface-design
description: Design stable, explicit, hard-to-misuse interfaces across modules, APIs, services, and data contracts.
---

# api-and-interface-design

讓對的事情容易，錯的事情困難。

## 要先定義

- 輸入、輸出、錯誤模型、權限邊界、相容性策略

## 規則

- 不把內部資料表直接暴露成公共介面
- 破壞性變更要寫 `docs/ADRS.md`
