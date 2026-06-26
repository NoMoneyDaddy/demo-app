# Learning Ledger Loop

這份文件把「做完一輪後學到什麼」落成 machine-readable ledger。

主檔：

- `.loop/LEARNINGS.json`
- `config/learning_ledger_schema.json`

## 為什麼要補

前面已經有：

- `.loop/CHECKPOINTS.md`
- `.loop/EVIDENCE.md`
- `config/execution_policy_matrix.json`

但還缺一塊：**哪些做法證明有效、哪些應丟棄、下一輪該延續什麼。**

這就是 learning ledger 的責任。

## 它回答什麼

1. 這輪改了什麼
2. 原本假設是什麼
3. 結果是保留、丟棄、重試，還是繼續調查
4. 證據在哪
5. 下一輪要接什麼實驗

## 最小條目格式

每個 entry 至少要有：

- `id`
- `date`
- `context`
- `change`
- `hypothesis`
- `result`
- `decision`
- `evidence_refs`
- `next_action`

## decision 定義

| decision | 意義 |
| --- | --- |
| `keep` | 證明值得保留 |
| `discard` | 證明不值得延續 |
| `retry` | 方向可能對，但證據不夠 |
| `investigate` | 還需要更多分析或外部驗證 |

## 什麼時候更新

- 每輪切片做完後
- 驗證或 review 改變結論後
- PR comment / CI failure 讓原假設失效後

## 和其他 loop 檔案的關係

- `CHECKPOINTS.md`：記流水帳
- `EVIDENCE.md`：記驗證證據
- `LEARNINGS.json`：記「哪些模式值得留下」

三者一起，自治 loop 才不會只是不斷重做相同試錯。

## 相關文件

- `docs/session_loop_contract.md`
- `docs/loop_evaluation_gate.md`
- `docs/agent_execution_policy_matrix.md`
- `docs/comparable_project_analysis.md`
