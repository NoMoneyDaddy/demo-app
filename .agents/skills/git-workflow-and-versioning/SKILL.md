---
name: git-workflow-and-versioning
description: Keep changes reversible, reviewable, and well-versioned with disciplined Git usage. Use for all code changes, risky refactors, conflict resolution, and commit preparation.
---

# git-workflow-and-versioning

commit 是存檔點，不是垃圾桶。

## 原則

- diff 要小
- commit 要清楚
- 歷史要可理解
- 高風險改動要可回退

## 做法

- 先看 `git diff`
- 大改用 branch 或 worktree
- commit message 用 Conventional Commits
- 相關變更一起提交，無關變更分開

## 禁忌

- 未確認就 `git reset --hard`
- 把格式化、重構、功能混成一包
- 改掉不理解的衝突內容

## 規則

- 提交前至少過一輪驗證
- 若 repo 已髒，先分辨哪些不是這次工作
