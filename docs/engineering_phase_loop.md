# Engineering Phase Loop

本文件把任務型工程工作固定成 phase loop。

調研吸收：

- `FarzamMohammadi/the-engineer`
- `agenticloops-ai/agentic-ai-engineering`
- `Dryxio/auto-re-agent`

## Core Phases

```text
Define
-> Plan
-> Build
-> Verify
-> Review
-> Ship
```

補充：

- `Define` 吸收 requirements、成功條件、初步 research
- `Plan` 吸收 task slicing、依賴確認、補充 research

## Phase Outputs

| Phase | 產出 | 回退 |
| --- | --- | --- |
| Define | 成功條件、限制、風險、初步來源 | intake / clarify |
| Plan | 切片、順序、邊界、依賴 | Define |
| Build | 最小必要修改 | Plan |
| Verify | test / lint / smoke / evidence | Build |
| Review | quality / security / maintainability gate | Plan / Build |
| Ship | docs / release / handoff | Review |

## Invariants

- `Verify` 不可省略
- `Review` 可縮小，不可假裝不存在
- 無法自證就改 `blocked`
- 同根因連續失敗 3 次就熔斷

## Task States

- `queued`
- `active`
- `blocked`
- `retrying`
- `complete`
- `failed`
