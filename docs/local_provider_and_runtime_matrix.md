# Local Provider And Runtime Matrix

目標：

- 讓 agent 自己知道該接哪種模型 / runtime
- 區分 local、docker、remote server、cloud API
- 避免「裝了 provider 但其實連不到」

## Provider 類型

| 類型 | 例子 | 優點 | 風險 |
| --- | --- | --- | --- |
| local native | Ollama、LM Studio、openjdk + Android SDK 等本機工具 | 隱私高、可離線、可控 | 吃硬體、PATH / host bind 常出錯 |
| local via docker | searxng、redis、browser sandbox | 部署整齊、可複製 | host / container 網路與 port 易混 |
| self-hosted remote | 自架 LLM server、內網 runner | 成本可控、集中管理 | 連線、認證、延遲 |
| cloud api | OpenAI、Anthropic、Google、OpenRouter | 啟動快 | 成本、憑證、資料外流風險 |

## 建議選擇順序

1. 能 local 就 local
2. local 不夠再 remote self-hosted
3. 最後才 cloud API

## Runtime 模式

| 模式 | 典型用途 | 本 repo 需要什麼 |
| --- | --- | --- |
| repo-only governance | 只做規劃 / 文檔 / 代碼整理 | `.loop/*`、skills、docs、scripts |
| local builder | 本機直接實作與驗證 | Node、package manager、doctor、tooling |
| sandbox runner | 隔離 browser / shell / file 操作 | sandbox tool guide、runtime topology、event stream |
| remote executor | 長任務、背景任務、重運算 | session/task schema、lease、audit |

## 常見錯誤

### Host / Docker 網路

- host 要給 container 連，不要只綁 `127.0.0.1`
- container 內不要把 service URL 寫成 `localhost`，要看是否應改成 service name

### Java / Android CLI

- 只裝 `sdkmanager` 不代表可用
- 少 `JAVA_HOME` 時，會出現「命令存在但實際不可跑」

### Browser automation

- Chrome / ChromeDriver 版本不合
- sandbox 內 browser binary 不存在

## 最低交付基線

若要達成「一句想法即交付」，至少要有：

- 一個可用 LLM provider
- 一條可用 shell 路徑
- 一條可用 browser 或 web-search 路徑
- 一條可用驗證路徑
- 一份可回寫的 session/task 狀態

## 參考來源

- `FoundationAgents/OpenManus`
- `Simpleyyt/ai-manus`
- `Fosowl/agenticSeek`
