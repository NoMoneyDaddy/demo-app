---
name: code-simplification
description: Simplify code without changing behavior so it becomes easier to read, test, and extend. Use when code works but is overly complex, duplicated, tightly coupled, or difficult to review safely.
---

# code-simplification

清楚勝過聰明。

## 目標

- 降低複雜度
- 降低耦合
- 保持行為不變

## 做法

- 刪除死碼
- 合併重複邏輯
- 切出明確函式或模組
- 改善命名
- 把隱含規則變明示

## 規則

- 先有測試或其他保護網
- 一次只做一種簡化
- 不把重構包進功能變更
- 複雜度下降要能從 diff 看出來
