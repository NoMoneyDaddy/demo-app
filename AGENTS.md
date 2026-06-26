## Loop Engineering Agent Contract

This file is the single source of agent instructions for this repo. Support priority:

- `AGENTS.md`: Codex, Cursor, GitHub Copilot Agent
- `CLAUDE.md`: Claude Code
- `GEMINI.md`: Gemini CLI

If your tool supports multiple filenames, this file takes precedence.

## Objectives

Converge "one idea" into a verifiable, deployable app or website. Plan first, then implement. Check official documentation first, then write code.

## Default Interaction Flow

Each new session follows these stages by default:

- Not a fixed 9 steps
- Can skip, merge, or revert
- Small tasks can combine planning and confirmation
- Medium/large tasks should retain dual confirmation

Default stages:

1. intake: Confirm new or existing project improvement
2. clarify: Fill in idea, constraints, success definition
3. capability-check: Inventory installed skills, tools, MCP, repo status
4. stack-and-deps: Tech stack, external services, API keys/fallback
5. spec-and-architecture: Specs, directory, layering, validation strategy
6. task-slicing: Break into minimum verifiable work
7. implementation-loop: Implement, test, fix, document
8. review-and-ship: Review, documentation, deploy preparation

Legacy project mode:

- Understand current state and pain points first
- Propose improvement slices
- Decide whether to reuse, partially refactor, or migrate
- No large-scale refactoring without confirmation

## Essential Rules

1. Don't start coding directly. Read `.agents/skills/loop-engineering/SKILL.md` first.
2. Before generating projects, read `docs/project_architecture_best_practices.md` to define directories and layers.
3. For new projects, execute initialization: create folders, core spec files, `docs/SPEC.md`, `docs/TASKS.md`, `docs/DEBUG_NOTES.md`, `docs/STATE.md`, `docs/ADRS.md`.
4. If `.loop/*` is missing, initialize session loop: `node scripts/init_session_loop.js . --goal "<objective>"`. If scripts can't run, read `docs/script_fallback_matrix.md` and manually create `.loop/*`.
5. If tools, skills, MCP, search ability, or browser verification is missing, read `.agents/skills/tool-discovery-and-installation/SKILL.md`.
6. Read first:
   - `docs/loop_maturity_model.md`
   - `docs/engineering_phase_loop.md`
   - `docs/capability_audit_and_install_loop.md`
   - `docs/loop_circuit_breaker.md`
   - `docs/agent_manifest_spec.md`
7. Auto-search for needed skills by project type; execute safe installation scripts when authorized; provide clear prompts when auto-installation isn't possible.
8. Ask 3-5 key questions, including:
   - Project type: `web app` / `landing page` / `mobile app` / `api service`
   - Frontend or execution environment
   - Database
   - UI library
   - Deployment strategy: `Zeabur All-in-One` / `Hybrid` / `Self-managed`
9. Produce brief architecture plan: directory sketch, layering, validation, error handling, env table.
10. Check official documentation when third-party integration, framework behavior, or deployment steps are uncertain.
11. Make only minimum necessary changes. Don't rewrite entire packages.
12. All secrets go through environment variables. Never commit `.env*`.
13. Always validate output. Execute corresponding `test`, `lint`, `build` or minimum reproduction.
14. Write debugging experience to `docs/DEBUG_NOTES.md`, current progress to `docs/STATE.md`, session loop progress to `.loop/*`.
15. Update `README.md`, `docs/TASKS.md`, `docs/ADRS.md` at phase end.
16. If same error persists after 3 fixes, stop and report error and blocking points.
17. Complex tasks default to parallel subtasks; auto-dispatch via subagents if platform supports.

## Low Token Guidelines

1. Ask only decision-related questions; avoid asking what repo or tools can auto-derive.
2. Ask 1-3 question groups per turn; allow multiple selection, skipping, using current status, or AI decision.
3. Only report incremental changes; don't repeat existing context.
4. For large repos, use `Semble`, `rg`, `fd` first; don't read entire files.
5. After confirmation round, write facts into `docs/SPEC.md`, `docs/STATE.md`; reference files afterward, not long summaries.
6. Present short plan first; expand complete version after confirmation.

## Delivery Flow

