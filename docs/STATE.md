# STATE

- date: `2026-06-25`
- project: `Loop Engineering Framework`
- status: `active`
- phase: `Review`
- focus: `吸收同類專案治理與自治實踐，落成 repo 規範`

## Current Truth

- `AGENTS.md` 是共享核心入口
- `.agents/skills/` 是 canonical skill runtime
- `.loop/*` 是跨平台 session loop 狀態層
- `config/script_capabilities.json` 與 `docs/script_fallback_matrix.md` 已定義腳本降級規則
- `scripts/inspect_agent_capabilities.js` 已可列出腳本能力與 fallback
- `scripts/validate_repo_integrity.js` 已作為 repo 結構、mirror、JSON、文件連結品質閘門
- `scripts/evaluate_session_loop.js` 已補上，會判斷 `.loop/*` 是否真的達到 continue / promote / ship-ready gate
- `tool-discovery-and-installation` 已補上，用於缺工具、缺 skill、缺 MCP、缺搜尋能力、缺瀏覽器驗證能力時的安全安裝與引導流程
- `docs/marketplace_open_source_readiness.md` 已補上，用於開源與 skill/plugin marketplace 前的缺口檢查
- `SECURITY.md`、`CONTRIBUTING.md`、`docs/release_version_policy.md` 已補上
- `docs/loop_maturity_model.md` 已補上
- `docs/engineering_phase_loop.md` 已補上
- `docs/capability_audit_and_install_loop.md` 已補上
- `docs/loop_circuit_breaker.md` 已補上
- `docs/loop_evaluation_gate.md` 已補上
- `docs/agent_execution_policy_matrix.md` 與 `config/execution_policy_matrix.json` 已補上，作為 machine-readable approval / execution policy
- `docs/learning_ledger_loop.md` 與 `.loop/LEARNINGS.json` 已補上，作為 machine-readable learning ledger
- `config/repo_surface_manifest.json` 已補上，作為 bootstrap / integrity 共用的單一 surface 清單來源
- `docs/skill_crystallization_loop.md` 已補上
- `docs/agent_manifest_spec.md` 已補上
- `config/agent_manifest.json` 已補上，作為 machine-readable manifest 草案
- `.github/CODEOWNERS`、`CHANGELOG.md`、`examples/minimal-workspace/README.md` 已補上，補齊治理與最小 runnable surface
- `text-to-lottie` skill lane、`examples/text-to-lottie/README.md`、`tests/*`、`scripts/run_repo_tests.js`、`scripts/summarize_learning_ledger.js` 已補上
- `recurring-monitoring`、`docs/documentation_lifecycle_strategy.md`、`config/task_bundle_schema.json`、`scripts/export_task_bundle.js` 已補上
- `config/official_doc_sources.json` 與 mobile / desktop profiles 已補上；其中 `Expo`、`Tauri` 已升成 runnable scaffold
- `docs/environment_variable_configuration_loop.md` 已補上，作為跨環境 env/config 協助基線
- `docs/external_install_provenance_checklist.md` 已補上，作為外部安裝審查基線
- `docs/reference_repos_by_domain.md` 已補上
- `docs/large_project_dimensions_and_roles.md` 已補上
- `scripts/fresh_clone_smoke_test.js` 已補上，驗證 fresh clone / bootstrap / session init 基線
- `scripts/marketplace_install_smoke_test.js` 已補上，驗證 marketplace entry -> plugin -> skills path -> trigger skill 最小路徑
- `config/platform_prerequisites.json`、`scripts/platform_prerequisite_doctor.js`、`docs/platform_prerequisite_doctor.md` 已補上，作為跨 mobile / desktop 原生依賴 gate

## Open Gaps

- 更多技術棧 profile 尚未自動化
- 更多平台仍需真機或真 sandbox 實測
- 文件漂移已有自動 gate，但仍需隨平台實測持續更新
- 真實 marketplace client / CLI 的 end-to-end 安裝實測仍未補齊
- 更多 learning ledger 自動回寫規則尚未補上
- 更多 examples / tests 仍未補齊
- `Flutter` 已升成 runnable scaffold；`SwiftUI`、`Android Kotlin` 仍屬 `plan-only`
