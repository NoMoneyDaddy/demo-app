# Sandbox Session Runtime Topology

這份文件描述「若把本 repo 往可執行 agent runtime 推進」，建議的最小拓樸。

來源參考包含：

- `Simpleyyt/ai-manus`
- `OpenHands/OpenHands`
- `HKUDS/OpenHarness`
- `FoundationAgents/OpenManus`

重點不是照抄產品。
重點是把 repo-first 治理層，往可驗證 runtime 能力補齊。

## 結論

目前本 repo 強項是：

- 入口契約
- skills / docs / scripts / loop 治理
- scaffold / doctor / install guidance

目前較薄的是：

- task 級 sandbox 隔離
- session orchestration
- tool event stream
- background task lifecycle

若要補齊，建議最小 runtime 分五層。

## 五層拓樸

### 1. Session Control Plane

責任：

- 建立 session / task
- 分配 sandbox
- 保存 session state
- 追蹤執行狀態：`queued` / `running` / `blocked` / `done`

最低資料：

- `session_id`
- `task_id`
- `goal`
- `current_phase`
- `sandbox_id`
- `tool_permissions`
- `created_at` / `updated_at`

### 2. Sandbox Runtime Plane

責任：

- 每個 task 給獨立 sandbox
- 跑 shell / browser / file / MCP tool
- 限定網路、磁碟、生命週期

最低能力：

- 建 sandbox
- 銷毀 sandbox
- 可重連
- TTL / idle timeout

### 3. Tool Gateway Plane

責任：

- 封裝 Terminal / Browser / File / Web Search / MCP
- 把工具輸出統一成 event stream
- 記錄 tool call、exit code、artifacts

最低事件型別：

- `tool_started`
- `tool_stdout`
- `tool_stderr`
- `tool_finished`
- `artifact_created`
- `human_takeover_requested`

### 4. Event Stream Plane

責任：

- 把 agent reasoning 外的可觀測事件推回前端 / 控制台
- 支援長任務、背景任務、恢復連線

建議基線：

- SSE 或 websocket
- 每個 event 帶 `session_id` / `task_id` / `timestamp`

### 5. Persistence Plane

責任：

- 保存 session history
- 保存 checkpoint / evidence / tool logs
- 保存 artifacts metadata

最低分流：

- state store
- event log
- artifact index

## 與本 repo 現況的對接點

可直接沿用：

- `.loop/*`：session state contract
- `docs/agent_execution_policy_matrix.md`：permission / allow/deny 邊界
- `config/platform_prerequisites.json`：runtime host doctor
- `scripts/setup_sandbox_tools.sh`：sandbox tool bootstrap

還缺：

- machine-readable session/task schema
- sandbox lease / TTL policy
- event stream schema
- background task runbook
- runtime quick-start lane（單代理 / 多代理 / MCP）

## 建議先做的最小補強

1. 補 `session/task` 狀態 schema
2. 補 `event stream` 文件與欄位
3. 補 `sandbox lease` / timeout policy
4. 補「human takeover」觸發條件

## 不要先做的事

- 不先做重型 always-on daemon
- 不先做多租戶產品化 UI
- 不先假裝已具備真正 background worker

先把契約、狀態、事件面定義清楚，再談 runtime。
