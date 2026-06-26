# 專案架構最佳實踐

這份文件定義 Loop Engineering 產出 app 或網站時的預設架構要求。
目標不是追求最複雜，而是追求：

- 易維護
- 易測試
- 易替換
- 易讓 AI 連續多輪修改而不崩

## 核心原則

1. 先定邊界，再寫功能。
2. UI、業務邏輯、資料存取分離。
3. 所有外部輸入都先驗證。
4. 共用能力集中，避免散落在頁面與路由內。
5. 以 feature 為主，避免只靠檔案類型平鋪。
6. 可移植自動化優先於平台綁定自動化。

## 腳本與自動化分層

- 主要流程邏輯優先放 `scripts/*.js`
- `.sh` 只做環境相關包裝：
  - sandbox 工具安裝
  - shell 導向匯出
  - 需要 package manager 的工作
- 每支腳本都要有文件化 fallback
- 不要把唯一真相藏在 shell script

對應檔案：

- `config/script_capabilities.json`
- `docs/script_fallback_matrix.md`
- `docs/session_loop_contract.md`

## Web App 預設架構

適用：Next.js、React、全端 Web app、SaaS、dashboard

```text
src/
  app/
    (marketing)/
    (app)/
    api/
  features/
    auth/
      components/
      schemas/
      services/
      server/
    billing/
    projects/
  components/
    ui/
    shared/
  lib/
    env/
    http/
    db/
    errors/
    logger/
  server/
    services/
    repositories/
    db/
  styles/
  types/
```

### 規則

- `app/` 只放 route、layout、page、loading、error、route handler。
- `features/` 放 feature 內聚邏輯。
- `server/services/` 放跨 feature 業務流程。
- `server/repositories/` 封裝資料庫查詢。
- `lib/` 只放基礎設施，不放產品業務規則。

## Next.js 最佳實踐

根據 Next.js 官方文件：

- App Router 以 `app/` 或 `src/app/` 定義路由。
- route handler 應放在 `app/**/route.ts`。
- route segment 可 colocate 檔案，但沒有 `page.tsx` 或 `route.ts` 不會公開成路由。

因此本框架預設：

1. 優先使用 `src/app/`。
2. 預設用 Server Components。
3. 只有需要互動時才加 `'use client'`。
4. API 走 `app/**/route.ts`，不要同時混用老的 `pages/api`。
5. 頁面不得直接寫 SQL、Prisma 查詢或第三方 SDK 呼叫。

## API / Backend 預設架構

適用：Express、Fastify、NestJS、FastAPI

```text
src/
  modules/
    auth/
      routes/
      controller.ts
      service.ts
      repository.ts
      schema.ts
    tasks/
  shared/
    env/
    errors/
    middleware/
    utils/
  db/
    client.ts
    migrations/
```

### 規則

- `routes/` 只做路由綁定與 middleware 組裝。
- `controller` 處理 request/response 映射。
- `service` 放業務規則。
- `repository` 封裝持久層。
- `schema` 或 `dto` 負責輸入驗證。

## FastAPI 最佳實踐

根據 FastAPI 官方文件：

- 較大的應用應拆成多檔。
- 用 `APIRouter` 分組 path operations。

因此本框架預設：

```text
app/
  main.py
  api/
    routes/
      auth.py
      tasks.py
  services/
  repositories/
  schemas/
  core/
```

- `main.py` 只做 app 組裝。
- 路由拆到 `api/routes/`。
- 業務邏輯不寫在 route function 內。

## Database / ORM 最佳實踐

### Prisma

根據 Prisma 官方文件：

- 建立集中式 Prisma Client。
- schema、migration、client 使用方式要一致。
- 在 Next.js 開發環境避免重複建立 client。

因此本框架預設：

```text
prisma/
  schema.prisma
src/
  lib/
    db/
      prisma.ts
```

- Prisma Client 只能從 `lib/db/prisma.ts` 匯出。
- repository 以注入或集中 import 方式使用 client。
- 不在 component 或 route handler 直接散落建立 client。

## Frontend 元件邊界

- `components/ui/`：純展示、可重用
- `components/shared/`：共用殼層元件
- `features/*/components/`：特定功能元件
- `features/*/hooks/`：功能相關 hooks
- `features/*/schemas/`：Zod schema

## 狀態與資料流

- server data 優先在 server 端取
- client state 只管互動狀態
- form 驗證前後端共用同一份 schema
- 非同步流程要有 loading、error、empty state

## 禁止事項

- page / route 直接連資料庫
- component 內寫商業規則
- 多個 feature 共用一個超大 `utils.ts`
- 未驗證外部輸入就進 service
- 把秘密寫死在程式內

## 生成專案前，代理必須先產出

1. 目錄草圖
2. 分層說明
3. 驗證策略
4. 錯誤處理策略
5. 部署所需環境變數表

## 官方參考

- Next.js Project Structure: https://nextjs.org/docs/app/getting-started/project-structure
- Next.js Route Handlers: https://nextjs.org/docs/app/getting-started/route-handlers
- Next.js `src` folder: https://nextjs.org/docs/app/api-reference/file-conventions/src-folder
- FastAPI Bigger Applications: https://fastapi.tiangolo.com/tutorial/bigger-applications/
- Prisma Best Practices: https://www.prisma.io/docs/orm/more/best-practices
- Prisma with Next.js: https://www.prisma.io/docs/orm/more/troubleshooting/nextjs
