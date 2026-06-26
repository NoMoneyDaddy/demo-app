# Marketplace and Open-source Readiness

本文件記錄讓本 repo 走向公開分享、skill market 或 Codex plugin distribution 前，需要補齊的檢查點。

## 調研結論

- repo-scoped skills 適合本專案內使用。
- 要讓其他人穩定安裝，應轉成 plugin packaging，而不是只散落 skills 目錄。
- community skill market 可用來發現候選，但不能當權威來源。
- 上架前要先補 license、版本、安裝驗證、來源聲明與安全邊界。

## 參考到的同類作法

| Project | 可借鏡作法 |
| --- | --- |
| openai/plugins | plugin.json manifest、skills 目錄、marketplace 入口 |
| anthropics/skills | spec、template、skills 分層，明確 disclaimer |
| vercel-labs/agent-skills | skill 說明以 use when 與 category 組織 |
| addyosmani/agent-skills | lifecycle command map、跨工具安裝說明 |
| obra/superpowers | 多 agent client distribution、plugin-first 發佈 |
| ComposioHQ/awesome-codex-skills | 安裝指令、分類 catalog、skill-installer 路徑 |

## 目前本 repo 已有

- AGENTS.md / CLAUDE.md / GEMINI.md
- SECURITY.md
- CONTRIBUTING.md
- LICENSE
- .agents/skills canonical runtime
- .claude/skills 與 skills mirrors
- .codex-plugin/plugin.json
- .agents/plugins/marketplace.json
- config/agent_manifest.json
- docs/external_install_provenance_checklist.md
- inspect、integrity、bootstrap、scaffold、config generator scripts
- fresh clone 與 marketplace install smoke tests
- skill / tooling profiles
- sandbox tool setup plan

## 主要缺口

1. 缺真實 marketplace client 安裝實測證據，目前只有 repo 內 local marketplace smoke test。

## 建議路線

### Phase 1：repo 內自用穩定

- 保持 .agents/skills 為 canonical。
- 補 tool-discovery-and-installation。
- 每次新增 skill 都跑 validate_repo_integrity。

### Phase 2：公開開源穩定

- LICENSE 已補。
- SECURITY.md 已補。
- CONTRIBUTING.md 已補。
- release / version policy 已補。
- fresh clone smoke test 已補。
- README 補 fresh install 驗證步驟。

### Phase 3：Codex marketplace / plugin ready

- 新增 .codex-plugin/plugin.json。
- 定義 skills path。
- 補 interface metadata。
- 建立 marketplace.json 測試入口。
- local marketplace install smoke test 已補。
- 若取得真實 marketplace client / CLI，再補 end-to-end 安裝實測。

## 安全規則

- 不直接信任 community market。
- 不安裝來源不明 skill。
- 不執行未審查 scripts。
- 不把 API key、token、cookie 寫進 repo。
- 外部工具要優先官方 docs、package registry、GitHub source。

## 最小下一步

1. 取得真實 marketplace client / CLI 後，補 end-to-end 安裝實測。
2. 對高風險外部工具補實際 provenance 記錄樣本。
