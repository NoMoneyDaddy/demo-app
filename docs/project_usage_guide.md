# Project Usage Guide

這份是本專案的正式使用教學。

目標：

- 讓人知道怎麼開局
- 讓 AI 知道怎麼引導
- 讓新專案與舊專案都走同一套可裁切流程

## 先做什麼

1. 開啟本 repo
2. 讀 `AGENTS.md`
3. 讀 `.agents/skills/using-agent-skills/SKILL.md`
4. 跑 `node scripts/inspect_agent_capabilities.js`
5. 跑 `node scripts/validate_repo_integrity.js`
6. 若缺 `.loop/*`，先跑 `node scripts/init_session_loop.js . --goal "<objective>"`
7. 若是 JS / TS 專案，再讀 `docs/biome_quality_loop.md`
8. 若要先建立官方框架骨架，可先跑 `node scripts/scaffold_project.js ../your-project --profile <profile>`
9. 技術棧確認後，可先跑 `node scripts/generate_project_configs.js --profile <profile> --name <projectName>`
10. 再依情境走新專案或舊專案流程

若腳本不可跑：

- 改讀 `docs/script_fallback_matrix.md`
- 先保工作流連續，再補自動化

## 新專案流程

預設是六階段生命週期：

- Define
- Plan
- Build
- Verify
- Review
- Ship

在 session 裡通常會長成這樣：

1. 使用者先給初步想法
2. AI 先判斷要用 `interview-me` 還是 `idea-refine`
3. AI 盤點 skills / MCP / tools
4. AI 若缺 `.loop/*`，先初始化 session loop
5. AI 引導技術棧與外部依賴
6. 若要先建官方骨架，AI 可用 `scripts/scaffold_project.js`
7. AI 用 `project-config-generation` 或 `scripts/generate_project_configs.js` 先落設定檔
8. AI 給短版方案
9. 視任務大小：
   - 小任務：可直接切 task 開工
   - 中大型任務：再出完整計畫與 task 切片
10. AI 進入 build-test-fix-doc loop

## 舊專案流程

1. 使用者指出 repo、問題、目標
2. AI 先做審查，不直接重寫
3. AI 列出：
   - 立即可修
   - 建議重構
   - 需要遷移規劃
   - 先不動
4. 使用者確認方向
5. AI 再切 task 並開始 loop

## AI 引導規則

- 一次只問下一批決策題
- 流程可跳步、可合併、可回退
- 每個實作切片後都要跑 quality loop
- 每題都允許：
  - 多選
  - 跳過
  - 沿用現況
  - 請 AI 決定
- 不要重複已確認事實
- 先短版，必要時再完整版

## 建議開場句

### 新專案

- `請使用 using-agent-skills 幫我把這個想法做成可規劃專案`
- `請先引導我把想法收斂，再幫我選技術棧`

### 舊專案

- `請先審查這個專案，給我改善建議與重構切片`
- `請先找風險、技術債與優先修正項目`

## 常用命令

```bash
node scripts/inspect_agent_capabilities.js
node scripts/validate_repo_integrity.js
node scripts/init_session_loop.js . --goal "你的目標"
node scripts/init_project_workspace.js ../your-project --name your-project --idea "你的想法"
node scripts/scaffold_project.js ../your-project --profile nextjs-app-router --language typescript --styling tailwind --database supabase --quality-tool biome
node scripts/auto_skill_setup.js --project-type web-app --ui-style modern --deployment zeabur --language typescript --database supabase
node scripts/generate_project_configs.js --profile nextjs-app-router --name your-project --language typescript --styling tailwind --database supabase --quality-tool biome
bash scripts/setup_sandbox_tools.sh --plan
npx @biomejs/biome check --write .
```

## 成功標準

- 有 `docs/SPEC.md`
- 有 `docs/TASKS.md`
- 有 `docs/ADRS.md`
- 有 `.loop/STATE.json` 與 `.loop/EVIDENCE.md`
- 有能力盤點結果
- 有 repo integrity 驗證
- 有短版方案；中大型任務再有完整版計畫
- 有驗證，不只是生成 code
