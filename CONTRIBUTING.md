# Contributing

本 repo 的目標不是堆更多 prompt，而是讓 AI agent 讀到少量入口後，能穩定找到正確 workflow、工具、驗證方式與 fallback。

## Principles

- 小改動，先驗證。
- skills 要單一職責。
- 長知識放 references 或 docs，不塞進入口檔。
- scripts 是加速器，不是唯一流程。
- 任何外部來源都要標明 provenance。

## Adding or Updating Skills

新增 skill 時，必須同步：

1. .agents/skills/SKILL_NAME/SKILL.md
2. .claude/skills/SKILL_NAME/SKILL.md wrapper
3. skills/SKILL_NAME/SKILL.md wrapper
4. docs/agent_skill_catalog.md
5. config/skill_profiles.json 如需自動推薦
6. README.md / README.en.md 如屬主要能力

驗證：

    node scripts/validate_repo_integrity.js

## Adding Scripts

新增 scripts 內的 .js 或 .sh 時，必須同步：

1. config/script_capabilities.json
2. docs/script_fallback_matrix.md
3. scripts/bootstrap_agent_files.js 如需複製到目標專案
4. .github/workflows/ci.yml 如需 syntax check 或 smoke test

驗證：

    node --check scripts/YOUR_SCRIPT.js
    bash -n scripts/YOUR_SCRIPT.sh
    node scripts/validate_repo_integrity.js

## Documentation Changes

文件改動要避免承諾不存在的能力。若只是 roadmap，請明確標成 gap、backlog 或 readiness。

## Pull Request Checklist

- 跑過 repo integrity gate。
- 沒有提交 secret。
- 沒有新增未記錄的外部依賴。
- 若新增 skill，三個 skill roots 已同步。
- 若新增 script，capabilities 與 fallback 已同步。
- 若涉及 marketplace 或 plugin，先更新 docs/marketplace_open_source_readiness.md。

