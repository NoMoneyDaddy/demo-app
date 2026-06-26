# Reference Repos By Domain

本文件按領域整理可借鏡的 GitHub repo。

調研日期：2026-06-25。

快照基線：除非另有標示，以下 repo 結論都以 `2026-06-25` 查詢時的 default-branch HEAD 為準。

## High-Star Snapshot

以下星數為 `2026-06-25` 查詢時快照。用途不是追星，而是先過濾掉影響力太低、沉澱不足的候選。

| 類別 | Repo | Stars | 為何值得看 |
| --- | --- | ---: | --- |
| skill framework | `obra/superpowers` | 238205 | skills framework + methodology 一起交付，最接近「能力市場 + 工程流程」 |
| skill standard | `anthropics/skills` | 154974 | `SKILL.md` 事實標準來源之一 |
| autonomous development | `OpenHands/OpenHands` | 78283 | 大型自治開發產品化與 eval / runtime / docs 結構 |
| design-to-code | `abi/screenshot-to-code` | 73058 | 自動化網頁設計 / 視覺轉碼的代表作 |
| agent loop runtime | `earendil-works/pi` | 65458 | 統一 LLM API、agent loop、CLI/TUI 的 runtime 參考 |
| coding agent product | `cline/cline` | 63872 | IDE / CLI / SDK 多表面產品化 |
| production skills | `addyosmani/agent-skills` | 66574 | 長期工程技能拆分方式成熟 |
| resilient graph | `langchain-ai/langgraph` | 35693 | graph-based agent orchestration、持久狀態 |
| agent instructions catalog | `github/awesome-copilot` | 35687 | instructions / agents / skills catalog 化做法 |
| science skill library | `K-Dense-AI/scientific-agent-skills` | 29287 | 大型 domain skill library 與資料源整合 |
| official skills | `vercel-labs/agent-skills` | 28311 | trigger-first skill 設計清楚 |
| goal-completion loop | `snarktank/ralph` | 20594 | PRD 驅動重複 loop 直到完成 |

## Autonomous LLM / Agent Engineering

| Repo | 類型 | 可借鏡 |
| --- | --- | --- |
| `microsoft/autogen` | agent framework | 多代理對話、跨語言結構、docs / support / security 面齊全 |
| `langchain-ai/langgraph` | resilient agent framework | agent graph、examples、docs、repo 級 `AGENTS.md` / `CLAUDE.md` |
| `OpenHands/OpenHands` | AI-driven development | 大型自治開發系統的 productization、bench / eval / skills |
| `Simpleyyt/ai-manus` | productized agent runtime | frontend/backend/sandbox 分層、session + sandbox + event stream 的產品化視角 |
| `Fosowl/agenticSeek` | local-first agent product | local provider matrix、Docker / host networking、CLI/Web 雙模式與 troubleshooting 密度 |
| `FoundationAgents/OpenManus` | lightweight open manus clone | quick-start、config surface、可選 multi-agent / MCP 入口 |
| `FarzamMohammadi/the-engineer` | orchestration layer | requirements → delivery phase、plugin contracts、audit trail |
| `Zhifeng-Niu/odyssey-engine` | autonomous iteration engine | tier / orientation / convergence / checkpoint loop |
| `lsdefine/GenericAgent` | self-evolving agent | skill tree、能力結晶化、原子工具 + 極小核心 |
| `cline/cline` | autonomous coding agent product | SDK / IDE / CLI 多形態產品化、工具調用邊界 |
| `campfirein/byterover-cli` | portable memory layer | 跨 session 記憶層，可作為 strategy memory 參考 |
| `jmilinovich/goal-md` | goal specification file | 用結構化 goal 檔驅動 agent loop 的輕量方法 |
| `earendil-works/pi` | agent loop runtime | 統一 LLM API、loop runtime、TUI/CLI 介面分層 |
| `snarktank/ralph` | PRD completion loop | 以 PRD item 為收斂單位的重複執行模型 |
| `the-open-engine/zeroshot` | reviewer-enforced loop | 獨立 reviewer feedback 不可省略，適合 verify gate 參考 |

## Harness Engineering / Meta-Agent Evolution

| Repo / Resource | 類型 | 可借鏡 |
| --- | --- | --- |
| `dresnite/loops` | lightweight loop engine | budget / task guardrails、run / logs / stop process model |
| `NousResearch/hermes-agent` | self-improving agent product | built-in learning loop、memory、skills self-improvement、長時運行邊界 |
| `HKUDS/OpenHarness` | open harness runtime | permission modes、path / command rules、hooks、tool / memory / swarm runtime |
| `deusyu/harness-engineering` | learning guide | repo-as-record、mechanical enforcement、entropy management |
| `walkinglabs/learn-harness-engineering` | beginner tutorial | onboarding / teaching flow、從 0 到 1 的學習路徑 |
| `nexu-io/harness-engineering-guide` | open guide | concepts、papers、tools、resources 的 guide 結構 |
| `ai-boost/awesome-harness-engineering` | awesome list | 候選工具、patterns、evals、memory、MCP、permissions 索引 |
| `kevinrgu/autoagent` | autonomous harness engineering | benchmark score hill-climbing、meta-agent 改 harness 而不是人直接改 |
| `https://hackmd.io/@BASHCAT/SkQEW0F2bg` | long-form article | Guides × Sensors 2x2、Harness templates、MDE -> AI harness 類比 |
| `https://gist.github.com/xgqfrms-GitHub/34b482aace58a8dbb9134a2e86a2626c` | supplemental gist | 舊前端資源索引；僅作低優先補充，不作核心治理依據 |

## CI / Automation

