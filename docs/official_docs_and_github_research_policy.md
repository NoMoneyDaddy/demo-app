# Official Docs And GitHub Research Policy

這份文件定義本 repo 在缺方向、缺框架知識、缺安裝細節時，怎麼查資料。

## 順序

1. 官方文檔
2. 官方教學 / architecture guide
3. 高品質 GitHub repo
4. 其他社群內容

## 官方優先規則

- 框架 API、安裝、版本、CLI、升級：先查官方文檔
- platform prerequisites：先查官方文檔
- store / signing / simulator / build：先查官方文檔

## GitHub 何時加入

- 官方文檔沒有完整 workflow
- 需要看大型專案怎麼實際組織
- 需要看 runbook / checklist / skill runtime / monorepo 結構
- 需要對比多個同類專案的優缺點

## 跨環境 lane

### Web

- `nextjs.org`
- `vite.dev`
- `react.dev`
- `tailwindcss.com`

### Mobile

- `docs.expo.dev`
- `reactnative.dev`
- `capacitorjs.com`
- `docs.flutter.dev`
- `developer.android.com`
- `developer.apple.com`

### Desktop

- `v2.tauri.app`
- `electronjs.org`
- `developer.apple.com/xcode`

## 機器可讀來源

- `config/official_doc_sources.json`

## 導入規則

- 若 repo 還沒 profile，不假裝已 fully supported
- 若只有官方 scaffold 與 docs 路徑，標註為 `plan-only`
- 有 config generation、smoke、tests、runbook 之後，才升到更高支援等級
