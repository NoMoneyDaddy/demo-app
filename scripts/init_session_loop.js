#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFileIfAllowed(filePath, content, force) {
  if (!force && fs.existsSync(filePath)) {
    return 'skipped';
  }

  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  return 'written';
}

function buildGoal(goal) {
  return `# GOAL

## Objective

${goal || '待補：請寫清楚這個 session 想完成什麼。'}

## Done Definition

- 待補：最小可交付結果
- 待補：必要驗證
- 待補：還有哪些不算完成

## Constraints

- 待補：技術棧 / 平台限制
- 待補：時間 / 權限 / 金鑰限制
- 待補：不可逆操作限制
`;
}

function buildPlan() {
  return `# PLAN

## Phases

- [ ] Define
- [ ] Plan
- [ ] Build
- [ ] Verify
- [ ] Review
- [ ] Ship

## Current Slice

- 待補

## Loop Settings

- maturity_level: L1
- tier: standard
- orientation: engineer
- time_budget: 待補
- convergence_state: closed

## Acceptance Criteria

- 待補
`;
}

function buildState(now) {
  return `${JSON.stringify(
    {
      mode: 'session-loop',
      maturity_level: 'L1',
      tier: 'standard',
      orientation: 'engineer',
      time_budget: null,
      convergence_state: 'closed',
      status: 'active',
      phase: 'Define',
      current_state: 'intake',
      current_task: null,
      retry_count: 0,
      blocked_reason: null,
      last_verified_at: null,
      updated_at: now
    },
    null,
    2
  )}\n`;
}

function buildCheckpoints() {
  return `# CHECKPOINTS

每輪 loop 完成後追加：

- 做了什麼
- 怎麼驗證
- 下一輪做什麼

## Entries

`;
}

function buildEvidence() {
  return `# EVIDENCE

記錄真實驗證證據：

- test
- lint
- build
- runtime
- browser

## Entries

`;
}

function buildPolicy() {
  return `# POLICY

## Default

- 預設 autonomy level 是 L1 report-only
- 有 verifier 才升 L2
- 有 scope / budget / audit 才升 L3
- 先短版確認，再進實作 loop
- 大任務先建 spec / task
- 每輪都要更新 loop 狀態
- 沒有驗證，不算完成

## Auto-continue

以下情況可在 session 內自動繼續，不必停：

- 小型可逆決策
- 設定檔補齊
- 測試失敗後的根因修正
- 文件與狀態同步更新

## Stop Conditions

以下情況才停：

- 缺憑證、登入、付款、權限
- 需要使用者做不可逆選擇
- 外部服務不可用且無替代方案
- 同一錯誤連修 3 次仍失敗
- circuit_breaker_open
`;
}

function buildLearnings(now) {
  return `${JSON.stringify(
    {
      schema_version: '1.0.0',
      updated_at: now,
      rollup: {
        retained_patterns: [],
        discarded_patterns: [],
        next_experiments: []
      },
      entries: []
    },
    null,
    2
  )}\n`;
}

function initLoopFiles(targetRoot, goal, force) {
  const now = new Date().toISOString();
  const loopRoot = path.join(targetRoot, '.loop');
  const files = new Map([
    ['.loop/GOAL.md', buildGoal(goal)],
    ['.loop/PLAN.md', buildPlan()],
    ['.loop/STATE.json', buildState(now)],
    ['.loop/CHECKPOINTS.md', buildCheckpoints()],
    ['.loop/EVIDENCE.md', buildEvidence()],
    ['.loop/POLICY.md', buildPolicy()],
    ['.loop/LEARNINGS.json', buildLearnings(now)]
  ]);

  const results = [];
  for (const [relativePath, content] of files.entries()) {
    const filePath = path.join(targetRoot, relativePath);
    const action = writeFileIfAllowed(filePath, content, force);
    results.push({ file: relativePath, action });
  }

  return { loopRoot, results };
}

function parseArgs(argv) {
  const options = {
    targetDir: '.',
    goal: '',
    force: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--goal') {
      options.goal = argv[i + 1] || options.goal;
      i += 1;
      continue;
    }
    if (arg === '--force') options.force = true;
    if (!arg.startsWith('--') && options.targetDir === '.') options.targetDir = arg;
  }

  return options;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const targetRoot = path.resolve(process.cwd(), options.targetDir);
  ensureDir(targetRoot);
  const { results } = initLoopFiles(targetRoot, options.goal, options.force);

  console.log('Session loop 初始化完成');
  for (const result of results) {
    console.log(`- ${result.file} | ${result.action}`);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`❌ 失敗: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  initLoopFiles
};
