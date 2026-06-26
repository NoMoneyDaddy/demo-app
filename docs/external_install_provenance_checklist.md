# External Install Provenance Checklist

本文件定義引入外部 skill、CLI、MCP、browser extension、installer command 前，最低限度該確認什麼。

## 適用範圍

- 第三方 skill
- 第三方 plugin / marketplace 項目
- `npm` / `pnpm` / `yarn` / `pip` / `uv` / `cargo` / `brew` 安裝指令
- `curl | sh`、遠端 shell、下載 binary
- MCP server、browser extension、桌面整合

## Trusted Source Order

1. 官方文件
2. 官方 package registry
3. 官方 GitHub repo
4. 已驗證 maintainer 發佈頁
5. repo 內既有 `scripts/`、`config/`、`.agents/skills/` 只作為輔助參考

若來源掉到第 5 層以下，預設視為高風險。

## 必查清單

### 1. 身分

- 專案名稱是否一致
- maintainer / org 是否可辨識
- 官方文件、registry、repo 是否互相對得上

### 2. 授權

- 是否有明確 license
- license 是否允許本 repo 使用情境
- 若無 license，不得直接內嵌或重散佈

### 3. 發佈面

- 是否有官方 package registry 頁面
- 是否有 release / tag / version
- 是否有安裝與升級說明

### 4. 安裝指令

- 是否為可讀、可解釋指令
- 是否會修改全域環境
- 是否需要 root / sudo / shell profile 變更
- 是否會啟動 daemon / background service

### 5. 秘密資料

- 是否需要 token / cookie / API key
- secret 是否只進環境變數
- 是否會把 secret 寫進 repo、shell history、設定檔

### 6. 驗證

至少要有一項：

- `command -v TOOL`
- `TOOL --version`
- `node scripts/inspect_agent_capabilities.js`
- 任務最小 smoke test

## 高風險紅旗

任一成立就不能靜默安裝：

- `curl | sh`
- 來源不明 binary
- 無 license
- 無版本
- 要求貼上 token 到 repo 檔案
- 要求改系統權限或登入態
- 文件與實際安裝來源對不起來

## 記錄格式

至少在 `docs/STATE.md`、`docs/DEBUG_NOTES.md`、`.loop/EVIDENCE.md` 之一留下：

- 來源 URL
- 版本 / tag / commit
- 授權
- 驗證命令
- 結果

## 最小結論模板

```text
Tool / Skill:
Source:
Version / Tag:
License:
Install Path:
Needs Human Gate: yes/no
Verification:
Result:
```
