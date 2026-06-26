---
name: security-and-hardening
description: Apply security-first engineering practices and hardening defaults.
---

# security-and-hardening

把所有外部輸入都當成敵意輸入。

## 必做

- 驗證所有輸入
- 秘密資料只走環境變數
- 權限最小化
- 日誌不要洩漏敏感資訊
- 敏感操作保留審計線索

## 常見檢查

- XSS、CSRF、SQL injection、SSRF、path traversal
- webhook 驗簽、rate limit、session / token 管理
