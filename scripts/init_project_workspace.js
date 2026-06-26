#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { initLoopFiles } = require('./init_session_loop');

const repoRoot = path.resolve(__dirname, '..');
const bootstrapScript = path.join(repoRoot, 'scripts/bootstrap_agent_files.js');

function parseArgs(argv) {
  const options = {
    targetDir: '',
    projectName: 'my-app',
    projectIdea: '',
    force: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--name') {
      options.projectName = argv[i + 1] || options.projectName;
      i += 1;
      continue;
    }
    if (arg === '--idea') {
      options.projectIdea = argv[i + 1] || '';
      i += 1;
      continue;
    }
    if (arg === '--force') options.force = true;
    if (!arg.startsWith('--') && !options.targetDir) options.targetDir = arg;
  }

  return options;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFileIfAllowed(filePath, content, force) {
  if (!force && fs.existsSync(filePath)) return;
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

function buildReadme(projectName, projectIdea) {
  return `# ${projectName}

繁中優先。English quick guide: \`README.en.md\`

## 概要

${projectIdea || '待補：請先完成需求釐清。'}

## 開發流程

1. 先讀 \`AGENTS.md\`
2. 若在 sandbox / remote，先跑 \`bash scripts/setup_sandbox_tools.sh --doctor\`
3. 先跑 \`node scripts/inspect_agent_capabilities.js\`
4. 若已有 \`.loop/*\`，先跑 \`node scripts/evaluate_session_loop.js .\`
5. 先跑 \`node scripts/validate_repo_integrity.js\`
6. 若缺 \`.loop/*\`，先跑 \`node scripts/init_session_loop.js . --goal "${projectIdea || '待補目標'}"\`
7. 再讀 \`docs/interactive_project_flow.md\`、\`docs/SPEC.md\`、\`docs/TASKS.md\`
8. 技術棧確認後，先跑 \`node scripts/generate_project_configs.js --profile <profile> --name ${projectName}\`
9. 依 Task List 逐步實作與驗證
10. 除錯與決策記錄到 \`docs/DEBUG_NOTES.md\` 與 \`docs/STATE.md\`
11. 技術棧相關實作前，先讀對應 \`.agents/skills/*-best-practices/SKILL.md\`
12. 若是 JS / TS 專案，先讀 \`docs/biome_quality_loop.md\`
13. 若要補官方骨架，可改用 \`node scripts/scaffold_project.js ../your-project --profile <profile>\`
14. 若要給 Hermes / OpenClaw 全域吃 skills，可跑 \`bash scripts/export_skills_for_hermes_openclaw.sh --plan\`

## 驗證

- 待補：lint
- 待補：test
- 待補：build
`;
}

function buildReadmeEn(projectName, projectIdea) {
  return `# ${projectName}

Traditional Chinese is primary in this project. This file gives English-speaking users and AI tools a quick entrypoint.

## Overview

${projectIdea || 'TODO: clarify the product idea first.'}

## Workflow

1. Read \`AGENTS.md\`
2. If running in sandbox / remote, run \`bash scripts/setup_sandbox_tools.sh --doctor\`
3. Run \`node scripts/inspect_agent_capabilities.js\`
4. If \`.loop/*\` already exists, run \`node scripts/evaluate_session_loop.js .\`
5. Run \`node scripts/validate_repo_integrity.js\`
6. If \`.loop/*\` is missing, run \`node scripts/init_session_loop.js . --goal "${projectIdea || 'TODO objective'}"\`
7. Read \`docs/interactive_project_flow.md\`, \`docs/SPEC.md\`, and \`docs/TASKS.md\`
8. After the stack is confirmed, run \`node scripts/generate_project_configs.js --profile <profile> --name ${projectName}\`
9. Implement step by step from the task list
10. Record debugging notes in \`docs/DEBUG_NOTES.md\` and current state in \`docs/STATE.md\`
11. Read the matching local best-practice skills before stack-specific work
12. For JS / TS projects, read \`docs/biome_quality_loop.md\`
13. If you need the official framework scaffold first, use \`node scripts/scaffold_project.js ../your-project --profile <profile>\`

## Verification

- TODO: lint
- TODO: test
- TODO: build
`;
}

function buildSpec(projectName, projectIdea) {
  return `# SPEC

## §G Goal

- 建立 ${projectName}
- 想法：${projectIdea || '待補'}

## §C Constraints

- 待補：核心使用者
- 待補：核心流程
- 待補：非功能需求
- 待補：技術棧限制
- 待補：部署與金鑰限制

## §I Interfaces

- I.app: 待補：主要使用者介面
- I.api: 待補：API / server actions / webhooks
- I.data: 待補：資料庫、第三方服務、背景任務
- I.env: 待補：必要環境變數

## §V Invariants

- V1: 所有新功能都要有對應驗證方式
- V2: 所有秘密資料都走環境變數，不提交 repo
- V3: 所有第三方整合都先查官方文檔再實作

## §T Tasks

| id | status | task | cites |
| --- | --- | --- | --- |
| T1 | . | 需求釐清與技術棧確認 | I.app,I.api,I.data |
| T2 | . | 產出架構草圖與模組邊界 | I.app,I.api,V1 |
| T3 | . | 建立第一個可執行版本 | V1,V2,V3 |
| T4 | . | 補齊測試、除錯筆記與 README | V1 |

## §B Bugs

| id | date | cause | fix |
| --- | --- | --- | --- |
`;
}

function buildTasks() {
  return `# TASKS

> ` + '`docs/SPEC.md` 的 `§T` 是結構化事實來源；這裡是較易掃描的執行看板。' + `

## Backlog

- [ ] 需求釐清
- [ ] 架構確認
- [ ] 專案初始化
- [ ] 第一個可執行版本
- [ ] 測試補齊
- [ ] README 更新

## In Progress

- [ ] 待補

## Done

- [ ] 建立核心規範檔
`;
}

function buildDebugNotes() {
  return `# DEBUG NOTES

## 規則

- 每次重大錯誤記一筆
- 記根因，不只記症狀
- 記修法與驗證方式

## Entries

`;
}

function buildState() {
  return `# STATE

## 目前狀態

- 待補

## 下一步

- 待補
`;
}

function buildAdrs() {
  return `# ADRS

## 使用方式

- 一個重要決策一個段落
- 寫清楚背景、選項、取捨、結論

## 0001 - Initial project setup

- Status: accepted
- Context: 專案剛初始化，需要建立共同工作流。
- Decision: 採用 AGENTS.md + SPEC.md + TASKS.md + DEBUG_NOTES.md + STATE.md。
- Consequences: 初期文件較多，但 AI 與人類有共同事實來源。
`;
}

function buildCursorRules() {
  return `請先讀取 AGENTS.md 與 .loop/*，並遵守其中的規範、架構、loop 與驗證流程。`;
}

function buildCursorRulesMdc() {
  return `---
description: Loop engineering project defaults
alwaysApply: true
---

先讀 \`AGENTS.md\`。

再依需求讀：

- \`.loop/GOAL.md\`
- \`.loop/STATE.json\`
- \`.agents/skills/using-agent-skills/SKILL.md\`
- \`.agents/skills/loop-engineering/SKILL.md\`
- 對應技術棧的 \`.agents/skills/*-best-practices/SKILL.md\`

實作前先查官方文檔。
只做最小必要修改。
修改後主動驗證。`;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.targetDir) {
    console.error('用法: node scripts/init_project_workspace.js <targetDir> [--name <projectName>] [--idea <idea>] [--force]');
    process.exit(1);
  }

  const targetRoot = path.resolve(process.cwd(), options.targetDir);
  ensureDir(targetRoot);

  const bootstrapArgs = [bootstrapScript, targetRoot];
  if (options.force) bootstrapArgs.push('--force');
  const bootstrapResult = spawnSync(process.execPath, bootstrapArgs, { stdio: 'inherit' });
  if (bootstrapResult.status !== 0) {
    process.exit(bootstrapResult.status || 1);
  }

  writeFileIfAllowed(path.join(targetRoot, 'README.md'), buildReadme(options.projectName, options.projectIdea), options.force);
  writeFileIfAllowed(path.join(targetRoot, 'README.en.md'), buildReadmeEn(options.projectName, options.projectIdea), options.force);
  writeFileIfAllowed(path.join(targetRoot, 'docs/SPEC.md'), buildSpec(options.projectName, options.projectIdea), options.force);
  writeFileIfAllowed(path.join(targetRoot, 'docs/SPEC_FORMAT.md'), fs.readFileSync(path.join(repoRoot, 'docs/SPEC_FORMAT.md'), 'utf8'), options.force);
  writeFileIfAllowed(path.join(targetRoot, 'docs/TASKS.md'), buildTasks(), options.force);
  writeFileIfAllowed(path.join(targetRoot, 'docs/DEBUG_NOTES.md'), buildDebugNotes(), options.force);
  writeFileIfAllowed(path.join(targetRoot, 'docs/STATE.md'), buildState(), options.force);
  writeFileIfAllowed(path.join(targetRoot, 'docs/ADRS.md'), buildAdrs(), options.force);
  writeFileIfAllowed(path.join(targetRoot, '.cursorrules'), buildCursorRules(), options.force);
  writeFileIfAllowed(path.join(targetRoot, '.cursor/rules/00-project.mdc'), buildCursorRulesMdc(), options.force);
  initLoopFiles(targetRoot, options.projectIdea, options.force);

  console.log('\n✅ 已完成專案初始化');
  console.log(`📁 ${targetRoot}`);
  console.log('已建立：README.md、README.en.md、docs/SPEC.md、docs/SPEC_FORMAT.md、docs/TASKS.md、docs/DEBUG_NOTES.md、docs/STATE.md、docs/ADRS.md、.cursorrules、.cursor/rules/00-project.mdc');
  console.log('已同步：核心入口、skills mirrors、config、scripts、docs、prompts、CI workflow');
}

main();
