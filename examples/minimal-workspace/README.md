# Minimal Workspace Example

這個範例不是完整應用，而是最小治理啟動面。

目標：

- 讓新使用者一眼知道最短路徑
- 提供 fresh clone 後可照抄的最小流程

## 最短路徑

```bash
node scripts/inspect_agent_capabilities.js
node scripts/init_session_loop.js . --goal "讓 AI 接手此專案並持續交付"
node scripts/evaluate_session_loop.js .
node scripts/validate_repo_integrity.js
```

## 若是新專案

```bash
node scripts/init_project_workspace.js ../your-project --name your-project --idea "你的想法"
cd ../your-project
node scripts/inspect_agent_capabilities.js
node scripts/evaluate_session_loop.js .
node scripts/validate_repo_integrity.js
```

## 這個範例要傳達什麼

- 先有 entry files
- 再有 `.loop/*`
- 再有驗證 gate
- 最後才談自治升級
