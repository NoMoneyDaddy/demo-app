---
name: planning-and-task-breakdown
description: Break a spec into small verifiable tasks with clear acceptance criteria. Use when a spec exists but the work is still too large, risky, or unclear to implement directly.
---

# planning-and-task-breakdown

把大任務切成小而可驗證的 task。

## 讀取順序

1. 讀 `docs/SPEC.md`
2. 讀 `docs/TASKS.md`
3. 讀 `docs/interactive_project_flow.md`

## 拆解原則

- 先切薄的垂直切片
- 每個 task 都要能：
  - 在一個專注 session 完成
  - 有明確驗證方式
  - 不依賴隱含上下文
- 能平行就平行

## 每個 task 至少要有

- 目標
- 影響範圍
- acceptance criteria
- 驗證方式
- 依賴

## 輸出

- 更新 `docs/TASKS.md`
- 若需要，回寫 `docs/SPEC.md §T`
- 標記：
  - `.` 待做
  - `~` 進行中
  - `x` 完成

## 規則

- 不要把「做完整個功能」當成一個 task。
- 若 task 仍過大，繼續切。
- 先排最能降低風險與不確定性的 task。
- 切完後再進 `incremental-implementation`。
