# Native App Bootstrap Runbook

這份文件只處理目前仍是 `plan-only` 的原生 profile。

原則：

- 不假裝有穩定 CLI scaffold。
- 優先跟官方 IDE / template 走。
- 建好官方骨架後，再回來套本 repo 治理層。

## ios-swiftui

目前基線：

- 官方入口：Xcode `File > New > Project`
- template：`iOS > App`
- UI：`SwiftUI`

建議流程：

1. 開 Xcode。
2. 選 `Create New Project`。
3. 在 template chooser 選 `iOS > App`。
4. Interface 選 `SwiftUI`。
5. Language 選 `Swift`。
6. 建完後先確認能在 simulator `Build and Run`。
7. 再把本 repo 治理層套進專案根目錄：
   - `node scripts/init_project_workspace.js . --name <projectName> --idea "<goal>" --force`
8. 若只要治理層設定，讀 `docs/project_config_generation.md`；原生 Xcode 專案本身先不要硬套 JS profile。

官方參考：

- Apple: Creating an Xcode project for an app
  - https://developer.apple.com/documentation/xcode/creating-an-xcode-project-for-an-app
- Apple: Building and running an app
  - https://developer.apple.com/documentation/xcode/building-and-running-an-app

## android-kotlin

目前基線：

- 官方入口：Android Studio `New Project`
- template：`Empty Activity`
- language：`Kotlin`
- UI：Jetpack Compose

建議流程：

1. 開 Android Studio。
2. 選 `New Project`。
3. 選 `Empty Activity`。
4. Language 選 `Kotlin`。
5. 建完後先在 emulator 或實機 `Run`。
6. 再把本 repo 治理層套進專案根目錄：
   - `node scripts/init_project_workspace.js . --name <projectName> --idea "<goal>" --force`
7. 若要補文件 / loop，照本 repo `.loop/*` 與 `docs/` 流程接上。

官方參考：

- Android Developers: Create a project
  - https://developer.android.com/studio/projects/create-project
- Android Developers: Build and run your app
  - https://developer.android.com/studio/run

## 何時升成 runnable

只有在以下條件都滿足時，才把 native profile 從 `plan-only` 升成 `full`：

1. 有穩定可重複的官方建立流程。
2. 本機 prerequisite doctor 能明確判斷 ready / partial / not-ready。
3. 至少做過一次真實 smoke。
4. 文件、測試、loop evidence 都補齊。
