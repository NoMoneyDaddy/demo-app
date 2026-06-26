---
name: context-engineering
description: Deliberately control what project context the agent reads, when it reads it, and how facts are persisted. Use at session start, on large repos, when token pressure is high, or when outputs start drifting.
---

# context-engineering

控制上下文，不要讓上下文控制你。

## 目標

- 少讀
- 讀準
- 把事實寫回檔案

## 做法

1. 先用 `rg`、`fd`、目錄樹縮小範圍
2. 只讀入口檔、設定、直接相關模組
3. 框架問題優先查官方文檔或 Context7
4. 把確認過的事實寫進：
   - `docs/SPEC.md`
   - `docs/STATE.md`
   - `docs/DEBUG_NOTES.md`

## 優先讀取

- `AGENTS.md`
- `docs/interactive_project_flow.md`
- `docs/agent_skill_catalog.md`
- 與目前 task 直接相關的 skill

## 規則

- 不整包讀大型 repo
- 不重貼長摘要到對話
- 不把猜測當成事實
- 上下文變髒或失焦時，重新收斂目前目標與範圍
