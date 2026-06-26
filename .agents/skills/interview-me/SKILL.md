---
name: interview-me
description: Run a one-question-at-a-time interview to extract what the user actually needs before planning or implementation.
---

# interview-me

一題一題問。不要一次倒整份問卷。

## 目標

- 用最少問題補足關鍵決策
- 避免把模糊需求直接搬進 spec
- 問到可進 `idea-refine` 或 `spec-driven-development`

## 流程

1. 先判斷缺的是哪一類資訊
2. 一次只問 1 個最能降低不確定性的問題
3. 收到答案後更新理解、決定下一題
4. 信心足夠後，停

## 規則

- 不連發 5-10 題
- 每題都允許多選、跳過、沿用現況、請 AI 決定
- 若答案仍發散，轉 `idea-refine`
- 若答案已夠清楚，轉 `spec-driven-development`
