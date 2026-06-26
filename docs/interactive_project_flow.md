# Interactive Project Flow

這份文件描述本 repo 的自適應工作流。

不是固定 9 步。也不是只有一條線。

真正結構是：

1. 六階段生命週期
2. 階段內的可跳轉 state
3. 品質 gate 與自動迭代 loop
4. `.loop/*` 作為 session 內共用狀態

## 六階段生命週期

| Phase | 中文 | 目標 | 常用 skills |
| --- | --- | --- | --- |
| Define | 定義 | 把模糊需求變成清楚問題 | `using-agent-skills` `interview-me` `idea-refine` `spec-driven-development` |
| Plan | 規劃 | 把 spec 變成可執行任務 | `planning-and-task-breakdown` |
| Build | 實作 | 小切片持續交付 | `incremental-implementation` `test-driven-development` `source-driven-development` |
| Verify | 驗證 | 用真實證據證明可行 | `browser-testing-with-devtools` `debugging-and-error-recovery` |
| Review | 審查 | 合併前品質門檻 | `code-review-and-quality` `code-simplification` `security-and-hardening` `performance-optimization` `biome-quality-automation` |
| Ship | 交付 | 可逆、可觀測、可維護 | `git-workflow-and-versioning` `ci-cd-and-automation` `observability-and-instrumentation` `documentation-and-adrs` `shipping-and-launch` |

## State Machine

每個 session 不一定走完全部 phase。

常見 state：

1. `intake`
2. `clarify`
3. `capability-check`
4. `stack-and-deps`
5. `spec-and-architecture`
6. `task-slicing`
7. `implementation-loop`
8. `review-gate`
9. `ship-prep`

## Stop Conditions

只有這些情況才停：

- 缺憑證、權限、付款、登入
- 需要使用者做不可逆選擇
- 外部服務不可用且無替代方案
- 同一錯誤連修 3 次仍失敗

---
