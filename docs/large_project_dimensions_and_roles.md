# Large Project Dimensions And Roles

本文件回答兩件事：

1. 大型嚴謹專案要具備什麼面向
2. 這些面向通常對應什麼角色 / 分工

## Core Dimensions

| 面向 | 說明 |
| --- | --- |
| Product / Requirements | 成功條件、非目標、roadmap、需求優先級 |
| Architecture | 分層、模組邊界、介面契約、可替換性 |
| Agent Runtime | loop、state、retry、blocked、budget、policy |
| Frontend | design system、accessibility、story / example、browser verification |
| Backend | API discipline、integration tests、migration / compatibility |
| CI / Delivery | lint、test、build、release、dependency automation |
| Security | secret hygiene、SAST、dependency scan、security policy |
| Observability | logs、metrics、traces、audit trail、incident clues |
| Documentation | README、usage guides、contribution、ADR、upgrade notes |
| Governance | CODEOWNERS / OWNERS、charter、review path、support path |
| Evaluation | benchmark、regression、quality gates、human review |

## Suggested Roles

| 角色 | 主要責任 |
| --- | --- |
| Product owner | 需求、優先級、成功定義 |
| Architect | 邊界、模組化、非功能需求 |
| Agent / Workflow owner | loop、state、policy、automation rollout |
| Frontend owner | UI、RWD、a11y、design verification |
| Backend owner | API、資料流、資料一致性 |
| QA / Verification owner | test plan、smoke、regression、review gate |
| Security owner | threat model、secret / vuln / policy 管理 |
| DevOps / CI owner | pipeline、release、infra automation |
| Observability owner | logs、metrics、alerts、postmortem signals |
| Docs / DX owner | README、guides、examples、upgrade path |

---
