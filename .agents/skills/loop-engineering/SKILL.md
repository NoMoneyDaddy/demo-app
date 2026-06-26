---
name: loop-engineering
description: Run the repository's end-to-end delivery loop from idea or legacy-project audit to plan, implementation, verification, documentation, and release preparation. Use when the user wants structured interactive guidance followed by persistent execution with minimal unnecessary stops.
---

# loop-engineering

本 skill 是專案主工作流。

## 讀取順序

1. `AGENTS.md`
2. `docs/session_loop_contract.md`
3. `docs/interactive_project_flow.md`
4. `docs/project_architecture_best_practices.md`
5. `docs/project_lifecycle_automation.md`
6. `docs/subagent_dispatch.md`

## 兩種模式

### A. 新專案

1. 必要時先用 `interview-me`
2. 用 `idea-refine` 收斂想法
3. 用 `spec-driven-development` 建 spec
4. 技術棧定了就先用 `project-config-generation`
5. 用 `planning-and-task-breakdown` 切 task
6. 再進實作 loop

### B. 舊專案改善

1. 先看入口檔、設定、測試、部署
2. 先提改善與重構切片
3. 使用者確認後才做大改

## 預設流程

這是預設路徑，不是固定步數。

1. 先判斷現在是新專案還是舊專案
2. 只問 1-3 組決策題
3. 先跑 `node scripts/inspect_agent_capabilities.js`
4. 先讀：
   - `docs/loop_maturity_model.md`
   - `docs/engineering_phase_loop.md`
   - `docs/loop_circuit_breaker.md`
5. 根據情境讀：
   - `prompts/interactive_tech_stack_prompt.md`
   - `prompts/interactive_api_key_prompt.md`
   - `prompts/legacy_project_improvement_prompt.md`
6. 若缺 `.loop/*`，先用 `goal-loop` 或 `node scripts/init_session_loop.js . --goal "<objective>"`
7. 技術棧確認後，先用 `project-config-generation` 落設定檔
8. 先給短版方案
9. 視任務大小決定：
   - 小任務：直接切 task 開工
   - 中大型任務：再補完整計畫與 task 切片
10. 完成必要確認後，進入 build-test-fix-doc loop
11. 每輪記錄 `maturity_level`、`retry_count`、`blocked_reason`、`convergence_state`
12. 若是 JS / TS 專案且有 Biome，啟用 quality loop：
    - `npx @biomejs/biome check --write <changed-paths>`
    - 必要時再跑測試
13. 進 merge / ship 前補：
    - `code-review-and-quality`
    - `observability-and-instrumentation`
    - `shipping-and-launch`

## 初始化

若是新專案或缺少核心檔案，先執行：

```bash
node scripts/init_project_workspace.js <targetDir> --name <projectName> --idea "<idea>"
```

再依情境推薦 skills / tools：

```bash
node scripts/auto_skill_setup.js --project-type <type> --ui-style <style> --deployment <target> --language <lang> --database <db>
```

## 實作 loop

每輪都做：

1. 選一個最小 task
2. 最小必要修改
3. 跑對應驗證
4. 失敗就修根因
5. 看 circuit breaker 是否該停
6. 更新：
   - `.loop/PLAN.md`
   - `.loop/STATE.json`
   - `.loop/CHECKPOINTS.md`
   - `.loop/EVIDENCE.md`
   - 必要時記 `tier`、`orientation`、`time_budget`
7. 若流程穩定可重用，參考 `docs/skill_crystallization_loop.md`
8. 更新：
   - `docs/TASKS.md`
   - `docs/DEBUG_NOTES.md`
   - `docs/STATE.md`
   - `README.md`

## 技能路由

- 想法模糊：`idea-refine`
- 要 `/goal` 類跨平台 loop：`goal-loop`
- 缺 spec：`spec-driven-development`
- 工作太大：`planning-and-task-breakdown`
- 技術棧已定但設定檔未落地：`project-config-generation`
- 開始實作：`incremental-implementation`
- 行為變動：`test-driven-development`
- framework 問題：`source-driven-development`
- 前端：`frontend-ui-engineering`
- API 邊界：`api-and-interface-design`
- runtime 驗證：`browser-testing-with-devtools`
- 除錯：`debugging-and-error-recovery`
- JS / TS 品質 loop：`biome-quality-automation`
- 合併前：`code-review-and-quality`
- 上線前觀測：`observability-and-instrumentation`
- 收尾文件：`documentation-and-adrs`
- 發版：`shipping-and-launch`

## 工具路由

- 大 repo / 省 token：優先 `Semble`
- 快速頁面驗證：優先 `agent-browser`
- 可重現瀏覽器流程：優先 `playwright-cli`
- 低 token MCP 探查：優先 `mcp-cli`
- 沒有外部工具時，退回平台原生工具

## 子代理

- 平台支援 subagents 時，預設可自動分派
- 角色看 `docs/subagent_dispatch.md`
- 不支援時，改為單代理順序執行

## 停止條件

只有以下情況才停：

- 缺憑證、權限、付款、登入
- 需要使用者做不可逆選擇
- 外部服務不可用且無替代方案
- 同一錯誤連修 3 次仍失敗

## 自治等級

- 預設 `L1 report-only`
- 有 verifier 才升 `L2`
- 有 scope / budget / audit 才升 `L3`

## 規則

- 不吹噓未驗證能力
- 不假設所有平台都支援同一套 MCP / subagents
- 高風險決策採保守可逆預設，並寫入 `docs/ADRS.md`
- 沒有驗證，不算完成
