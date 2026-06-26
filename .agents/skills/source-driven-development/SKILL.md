---
name: source-driven-development
description: Base framework, library, API, and platform decisions on official documentation or Context7 rather than memory. Use whenever correctness depends on current behavior, versions, configuration, or platform constraints.
---

# source-driven-development

不靠記憶。靠來源。

## 流程

1. 先確認用到哪個 framework / library / platform
2. 查官方文檔或 Context7
3. 記下版本、限制、必要設定
4. 再決定實作方式
5. 若影響架構，寫進 `docs/ADRS.md`

## 需要查來源的情況

- API 介面
- 設定檔格式
- 部署流程
- 權限 / 安全模型
- SDK 新舊差異

## 輸出

- 實作前提
- 關鍵引用來源
- 需要的 config / env / migration

## 規則

- 社群文章只能當線索，不當最終依據
- 有官方範例時，先對齊官方範例
- 若來源彼此矛盾，採官方最新版本並標記假設
