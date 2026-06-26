# Security Policy

本 repo 是 AI agent governance layer 與 local skill runtime。安全重點是：不要讓 skill、script、plugin、MCP 或外部工具在未審查下取得過大權限。

## Supported Surface

目前維護範圍：

- AGENTS.md / CLAUDE.md / GEMINI.md
- .agents/skills canonical skills
- .claude/skills 與 skills mirrors
- scripts 目錄內的輔助腳本
- config 目錄內的 profiles / capabilities
- docs 目錄內的 workflow / readiness / fallback 文件

## Reporting

如果你發現安全問題，請在 GitHub issue 中使用 private / responsible disclosure 能力；若無法使用，請先開一個不含 exploit 細節的 issue，標題加上 SECURITY。

請勿在公開 issue 內貼：

- token、cookie、API key
- 可直接利用的 exploit payload
- 私有 repo 路徑、帳號資料、瀏覽器資料

## Security Rules

- 不提交 .env 或任何 secret。
- 外部 API key、token、cookie 一律走環境變數或本機安全設定。
- community skill market 只能作為候選來源。
- 安裝外部 skill 前要檢查來源、授權、scripts、permissions。
- 不執行來源不明的遠端 shell。
- 不把工具安裝成功與否靠猜測判定；要跑 doctor、version 或 smoke test。

## Agent-specific Risks

高風險區：

- browser extension
- cookie-based auth
- MCP servers
- install scripts
- plugin marketplace
- shell commands that alter global state

對應規則：

- 需要登入態、cookie、token 時，先說明用途與風險。
- 需要安裝 browser extension 或持久工具時，先取得明確授權。
- 同一錯誤連修 3 次仍失敗就熔斷。
