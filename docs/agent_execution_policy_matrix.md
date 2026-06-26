# Agent Execution Policy Matrix

這份文件把「什麼能自動做、什麼必須停下來問人」落成 machine-readable policy。

主檔：

- `config/execution_policy_matrix.json`

## 為什麼現在補這個

前一輪已補：

- `.loop/*` 狀態層
- `docs/loop_maturity_model.md`
- `docs/loop_circuit_breaker.md`
- `scripts/evaluate_session_loop.js`

但還缺一塊：**自治等級有了，實際動作的允許邊界還沒有 machine-readable policy。**

這份 matrix 就是把那條線畫清楚。

## 它回答什麼

1. 哪些 action 在 `L1 / L2 / L3` 可以做
2. 哪些 action 一定要 verifier
3. 哪些 action 一定要 human gate
4. 哪些 action 直接 deny

## 目前策略

### 低風險

- `repo_read`
- `external_research_read`
- `doc_update`

這些可以自動做，但仍要保留證據與來源。

### 中風險

- `repo_write_local`
- `verified_tool_setup`
- `pr_create`

這些需要：

- verifier
- `git diff --check`
- audit trail

### 高風險

- `auto_merge`
- `system_tool_install`
- `deployment_write`

這些預設都要 human gate。

### 致命風險

- `secret_entry`
- `unguarded_external_write`

前者是 human-only，後者直接 deny。

## 參考來源

這份 matrix 的設計，這輪已吸收以下參考：

- `dresnite/loops`：budget / task guardrails
- `NousResearch/hermes-agent`：學習 loop + 長時運行 agent 的邊界感
- `HKUDS/OpenHarness`：permission modes、path / command rules、hooks
- `kevinrgu/autoagent`：benchmark / score / keep-or-discard 的工程化思路
- `deusyu/harness-engineering`
- `walkinglabs/learn-harness-engineering`
- `nexu-io/harness-engineering-guide`
- `ai-boost/awesome-harness-engineering`
- `https://hackmd.io/@BASHCAT/SkQEW0F2bg`

補充：

- `xgqfrms` 那份 gist 是舊前端資源索引，對本 repo 的 agent governance 價值低，所以只列為低優先外部資源，不作核心治理依據。

## 相關文件

- `docs/loop_maturity_model.md`
- `docs/loop_evaluation_gate.md`
- `docs/capability_audit_and_install_loop.md`
- `config/agent_manifest.json`
