# 技術棧對比與選擇指南

這份文件分兩層：

- 已自動化支援：repo 目前可直接用 scaffold / config generation 落地
- 一般技術選型參考：可作為討論候選，但不代表 repo 已有自動化 profile

## 目前已自動化支援的 profile

| Profile | 類型 | 官方 scaffold | 設定檔產生 |
| --- | --- | --- | --- |
| `nextjs-app-router` | 全端 web app / landing page | `create-next-app` | 有 |
| `vite-react` | SPA / dashboard / 前端站 | `create-vite` | 有 |
| `node-express-api` | API service | `npm init -y` | 有 |
| `react-native-expo` | 跨平台 mobile app | `create-expo-app` | 有 |
| `capacitor-mobile-app` | Web Native mobile app | `@capacitor/create-app` | 有 |
| `flutter-app` | Flutter mobile app | `flutter create` | 有 |
| `tauri-desktop` | 輕量 desktop app | `create-tauri-app` | 有 |
| `electron-desktop` | Electron desktop app | 官方 first app tutorial | 有 |
| `ios-swiftui` | iOS native | Xcode new project | 規劃中 / plan-only，先看 `docs/native_app_bootstrap_runbook.md` |
| `android-kotlin` | Android native | Android Studio new project | 規劃中 / plan-only，先看 `docs/native_app_bootstrap_runbook.md` |

若超出上表：

- 可以做
- 但要視為「人工擴充」或「後續新增 profile」
- 不要假裝目前 repo 已自動化支援

## 1. 前端框架 (Frontend Frameworks)

| 框架 | 優點 | 缺點 | 適用場景 |
| :--- | :--- | :--- | :--- |
| **Next.js (App Router)** | SEO 友好、伺服器渲染 (SSR)、內建路由、Route Handlers、生態系強大 | 學習曲線較陡 | 商業級 Web 應用、電商、部落格、SaaS 平台 |
| **React (Vite)** | 輕量、啟動極快、高度靈活、社群龐大 | 需自行配置路由與狀態管理、SEO 較弱 | 單頁應用 (SPA)、內部管理系統、數據儀表板 |
| **Vue.js (Vite)** | 易學易用、雙向綁定、漸進式框架 | 目前本 repo 尚未提供對應 profile | 需手動擴充時可評估 |
| **React Native + Expo** | 單一 JS/TS codebase 跑 iOS / Android / web | 已可走 repo scaffold / config overlay | 需要 mobile-first 時優先評估 |
| **Flutter** | 真多平台、效能好、UI 一致性高 | 已可走 repo scaffold / config overlay | 重視多平台一致性時可評估 |

**AI 推薦策略**：對於大多數商業級專案，強烈推薦 **Next.js App Router**，並採用 `src/app` + `features` + `lib` 的分層結構。

## 2. UI 組件庫 (UI Libraries)

| 組件庫 | 優點 | 缺點 | 適用場景 |
| :--- | :--- | :--- | :--- |
| **shadcn/ui** | 極高客製化、程式碼歸您所有、基於 Tailwind CSS、現代感設計 | 需自行維護程式碼、初次配置稍繁瑣 | 需要高度客製化設計的商業級應用 |
| **MUI (Material-UI)** | 組件豐富、成熟穩定、企業級支援 | 體積較大、客製化較困難、設計風格較為傳統 | 內部管理系統、需要快速搭建的後台 |
| **Chakra UI** | 易於使用、無障礙支援好、開發體驗佳 | 運行時效能開銷較大 | 中小型專案、重視無障礙設計的應用 |

**AI 推薦策略**：推薦使用 **shadcn/ui + Tailwind CSS**，這是目前最現代且靈活的組合，AI 也能很好地生成相關程式碼。

## 3. 後端架構 (Backend Architecture)

| 架構 | 優點 | 缺點 | 適用場景 |
| :--- | :--- | :--- | :--- |
| **Next.js Route Handlers** | 無需獨立後端、全端同構、部署簡單 | 不適合長時間運行的任務、架構耦合度高 | 中小型 SaaS、CRUD 應用、快速原型 |
| **Node.js (Express/NestJS)** | 生態系龐大、適合微服務、效能穩定 | 需獨立部署、配置較繁瑣 | 大型複雜應用、高併發系統、需要獨立 API 服務 |
| **Python (FastAPI/Django)** | 適合 AI/數據處理、開發效率高 | 目前本 repo 尚未提供對應 profile | 需手動擴充時可評估 |
| **Capacitor** | 用 Web 技術包成 iOS / Android app，與前端 stack 很順 | 已可走 repo scaffold / config overlay | 已有 Web app 想快速上 mobile 時適合 |

