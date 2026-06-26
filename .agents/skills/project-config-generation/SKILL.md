---
name: project-config-generation
description: Generate or align project configuration files after the stack has been confirmed. Use when a new project or legacy repo needs package.json, tsconfig, framework config, env examples, or quality config aligned to the chosen stack.
---

# project-config-generation

這個 skill 用在「技術棧已確認，但工程設定檔還沒落地」的時候。

## 先讀

1. `AGENTS.md`
2. `docs/tech_stack_guide.md`
3. `docs/project_config_generation.md`
4. `docs/biome_quality_loop.md`（若是 JS / TS + Biome）

## 目標

- 讓 AI 不要臨場亂猜 `package.json`、`tsconfig.json`、`vite.config.ts`、`next.config.ts`、`.env.example`
- 讓設定檔先落地，再進實作
- 盡量跟官方 scaffold / 官方安裝頁對齊

## 使用方式

先看計畫，不要直接覆寫：

```bash
node scripts/generate_project_configs.js --profile <profile> --name <projectName> --language <lang> --styling <style> --database <db> --quality-tool <tool>
```

確認後再寫入：

```bash
node scripts/generate_project_configs.js --profile <profile> --name <projectName> --language <lang> --styling <style> --database <db> --quality-tool <tool> --write
```

## 目前支援 profile

- `nextjs-app-router`
- `vite-react`
- `node-express-api`

## 規則

- Greenfield 若還沒建骨架，優先採官方 scaffold，再用本腳本補治理層與設定對齊
- `package.json` 若已存在，預設只補缺漏，不亂蓋既有值
- `supabase/config.toml` 不手寫；若要本地 Supabase，走官方 `supabase init`
- `next-env.d.ts` 不手寫；讓 `next dev` 或 `next build` 自動生成
- 產完後要看 `docs/STACK_SETUP.md`

## 驗證

- 確認目標檔已建立或合併
- 確認 `.env.example` 已對應技術棧
- 若有 Biome，跑：

```bash
npx @biomejs/biome check --write .
```
