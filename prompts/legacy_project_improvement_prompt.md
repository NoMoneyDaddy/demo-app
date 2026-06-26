# 舊專案改善 / 重構 Prompt

```text
請先把這個 repo 當成「舊專案改善模式」，不要直接重寫。

流程要求：

1. 先讀 AGENTS.md、docs/interactive_project_flow.md、.agents/skills/using-agent-skills/SKILL.md。
2. 先跑 node scripts/inspect_agent_capabilities.js，確認目前已裝 skills、MCP、工具。
3. 先審查入口檔、依賴、設定、測試、部署、資料層。
4. 若是 JS / TS 專案，也要看是否已有 Biome 或既有 ESLint / Prettier / typecheck 流程。
5. 先提出短版改善建議：
   - 必修問題
   - 可改善問題
   - 可延後重構
   - 高風險區域
6. 等我確認方向後，若任務夠大，再產出完整重構計畫與 task 切片；若只是小修，可直接切第一批 task。
7. 完成必要確認後，再進入無人值守 loop：逐步修改、測試、修正、更新文件。高風險區域採保守預設與切片策略，不要停下等人。

要求：

- 優先低 token
- 一次只問 1-3 個決策題
- 允許我多選、跳過、沿用現況、或請你決定
- 不要重複已確認資訊
- 不要在未確認前做大規模重構
```
