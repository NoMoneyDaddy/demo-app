# Zeabur 完整部署指南（基於官方文檔）

Zeabur 是一個現代化的 PaaS 平台，讓開發者可以將前端、後端、資料庫等多個服務部署在同一個「專案」中，服務間透過私有網路自動互連，無需手動配置連線字串。本指南涵蓋所有部署方式，以及與 AI 工具的深度整合。

---

## 核心概念：專案與服務

在 Zeabur 上，所有服務都存放在「**專案 (Project)**」中。一個專案可以包含：

- 前端服務（Next.js、React、Vue 等）
- 後端服務（Node.js、Python、Go 等）
- 資料庫服務（PostgreSQL、MySQL、MongoDB、Redis）
- 其他服務（Nginx、n8n、自訂 Docker 映像等）

**同一專案內的服務可透過私有網路互相通訊，且 Zeabur 會自動注入資料庫連線變數到其他服務中。**

---

## 部署方式一覽

| 方式 | 適用情境 | 操作難度 |
| :--- | :--- | :--- |
| **GitHub 整合** | 最常見，push 即自動部署 | ⭐ 最簡單 |
| **模板** | 一鍵部署開源應用（WordPress、n8n 等） | ⭐ 最簡單 |
| **本機專案上傳** | 直接拖放資料夾，無需 Git | ⭐⭐ 簡單 |
| **Dockerfile** | 自訂建置流程 | ⭐⭐⭐ 中等 |
| **Docker Image** | 使用現有映像檔 | ⭐⭐⭐ 中等 |
| **CLI** | 終端部署，適合 CI/CD | ⭐⭐⭐ 中等 |
| **Chrome 擴充功能** | 從瀏覽器快速部署 | ⭐⭐ 簡單 |
| **Cursor 擴充功能** | 直接從 Cursor IDE 部署 | ⭐⭐ 簡單 |
| **Upload API** | 上傳 ZIP 自動部署 | ⭐⭐⭐ 中等 |

---

## 標準部署流程（GitHub 整合）

### 步驟 1：建立專案

1. 前往 [Zeabur Dashboard](https://zeabur.com/projects)
2. 點擊 **Create Project**（或按 `CMD+K` → 選擇 Create Project）
3. 選擇伺服器區域（建議選擇離用戶最近的區域）

### 步驟 2：部署應用服務

1. 在空專案中點擊 **部署新服務**
2. 選擇 **GitHub**
3. 連接 GitHub 帳號（首次需安裝 Zeabur GitHub App）
4. 搜尋並選擇你的倉庫
5. Zeabur 自動偵測技術棧並開始部署

### 步驟 3：新增資料庫服務（一站式）

1. 在同一專案中再次點擊 **部署新服務**
2. 選擇 **資料庫**
3. 選擇所需資料庫（PostgreSQL / MySQL / MongoDB / Redis）
4. 資料庫立即部署，**Zeabur 自動將連線變數注入到同專案的應用服務中**

自動注入的環境變數範例（PostgreSQL）：
```
POSTGRES_HOST=...
POSTGRES_PORT=5432
POSTGRES_USER=...
POSTGRES_PASSWORD=...
POSTGRES_DB=...
DATABASE_URL=postgresql://user:password@host:5432/db
```

### 步驟 4：設定環境變數

1. 點擊應用服務 → **環境變數** 頁面
2. 新增所需的 API Key（如 OpenAI、Stripe 等）
3. 支援變數引用語法：`${OTHER_VAR}` 可引用其他服務的變數

### 步驟 5：綁定網域

1. 點擊應用服務 → **網域** 頁面
2. 點擊 **生成網域** 獲得免費的 `.zeabur.app` 子網域
3. 或綁定自訂網域，Zeabur 自動配置 SSL 憑證

---

## 觸發重新部署的方式

- **GitHub Push**：對綁定分支的每次 push 自動觸發
- **手動觸發**：Dashboard 中點擊「重新部署」
- **Watch Paths**：可設定只有特定路徑變更時才觸發（節省資源）

---

## AI 驅動部署：三種方式

### 方式 1：Zeabur MCP（Claude Desktop / Cursor / 其他支援 MCP 的代理環境）

安裝 `@zeabur/mcp-server` 後，可用自然語言操作 Zeabur：

```json
{
  "mcpServers": {
    "zeabur": {
      "command": "npx",
      "args": ["-y", "@zeabur/mcp-server"],
      "env": { "ZEABUR_TOKEN": "sk-xxxxxx" }
    }
  }
}
```

**自然語言指令範例：**
- `請在 Zeabur 建立一個新專案並部署這個 GitHub 倉庫`
- `幫我的服務新增一個 PostgreSQL 資料庫`
- `設定 OPENAI_API_KEY 環境變數`
- `幫我綁定 myapp.zeabur.app 網域`
- `顯示最近的部署日誌`

### 方式 2：Zeabur Claude Code Skills（Claude Code 環境）

Zeabur 官方提供 Claude Code 外掛，支援更豐富的操作：

```bash
# 安裝
claude plugin marketplace add zeabur/agent-skills
claude plugin install zeabur@zeabur
```

**支援的 Skills：**

| Skill | 功能 |
| :--- | :--- |
| 租用 VPS | 瀏覽並租用 AWS、Hetzner 等伺服器 |
| 部署服務 | 自動偵測框架並部署 |
| 啟用 AI 模型 | 接入 GPT-4o、Claude、Gemini |
| 設定 Email | 自動配置 SMTP |
| 設定環境變數 | 建立、更新、跨服務連結 |
| 管理資料庫 | 部署、查詢、填入測試資料、遷移 |
| 綁定網域 | 自動設定 SSL |
| 除錯與排障 | 讀取日誌、診斷 500 錯誤 |

### 方式 3：Cursor 擴充功能

直接在 Cursor IDE 中安裝 Zeabur 擴充功能，寫完代碼直接在編輯器內部署，無需切換視窗。

---

## 本機專案直接上傳（無需 Git）

如果不想使用 Git，可以直接上傳專案資料夾：

1. 在 Zeabur 中新增服務 → **本機專案**
2. 拖放專案資料夾（注意：`/dist/*` 目錄會被自動忽略）
3. Zeabur 自動分析並部署

---

## 常見問題

**Q: 資料庫連線字串在哪裡找？**
A: 在 Zeabur 專案中新增資料庫服務後，連線變數會自動注入到同專案的其他服務，無需手動複製。

**Q: 如何讓前後端服務互相通訊？**
A: 同一專案內的服務透過私有網路自動互連。使用 `${SERVICE_NAME}_HOST` 變數引用其他服務的主機名稱。

**Q: 支援哪些程式語言？**
A: Node.js（Next.js、NestJS、Express 等）、Python（Django、Flask）、Go、Java（Spring Boot）、PHP（Laravel）、Rust、Dart（Flutter）、.NET 等。

**Q: 免費方案有什麼限制？**
A: 免費方案可以部署服務，但有資源限制。建議查閱 [Zeabur 定價頁面](https://zeabur.com/pricing) 了解最新方案。

---

## 參考資源

- [Zeabur 官方文檔](https://zeabur.com/docs/zh-TW)
- [Zeabur Dashboard](https://zeabur.com/projects)
- [Zeabur 模板市場](https://zeabur.com/zh-TW/templates)
- [Zeabur MCP 文檔](https://zeabur.com/docs/zh-TW/mcp)
- [Zeabur Claude Code Skills](https://zeabur.com/docs/zh-TW/developer/claude-code-skills)
- [Zeabur GitHub](https://github.com/zeabur)
