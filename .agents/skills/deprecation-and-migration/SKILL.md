---
name: deprecation-and-migration
description: Manage removal of old code, APIs, and workflows with explicit migration planning and compatibility windows. Use when replacing legacy implementations, renaming interfaces, or sunsetting behavior users still depend on.
---

# deprecation-and-migration

舊東西不是資產，是持續成本。

## 流程

1. 盤點舊介面與使用點
2. 定義新舊相容策略
3. 安排 migration path
4. 留 warning、文件、截止點
5. 驗證切換完成後再刪

## 必寫

- 影響範圍
- 使用者或呼叫端要改什麼
- 回退策略
- 移除時機

## 規則

- 不做無公告硬切
- 不保留無人使用的舊碼太久
- 重大遷移寫進 `docs/ADRS.md`
