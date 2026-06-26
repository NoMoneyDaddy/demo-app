# GOAL

## Objective

讓本 repo 的實際檔案、架構、入口、腳本、session loop、文件敘述彼此一致，成為多 AI 平台可共用的專案治理框架。

## Done Definition

- 入口文件、核心 docs、skill 路徑、腳本能力宣告彼此對齊
- `.loop/*`、`docs/SPEC.md`、`docs/TASKS.md`、`docs/STATE.md`、`docs/DEBUG_NOTES.md`、`docs/ADRS.md` 存在且可作為真相來源
- 驗證通過：核心腳本 `node --check`、能力盤點腳本可執行、`git diff --check` 通過

## Constraints

- 不能依賴單一 AI 平台私有能力
- 不能保留過時或虛構檔案引用
- 不改動不必要的使用者內容
