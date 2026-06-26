# Repo Architecture

這份文件描述的是「本 repo 自己」的架構，不是某個目標產品的 Web-only 架構。

目標：

- 讓多 AI 平台讀同一份事實來源
- 讓 skill、文件、腳本、loop 狀態彼此對齊
- 讓腳本可跑時加速，跑不了時也不阻塞流程

## 架構分層

### 1. Entry Layer

平台入口檔，只放最少必要規則與導流：

- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
- `.github/copilot-instructions.md`
- `.cursor/rules/*.mdc`
- `.cursorrules`

規則：

- `AGENTS.md` 是共享核心來源
- 其他入口檔只補平台差異，不複製整份規範

### 2. Skill Runtime Layer

真正的 workflow 能力包：

- `.agents/skills/`：canonical
- `.claude/skills/`：Claude mirror
- `skills/`：legacy mirror

規則：

- skill 內容以 `.agents/skills/` 為準
- mirror 只做轉址或兼容，不應各自漂移

### 3. Docs Layer

文件分三類：

- 核心工作流：`docs/interactive_project_flow.md`、`docs/project_usage_guide.md`
- 相容與架構：`docs/platform_support_matrix.md`、`docs/ai-tool-compatibility.md`、`docs/cross_ai_capability_portability.md`、`docs/project_architecture_best_practices.md`、`docs/sandbox_session_runtime_topology.md`、`docs/event_stream_contract.md`、`docs/local_provider_and_runtime_matrix.md`
- 狀態與決策：`docs/SPEC.md`、`docs/TASKS.md`、`docs/STATE.md`、`docs/DEBUG_NOTES.md`、`docs/ADRS.md`

規則：

- 文件要描述 repo 目前真實存在的能力
- 過時流程、虛構檔案、未落地承諾要移除

### 4. Automation Layer

可執行能力：

- `scripts/*.js`：主要自動化
- `scripts/*.sh`：環境導向包裝
- `config/*.json`：機器可讀設定
- `.github/workflows/ci.yml`：自動化驗證入口
- `scripts/validate_repo_integrity.js`：repo 入口、mirror、JSON、script capability、Markdown link gate

規則：

- Node.js 腳本優先於 shell script
- shell 只處理安裝、匯出、環境導向工作
- 新腳本要補 `config/script_capabilities.json`
- 新腳本要補 `docs/script_fallback_matrix.md`
- 新入口或刪檔要能通過 `node scripts/validate_repo_integrity.js`

### 5. Session State Layer

session 內 loop 狀態：

- `.loop/GOAL.md`
- `.loop/PLAN.md`
- `.loop/STATE.json`
- `.loop/CHECKPOINTS.md`
- `.loop/EVIDENCE.md`
- `.loop/POLICY.md`

規則：

- 這層是跨平台 session 協定
- 不把進度只留在聊天記憶

## Repo 結構

```text
.
├── AGENTS.md
├── CLAUDE.md
├── GEMINI.md
├── README.md
├── README.en.md
├── .loop/
├── .agents/skills/
├── .claude/skills/
├── skills/
├── docs/
├── config/
├── scripts/
├── prompts/
└── .github/workflows/
```

## 主要資料流

1. AI 先讀入口檔
2. 入口檔導到 canonical skills 與核心 docs
3. AI 先盤點能力與平台限制
4. 能跑腳本就跑
5. 不能跑就依 `docs/script_fallback_matrix.md` 降級
6. 實作、驗證、決策回寫到 `.loop/*` 與 `docs/*.md`

## 維護規則

- 新增 skill：同步 `.agents/skills/`、mirrors、catalog
- 新增腳本：同步 capability / fallback 文件
- 新增流程：同步 README、入口檔、核心 docs
- 刪除檔案：先移除所有引用，再刪
