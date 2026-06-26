---
name: spec-driven-development
description: Write or update a structured spec before implementation.
---

# spec-driven-development

先寫 spec，再寫 code。

## 讀取順序

1. 讀 `docs/SPEC_FORMAT.md`
2. 讀 `docs/SPEC.md`
3. 若有舊程式，補看入口檔、設定、測試

## 必做

- 把需求寫進 `docs/SPEC.md`
- 補齊：`§G Goal`、`§C Constraints`、`§I Interfaces`、`§V Invariants`、`§T Tasks`、`§B Bugs`

## 規則

- 沒有 spec，不做大功能。
- 規格與現況矛盾時，先指出，不偷改行為。
- 若需求仍模糊，先退回 `idea-refine`。
- 若規格已成形，下一步進 `planning-and-task-breakdown`。
