# Example Sessions

這份提供「AI 應該怎麼引導」的範例。

## Example 1: 新專案 / New Project

### User

`我想做一個讓自由接案者追蹤報價、合約、收款的 web app`

### AI 第一輪應做

1. 若需求仍太散，先用 `interview-me`
2. 確認使用者類型與最重要痛點
2. 問是否要：
   - web app / landing page / mobile app
   - Supabase / PostgreSQL / none
   - 自己決定技術棧或請 AI 建議
3. 跑 `node scripts/inspect_agent_capabilities.js`
4. 跑 `node scripts/validate_repo_integrity.js`
5. 技術棧若已確認，先跑 `node scripts/generate_project_configs.js --profile <profile> --name <projectName>`
6. 只給短版方向，不直接寫 code

### 好的短版回應範例

- 核心使用者：自由接案者
- 核心流程：建立客戶、建立報價、追合約、記錄收款
- 建議技術棧：`Next.js + TypeScript + Supabase`
- 先補兩件事：是否需要登入、是否需要多人協作

## Example 2: 舊專案 / Legacy Project

### User

`請幫我看這個舊 repo，首頁很亂、API 邊界也不清楚，但先不要整個重寫`

### AI 第一輪應做

1. 看入口檔、路由、API、測試、部署
2. 分類：
   - correctness
   - readability
   - architecture
   - security
   - performance
3. 先給改善切片，不直接重構整包

### 好的輸出方向

- 立即修：console error、壞掉的 API contract
- 可局部重構：首頁 component 拆分、env 驗證
- 之後再做：資料層重整、部署流程清理

## Example 3: API Key 不足 / Missing Credentials

### User

`我還沒有 OpenAI API key，但想先把流程做起來`

### AI 應做

- 不阻斷主流程
- 解釋 key 用途
- 提供最短官方取得方式
- 產生 placeholder env
- 把缺口寫進 `docs/STATE.md`

## Example 4: AI 自動選 Skill

### 狀況

- 想法很模糊
- 要做 web app
- repo 很大
- 前端有畫面問題

### 合理 skill 路由

1. `using-agent-skills`
2. `interview-me`
3. `idea-refine`
4. `spec-driven-development`
5. `project-config-generation`
6. `planning-and-task-breakdown`
7. `frontend-ui-engineering`
8. `biome-quality-automation`
9. `browser-testing-with-devtools`
10. `code-review-and-quality`

## Example 5: 高風險決策 / High-risk Decision

### 狀況

- 使用者沒有回覆
- 但 feature flag、資料表命名、UI 文案還要先定一版

### AI 應做

- 採保守、可逆預設
- 把假設寫進 `docs/ADRS.md`
- 繼續做不受阻的部分
- 不因小決策卡住整個 loop
