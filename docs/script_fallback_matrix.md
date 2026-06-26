# Script Fallback Matrix

這份文件定義：

- 哪些腳本只是加速器
- 哪些腳本受限於 shell / network / package manager
- 腳本跑不了時，AI 應怎麼降級，不中斷整體工作流

## 核心原則

- 腳本不是唯一入口
- repo 文件才是共同事實來源
- 能跑腳本就加速
- 不能跑腳本就走手動 fallback
- 不因單一腳本失敗就整個停工

## 平台原則

- `scripts/*.js` 以 Node.js 為基準，目標支援 macOS / Linux / Windows。
- `scripts/*.sh` 是 shell-bound，只保證 macOS / Linux / Git Bash / WSL 這類 shell 環境。
- Windows 原生環境不能跑 `.sh` 時，不視為失敗；照本文件 fallback。
- 需要 package manager、network、browser、MCP 的步驟都要先看當前 sandbox 權限。

## 決策順序

1. 先讀 `config/script_capabilities.json`
2. 判斷當前平台是否有：
   - `node`
   - `shell`
   - `network`
   - `filesystem:write`
   - `package-manager`
3. 能跑就跑腳本
4. 跑不了就照 fallback mode 改走文件化流程
5. 把實際採用的路徑記到 `.loop/CHECKPOINTS.md` 或 `docs/STATE.md`

## 矩陣

| Script | 類型 | 需要 | 跑不了時怎麼辦 |
| --- | --- | --- | --- |
| `scripts/inspect_agent_capabilities.js` | accelerator | `node` `filesystem:read` | 人工盤點 skills / MCP / tools，寫入 `docs/STATE.md` |
| `scripts/evaluate_session_loop.js` | quality-gate | `node` `filesystem:read` | 人工檢查 `.loop/*`、`STATE.json` schema、evidence、checkpoint、policy，決定 hold / continue / promote |
| `scripts/validate_repo_integrity.js` | quality-gate | `node` `filesystem:read` | 人工確認入口檔、skill mirrors、JSON、script capabilities、本地文件連結 |
| `scripts/init_session_loop.js` | strong-accelerator | `node` `filesystem:write` | 手動建立 `.loop/*` |
| `scripts/init_project_workspace.js` | strong-accelerator | `node` `filesystem:write` | 手動建立入口檔、docs、`.loop/*` |
| `scripts/scaffold_project.js` | environment-bound | `node` `shell` `network` | 只輸出官方 scaffold 指令，交給可執行環境跑 |
| `scripts/setup_sandbox_tools.sh` | environment-bound | `shell` `network` `package-manager` | 讀 `docs/sandbox_tooling_guide.md`，改手動安裝 |

## `/GOAL` 相關降級

若平台沒有原生 `/goal`，或不能跑 `node scripts/init_session_loop.js`：

1. 手動建立 `.loop/GOAL.md`
2. 手動建立 `.loop/PLAN.md`
3. 手動建立 `.loop/STATE.json`
4. 手動建立 `.loop/CHECKPOINTS.md`
5. 手動建立 `.loop/EVIDENCE.md`
6. 手動建立 `.loop/POLICY.md`
7. 把目標寫進 `GOAL.md`
8. 把目前 phase / state / status 寫進 `STATE.json`
9. 每輪修改後都更新 `CHECKPOINTS.md` 與 `EVIDENCE.md`

## 對 AI 的要求

- 不要把「腳本不可跑」誤判成「專案不可用」
- 不要假設所有平台都有 shell 與 network
- 不要假設所有平台都能安裝依賴
- 先保工作流連續性，再追求自動化程度

## 相關文件

- `docs/session_loop_contract.md`
- `docs/project_usage_guide.md`
- `config/script_capabilities.json`
