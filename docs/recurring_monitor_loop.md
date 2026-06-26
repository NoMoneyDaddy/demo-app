# Recurring Monitor Loop

這份文件定義「定期監控 / 定期輪詢 / 定期摘要」的通用策略。

## 適用問題

- PR 是否全綠
- deploy 是否完成
- 外部 job 是否結束
- smoke test 是否恢復
- 長時間 builder loop 是否卡住

## 工具選擇

| 情境 | 應用工具 |
| --- | --- |
| 每 N 分鐘檢查 | session recurring loop / periodic monitor |
| Claude/agent 事件觸發 | hook |
| 需要隔離修改 | subagent / worktree |
| 需要持久排程 | CI / OS scheduler |
| 需要多 story 自主實作 | task bundle / builder loop |

## Loop Schema

```yaml
objective:
interval:
max_runtime:
success_condition:
failure_condition:
escalation_condition:
allowed_actions:
approval_required_for:
artifacts_to_read:
artifacts_to_write:
notify_when_done:
```

## 失敗預算

同一個失敗 3 次都沒進展：

- stop
- summarize
- escalate

## 建議 artifact

- `tmp/loop-status/*.md`
- `tmp/loop-history/*.jsonl`
- 或回寫 `.loop/CHECKPOINTS.md` / `.loop/EVIDENCE.md`

## 何時升級到 CI

- 同一類 recurring monitor 反覆重開 3 次以上
- 需要跨 session 持續存在
- 不只一個人會依賴
- 已經是 production critical

## 相關文件

- `docs/loop_circuit_breaker.md`
- `docs/loop_evaluation_gate.md`
- `docs/project_lifecycle_automation.md`
