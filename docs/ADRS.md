# ADRS

## ADR-001 Cross-platform Repo-first Contract

### Context

目標是讓 Codex、Claude Code、Cursor、Gemini CLI、Copilot、Hermes、OpenClaw 等工具讀同一份 repo，就能得到接近一致的工作流。

### Options

1. 各平台各寫一套完整規則
2. 以單一平台為主，其他平台自行適配
3. 用 repo-first：共享核心入口 + 平台薄入口 + canonical skills

### Decision

採用選項 3。

### Consequences

- 維護成本較低
- 需要持續控制入口檔與 mirrors 不漂移
- 文件與檔案結構必須更嚴格對齊

## ADR-002 Scripts Are Accelerators, Not Hard Dependencies

### Context

不同 AI 平台不一定同時具備 Node、shell、network、package manager。

### Options

1. 假設本機 CLI 永遠可用
2. 把所有流程都改成手動文件
3. 能跑腳本就跑，不能跑就 fallback

### Decision

採用選項 3。

### Consequences

- 需要 `config/script_capabilities.json`
- 需要 `docs/script_fallback_matrix.md`
- 腳本設計要先考慮可移植性

## ADR-003 Tool Installation Must Be Discoverable, Authorized, and Verified

### Context

使用者希望 agent 讀 repo 後能自己找缺少能力並安裝工具；但安裝外部工具會改本機或 sandbox 狀態，也可能引入供應鏈風險。

### Options

1. 允許 agent 靜默安裝任何工具
2. 完全禁止 agent 安裝，只輸出文件
3. 讓 agent 先盤點與規劃；使用者明確要求安裝時，執行 repo 內安全腳本；未知來源先停下確認

### Decision

採用選項 3。

### Consequences

- 新增 `tool-discovery-and-installation`
- 安裝後必須驗證 command 或重新跑 capability inspector
- community skill market 只能當候選來源，不能當信任來源
- marketplace distribution 需等 LICENSE、plugin manifest、version policy 補齊後再做