**AI 推薦策略**：若要直接利用本 repo 目前自動化能力，優先考慮 `Next.js`、`Vite React`、`Node + Express API`。若有複雜 AI / 數據需求，`FastAPI` 仍可作為候選，但目前要手動擴充 profile。

## 4. 資料庫與 ORM (Database & ORM)

| 資料庫/ORM | 優點 | 缺點 | 適用場景 |
| :--- | :--- | :--- | :--- |
| **PostgreSQL + Prisma** | 關聯式資料庫強大、Prisma 提供完美的型別安全、開發體驗極佳 | 關聯複雜時查詢效能可能受影響 | 大多數商業應用、需要嚴格資料一致性的系統 |
| **MongoDB + Mongoose** | Schema 靈活、適合快速迭代、水平擴展容易 | 不適合複雜的關聯查詢、無事務支援 (早期版本) | 內容管理系統、物聯網數據、快速原型 |
| **Supabase / Firebase** | BaaS 服務、內建認證與 API、開發極快 | 供應商鎖定、進階客製化受限 | 獨立開發者、MVP、需要快速上線的專案 |

**AI 推薦策略**：**PostgreSQL + Prisma** 是黃金組合，Zeabur 原生支援 PostgreSQL，部署極為順暢。

## 5. 部署平台 (Deployment Platforms)

| 平台 | 優點 | 缺點 | 適用場景 |
| :--- | :--- | :--- | :--- |
| **Zeabur** | 可在同平台部署應用與資料庫、支援 Docker、GitHub 整合 | 生態系較新、邊緣運算支援較弱 | 全棧應用、需要資料庫的專案、微服務架構 |
| **Vercel** | 前端與 Serverless 體驗極佳、Next.js 官方平台 | 資料庫需額外配置、定價較高 | 純前端應用、靜態網站、Next.js 專案 |
| **Render** | 支援多語言、PostgreSQL 整合好 | 免費層有休眠機制、構建速度較慢 | 後端服務、全棧應用 |

**AI 推薦策略**：若專案希望簡化部署與資料庫管理，`Zeabur` 是可優先評估的選項之一；最終仍應依需求、成本與平台限制決定。

## 6. Mobile / Desktop 路線

| 路線 | 優點 | 目前 repo 狀態 |
| :--- | :--- | :--- |
| **React Native + Expo** | iOS / Android / web 共用 JS/TS codebase，官方 scaffold 清楚 | `full` |
| **Capacitor** | Web app 轉 iOS / Android 成本低，可保留現有前端 stack | `full` |
| **Flutter** | 多平台一致性強，UI toolkit 完整 | `full` |
| **Tauri** | desktop 體積小、速度快，還能延伸到 mobile | `full` |
| **Electron** | 生態成熟、桌面整合多 | `full` |
| **SwiftUI / Android Kotlin** | 原生能力最完整 | `plan-only` |

---

## 使用規則

- 先看 `config/project_config_profiles.json`
- 若在已自動化支援範圍內，優先走 `scripts/scaffold_project.js` 與 `scripts/generate_project_configs.js`
- 若超出範圍，文件可以建議，但要明講「需手動擴充」
- `full` 代表：可直接走 `scripts/scaffold_project.js --run`，再套治理層與設定檔。
- `plan-only` 代表：官方文檔與 scaffold 路徑已整理，但 config generation / smoke / tests / runbook 還沒補齊

## 如何在 Prompt 中指定技術棧？

在與 AI 互動時，您可以明確指定技術棧，或讓 AI 根據您的需求推薦。

**明確指定範例**：
> 「我想要一個任務管理系統，請使用 React (Vite) + Tailwind CSS + Supabase，並部署到 Vercel。」

**讓 AI 推薦範例**：
> 「我想要一個 AI 圖片生成平台，需要處理大量圖片和使用者認證。請推薦最適合的技術棧，並說明理由。」
