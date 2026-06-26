---
name: test-driven-development
description: Write a failing test or executable reproduction before implementation or bug fixing.
---

# test-driven-development

先證明會壞，再修到會過。

## 流程

1. 先找最小可重現
2. 寫一個會失敗的測試
3. 只寫足夠讓測試通過的實作
4. 重跑測試
5. 必要時再整理 code

## Bug 修復

- 沒有重現，不算找到 bug
- 修完要留回歸測試
- 根因與修法記進 `docs/DEBUG_NOTES.md`
