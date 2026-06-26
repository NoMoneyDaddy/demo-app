---
name: goal-loop
description: Run a cross-platform session loop using repo files instead of platform-specific slash commands.
---

# goal-loop

這個 skill 把 `/goal` 類體驗降落到 repo 檔案。

## 核心觀念

- 不依賴單一平台內建 `/goal`
- 用 `.loop/*` 當 session 內共用狀態
- 每輪都回寫狀態與驗證證據
- 用 maturity / circuit breaker 控制自治與停機

## 啟動

若 `.loop/` 不存在，先執行：

```bash
node scripts/init_session_loop.js . --goal "<objective>"
```

## 每輪 loop 必做

1. 讀 `.loop/GOAL.md`
2. 讀 `.loop/STATE.json`
3. 決定下一個最小切片
4. 實作或驗證
5. 更新 `.loop/PLAN.md`、`.loop/STATE.json`、`.loop/CHECKPOINTS.md`、`.loop/EVIDENCE.md`