1. Read `.agents/skills/loop-engineering/SKILL.md` and relevant `references/`.
2. For new projects lacking spec files, create `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.cursorrules`, `.cursor/rules/00-project.mdc`.
3. Create `docs/SPEC.md`, `docs/SPEC_FORMAT.md`, `docs/TASKS.md`, `docs/DEBUG_NOTES.md`, `docs/STATE.md`, `docs/ADRS.md`.
4. Execute `node scripts/inspect_agent_capabilities.js` to inventory skills, MCP, tools.
5. Execute `node scripts/validate_repo_integrity.js` to confirm entry points, mirrors, settings, document links.
6. If tools, skills, MCP, search, or browser verification missing, read `.agents/skills/tool-discovery-and-installation/SKILL.md`, then run `bash scripts/setup_sandbox_tools.sh --plan`.
7. Search and install needed skills by project type.
8. Produce initial planning and tech stack summary; await user confirmation.
9. Medium/large tasks: After short version confirmation, produce complete plan and task slicing.
10. Small tasks: Can merge into single confirmation before starting.
11. Generate minimum viable version:
    - Prioritize runnable, testable, deployable
    - Then add value features
12. If environment supports MCP, check if direct deployment or external tools are available.
13. Report:
    - What was done
    - How to verify
    - Missing keys or manual steps

## File Navigation

- Core skill: `.agents/skills/loop-engineering/SKILL.md`
- Skill routing: `.agents/skills/using-agent-skills/SKILL.md`
- Tool enhancement: `.agents/skills/tool-discovery-and-installation/SKILL.md`
- Maturity: `docs/loop_maturity_model.md`
- Phase loop: `docs/engineering_phase_loop.md`
- Capability audit: `docs/capability_audit_and_install_loop.md`
- Circuit breaker: `docs/loop_circuit_breaker.md`
- Skill crystallization: `docs/skill_crystallization_loop.md`
- Agent manifest: `docs/agent_manifest_spec.md`
- GitHub reference map: `docs/reference_repos_by_domain.md`
- Large project dimensions and roles: `docs/large_project_dimensions_and_roles.md`
- Interactive flow: `docs/interactive_project_flow.md`
- Session loop protocol: `docs/session_loop_contract.md`
- Script fallback matrix: `docs/script_fallback_matrix.md`
- Usage guide: `docs/project_usage_guide.md`
- Interactive examples: `docs/example_sessions.md`
- JS/TS quality loop: `docs/biome_quality_loop.md`
- Subagent rules: `docs/subagent_dispatch.md`
- Tech stack best practices: `.agents/skills/*-best-practices/SKILL.md`
- Architecture standards: `docs/project_architecture_best_practices.md`
- Bootstrap process: `docs/agent_bootstrap_workflow.md`
- Marketplace and open source readiness: `docs/marketplace_open_source_readiness.md`
- Release rules: `docs/release_version_policy.md`
- Project lifecycle: `docs/project_lifecycle_automation.md`
- Tech stack hints: `prompts/interactive_tech_stack_prompt.md`
- Prompt templates: `prompts/`
- Deployment docs: `docs/zeabur_*.md`
- Config templates: `config/`
- Scripts: `scripts/`

## Script Portability Rules

- New scripts default to Node.js; more cross-platform than `.sh`
- `.sh` only for sandbox setup, CLI wrapping, environment-oriented work
- Each new script requires:
  - `config/script_capabilities.json`
  - `docs/script_fallback_matrix.md`
  - `scripts/bootstrap_agent_files.js` when necessary
- Non-running scripts shouldn't mark workflow as failed; use fallback instead

## Official Documentation Priority

Documentation search priority:

- OpenAI Codex/API: `developers.openai.com`
- Claude Code: `code.claude.com`, `docs.anthropic.com`
- Cursor: `cursor.com/docs`
- Gemini CLI: `github.com/google-gemini/gemini-cli`
- GitHub Copilot: `docs.github.com`
- Zeabur: `zeabur.com/docs`

Community skill directories (like `awesomeclaude.ai`, `awesomeskill.ai`) only discover candidates. Before importing, installing, writing specifications, or making technical decisions, return to official documentation, Context7, or verified best practices.
