---
name: recurring-monitoring
description: Use when supervising PRs, deploys, long-running agents, flaky checks, external jobs, or any recurring watch task. Choose the right tool between session loop, hook, subagent, or CI, and define explicit success/failure/escalation exits.
---

# recurring-monitoring

這個 skill 用於「定期觀察、定期檢查、定期摘要」。

不是用來直接實作功能。

## 何時用

- 盯 PR checks
- 盯 deploy 結果
- 盯長時間 migration / sync / batch job
- 盯另一個 agent / automation loop
- 定期做 smoke check
- 使用者說：
  - babysit
  - watch
  - monitor
  - keep an eye on
  - every 5 min check ...

## 何時不要用

- 要直接做功能：改用 `incremental-implementation`
- 需要 isolated file changes：改用 subagent / worktree
- 要永久排程：改用 CI / scheduler
- 要 lifecycle event 觸發：改用 hook

## 決策矩陣

| 訊號 | 正確工具 | 理由 |
| --- | --- | --- |
| 每 N 分鐘檢查一次 | session recurring loop / periodic watch | 週期性 polling |
| 檔案一改完就 format / typecheck | hook | 事件觸發 |
| 要隔離修改 | subagent / worktree | 避免撞工作樹 |
| 每次 push 都要跑 | CI | 可審計、持久 |
| 多 story 自主開發 | builder loop / task bundle | 不是監控，而是執行 |

## 標準 loop schema

每個 recurring monitor 至少要明確定義：

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

## 退出條件

每個 recurring loop 都必須有：

1. success exit
2. failure exit
3. timeout exit
4. escalation exit

## 熔斷規則

同一個失敗連續 3 次沒進展：

1. 停止 recurring loop
2. 寫 root-cause summary
3. 回報診斷與下一步
4. 不要無限重試

## 建議 artifact

- `tmp/loop-status/<task>.md`
- `tmp/loop-history/<date>-<task>.jsonl`

若平台不適合寫 `tmp/`，至少把摘要回寫：

- `.loop/CHECKPOINTS.md`
- `.loop/EVIDENCE.md`

## 與其他 skill 的搭配

- PR / merge 前：`code-review-and-quality`
- 發現問題後修復：`debugging-and-error-recovery`
- 要正式共享化：`ci-cd-and-automation`
- builder loop：搭配 `task-bundle-execution`

## 本 repo 的跨平台規則

- 若平台支援 session recurring loop，就用平台能力
- 若平台不支援，就改：
  - CI scheduler
  - OS scheduler
  - 手動 repeated check
- 不把 core contract 綁死在單一 Claude / cron API
