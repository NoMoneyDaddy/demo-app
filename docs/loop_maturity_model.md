# Loop Maturity Model

本文件定義 agent autonomy rollout。

調研吸收：

- `cobusgreyling/loop-engineering`
- `FlyFission/nuclear-grade-context-engineering`
- `FarzamMohammadi/the-engineer`
- `Zhifeng-Niu/odyssey-engine`

## Levels

| Level | 名稱 | 定義 | 允許行為 | 必要條件 |
| --- | --- | --- | --- | --- |
| L0 | Manual | 人主導，AI 只提建議 | 分析、草稿、規劃 | 無 |
| L1 | Report-only | AI 可盤點與產報告，不改外部狀態 | 掃 repo、查缺口、寫 docs | evidence、stop condition |
| L2 | Assisted | AI 可在 repo 內局部修改並驗證 | 改 code、補設定、跑 test | verifier、review gate、bounded retries |
| L3 | Unattended | AI 可在核准範圍內連續執行 | 自動修正、開 PR、持續迭代 | scope boundary、budget、audit trail、policy |

## Default

- 預設從 `L1` 開始。
- 沒 verifier，不升 `L2`。
- 沒 scope / budget / audit，不升 `L3`。

## Promotion Rule

1. 前一級已穩定。
2. 有真實驗證，不是文件宣稱。
3. 有 blocked / escalation 規則。
4. 有回退或可逆策略。

## Suggested State Fields

- `maturity_level`
- `tier`
- `orientation`
- `time_budget`
- `phase`
- `status`
- `blocked_reason`
- `retry_count`
- `convergence_state`

## Anti-Patterns

- 把可自動跑說成可安全自治
- 沒驗證就升級 autonomy
- 單一長 prompt 取代 state / policy / evidence
