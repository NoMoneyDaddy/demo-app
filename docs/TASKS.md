# TASKS

## Current

| id | status | task | note |
| --- | --- | --- | --- |
| T1 | x | 建立跨平台 session loop contract | `.loop/*` 已落地 |
| T2 | x | 建立腳本能力宣告與 fallback matrix | `config/script_capabilities.json`、`docs/script_fallback_matrix.md` |
| T3 | x | 對齊 README / 入口檔 / bootstrap / capability inspector | 已驗證 |
| T4 | x | 補 repo 自己的治理文件 | `docs/SPEC.md`、`docs/STATE.md`、`docs/ADRS.md` 等 |
| T5 | x | 新增 repo integrity gate | `scripts/validate_repo_integrity.js`、CI |
| T6 | x | 補工具發現與安全安裝流程 | `tool-discovery-and-installation` |
| T7 | x | 補 marketplace / open-source readiness 檢查 | `docs/marketplace_open_source_readiness.md` |
| T8 | x | 補開源維護基線 | `SECURITY.md`、`CONTRIBUTING.md`、`docs/release_version_policy.md` |
| T9 | x | 吸收同類專案的 maturity / phase / audit 最佳實踐 | 新治理文件與 skill 回接 |
| T10 | x | 補 machine-readable manifest 與 fresh clone smoke test | `config/agent_manifest.json`、`scripts/fresh_clone_smoke_test.js` |
| T11 | x | 補 provenance checklist 與 local marketplace smoke test | `docs/external_install_provenance_checklist.md`、`scripts/marketplace_install_smoke_test.js` |
| T12 | x | 補自治評估 gate 與 loop promotion 入口 | `scripts/evaluate_session_loop.js`、`docs/loop_evaluation_gate.md` |
| T13 | x | 補 machine-readable policy / approval matrix | `config/execution_policy_matrix.json`、`docs/agent_execution_policy_matrix.md` |
| T14 | x | 補 machine-readable learning ledger / retrospective loop | `.loop/LEARNINGS.json`、`docs/learning_ledger_loop.md` |
| T15 | x | 抽 repo surface manifest，整併 bootstrap / integrity 清單 | `config/repo_surface_manifest.json` |
| T16 | x | 補 CODEOWNERS、CHANGELOG、minimal example | `.github/CODEOWNERS`、`CHANGELOG.md`、`examples/minimal-workspace/README.md` |
| T17 | x | 補 text-to-lottie skill lane、tests、learning ledger summary | `text-to-lottie`、`tests/*`、`scripts/summarize_learning_ledger.js` |
| T18 | x | 補 recurring monitor、docs lifecycle、task bundle | `recurring-monitoring`、`docs/documentation_lifecycle_strategy.md`、`scripts/export_task_bundle.js` |
| T19 | x | 補 mobile / desktop plan-only profiles 與官方文檔來源 | `config/project_config_profiles.json`、`config/official_doc_sources.json` |
| T20 | x | 補 env/configuration loop 基線 | `docs/environment_variable_configuration_loop.md` |
| T21 | x | 補 Expo / Tauri runnable scaffold | `scripts/scaffold_project.js`、`scripts/generate_project_configs.js`、`tests/mobile_desktop_profile_files.test.js` |
| T22 | x | 補 Capacitor / Electron runnable scaffold | `scripts/scaffold_project.js`、`scripts/generate_project_configs.js`、`tests/mobile_desktop_profile_files.test.js` |
| T23 | x | 補 platform prerequisite doctor | `config/platform_prerequisites.json`、`scripts/platform_prerequisite_doctor.js`、`tests/platform_prerequisite_doctor.test.js` |
| T24 | x | 補 Flutter runnable scaffold | `scripts/scaffold_project.js`、`scripts/generate_project_configs.js`、`tests/mobile_desktop_profile_files.test.js` |
| T25 | x | 補 Flutter `--platforms` CLI 解析與測試 | `scripts/scaffold_project.js`、`tests/scaffold_project.test.js`、`docs/scaffold_project.md` |
| T26 | x | 補 native profile 官方 runbook 與 machine-readable metadata | `docs/native_app_bootstrap_runbook.md`、`config/project_config_profiles.json`、`scripts/scaffold_project.js` |
| T27 | x | 補 native prerequisite doctor 細粒度檢查 | `config/platform_prerequisites.json`、`scripts/platform_prerequisite_doctor.js`、`tests/platform_prerequisite_doctor.test.js` |
| T28 | x | 吸收 `ai-manus` / `agenticSeek` 的 runtime topology 與 local-first troubleshooting | `docs/sandbox_session_runtime_topology.md`、`docs/comparable_project_analysis.md`、`docs/sandbox_tooling_guide.md` |
| T29 | x | 補 session/task schema、event stream、local runtime matrix | `config/session_task_schema.json`、`docs/event_stream_contract.md`、`docs/local_provider_and_runtime_matrix.md` |
| T30 | x | 補跨 AI 能力可攜矩陣 | `config/capability_portability_matrix.json`、`docs/cross_ai_capability_portability.md`、`docs/platform_support_matrix.md` |
| T31 | ~ | 持續移除過時文件敘述與擴充其他平台實測 | 後續維護項 |

## Backlog

- 補更多 profile 的官方 scaffold 與 config generation
- 補更多平台實測證據，而不只相容性推論
- 補真實 marketplace client / CLI end-to-end 安裝實測
- 補更進一步的 learning ledger 自動回寫 / review feedback ingestion
- 補更多 runnable examples / tests
