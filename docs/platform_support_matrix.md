# Platform Support Matrix

> Checked on `2026-06-25`

## 結論

這個 repo 現在對 **Codex / Claude Code / Cursor** 是強支援。
對 **Hermes / OpenClaw / NanoClaw** 也能接，但有各自原生入口，不能假設完全等價。

若你要的目標是「不同 AI 讀完本 repo 都盡量拿到同一套能力」，先讀：

- `docs/cross_ai_capability_portability.md`
- `config/capability_portability_matrix.json`

另外，repo 內所有 `SKILL.md` 已經都有 YAML frontmatter，符合 OpenClaw / Hermes 這類 skill runtime 的基本要求。

## 支援矩陣

| 平台 | 指令入口 | Skill 入口 | MCP / 工具 | 支援等級 | 備註 |
| --- | --- | --- | --- | --- | --- |
| OpenAI Codex CLI / App / IDE | `AGENTS.md` | `.agents/skills/` | 原生支援 | 強 | 本 repo 的主落地平台 |
| Claude Code CLI / Desktop | `CLAUDE.md` + `AGENTS.md` | `.claude/skills/` | 原生支援 | 強 | 已做 `.claude/skills` mirror |
| Cursor Desktop / Cloud Agent | `.cursor/rules/00-project.mdc` + `AGENTS.md` | 透過 `AGENTS.md` / repo 內容橋接 | 原生支援 | 強 | 適合雲端 agent 與 IDE 協作 |
| Gemini CLI | `GEMINI.md` | `.gemini/commands/` + 非 `.agents/skills` 原生 runtime | 可接 MCP | 中高 | 已補 project-level custom commands adapter |
| GitHub Copilot CLI / IDE | `.github/copilot-instructions.md` + `AGENTS.md` | 非 repo-local skill 原生 runtime | 工具能力依宿主而定 | 中 | 規範可讀，但 skills 非主戰場 |
| Hermes Agent / Desktop | `AGENTS.md`、`CLAUDE.md`、`.cursorrules` | `~/.hermes/skills/` 或外部 skill 目錄 | 原生支援 | 中高 | 需把 repo skills 匯出到 Hermes skill 目錄 |
| OpenClaw | `AGENTS.md` 可共用；技能系統更重要 | `skills/`、`.agents/skills/`、`~/.agents/skills/` | 原生支援 | 高 | 幾乎直接吃這個 repo 的 skill 佈局 |
| NanoClaw | `CLAUDE.md` / group `CLAUDE.md` | `.claude/skills/` | MCP 可用 | 中 | 預設 provider 是 Claude；Codex 需 provider skill |

## 每個平台最建議的入口

### Codex

- 先讀 `AGENTS.md`
- 再讀 `.agents/skills/using-agent-skills/SKILL.md`

### Claude Code

- 先讀 `CLAUDE.md`
- 再讀 `.claude/skills/using-agent-skills/SKILL.md`

### Cursor

- 先吃 `.cursor/rules/00-project.mdc`
- 再橋接到 `AGENTS.md`

### Gemini CLI

- 先讀 `GEMINI.md`
- 再用 `.gemini/commands/`
- `goal` / `status` / `specify` / `plan` / `tasks` / `implement` 可作為 session loop adapter

### Hermes

- 先吃 `AGENTS.md`
- skills 放到 `~/.hermes/skills/`
- 可用 `bash scripts/export_skills_for_hermes_openclaw.sh --global`

### OpenClaw

- workspace 內優先：
  - `skills/`
  - `.agents/skills/`
- 全域可用：
  - `~/.agents/skills/`
- 這個 repo 已同時保留 `skills/` 與 `.agents/skills/`

### NanoClaw

- 主要看 `CLAUDE.md`
- skill 放在 `.claude/skills/`
- 若走非 Claude provider，要另外安裝對應 provider skill

## Browser / Search 工具在各平台的角色

| 工具 | 角色 | 建議平台 |
| --- | --- | --- |
| `Semble` | 大型 repo 語意搜尋 / 索引 | 全平台，特別是 remote / sandbox |
| `agent-browser` | 快速 smoke test / 視覺驗證 | Codex / Claude Code / Cursor / OpenClaw |
| `playwright-cli` | 正式 E2E / 錄製 / 截圖 | Codex / Claude Code / Cursor / OpenClaw |

## 已知限制

- `Gemini CLI`、`Copilot` 不把 `.agents/skills/` 當成官方原生 skill runtime。
- `Hermes` 會讀 `AGENTS.md`，但 skills 的主目錄是 `~/.hermes/skills/`。
- `NanoClaw` 是 container / provider 架構，不是單純「打開 repo 就等於完整接上」。
- `OpenClaw` 雖然很相容，但它的 skill precedence 以 `skills/` 與 `.agents/skills/` 為核心，不是 `CODEX_HOME/skills`。

## 官方參考

- OpenAI Codex `AGENTS.md`：https://developers.openai.com/codex/guides/agents-md
- OpenAI Codex Skills：https://developers.openai.com/codex/skills
- Claude Code Desktop：https://code.claude.com/docs/en/desktop
- Claude Code Skills：https://code.claude.com/docs/en/skills
- Cursor Rules：https://cursor.com/docs/rules
- Gemini CLI `GEMINI.md`：https://geminicli.com/docs/cli/gemini-md/
- GitHub Copilot custom instructions：https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions
- Hermes Context Files：https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files
- Hermes Skills System：https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
- Hermes Working with Skills：https://hermes-agent.nousresearch.com/docs/guides/work-with-skills
- OpenClaw Skills：https://github.com/openclaw/openclaw/blob/main/docs/tools/skills.md
- NanoClaw Skills Overview：https://docs.nanoclaw.dev/extend/overview
- NanoClaw Agent Providers：https://docs.nanoclaw.dev/extend/providers
- NanoClaw Customize Skill：https://nanoclaw.dev/skills/customize/
