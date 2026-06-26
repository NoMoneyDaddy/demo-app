# Environment Variable Configuration Loop

這份文件定義本 repo 怎麼協助配置環境變數、設定檔與 `.env*` 類檔案。

## 原則

- secret 不進 repo
- 範例值進 `.env.example` 或 config template
- 先官方文檔，再決定變數命名與用途
- 變數要分清楚：
  - public / client-safe
  - server-only
  - build-time
  - runtime

## 基本流程

1. 先查官方文檔
2. 確認變數分類
3. 回寫 `.env.example`
4. 回寫 `docs/STACK_SETUP.md` 或相關 setup 文檔
5. 若是平台特殊變數，再補 runbook

## 跨環境注意事項

### Web

- Next.js：`NEXT_PUBLIC_*` 只給 client-safe 值
- Vite：`VITE_*` 只給 client-safe 值

### Mobile

- Expo / React Native：避免把真正 secret 直接打包進 client
- Capacitor：區分 web env 與 native-side config
- Flutter：區分 compile-time define 與 runtime config

### Desktop

- Tauri / Electron：區分 renderer 可見與 main process 可見
- 原生憑證、簽章、更新 URL 要額外做 runbook

## 驗證

- `.env.example` 是否存在
- README / STACK_SETUP 是否有對應說明
- 變數命名是否符合官方慣例
- 沒有真正 secret 被寫入 repo

## 相關文件

- `config/env_templates.json`
- `docs/project_config_generation.md`
- `docs/official_docs_and_github_research_policy.md`
