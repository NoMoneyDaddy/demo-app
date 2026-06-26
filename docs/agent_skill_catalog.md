# Agent Skill Catalog

本文件只列「目前 repo 內已實作且維護中」的 skills。

Canonical path:

- `.agents/skills/<skill-name>/SKILL.md`

Mirror paths:

- `.claude/skills/<skill-name>/SKILL.md`
- `skills/<skill-name>/SKILL.md`

## 21 Core Workflow Skills

| ID | Skill | Purpose |
| --- | --- | --- |
| S01 | `using-agent-skills` | skill 路由入口 |
| S02 | `idea-refine` | 把模糊想法收斂成可規劃概念 |
| S03 | `spec-driven-development` | 先寫 spec，再開工 |
| S04 | `planning-and-task-breakdown` | 切成小而可驗證的 tasks |
| S05 | `incremental-implementation` | 薄切片實作 |
| S06 | `test-driven-development` | 先失敗測試，再修 |
| S07 | `context-engineering` | 控制讀取範圍與寫回事實 |
| S08 | `source-driven-development` | 官方文檔 / Context7 優先 |
| S09 | `frontend-ui-engineering` | 前端 UI 品質與可用性 |
| S10 | `api-and-interface-design` | API / module 邊界設計 |
| S11 | `browser-testing-with-devtools` | 用真實瀏覽器驗證 |
| S12 | `debugging-and-error-recovery` | 結構化除錯與熔斷 |
| S13 | `code-review-and-quality` | 合併前五維審查 |
| S14 | `code-simplification` | 不改行為的簡化重構 |
| S15 | `security-and-hardening` | security-first 開發 |
| S16 | `performance-optimization` | 先量測再優化 |
| S17 | `git-workflow-and-versioning` | 可逆、可審查的版本控制 |
| S18 | `ci-cd-and-automation` | 自動化品質門檻 |
| S19 | `deprecation-and-migration` | 舊介面汰除與遷移 |
| S20 | `documentation-and-adrs` | 決策與維護文件 |
| S21 | `shipping-and-launch` | 可逆、可觀測的發版 |

## Local Best-Practice Skills

| Skill | Purpose |
| --- | --- |
| `loop-engineering` | 主工作流 orchestrator |
| `goal-loop` | 用 `.loop/*` 做跨平台 session goal loop |
| `interview-me` | 一題一題問出真正需求 |
| `project-config-generation` | 技術棧確認後，自動落 package / tsconfig / framework config / env example |
| `tool-discovery-and-installation` | 盤點缺少的 skills / MCP / CLI，安全引導或執行工具安裝 |
| `cavekit-spec` | 維護 `docs/SPEC.md` |
| `cavekit-backprop` | bug 反寫規格與測試 |
| `cavekit-check` | 規格與實作漂移檢查 |
| `ui-ux-designer` | UI/UX / accessibility |
| `typescript-best-practices` | TypeScript 實務基線 |
| `biome-quality-automation` | Biome quality loop |
| `supabase-best-practices` | Supabase auth / RLS / schema |
| `website-best-practices` | 網站語意、效能、內容結構 |
| `responsive-design-best-practices` | RWD、斷點、流動版面 |
| `observability-and-instrumentation` | logs / metrics / tracing / runtime signals |
| `text-to-lottie` | Lottie / motion graphics / animated SVG 路由 |
| `recurring-monitoring` | recurring watch / deploy / PR / long-running task 監控 |

## Routing Notes

- 不確定用哪個 skill：先用 `using-agent-skills`
- 新專案主路徑：`interview-me` / `idea-refine` → `spec-driven-development` → `project-config-generation` → `planning-and-task-breakdown` → `loop-engineering`
- 舊專案主路徑：`using-agent-skills` → `code-review-and-quality` → `code-simplification` → `loop-engineering`
- 自治等級：先看 `docs/loop_maturity_model.md`
- phase：先看 `docs/engineering_phase_loop.md`
- 缺能力：先看 `docs/capability_audit_and_install_loop.md`
- 卡住停機：看 `docs/loop_circuit_breaker.md`
- 可重用流程沉澱：看 `docs/skill_crystallization_loop.md`

## Maintenance Rule

- 文件提到的 skill，必須在 `.agents/skills/` 有對應資料夾
- 只要 canonical skill 改名，兩個 mirror path 必須一起改
- 不再維護的 skill，要一起從 catalog、bootstrap、README 移除
