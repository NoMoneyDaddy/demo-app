# 專案生命週期自動化

本 repo 不再用固定 9 步或單一路徑。
正式骨架是六階段生命週期，加上可持續運作的 quality loop。

## 六階段

1. `Define`
   - 收想法或舊專案目標
   - 互動式釐清
   - 盤點 skills、MCP、CLI、browser 能力
2. `Plan`
   - 建立 spec
   - 選技術棧
   - 切 task 與 acceptance criteria
3. `Build`
   - 逐個最小 task 實作
   - 優先薄切片
   - 必要時自動分派子代理
4. `Verify`
   - 跑測試、型別檢查、runtime 驗證
   - 失敗就 triage 根因
   - 記錄到 `docs/DEBUG_NOTES.md` 與 `docs/STATE.md`
5. `Review`
   - 安全、效能、可讀性、架構、正確性一起過 gate
   - JS / TS 專案優先納入 Biome quality loop
6. `Ship`
   - 更新 README / ADR / 狀態文件
   - 準備 CI、部署、監控、rollback

## 自動化入口

### 1. 初始化新專案

```bash
node scripts/init_project_workspace.js ../your-project --name your-project --idea "你的想法"
```

會建立：

- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
- `.github/copilot-instructions.md`
- `.cursorrules`
- `README.md`
- `README.en.md`
- `docs/SPEC.md`
- `docs/TASKS.md`
- `docs/DEBUG_NOTES.md`
- `docs/STATE.md`
- `docs/ADRS.md`

### 2. 盤點能力

```bash
node scripts/inspect_agent_capabilities.js
node scripts/validate_repo_integrity.js
```

用途：

- 看 repo 內 skills
- 看全域 skills
- 看 MCP 設定
- 看 CLI / browser / quality 工具
- 檢查入口檔、skill mirrors、JSON、script capability、Markdown 本地連結

### 3. 初始化 session loop

```bash
node scripts/init_session_loop.js . --goal "你的目標"
```

用途：

- 建立 `.loop/*`
- 讓 session 內 loop 狀態落到 repo
- 讓不同 AI 工具在同一個 session 看同一份目標與證據

### 4. 推薦或安裝 skills / tools

```bash
node scripts/auto_skill_setup.js --project-type web-app --ui-style modern --deployment zeabur --language typescript --database supabase
```

若要嘗試自動安裝：

```bash
node scripts/auto_skill_setup.js --project-type web-app --ui-style modern --deployment zeabur --language typescript --database supabase --install
```

## 文件驅動原則

AI 在寫代碼前，先對齊：

- `docs/SPEC.md`
- `docs/TASKS.md`

至少要寫清楚：

- 目標與範圍
- 技術棧與理由
- 架構與模組邊界
- 驗證方式
- 環境變數
- 任務切片

## 無人值守 loop

必要確認完成後，AI 應盡量連續執行：

1. 取一個最小 task
2. 最小必要修改
3. 跑對應驗證
4. 失敗就修根因
5. 更新 `.loop/PLAN.md`
6. 更新 `.loop/STATE.json`
7. 更新 `.loop/CHECKPOINTS.md`
8. 更新 `.loop/EVIDENCE.md`
9. 更新 `docs/TASKS.md`
10. 更新 `docs/DEBUG_NOTES.md`
11. 更新 `docs/STATE.md`
12. 階段性更新 `README.md`
13. 重大決策更新 `docs/ADRS.md`

若是 JS / TS 專案且已配置 Biome：

```bash
npx @biomejs/biome check --write <changed-paths>
npx @biomejs/biome ci .
```

## 停止條件

只有以下情況才該停：

- 缺憑證、權限、登入、付款
- 需要使用者做不可逆選擇
- 外部服務不可用且無替代方案
- 同一錯誤連修 3 次仍失敗