| Repo | 類型 | 可借鏡 |
| --- | --- | --- |
| `reviewdog/reviewdog` | automated code review | 多 CI 平台整合、review gate、`CHANGELOG`、大量測試與 release tooling |
| `renovatebot/renovate` | dependency automation | 大規模自動化維護、策略化更新、嚴格設定面 |
| `google/osv-scanner` | vuln automation | CLI + actions + docs + release + config 標準化 |

## Frontend Engineering

| Repo | 類型 | 可借鏡 |
| --- | --- | --- |
| `vercel/next.js` | frontend platform | `bench`、`evals`、`examples`、monorepo、release 腳本、升級指南 |
| `microsoft/playwright` | web testing & automation | 跨瀏覽器驗證、examples、docs、穩定測試文化 |
| `nexu-io/open-design` | automated web / app design | 本地優先設計生成、設計系統、匯出與 sandbox 預覽 |
| `BuilderIO/figma-html` | design-to-code utility | 網站轉 Figma 的雙向設計參考 |
| `karero/website-builder` | website-builder skill suite | AI 網站建置 skill 化做法 |
| `abi/screenshot-to-code` | screenshot-to-code | 視覺輸入轉 HTML / Tailwind / React / Vue 的實戰參考 |
| `microsoft/design-to-code` | enterprise design system tooling | 設計系統、元件、流程工具鏈整合思路 |
| `diffusionstudio/lottie` | text-to-lottie skill runtime | 讓 coding agent 產 Lottie / animated SVG / motion asset 的技能化做法 |

## Backend Engineering

| Repo | 類型 | 可借鏡 |
| --- | --- | --- |
| `fastify/fastify` | backend framework | `GOVERNANCE.md`、`PROJECT_CHARTER.md`、`SECURITY.md`、examples、integration tests |
| `django/django` | mature web framework | 長期維護、嚴格文件 / release / compatibility discipline |
| `kubernetes/kubernetes` | large-scale infra | `OWNERS`、`SECURITY_CONTACTS`、多層目錄、測試與支援面完整 |

## Security Research / Hardening

| Repo | 類型 | 可借鏡 |
| --- | --- | --- |
| `semgrep/semgrep` | static analysis | rule-driven research、security docs、perf / tests / changelog discipline |
| `google/osv-scanner` | vuln scanning | SBOM / vulnerability scanning 自動化基線 |
| `FlyFission/nuclear-grade-context-engineering` | evidence-first governance | 高風險變更的審查與證據習慣 |

## Governance / Agent Safety

| Repo | 類型 | 可借鏡 |
| --- | --- | --- |
| `open-kya/kya-standard` | agent governance standard | 機器可讀 agent 邊界宣告 |
| `cobusgreyling/loop-engineering` | loop governance | maturity、patterns、operating loops |
| `cyberCharl/drydock` | workbench / state store | items、runs、audit trail、pause flag |
| `microsoft/agent-governance-toolkit` | governance hardening toolkit | policy enforcement、sandbox、zero-trust 身分與 OWASP Agentic Top 10 映射 |

## Skills / Skill Standards

| Repo | 類型 | 可借鏡 |
| --- | --- | --- |
| `anthropics/skills` | official skill repo | SKILL.md 基礎格式與示例 |
| `vercel-labs/agent-skills` | official skills | trigger-first skill 結構 |
| `addyosmani/agent-skills` | production skills | lifecycle 與長期工程技能 |
| `obra/superpowers` | skills framework | 技能方法論與 distribution |
| `agentskills/agentskills` | skill specification | 技能標準化與可攜格式 |
| `sickn33/antigravity-awesome-skills` | large skill library | 大規模 skills catalog 與 installer 思路 |
| `github/awesome-copilot` | instructions / agents catalog | catalog、分類、社群收錄模式 |
| `K-Dense-AI/scientific-agent-skills` | domain skill library | 大型專業領域 skill bundles 的結構參考 |
| `googleworkspace/cli` | tool + skills bundle | 單一 CLI 搭配 skills 的產品包裝方式 |
| `Chravel-Inc/chravel-web` | repo-native plugin + skills | skill/plugin、ACTIVE/_archive 文件分層、monitoring discipline、runbook 密度值得借鏡 |

## Loop AI Methodologies

| Repo | 類型 | 可借鏡 |
| --- | --- | --- |
| `cobusgreyling/loop-engineering` | loop methodology | patterns、primitives、maturity |
| `Zhifeng-Niu/odyssey-engine` | iteration methodology | convergence、tier、orientation |
| `lodekeeper/lodeloop` | verification loop | circuit breaker、verify loop |
| `jmilinovich/goal-md` | goal file methodology | 結構化 goal 檔驅動 loop |
| `modelscope/AgentEvolver` | self-evolving methodology | questioning / navigating / attributing |
| `snarktank/ralph` | execution loop | PRD item 持續重試直到完成 |
| `earendil-works/pi` | runtime loop toolkit | agent loop + terminal UX + runtime 分層 |
| `the-open-engine/zeroshot` | review-enforced loop | 獨立 reviewer 作為收斂條件 |

## Practical Reading Order

1. `cobusgreyling/loop-engineering`
2. `FarzamMohammadi/the-engineer`
3. `FlyFission/nuclear-grade-context-engineering`
4. `Zhifeng-Niu/odyssey-engine`
5. `lsdefine/GenericAgent`
6. `reviewdog/reviewdog`
7. `vercel/next.js`
8. `fastify/fastify`
9. `semgrep/semgrep`
10. `open-kya/kya-standard`
11. `dresnite/loops`
12. `HKUDS/OpenHarness`
13. `NousResearch/hermes-agent`
14. `kevinrgu/autoagent`
15. `deusyu/harness-engineering`
16. `https://hackmd.io/@BASHCAT/SkQEW0F2bg`
