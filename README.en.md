# Loop Engineering Framework

Traditional Chinese is the primary language in this repo. English identifiers and this file exist to keep the project friendly to English-speaking users and AI tools.

## What this repo is

This repository is not a magic one-click builder. It is a governance layer and local skill runtime for AI agents.
Its job is to give multiple AI tools the same source of truth, the same project workflow, and the same delivery discipline.

## Implemented

- `AGENTS.md` as the shared contract
- `.loop/*` as the cross-platform session loop state layer
- `.agents/skills/` as the canonical local skill runtime
- `.claude/skills/` as Claude mirror wrappers
- `skills/` as legacy mirror wrappers
- `scripts/init_project_workspace.js` for bootstrapping new projects
- `scripts/scaffold_project.js` for official framework scaffolding plus governance overlay
- `scripts/init_session_loop.js` for initializing portable session loop state
- `scripts/inspect_agent_capabilities.js` for checking repo skills, global skills, MCP config, and local tools
- `scripts/evaluate_session_loop.js` for deciding whether `.loop/*` is only present or actually promotion / ship ready
- `scripts/validate_repo_integrity.js` for checking entry files, skill mirrors, JSON config, script declarations, and local Markdown links
- `scripts/auto_skill_setup.js` for skill/tool recommendations
- `config/execution_policy_matrix.json` for machine-readable approval and execution policy
- `.loop/LEARNINGS.json` for the machine-readable learning ledger
- `config/repo_surface_manifest.json` for the machine-readable repo surface source of truth
- `scripts/summarize_learning_ledger.js` for learning-ledger summary and score aggregation
- `scripts/export_task_bundle.js` for exporting `docs/SPEC.md` into a machine-readable task bundle
- `config/official_doc_sources.json` for official-doc lookup sources by environment
- `tool-discovery-and-installation` plus `scripts/setup_sandbox_tools.sh` for safe tool discovery and opt-in installation
- `docs/loop_maturity_model.md` for autonomy rollout
- `docs/engineering_phase_loop.md` for phase-based delivery
- `docs/capability_audit_and_install_loop.md` for safe capability expansion
- `docs/loop_circuit_breaker.md` for stagnation handling
- `docs/skill_crystallization_loop.md` for turning repeated workflows into skills
- `docs/agent_manifest_spec.md` for machine-readable agent boundaries
- `docs/external_install_provenance_checklist.md` for external install review
- `scripts/generate_project_configs.js` for stack-aware config generation
- `config/script_capabilities.json` plus `docs/script_fallback_matrix.md` for script portability and fallback routing
- `scripts/marketplace_install_smoke_test.js` for local marketplace install path verification
- `scripts/platform_prerequisite_doctor.js` for machine-readable native/mobile/desktop prerequisite checks
- `scripts/run_repo_tests.js` for minimal repository tests
- `text-to-lottie` as the optional motion / Lottie skill lane
- `recurring-monitoring` as the recurring PR/deploy/watch supervision lane
- Expo, Capacitor, Flutter, Tauri, and Electron profiles are runnable now; other mobile / desktop profiles remain plan-only
- 21 localized workflow skills plus extra local skills such as `goal-loop`, `project-config-generation`, `interview-me`, `observability-and-instrumentation`, and `biome-quality-automation`

## Supported AI surfaces

This repo is designed to be readable by:

- Codex
- Claude Code
- Cursor
- Gemini CLI
- GitHub Copilot

“Support” means the repo provides compatible entry files and mirror paths. It does not guarantee identical MCP, browser, deployment, or subagent features on every platform.

If a platform cannot run a script, the workflow should fall back to `docs/script_fallback_matrix.md` instead of stopping.

## Quick start

1. Open the repo in your AI tool.
2. Read `AGENTS.md`.
3. Read `.agents/skills/using-agent-skills/SKILL.md`.
4. Run:

```bash
node scripts/inspect_agent_capabilities.js
node scripts/evaluate_session_loop.js .
node scripts/validate_repo_integrity.js
```

If tools are missing, read `.agents/skills/tool-discovery-and-installation/SKILL.md` and start with:

```bash
bash scripts/setup_sandbox_tools.sh --doctor
bash scripts/setup_sandbox_tools.sh --plan
```

Default autonomy starts at `L1 report-only`.

Optional extra checks:

```bash
node scripts/run_repo_tests.js
node scripts/summarize_learning_ledger.js
node scripts/export_task_bundle.js
node scripts/platform_prerequisite_doctor.js
```

5. For a new project:

```bash
node scripts/init_project_workspace.js ../your-project --name your-project --idea "your idea"
```

6. If `.loop/*` is missing, initialize the session loop:

```bash
node scripts/init_session_loop.js . --goal "your objective"
```

7. If you want the official framework scaffold first:

```bash
node scripts/scaffold_project.js ../your-project --profile nextjs-app-router --language typescript --styling tailwind --database supabase --quality-tool biome
```

8. After the stack is confirmed, generate config files:

```bash
node scripts/generate_project_configs.js --profile nextjs-app-router --name your-project --language typescript --styling tailwind --database supabase --quality-tool biome
```

9. Follow `docs/interactive_project_flow.md`.

## Maintained docs

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

## Principles

- Spec before code
- Official docs / Context7 before guesswork
- Small reversible changes
- Verification every round
- Start at `L1`; promote autonomy only with evidence
- No verifier means not ready
- Scripts are accelerators, not single points of failure
- No stale claims, no stale workflow files
