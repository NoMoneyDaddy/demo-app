# Subagent Dispatch

本 repo 的預設策略是：

- 平台支援 subagents，就自動分派
- 不必先問使用者可不可以拆
- 拆完後主代理負責整合、驗證、更新文件

## 建議角色

- `planner`
  - 產出完整計畫、task 切片、依賴順序
- `repo-auditor`
  - 舊專案審查、找風險、列改善建議
- `implementer`
  - 做單一薄切片實作
- `tester`
  - 跑測試、重現 bug、做 triage
- `reviewer`
  - 看 diff、抓 correctness / security / performance 問題
- `docs-updater`
  - 更新 `README.md`、`docs/TASKS.md`、`docs/DEBUG_NOTES.md`、`docs/STATE.md`

## 自動分派規則

適合平行：

- 多個互不相依的 bug
- UI 與 API 可分開
- 測試補齊與文件更新可獨立
- 大型重構能切成多個模組

不適合平行：

- 強依賴同一份未穩定的核心介面
- 同時改同一批高衝突檔案
- 還沒做完 root cause analysis 就急著多工修 bug

## 主代理責任

主代理不能把責任丟給子代理。

主代理必須：

1. 定義每個子代理的明確任務
2. 控制 context，不要把整個 repo 都塞進去
3. 收回結果後做整合驗證
4. 更新 `docs/STATE.md`
5. 決定是否繼續下一輪分派
