# Scaffold Project

這支腳本負責用**官方 scaffold** 先建立骨架，再套本 repo 的治理層。

## 指令

先看計畫：

```bash
node scripts/scaffold_project.js ../my-app --profile nextjs-app-router --language typescript --styling tailwind --database supabase --quality-tool biome
```

真的執行：

```bash
node scripts/scaffold_project.js ../my-app --profile nextjs-app-router --language typescript --styling tailwind --database supabase --quality-tool biome --run
```

Flutter 若只想建特定平台：

```bash
node scripts/scaffold_project.js ../my-flutter-app --profile flutter-app --database supabase --platforms android,web --run
```

若平台不能跑 `shell` 或 `network`：

- 不要硬跑
- 只輸出官方 scaffold 指令
- 後續改讀 `docs/script_fallback_matrix.md`

## 目前支援

| Profile | 官方 baseline |
| --- | --- |
| `nextjs-app-router` | `create-next-app` |
| `vite-react` | `create-vite` |
| `node-express-api` | `npm init -y` |
| `react-native-expo` | `create-expo-app` |
| `capacitor-mobile-app` | `@capacitor/create-app` |
| `flutter-app` | `flutter create` |
| `tauri-desktop` | `create-tauri-app` |
| `electron-desktop` | Electron 官方 first app baseline |
| `ios-swiftui` | Xcode `iOS > App`，細節見 `docs/native_app_bootstrap_runbook.md#ios-swiftui` |
| `android-kotlin` | Android Studio `Empty Activity`，細節見 `docs/native_app_bootstrap_runbook.md#android-kotlin` |

## 內部流程

1. 先跑官方 scaffold
2. `--run` 前先跑 prerequisite doctor gate
3. 再跑 `scripts/init_project_workspace.js`
4. 再跑 `scripts/generate_project_configs.js --write`

## 為什麼這樣拆

- 官方 scaffold 負責最新骨架
- 本 repo 負責治理層、loop、skills、補充設定檔
- 避免自己手寫過時的框架骨架
- 原生 iOS / Android 若仍是 `plan-only`，先走官方 IDE runbook，再接治理層

## 相關文件

- `docs/project_config_generation.md`
- `docs/native_app_bootstrap_runbook.md`
- `docs/session_loop_contract.md`
- `docs/project_architecture_best_practices.md`
- `docs/script_fallback_matrix.md`
