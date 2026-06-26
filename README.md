# Loop Engineering Framework

繁中優先。English quick guide: [README.en.md](README.en.md)

這個 repo 不是「神奇一鍵全自動工具」。它是給 AI agent 讀的專案治理層與 skill runtime。
目標很單純：讓不同 AI 工具進 repo 後，能用同一套事實來源、同一套路由、同一套交付紀律，把想法或舊專案需求穩定做下去。

## 概要 / Overview

- `AGENTS.md` 是共享核心規範
- `.loop/*` 是跨平台 session loop 狀態層
- `.agents/skills/` 是 canonical repo-level skills
- `.claude/skills/` 是 Claude mirror
- `skills/` 是 legacy mirror，給只掃舊路徑的工具
- `docs/` 保留維護中的工作流、架構、相容性與最佳實踐文件
- `scripts/` 提供初始化、能力盤點、skill 推薦、sandbox 工具導引
- `.gemini/commands/` 提供 Gemini CLI 的 custom command adapter
- `config/script_capabilities.json` 與 `docs/script_fallback_matrix.md` 提供跨平台腳本降級規則

## 已落地能力 / Implemented

- 21 個 core workflow skills 已本地化到 `.agents/skills/`
- 額外補強：`interview-me`、`observability-and-instrumentation`、`biome-quality-automation`
- 額外補強：`goal-loop`、`project-config-generation`
- TypeScript、Supabase、網站基線、RWD、UI/UX 最佳實踐已本地化
- 新專案初始化：`scripts/init_project_workspace.js`
- 官方骨架建立：`scripts/scaffold_project.js`
- 能力盤點：`scripts/inspect_agent_capabilities.js`
- session loop 評估 gate：`scripts/evaluate_session_loop.js`
- repo integrity gate：`scripts/validate_repo_integrity.js`
- skill 推薦 / 外部 skill 導引：`scripts/auto_skill_setup.js`
- machine-readable policy / approval matrix：`config/execution_policy_matrix.json`
- machine-readable learning ledger：`.loop/LEARNINGS.json`
- machine-readable repo surface manifest：`config/repo_surface_manifest.json`
- learning ledger summary：`scripts/summarize_learning_ledger.js`
- task bundle export：`scripts/export_task_bundle.js`
- official docs source map：`config/official_doc_sources.json`
- 工具發現與安全安裝引導：`tool-discovery-and-installation` + `scripts/setup_sandbox_tools.sh`
- 外部安裝來源審查：`docs/external_install_provenance_checklist.md`
- loop maturity 分級：`docs/loop_maturity_model.md`
- engineering phase loop：`docs/engineering_phase_loop.md`
- capability audit / install loop：`docs/capability_audit_and_install_loop.md`
- loop circuit breaker：`docs/loop_circuit_breaker.md`
- skill crystallization：`docs/skill_crystallization_loop.md`
- agent manifest 草案：`docs/agent_manifest_spec.md`
- 設定檔產生：`scripts/generate_project_configs.js`
- sandbox / GitHub / remote 工具導引：`scripts/setup_sandbox_tools.sh`
- platform prerequisite doctor：`scripts/platform_prerequisite_doctor.js`
- local marketplace install smoke test：`scripts/marketplace_install_smoke_test.js`
- repo tests：`scripts/run_repo_tests.js`
- motion / Lottie skill lane：`text-to-lottie`
- recurring monitor skill lane：`recurring-monitoring`
- mobile / desktop profiles：`Expo`、`Capacitor`、`Flutter`、`Tauri`、`Electron` 已可執行 scaffold，其餘仍是 `plan-only`

## 支援定義 / What “Support” Means

本 repo 對 `Codex`、`Claude Code`、`Cursor`、`Gemini CLI`、`GitHub Copilot` 的「支援」定義是：

- 提供該平台可讀的入口檔或 mirror path
- 提供一致的 skill 路徑與文件結構
- 提供可在本機或 sandbox 執行的輔助腳本

不代表：

- 每個平台都保證支援同一套 MCP
- 每個平台都保證支援 subagents
- 每個平台都能直接幫你部署

實際可用能力，先跑：

```bash
node scripts/inspect_agent_capabilities.js
node scripts/validate_repo_integrity.js
```

若腳本跑不了，不中斷流程，改讀：

```text
docs/script_fallback_matrix.md
```

## 快速開始 / Quick Start

1. 用任一支援工具開啟本 repo。
2. 讓 AI 先讀：
   - `AGENTS.md`
   - `.agents/skills/using-agent-skills/SKILL.md`
3. 跑：

```bash
node scripts/inspect_agent_capabilities.js
node scripts/evaluate_session_loop.js .
```

4. 若是新專案，初始化：

```bash
node scripts/init_project_workspace.js ../your-project --name your-project --idea "你的想法"
```

5. 若缺 session loop 狀態檔，先初始化：

```bash
node scripts/init_session_loop.js . --goal "你的目標"
```

6. 若要依情境推薦 skills / tools：

```bash
node scripts/auto_skill_setup.js --project-type web-app --ui-style modern --deployment zeabur --language typescript --database supabase
```

7. 若要補齊本機 / sandbox 工具：

