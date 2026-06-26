# Changelog

本檔記錄對使用者或 AI workflow 有影響的變更。

格式基線：

- 日期：`YYYY-MM-DD`
- 類型：`Added`、`Changed`、`Fixed`、`Removed`
- 只記有實際影響的變更，不記純噪音

## 2026-06-25

### Added

- 新增 machine-readable execution policy：`config/execution_policy_matrix.json`
- 新增 machine-readable learning ledger：`.loop/LEARNINGS.json`
- 新增 learning ledger schema：`config/learning_ledger_schema.json`
- 新增 `docs/learning_ledger_loop.md`
- 新增 `.github/CODEOWNERS`
- 新增 `examples/minimal-workspace/README.md`

### Changed

- `scripts/evaluate_session_loop.js` 現在把 `LEARNINGS.json` 納入 gate
- `scripts/init_session_loop.js` 現在初始化 `LEARNINGS.json`
- `bootstrap` 與 `integrity` 改以 `config/repo_surface_manifest.json` 作為單一 surface 清單來源
