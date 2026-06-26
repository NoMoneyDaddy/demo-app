# Cross-AI Capability Portability

目標：

- 讓不同 AI 平台讀完本 repo，得到盡量接近的工作能力
- 不是保證模型完全等價
- 是保證 workflow、contract、tools、runbook 盡量等價

## 核心原則

同一份 repo 要交付給不同 AI，至少要共享：

- 同一份目標
- 同一份 task 切分
- 同一份 state
- 同一份 skill catalog
- 同一份 tool/runbook
- 同一份 verify / ship gate

## 能力可攜矩陣

機器可讀版本：

- `config/capability_portability_matrix.json`

人類版結論：

| 平台 | 可攜程度 | 說明 |
| --- | --- | --- |
| Codex | 高 | `AGENTS.md` + `.agents/skills` 幾乎直吃 |
| Claude Code | 高 | `CLAUDE.md` + `.claude/skills` mirror 已補 |
| Cursor | 中高 | Rules + `AGENTS.md` bridge 可用，但 skill/runtime 不是同一套原生介面 |
| Gemini CLI | 中 | 要靠 `.gemini/commands/` 與 `AGENTS.md` adapter |
| Hermes | 中高 | skills 可匯出，但全域 skill 目錄與 host 工具要另外接 |
| OpenClaw | 高 | `skills/` + `.agents/skills/` 很接近它的原生習慣 |

## 哪些能力能共用

- goal loop
- task bundle
- docs/spec
- repo integrity gate
- platform prerequisite doctor
- scaffold / config generation
- runtime topology / event stream contract

## 哪些能力不能假裝完全共用

- browser 控制
- host shell 權限
- 系統安裝權限
- subagent 調度
- 長時背景任務

## 要逼近 Manus / OpenManus / Hermes / OpenClaw 的方法

不是把對方 runtime 整個搬過來。

而是把這些做成 repo-native contract：

1. `AGENTS.md` / `CLAUDE.md` / `GEMINI.md`
2. `.agents/skills` / `.claude/skills` / `skills`
3. `.loop/*`
4. `config/session_task_schema.json`
5. `docs/event_stream_contract.md`
6. `docs/local_provider_and_runtime_matrix.md`
7. `config/platform_prerequisites.json`

## 判斷標準

如果一個平台讀完 repo 後，能做到：

- 知道從哪裡讀規範
- 知道怎麼切 task
- 知道怎麼找技能
- 知道怎麼 doctor 環境
- 知道怎麼驗證與 ship

就算達到「能力可攜」。

不是要求每個平台的底層 runtime 一模一樣。
