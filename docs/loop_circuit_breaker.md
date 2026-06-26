# Loop Circuit Breaker

本文件定義 loop 何時該停，避免燒 token 或反覆撞牆。

調研吸收：

- `lodekeeper/lodeloop`
- `Zhifeng-Niu/odyssey-engine`
- `Dryxio/auto-re-agent`

## States

| State | 條件 | 行為 |
| --- | --- | --- |
| `closed` | 正常前進 | 繼續 |
| `half_open` | 2 輪無進展或同根因連續失敗 2 次 | 繼續，但加強觀察 |
| `open` | 3 輪無進展或同根因連續失敗 3 次 | 停止並回報 |

## Progress Signal

以下任一成立才算有進展：

- 驗證數量增加
- bug / failing tests 減少
- diff 有效縮小問題
- evidence 新增且指向新資訊
- 任務 phase 往前

## Root Cause Rule

- 只計「同根因」重試，不把不同錯誤混算
- 一旦換根因，`retry_count` 應重新計數
- `open` 觸發後，必須回報阻塞點，不可假裝仍可自治前進

## Required Record

- `.loop/STATE.json`
- `.loop/EVIDENCE.md`
- `docs/DEBUG_NOTES.md`
