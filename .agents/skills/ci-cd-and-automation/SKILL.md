---
name: ci-cd-and-automation
description: Define repeatable automated quality gates for build, test, lint, deployment, and release workflows. Use when creating or changing CI pipelines, release automation, or environment promotion rules.
---

# ci-cd-and-automation

把流程交給機器，別交給運氣。

## 必做

- build
- test
- lint / typecheck
- 秘密資料管理
- 失敗即中止

若是 JS / TS 專案且使用 Biome，加入：

- `npx @biomejs/biome ci .`

## 設計原則

- 本地可重現
- preview 與 production 分離
- pipeline 輸出要可讀
- 快取有用才加

## 規則

- 不把手動步驟藏在腦中
- 不讓 production 依賴未驗證 artifact
- 變更 pipeline 時，要一起更新文件
- 先在本地確認 Biome / test / build 跑得動，再搬進 CI
