# Sandbox Tooling Guide

## 結論

新 sandbox、GitHub Codespaces、遠端 agent session 先做這三步：

1. `bash scripts/setup_sandbox_tools.sh --doctor`
2. `bash scripts/setup_sandbox_tools.sh --install-core`
3. 需要 repo 搜尋或真實瀏覽器驗證時，再跑 `bash scripts/setup_sandbox_tools.sh --install-ai`

若只想先看完整建議清單，再補跑：

`bash scripts/setup_sandbox_tools.sh --plan`

## 必裝 Core

| Tool | 用途 | macOS | Debian / Ubuntu sandbox |
| --- | --- | --- | --- |
| `ripgrep` / `rg` | 全文搜尋 | `brew install ripgrep` | `sudo apt-get install -y ripgrep` |
| `fd` | 找檔案 / 目錄 | `brew install fd` | `sudo apt-get install -y fd-find` |
| `fzf` | 模糊搜尋 | `brew install fzf` | `sudo apt-get install -y fzf` |
| `zoxide` | 智慧跳目錄 | `brew install zoxide` | `sudo apt-get install -y zoxide` |
| `bat` | 語法高亮看檔案 | `brew install bat` | `sudo apt-get install -y bat` |
| `jq` | JSON 處理 | `brew install jq` | `sudo apt-get install -y jq` |
| `hyperfine` | 基準測試 | `brew install hyperfine` | `sudo apt-get install -y hyperfine` |
| `delta` | Git diff 強化 | `brew install git-delta` | `cargo install git-delta` |

## AI / Browser 補強

| Tool | 何時用 | 安裝 |
| --- | --- | --- |
| `semble` | 大型 repo、跨多資料夾任務、remote / sandbox token 很緊時 | `uv tool install semble && semble install` |
| `mcp-cli` | 要在 shell 低 token 探查 / 搜尋 / 呼叫 MCP tools 時 | `npm install -g @willh/mcp-cli` |
| `playwright-cli` | 要產生或維護正式 E2E、錄製、截圖、selector 檢查時 | `npm install -g @playwright/cli@latest && playwright-cli install --skills` |
| `agent-browser` | 要做快速 smoke test、視覺驗證、互動檢查時 | `npm install -g agent-browser && agent-browser install` |

## JS / TS 品質自動化

若目標專案是 JavaScript / TypeScript，建議在專案內加入 Biome：

```bash
npm install --save-dev --save-exact @biomejs/biome
npx @biomejs/biome init
```

常用命令：

```bash
npx @biomejs/biome format --write ./src
npx @biomejs/biome lint --write ./src
npx @biomejs/biome check --write ./src
npx @biomejs/biome ci .
```

建議用法：

- 每個實作切片後：`check --write`
- 只想改格式：`format --write`
- 只想套安全 lint 修正：`lint --write`
- CI / merge gate：`ci .`

## GitHub / Sandbox 注意事項

- GitHub Codespaces、Linux 容器常見是 `apt-get` 路線。
- Debian / Ubuntu 常把 binary 名稱改成 `fdfind` 與 `batcat`；可加 alias：
  - `alias fd='fdfind'`
  - `alias bat='batcat'`
- `playwright-cli`、`agent-browser`、`mcp-cli` 依賴 `npm`；`semble` 依賴 `uv`。
- 要在 CI / sandbox 跑瀏覽器驗證時，先確認 Node.js 與權限存在，再裝 AI 補強工具。
- 優先順序：先 `--doctor` 看缺口，再決定要不要 `--install-*`。

## Docker / Host 網路排錯

若 sandbox / container 內要連本機工具或本機模型：

- 先分清楚「host port」與「container 內 service URL」
- Docker Desktop 常可用 `host.docker.internal`
- Linux 容器常需要額外 `extra_hosts`

常見例子：

- 本機 Ollama 給 container 連時，常要綁 `0.0.0.0`
- SearxNG / Redis 這類 compose service，在 container 內通常走 service name，不是 `localhost`
- Browser / ChromeDriver mismatch 要明確看 browser version 與 driver version

原則：

- 先證明 connectivity，再懷疑 agent prompt
- 先查官方文檔，再看高品質實作 repo 的 troubleshooting

## 常用範例

```bash
rg -n "createClient|Supabase" src app lib
fd "route|page" src app
bat package.json
jq '.scripts' package.json
hyperfine 'rg "TODO" src'
mcp-cli
```

## 避免使用

### 危險指令

- `rm -rf`
- `git reset --hard`
- `git clean -fd`
- `git checkout --`

這些會直接破壞工作區或歷史。沒有明確確認，不要執行。

### 低效指令

- `grep -R` 掃整個 repo
- `find . -type f` 掃整個 repo
- `cat` 直接打開巨檔

優先改用：

- `rg`
- `fd`
- `bat`
- `sed -n`

### 來源不明安裝腳本

- 避免直接執行來源不明的 `curl | sh`
- 若官方文檔有提供安裝腳本，先確認 domain 與內容再執行
