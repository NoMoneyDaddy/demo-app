# Project Config Generation

這份文件定義本 repo 如何「引導並產生工程設定檔」。

目標不是取代官方 scaffold。
目標是讓 AI 在技術棧確認後，能快速把設定檔落地，而且不要亂猜。

## 原則

1. Greenfield 專案若還沒建立骨架，優先用官方 scaffold。
2. 已有 repo 或要補治理層時，再用本 repo 的設定檔產生器補齊。
3. `package.json` 允許合併；既有 repo 預設不強蓋。
4. `supabase/config.toml` 與 `next-env.d.ts` 這種「官方工具會自動產生」的檔案，不在 repo 內硬寫舊模板。

## 指令

先看計畫：

```bash
node scripts/generate_project_configs.js --profile nextjs-app-router --name my-app --language typescript --styling tailwind --database supabase --quality-tool biome
```

確認後寫入：

```bash
node scripts/generate_project_configs.js --profile nextjs-app-router --name my-app --language typescript --styling tailwind --database supabase --quality-tool biome --write
```

若平台不能跑 Node：

- 改照本文件手動產生
- 不要因腳本不可跑就中斷整體工作流
- 需要降級規則時，讀 `docs/script_fallback_matrix.md`

## 支援 profile

| Profile | 用途 | 可產生重點 |
| --- | --- | --- |
| `nextjs-app-router` | 全端 Web / SaaS / 內容網站 | `package.json`、TS 時 `tsconfig.json` + `next.config.ts`，JS 時 `next.config.js`、`postcss.config.mjs`、`.env.example`、`biome.json` |
| `vite-react` | SPA / dashboard / 前端站 | `package.json`、TS 時 `tsconfig.json` + `vite.config.ts`，JS 時 `vite.config.js`、`.env.example`、`biome.json` |
| `node-express-api` | API / webhook / backend service | `package.json`、TS 時 `tsconfig.json`、`.env.example`、`biome.json` |
| `react-native-expo` | mobile app | 補 `.env.example`、`.gitignore`、`docs/STACK_SETUP.md`，並可 merge quality / Supabase baseline |
| `capacitor-mobile-app` | web native mobile | 補 `.env.example`、`.gitignore`、`docs/STACK_SETUP.md`，並可 merge quality / Supabase baseline |
| `flutter-app` | Flutter | 補 `.env.example`、`.gitignore`、`docs/STACK_SETUP.md`，並提供 `dart-define` / runtime config 基線 |
| `tauri-desktop` | desktop app | 補 `.env.example`、`.gitignore`、`docs/STACK_SETUP.md`，並可 merge quality / Supabase baseline |
| `electron-desktop` | desktop app | 補 `main.js`、`index.html`、`.env.example`、`.gitignore`、`docs/STACK_SETUP.md`，並可 merge quality / Supabase baseline |

## 選項

- `--profile`
- `--name`
- `--target`
- `--language typescript|javascript`
- `--styling tailwind|none`
- `--database supabase|none`
- `--quality-tool biome|none`
- `--package-manager npm|pnpm|yarn|bun`
- `--write`
- `--force`

## 產生後要做什麼

1. 跑套件安裝
2. 讀 `docs/STACK_SETUP.md`
3. 補 source 入口檔
4. 跑驗證

## 官方基線

- Next.js：官方 `create-next-app` 與手動安裝頁
- Vite：官方 `create-vite`
- Tailwind CSS：Next.js / Vite 官方安裝頁
- Biome：官方 getting started / CLI
- Supabase：官方 `supabase-js` 安裝頁；本地 CLI 設定走 `supabase init`
- 腳本降級：`docs/script_fallback_matrix.md`
