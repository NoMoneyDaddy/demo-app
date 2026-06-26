---
name: tool-discovery-and-installation
description: Detect missing skills, MCP servers, CLIs, and sandbox tools; choose safe install paths; install or guide tool setup with explicit authorization and verification.
---

# tool-discovery-and-installation

用於缺工具、缺 skill、缺 MCP、缺瀏覽器驗證能力、缺搜尋能力，或使用者明確要求「補能力 / 裝工具 / 自己找辦法」時。

## 目標

讓 agent 能自己盤點能力缺口、找到安全安裝路線、完成可驗證的工具補強；同時避免靜默安裝、來源不明安裝與秘密資料外洩。

相關文件：

- `docs/capability_audit_and_install_loop.md`
- `docs/loop_maturity_model.md`
- `docs/skill_crystallization_loop.md`
- `docs/external_install_provenance_checklist.md`

## 啟動順序

1. 先跑能力盤點：

    node scripts/inspect_agent_capabilities.js

2. 若任務已有專案型別或技術棧，先跑 dry-run 推薦：

    node scripts/auto_skill_setup.js --project-type TYPE --language LANG --database DB --deployment TARGET

3. 若缺 sandbox / shell 工具，先做體檢：

    bash scripts/setup_sandbox_tools.sh --doctor

4. 若需要完整建議清單，再看安裝計畫：

    bash scripts/setup_sandbox_tools.sh --plan

5. 若使用者已明確要求安裝，才執行 repo 內安全腳本：

    bash scripts/setup_sandbox_tools.sh --install-core
    bash scripts/setup_sandbox_tools.sh --install-ai
    node scripts/auto_skill_setup.js --project-type TYPE --language LANG --database DB --deployment TARGET --install

## 安裝判定

可以直接安裝：

- 使用者在本輪明確要求「安裝工具 / 補能力 / 讓 AI 自己裝」
- 指令來自本 repo 的 scripts 或 config/tooling_profiles.json
- 套件來源可追溯到官方文件、官方 package registry 或已知 GitHub repo
- 不需要把 token、cookie、API key 寫進 repo

必須先停下確認：

- 要跑 curl pipe shell、遠端 shell、未知 binary
- 要安裝瀏覽器 extension、系統服務、daemon、driver
- 要改 shell profile、全域 Git config、系統權限或登入態
- 需要 secret、cookie、token、SSH key
- 指令不在 repo 文件、官方文件或已驗證來源中

## 缺口類型

- `skill gap`
- `CLI gap`
- `MCP gap`
- `browser gap`
- `secret gap`

## 查找規則

- 先查 repo：rg、fd、docs、config
- 再查本機：command -v TOOL、TOOL --version
- 再查官方文件或 package registry
- 不確定工具名稱時，先列候選與風險，不要硬裝

## 驗證

安裝後至少做一項：

    TOOL --version
    command -v TOOL
    node scripts/inspect_agent_capabilities.js
    node scripts/validate_repo_integrity.js

若安裝失敗：

- 貼最短錯誤摘要
- 提供替代安裝路線
- 同一錯誤連修 3 次仍失敗就熔斷

若補強後形成穩定流程，考慮沉澱成新 skill。

## 記錄

任務結束時更新：

- docs/STATE.md：目前可用能力與缺口
- docs/DEBUG_NOTES.md：失敗安裝與解法
- .loop/EVIDENCE.md：驗證命令與結果

## 禁止

- 不得提交 .env*
- 不得把 secret 寫入文件、log、config
- 不得把「建議安裝」說成「已安裝」
- 不得在未驗證時宣稱工具可用