```bash
bash scripts/setup_sandbox_tools.sh --doctor
bash scripts/setup_sandbox_tools.sh --plan
bash scripts/setup_sandbox_tools.sh --install-core
```

AI 需要安裝未知工具時，先讀 `.agents/skills/tool-discovery-and-installation/SKILL.md`。

預設自治等級：

```text
L1 report-only
```

可額外跑：

```bash
node scripts/run_repo_tests.js
node scripts/summarize_learning_ledger.js
node scripts/export_task_bundle.js
node scripts/platform_prerequisite_doctor.js
```

8. 若要先跑官方骨架：

```bash
node scripts/scaffold_project.js ../your-project --profile nextjs-app-router --language typescript --styling tailwind --database supabase --quality-tool biome
```

9. 技術棧確認後，可先產設定檔：

```bash
node scripts/generate_project_configs.js --profile nextjs-app-router --name your-project --language typescript --styling tailwind --database supabase --quality-tool biome
```

10. 照 `docs/interactive_project_flow.md` 的階段式流程走。

## 維護中的主文件 / Maintained Surface

優先讀這些：

- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
- `CHANGELOG.md`
- `SECURITY.md`
- `CONTRIBUTING.md`
- `docs/interactive_project_flow.md`
- `docs/project_usage_guide.md`
- `docs/example_sessions.md`
- `docs/architecture.md`
- `docs/SPEC.md`
- `docs/TASKS.md`
- `docs/STATE.md`
- `docs/DEBUG_NOTES.md`
- `docs/ADRS.md`
- `docs/biome_quality_loop.md`
- `docs/session_loop_contract.md`
- `docs/project_config_generation.md`
- `docs/scaffold_project.md`
- `docs/script_fallback_matrix.md`
- `docs/agent_skill_catalog.md`
- `docs/marketplace_open_source_readiness.md`
- `docs/release_version_policy.md`
- `docs/comparable_project_analysis.md`
- `docs/loop_maturity_model.md`
- `docs/engineering_phase_loop.md`
- `docs/loop_evaluation_gate.md`
- `docs/agent_execution_policy_matrix.md`
- `docs/learning_ledger_loop.md`
- `docs/recurring_monitor_loop.md`
- `docs/documentation_lifecycle_strategy.md`
- `docs/official_docs_and_github_research_policy.md`
- `docs/capability_audit_and_install_loop.md`
- `docs/loop_circuit_breaker.md`
- `docs/skill_crystallization_loop.md`
- `docs/agent_manifest_spec.md`
- `docs/external_install_provenance_checklist.md`
- `docs/reference_repos_by_domain.md`
- `docs/large_project_dimensions_and_roles.md`
- `docs/project_architecture_best_practices.md`
- `docs/project_lifecycle_automation.md`
- `docs/platform_support_matrix.md`
- `docs/platform_prerequisite_doctor.md`
- `docs/sandbox_tooling_guide.md`
- `docs/third_party_skills.md`
- `docs/tech_stack_guide.md`
- `config/agent_manifest.json`
- `config/repo_surface_manifest.json`
- `config/task_bundle_schema.json`
- `config/official_doc_sources.json`
- `.loop/LEARNINGS.json`
- `scripts/fresh_clone_smoke_test.js`
- `scripts/marketplace_install_smoke_test.js`
- `scripts/run_repo_tests.js`
- `scripts/export_task_bundle.js`
- `scripts/platform_prerequisite_doctor.js`
- `examples/text-to-lottie/README.md`
- `examples/minimal-workspace/README.md`

## 專案結構 / Structure

```text
.
├── AGENTS.md
├── CLAUDE.md
├── GEMINI.md
├── README.md
├── README.en.md
├── .loop/                     # cross-platform session loop state
├── .agents/
│   └── skills/                # canonical skills
├── .claude/
│   └── skills/                # Claude mirror wrappers
├── .cursor/
│   └── rules/
├── .github/
│   └── copilot-instructions.md
├── skills/                    # legacy mirror wrappers
├── config/
├── docs/
├── prompts/
└── scripts/
```

## 主要技能群組 / Core Skill Sets

- 路由與規劃：`using-agent-skills`、`goal-loop`、`interview-me`、`idea-refine`、`spec-driven-development`、`project-config-generation`、`planning-and-task-breakdown`
- 能力補強：`tool-discovery-and-installation`
- 實作與驗證：`incremental-implementation`、`test-driven-development`、`browser-testing-with-devtools`、`debugging-and-error-recovery`
- 架構與交付：`source-driven-development`、`api-and-interface-design`、`documentation-and-adrs`、`observability-and-instrumentation`、`shipping-and-launch`
- 品質與風險：`code-review-and-quality`、`code-simplification`、`security-and-hardening`、`performance-optimization`
- 技術棧最佳實踐：`typescript-best-practices`、`biome-quality-automation`、`supabase-best-practices`、`website-best-practices`、`responsive-design-best-practices`

## 原則 / Principles

- 先 spec，後 code
- 先官方文檔 / Context7，後實作
- 最小必要修改
- 每輪都驗證
- 預設 `L1`，有證據再升 autonomy
- 沒有 verifier，不算 ready
- 腳本可加速，但不可成為單點依賴
- 不保留過時流程、不保留不實承諾
