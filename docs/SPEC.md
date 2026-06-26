# SPEC

## §G Goal

讓這個 repo 成為多 AI 平台共用的專案治理層與 skill runtime。

## §C Constraints

- 共享核心規範必須落在 repo 內，不依賴單一平台私有能力
- 腳本必須有跨平台 fallback，不能把 shell / network 當成必然存在
- 文件必須只描述目前 repo 真實存在的檔案與能力
- 新專案與舊專案改善都要能共用同一套 workflow

## §I Interfaces

- `AGENTS.md`：共享主入口
- `CLAUDE.md`、`GEMINI.md`、`.cursor/rules/*`、`.github/copilot-instructions.md`：平台入口
- `.agents/skills/`：canonical skills
- `.loop/*`：session loop 狀態
- `scripts/*.js`、`scripts/*.sh`：自動化入口
- `config/script_capabilities.json`：腳本能力宣告
- `docs/script_fallback_matrix.md`：腳本降級策略

## §V Invariants

- `AGENTS.md` 是共享核心來源
- `.agents/skills/` 是 canonical skill runtime
- 每支重要腳本都要能被能力盤點工具描述
- 腳本不可跑時，workflow 仍可繼續
- 文件不可引用不存在的檔案或過時流程

## §T Tasks

| id | status | task | cites |
| --- | --- | --- | --- |
| T1 | x | 補齊跨平台 `/GOAL` loop 與 `.loop/*` 協定 | I4,V3,V4 |
| T2 | x | 補齊腳本能力宣告與 fallback 文件 | I6,I7,V3,V4 |
| T3 | x | 對齊入口文件、README、bootstrap 與腳本現況 | I1,I2,I5,V1,V5 |
| T4 | x | 補齊 repo 自身的 SPEC / STATE / ADRS / DEBUG / TASKS | I1,V5 |
| T5 | ~ | 持續清理過時敘述與擴充真實可驗證能力 | V5 |

## §B Bugs

| id | date | cause | fix |
| --- | --- | --- | --- |
| B1 | 2026-06-25 | 文件提到不存在的 `docs/ADRS.md`，但 repo 本身沒放 | V5 |
| B2 | 2026-06-25 | `docs/architecture.md` 舊內容描述純 Web 端架構，與 repo 目標不符 | V5 |
