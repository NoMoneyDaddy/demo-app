# SPEC Format

本 repo 的 `docs/SPEC.md` 採固定區段，讓 AI 與人都能穩定讀寫。

## 必備區段

- `§G Goal`
  - 一句話目標
- `§C Constraints`
  - 限制、假設、非功能需求、技術棧約束
- `§I Interfaces`
  - UI、API、資料、環境變數、外部整合
- `§V Invariants`
  - 不可破壞的行為規則
- `§T Tasks`
  - 結構化任務表
- `§B Bugs`
  - bug 與防回歸紀錄

## 任務表格式

| id | status | task | cites |
| --- | --- | --- | --- |
| T1 | . | 需求釐清 | I.app |

`status` 規則：

- `.`：未開始
- `~`：進行中
- `x`：已完成

## Bugs 表格式

| id | date | cause | fix |
| --- | --- | --- | --- |
| B1 | 2026-06-24 | session 驗證缺漏 | V4 |

## 寫作規則

- 保持短句、可驗證、可 grep。
- `§V` 只寫可測試規則，不寫空話。
- `§I` 要寫真實表面，不寫抽象願景。
- 大功能先補 `§G/§C/§I/§V`，再展開 `§T`。
- bug 修復後，優先回寫 `§B`，必要時補新的 `§V`。
