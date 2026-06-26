---
name: debugging-and-error-recovery
description: Triage failures systematically to find root causes and recover safely. Use when tests fail, builds break, runtime behavior is wrong, deployments regress, or repeated fixes are not working.
---

# debugging-and-error-recovery

先止血。再找根因。

## 流程

1. 停止加新功能
2. 保留錯誤與重現步驟
3. 確認壞在哪一層：
   - build
   - test
   - runtime
   - config
   - external service
4. 縮小問題範圍
5. 修根因，不修表象
6. 加回歸驗證
7. 記進 `docs/DEBUG_NOTES.md`

## 熔斷

- 同一錯誤連修 3 次還沒過，就停
- 回報：
  - 錯誤訊息
  - 已試過的方法
  - 推定阻塞點

## 規則

- 先重現，再修
- 先最小改動，再擴大
- 外部服務壞掉時，標記為外部阻塞，不亂改核心程式
