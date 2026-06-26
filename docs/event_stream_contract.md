# Event Stream Contract

目標：

- 把 agent 執行過程變成可觀測事件
- 讓「一句想法即交付」不是黑盒
- 讓前端、CLI、remote runner、sandbox viewer 看同一種事件語意

## 最小事件模型

每個 event 最少帶：

- `session_id`
- `task_id`
- `event_type`
- `timestamp`

建議附帶：

- `phase`
- `source`
- `payload`

## 最小事件型別

### Lifecycle

- `session_created`
- `task_created`
- `task_started`
- `task_blocked`
- `task_resumed`
- `task_completed`
- `task_cancelled`

### Tool

- `tool_started`
- `tool_stdout`
- `tool_stderr`
- `tool_finished`
- `tool_failed`

### Artifact

- `artifact_created`
- `artifact_updated`
- `artifact_deleted`

### Governance

- `verification_started`
- `verification_passed`
- `verification_failed`
- `human_takeover_requested`
- `policy_blocked`

## 建議 payload

### `tool_started`

```json
{
  "tool_name": "browser",
  "command": "open page",
  "sandbox_id": "sbx_001"
}
```

### `tool_finished`

```json
{
  "tool_name": "browser",
  "exit_code": 0,
  "duration_ms": 1532
}
```

### `verification_failed`

```json
{
  "gate": "tests",
  "summary": "2 tests failed",
  "evidence_ref": ".loop/EVIDENCE.md"
}
```

## 輸送層

可接受：

- SSE
- websocket
- append-only log

原則：

- 事件語意先固定
- 傳輸協定可替換

## 與本 repo 的對接

- `.loop/EVIDENCE.md`：對應驗證證據
- `.loop/CHECKPOINTS.md`：對應高層 checkpoint
- `config/session_task_schema.json`：對應 session / task 狀態
- `docs/sandbox_session_runtime_topology.md`：對應 runtime 拓樸

## 何時需要 human takeover

至少以下情況丟 `human_takeover_requested`：

- 登入 / 驗證碼
- 不可逆刪除
- 付款 / deploy
- 系統級權限升高
- 同錯 3 次仍失敗
