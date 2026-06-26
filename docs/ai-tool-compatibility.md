# AI 工具相容指南

本 repo 現在採用「共享核心指令 + 各工具入口檔 + 官方 skill runtime 路徑」模式，避免同一套規範分散在不同檔案後逐漸漂移。

若要看更細的平台級支援分級，直接讀 `docs/platform_support_matrix.md`。
若要看「能力可攜」而不是只有入口相容，讀 `docs/cross_ai_capability_portability.md`。

## 目前相容策略

| 工具 | 官方支援重點 | 本 repo 入口 |
| :--- | :--- | :--- |
| OpenAI Codex | `AGENTS.md`、`.agents/skills`、MCP、Skills、subagents | `AGENTS.md` + `.agents/skills/` |
| Claude Code | `CLAUDE.md`、`.claude/skills`、Skills、subagents、MCP | `CLAUDE.md` + `.claude/skills/` + `AGENTS.md` |
| Cursor | Rules、`AGENTS.md`、MCP、Cloud Agent、Skills | `.cursor/rules/00-project.mdc` + `AGENTS.md` + `.agents/skills/` |
| Gemini CLI | `GEMINI.md`；也可在 `settings.json` 自訂 `context.fileName` 載入 `AGENTS.md` | `GEMINI.md` + `.gemini/commands/` + `AGENTS.md` |
| GitHub Copilot | `.github/copilot-instructions.md`、`AGENTS.md`、`CLAUDE.md`、`GEMINI.md` | `.github/copilot-instructions.md` + `AGENTS.md` + `.agents/skills/` |

## 設計原則

1. `AGENTS.md` 是單一真實來源。
2. `CLAUDE.md`、`GEMINI.md`、`.github/copilot-instructions.md` 只保留工具入口與補充。
3. 具體開發工作流仍以 `.agents/skills/loop-engineering/SKILL.md` 為主。
4. 有能力差異時，文件明確標示，不假裝「所有工具完全等價」。
5. `skills/` 視為 legacy mirror；新的 repo-level skill runtime 以 `.agents/skills/` 為主。
6. Claude Code 額外提供 `.claude/skills/` mirror wrapper，解決 web / remote 場景的原生 skill 探測問題。

## 能力差異

### 1. 指令載入

- Codex：原生讀 `AGENTS.md`
- Claude Code：原生讀 `CLAUDE.md`
- Claude Code：原生技能位置是 `.claude/skills/`
- Cursor：官方 Rules 與 `.cursor/rules/*.mdc` 為主要入口，再橋接 `AGENTS.md`
- Gemini CLI：預設讀 `GEMINI.md`，但可用 `context.fileName` 加入 `AGENTS.md`
- Gemini CLI：可用 `.gemini/commands/*.toml` 補 `goal` / `status` / `specify` / `plan` / `tasks` / `implement`
- Copilot：官方文件支援 `.github/copilot-instructions.md` 與 `AGENTS.md`

### 2. MCP

- Codex、Claude Code、Cursor、Gemini CLI 都支援 MCP
- GitHub Copilot 的自訂指令重點較偏 repository guidance，不等同通用本地代理執行環境

### 3. 多代理 / 子代理

- Codex：官方支援 subagents
- Claude Code：官方支援 subagents
- Cursor：官方支援 subagents / cloud agents
- Gemini CLI、Copilot：能力模型與介面不同，不能直接假設同等流程

### 4. Remote / Sandbox

- Claude Code：官方文件明示可在 browser 使用，也可用 Remote Control 從瀏覽器接續本地 session
- Claude Code routines / GitHub Actions 走遠端基礎設施時，repo 內 `CLAUDE.md` 與 `.claude/skills/` 更重要
- Cursor：官方文件有 Cloud Agents、Security & Network、Settings 等正式章節
- 因此本 repo 盡量只依賴 repo 內檔案，不依賴機器本地全域記憶或手動安裝

### 5. Repo-level Skills

- Codex：官方文件明示 repo 內原生掃描 `.agents/skills/`
- 其他工具未必自動掃描相同路徑，但可透過入口檔明確指向
- 因此本 repo 採「`AGENTS.md` 指揮 + `.agents/skills/` 實際能力包」模式

## 建議補強工具

| 工具 | 定位 | 何時用 |
| :--- | :--- | :--- |
| `Semble` | repo 搜尋 / 索引底座 | 大型 repo、remote session、sandbox token 很緊時 |
| `playwright-cli` | 正式瀏覽器 E2E / 錄製 / 截圖 | 需要可重現測試與 Playwright 代碼產出時 |
| `agent-browser` | 快速 smoke test / 視覺驗證 | 要快速確認互動、畫面與 DOM 狀態時 |

- `Semble` 不是 skill，但很適合當多 AI 共用的 repo 搜尋層。
- `playwright-cli` 比較像正式測試工作流。
- `agent-browser` 比較像快速驗證工作流。
- GitHub / sandbox 安裝方式與避免使用指令，統一放在 `docs/sandbox_tooling_guide.md`。

## 建議使用方式

### 想從一個想法直接產出 app 或網站

優先選：

- Codex
- Claude Code
- Cursor

次選：

- Gemini CLI

輔助場景：

- GitHub Copilot：適合 repo 內協作、PR、review、補充修改

## 官方參考

- OpenAI Codex `AGENTS.md`：https://developers.openai.com/codex/guides/agents-md
- OpenAI Codex MCP：https://developers.openai.com/codex/mcp
- OpenAI Codex Skills：https://developers.openai.com/codex/skills
- Claude Code settings：https://code.claude.com/docs/en/settings
- Claude Code subagents：https://code.claude.com/docs/en/sub-agents
- Cursor Rules：https://cursor.com/docs/rules
- Cursor MCP：https://cursor.com/docs/mcp
- Cursor Cloud Agent：https://cursor.com/docs/cloud-agent
- Gemini CLI `GEMINI.md`：https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md
- GitHub Copilot custom instructions：https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions
