---
name: shipping-and-launch
description: Prepare releases so they are observable, reversible, and safe to roll out. Use when deploying to production, planning rollouts, setting success metrics, or coordinating post-launch checks.
---

# shipping-and-launch

每次上線都要可逆、可觀測、可判斷成敗。

## 上線前

- 確認驗證都過
- 確認 env 與 secrets
- 確認 rollback 路徑
- 確認 owner 與監控

## 上線策略

- 能分批就分批
- 能 feature flag 就不要硬切
- 先做 smoke test

## 上線後

- 看錯誤率
- 看核心成功指標
- 看使用者回報
- 需要時快速回退

## 規則

- 沒有監控就不算真的可上線
- 不把高風險決策留成口頭約定
