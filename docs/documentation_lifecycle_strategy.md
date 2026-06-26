# Documentation Lifecycle Strategy

這份文件定義 `docs/ACTIVE` 與 `docs/_archive` 的分層策略。

## 目標

- 降低文件太雜
- 讓 AI 優先讀有效文件
- 把歷史文件留存，但不混入主工作面

## 分層規則

### `docs/ACTIVE/`

放：

- 目前仍有效的 runbook
- 目前仍有效的 checklist
- 目前仍有效的 release / deploy / incident 文件
- 新人或 agent 進來最該先讀的操作文件

### `docs/_archive/`

放：

- 已完成專案階段的記錄
- 舊 audit / handoff / roadmap
- 舊 migration / incident 復盤
- 已不再作為主事實來源的歷史文件

## 判定規則

文件符合任一條件，應考慮歸檔：

- 描述的流程已被新流程取代
- 描述的風險或缺口已不存在
- 只保留歷史背景價值
- 與主 README / SPEC / STATE / TASKS 不再同步

## 不應歸檔的文件

- `docs/SPEC.md`
- `docs/TASKS.md`
- `docs/STATE.md`
- `docs/ADRS.md`
- 目前仍被 README / bootstrap / catalog 指向的主文件

## 本 repo 的落地策略

目前先採：

1. 保留現有 `docs/` 主面
2. 新增 lifecycle strategy 文件
3. 未來若單一主題文件數量持續增加，再實際搬移到：
   - `docs/ACTIVE/`
   - `docs/_archive/`

## AI 閱讀順序

1. `README.md`
2. `docs/SPEC.md`
3. `docs/TASKS.md`
4. `docs/STATE.md`
5. `docs/ACTIVE/*`
6. 其餘主文件
7. `docs/_archive/*` 僅在需要歷史脈絡時閱讀
