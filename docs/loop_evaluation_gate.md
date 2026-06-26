# Loop Evaluation Gate

這份文件定義：

- 什麼叫 `.loop/*` 真的可用
- 什麼情況只是「有檔案」，但其實不能升自治
- 怎麼用機器可跑的 gate 判斷能不能繼續、能不能升 L2、能不能進 ship / merge gate

## 結論

先跑：

```bash
node scripts/evaluate_session_loop.js .
```

若要讓 automation / CI 直接擋下不合格 loop：

```bash
node scripts/evaluate_session_loop.js . --fail-on-hold
```

## gate 看的東西

1. `.loop/*` 六個核心檔案是否存在
2. `GOAL.md` 是否真的有 objective / done definition / constraints
3. `PLAN.md` 是否真的有 current slice / acceptance criteria
4. `POLICY.md` 是否真的有 default / auto-continue / stop conditions
5. `CHECKPOINTS.md` 是否有實際 entries
6. `EVIDENCE.md` 是否有實際證據
7. `LEARNINGS.json` 是否有完整 keep / discard / retry ledger
8. `STATE.json` 是否符合 session loop contract
9. `last_verified_at` 是否存在
10. circuit breaker 是否已打開

## gate 結果

| gate | 意義 | 動作 |
| --- | --- | --- |
| `hold` | loop 還不能信 | 先補狀態、證據、policy、schema |
| `continue` | loop 基線齊，但還不到升級條件 | 繼續下一個切片 |
| `promote-candidate` | 可考慮從 `L0/L1` 升到 `L2` | 先確認 verifier 與權限邊界 |
| `ship-ready` | loop 證據與狀態足夠，可進 ship / merge gate | 可接 PR / release / ship 流程 |

## 什麼叫 promote-candidate

至少要同時成立：

- `GOAL.md`、`PLAN.md`、`POLICY.md` 不是 placeholder
- `CHECKPOINTS.md`、`EVIDENCE.md` 有真實 entries
- `LEARNINGS.json` 至少有一筆完整 machine-readable entry
- `STATE.json` 欄位完整、enum 合法、時間欄位合法
- `last_verified_at` 已填
- `retry_count < 3`
- `blocked_reason != circuit_breaker_open`
- `convergence_state != open`
- `phase` 已進到 `Verify` / `Review` / `Ship`
- `maturity_level` 目前是 `L0` 或 `L1`

## 什麼叫 ship-ready

除了上面的基線外，還要：

- `phase == Ship`
- `current_state == ship-prep`
- `status == active` 或 `complete`

## 常見失敗

### 1. `.loop/STATE.json` 欄位漂移

最常見。檔案還在，但欄位已不符合 `docs/session_loop_contract.md`。

### 2. 有 evidence，但沒有 last_verified_at

代表驗證證據有寫，但 machine-readable state 沒同步。

### 3. 有檔案，但都是 placeholder

代表只完成 bootstrap，還沒形成真 loop。

### 4. 有 checkpoint / evidence，但沒有 learning ledger

代表有流水帳，沒有把 keep / discard 結論留下來。

## 建議接法

### 新專案 / 新 workspace

```bash
node scripts/init_session_loop.js . --goal "<objective>"
node scripts/evaluate_session_loop.js .
```

### 實作切片後

```bash
node scripts/evaluate_session_loop.js .
```

### PR / merge 前

```bash
node scripts/evaluate_session_loop.js . --fail-on-hold
```

## 相關文件

- `docs/session_loop_contract.md`
- `docs/loop_maturity_model.md`
- `docs/engineering_phase_loop.md`
- `docs/loop_circuit_breaker.md`
- `docs/project_lifecycle_automation.md`
- `docs/learning_ledger_loop.md`
