# Platform Prerequisite Doctor

目的：把 mobile / desktop profile 的原生依賴檢查，從口頭提醒變成 machine-readable doctor。

## 指令

看全部：

```bash
node scripts/platform_prerequisite_doctor.js
```

只看單一 profile：

```bash
node scripts/platform_prerequisite_doctor.js --profile tauri-desktop
node scripts/platform_prerequisite_doctor.js --profile capacitor-mobile-app
```

輸出 JSON：

```bash
node scripts/platform_prerequisite_doctor.js --json
```

## 規則來源

- `config/platform_prerequisites.json`

裡面定義：

- 要檢查哪些 CLI / toolchain
- 哪些是 required
- 哪些是 optional
- 最低 major version
- 對應官方文檔

## 目前覆蓋的 profile

- `react-native-expo`
- `capacitor-mobile-app`
- `flutter-app`
- `tauri-desktop`
- `electron-desktop`
- `ios-swiftui`
- `android-kotlin`

## 輸出語意

- `ready`：required 都過；optional 也都過
- `partial`：required 過，但 optional 有缺
- `not-ready`：required 有缺或版本不足

## 設計原則

1. 先檢查 toolchain，再宣稱 runnable
2. native prerequisite 跟 web scaffold 分開看
3. 只把官方文檔能支持的條件寫進規則
4. 不把「可能有用」的工具升成 required

## 例子

### Tauri

- required：
  - Node.js
  - Rust
  - Cargo
- optional：
  - Xcode Command Line Tools（macOS desktop）

### Capacitor

- required：
  - Node.js 22+
- optional：
  - Xcode / Xcode Command Line Tools
  - Android SDK Platform Tools
  - `sdkmanager`

這代表：

- web / PWA 路徑可先工作
- 要進 iOS / Android 時，doctor 會把 native 缺口打出來

### iOS SwiftUI

- required：
  - Xcode
  - Xcode Command Line Tools
  - `Xcode.app`
- optional：
  - `xcrun simctl`
  - CocoaPods

這代表：

- 先把官方 Xcode 建立流程與完整 app 裝好
- 若只是少 simulator tooling，狀態會是 `partial`

### Android Kotlin

- required：
  - JDK 17+
  - `adb`
  - `sdkmanager`
- optional：
  - `Android Studio.app`
  - `avdmanager`
  - `emulator`

這代表：

- SDK 管理與 platform tools 是最低可驗證基線
- Java runtime 若缺，`sdkmanager` / `avdmanager` 會是假安裝、真不可用
- 若 emulator 鏈不完整，doctor 會標成 `partial`，提醒還不能視為完整本機 Android 開發環境

## 相關文件

- `docs/project_config_generation.md`
- `docs/tech_stack_guide.md`
- `docs/platform_support_matrix.md`
- `docs/official_docs_and_github_research_policy.md`
