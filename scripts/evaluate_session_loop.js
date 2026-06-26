#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  '.loop/GOAL.md',
  '.loop/PLAN.md',
  '.loop/STATE.json',
  '.loop/CHECKPOINTS.md',
  '.loop/EVIDENCE.md',
  '.loop/POLICY.md',
  '.loop/LEARNINGS.json'
];

const ENUMS = {
  maturity_level: ['L0', 'L1', 'L2', 'L3'],
  tier: ['prototype', 'standard', 'production', 'research'],
  orientation: ['engineer', 'creative', 'production'],
  convergence_state: ['closed', 'half_open', 'open'],
  status: ['active', 'blocked', 'complete'],
  phase: ['Define', 'Plan', 'Build', 'Verify', 'Review', 'Ship'],
  current_state: [
    'intake',
    'clarify',
    'capability-check',
    'stack-and-deps',
    'spec-and-architecture',
    'task-slicing',
    'implementation-loop',
    'review-gate',
    'ship-prep'
  ]
};

function parseArgs(argv) {
  const options = {
    targetDir: '.',
    json: false,
    failOnHold: false
  };

  for (const arg of argv) {
    if (arg === '--json') options.json = true;
    else if (arg === '--fail-on-hold') options.failOnHold = true;
    else if (!arg.startsWith('--') && options.targetDir === '.') options.targetDir = arg;
  }

  return options;
}

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function getSection(markdown, heading) {
  const lines = markdown.split('\n');
  const startIndex = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (startIndex === -1) return '';

  const buffer = [];
  for (let i = startIndex + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.startsWith('## ')) break;
    buffer.push(line);
  }
  return buffer.join('\n').trim();
}

function meaningfulLines(markdown) {
  return markdown
    .split('\n')
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean)
    .filter((line) => !/^(待補|todo\b)/i.test(line));
}

function hasMeaningfulSection(markdown, heading) {
  return meaningfulLines(getSection(markdown, heading)).length > 0;
}

function countEntryLines(markdown) {
  return meaningfulLines(getSection(markdown, 'Entries')).length;
}

function isIsoDate(value) {
  if (value === null) return true;
  if (typeof value !== 'string' || value.trim().length === 0) return false;
  return !Number.isNaN(Date.parse(value));
}

function addCheck(checks, name, pass, detail) {
  checks.push({ name, pass, detail });
}

function evaluateLearnings(learningsRaw, checks) {
  let learnings = null;
  try {
    learnings = JSON.parse(learningsRaw);
  } catch (error) {
    addCheck(checks, 'learnings-json', false, `LEARNINGS.json 無法解析 | ${error.message}`);
    return { learnings: null, learningsOk: false, learningEntries: 0 };
  }

  const requiredTopLevelKeys = ['schema_version', 'updated_at', 'rollup', 'entries'];
  const missingTopLevelKeys = requiredTopLevelKeys.filter((key) => !(key in learnings));
  addCheck(
    checks,
    'learnings-required-keys',
    missingTopLevelKeys.length === 0,
    missingTopLevelKeys.length === 0 ? 'required keys ok' : `缺欄位: ${missingTopLevelKeys.join(', ')}`
  );

  const rollup = learnings.rollup || {};
  const rollupOk =
    Array.isArray(rollup.retained_patterns) &&
    Array.isArray(rollup.discarded_patterns) &&
    Array.isArray(rollup.next_experiments);
  addCheck(checks, 'learnings-rollup', rollupOk, rollupOk ? 'rollup ok' : 'rollup 需包含三個 array');

  const entries = Array.isArray(learnings.entries) ? learnings.entries : [];
  const validDecisions = new Set(['keep', 'discard', 'retry', 'investigate']);
  const validEntries = entries.filter((entry) => {
    const requiredEntryKeys = ['id', 'date', 'context', 'change', 'hypothesis', 'result', 'decision', 'evidence_refs', 'next_action'];
    const hasKeys = requiredEntryKeys.every((key) => typeof entry[key] !== 'undefined');
    const evidenceOk = Array.isArray(entry.evidence_refs) && entry.evidence_refs.length > 0;
    const decisionOk = typeof entry.decision === 'string' && validDecisions.has(entry.decision);
    const textFieldsOk = ['id', 'date', 'context', 'change', 'hypothesis', 'result', 'next_action'].every(
      (key) => typeof entry[key] === 'string' && entry[key].trim().length > 0
    );
    return hasKeys && evidenceOk && decisionOk && textFieldsOk;
  });
  const entriesOk = entries.length > 0 && validEntries.length === entries.length;
  addCheck(
    checks,
    'learning-entries',
    entriesOk,
    entriesOk ? `learning entries=${entries.length}` : 'LEARNINGS.json 需至少一筆完整 entry'
  );

  const updatedAtOk = isIsoDate(learnings.updated_at);
  addCheck(checks, 'learning-updated-at', updatedAtOk, updatedAtOk ? 'updated_at ok' : 'updated_at 需為 ISO 時間');

  return {
    learnings,
    learningsOk: missingTopLevelKeys.length === 0 && rollupOk && entriesOk && updatedAtOk,
    learningEntries: entries.length
  };
}

function evaluateState(stateRaw, checks) {
  let state = null;
  try {
    state = JSON.parse(stateRaw);
  } catch (error) {
    addCheck(checks, 'state-json', false, `STATE.json 無法解析 | ${error.message}`);
    return { state: null, stateSchemaOk: false, breakerOpen: true };
  }

  const requiredKeys = [
    'mode',
    'maturity_level',
    'tier',
    'orientation',
    'time_budget',
    'convergence_state',
    'status',
    'phase',
    'current_state',
    'current_task',
    'retry_count',
    'blocked_reason',
    'last_verified_at',
    'updated_at'
  ];

  const missingKeys = requiredKeys.filter((key) => !(key in state));
  addCheck(checks, 'state-required-keys', missingKeys.length === 0, missingKeys.length === 0 ? 'required keys ok' : `缺欄位: ${missingKeys.join(', ')}`);

  const invalidEnums = Object.entries(ENUMS)
    .filter(([key, values]) => key in state && !values.includes(state[key]))
    .map(([key]) => `${key}=${JSON.stringify(state[key])}`);
  addCheck(checks, 'state-enums', invalidEnums.length === 0, invalidEnums.length === 0 ? 'enum values ok' : `非法值: ${invalidEnums.join(', ')}`);

  const retryValid = Number.isInteger(state.retry_count) && state.retry_count >= 0;
  addCheck(checks, 'state-retry-count', retryValid, retryValid ? 'retry_count ok' : `retry_count 非法: ${JSON.stringify(state.retry_count)}`);

  const timestampsOk = isIsoDate(state.last_verified_at) && isIsoDate(state.updated_at);
  addCheck(checks, 'state-timestamps', timestampsOk, timestampsOk ? 'timestamps ok' : 'last_verified_at / updated_at 需為 ISO 時間或 null');

  const stateSchemaOk = missingKeys.length === 0 && invalidEnums.length === 0 && retryValid && timestampsOk;
  const breakerOpen =
    state.blocked_reason === 'circuit_breaker_open' ||
    state.convergence_state === 'open' ||
    (Number.isInteger(state.retry_count) && state.retry_count >= 3);
  addCheck(checks, 'circuit-breaker', !breakerOpen, breakerOpen ? '偵測到 breaker / retry / convergence 風險' : 'breaker not open');

  return { state, stateSchemaOk, breakerOpen };
}

function evaluateLoop(targetRoot) {
  const checks = [];
  const missingFiles = REQUIRED_FILES.filter((relativePath) => !fs.existsSync(path.join(targetRoot, relativePath)));
  addCheck(checks, 'loop-files', missingFiles.length === 0, missingFiles.length === 0 ? 'all loop files exist' : `缺檔: ${missingFiles.join(', ')}`);

  if (missingFiles.length > 0) {
    return {
      targetRoot,
      gate: 'hold',
      promotionCandidate: false,
      shipReady: false,
      score: 0,
      checks,
      summary: { missingFiles, evidenceEntries: 0, checkpointEntries: 0 }
    };
  }

  const goal = readUtf8(path.join(targetRoot, '.loop/GOAL.md'));
  const plan = readUtf8(path.join(targetRoot, '.loop/PLAN.md'));
  const stateRaw = readUtf8(path.join(targetRoot, '.loop/STATE.json'));
  const checkpoints = readUtf8(path.join(targetRoot, '.loop/CHECKPOINTS.md'));
  const evidence = readUtf8(path.join(targetRoot, '.loop/EVIDENCE.md'));
  const policy = readUtf8(path.join(targetRoot, '.loop/POLICY.md'));
  const learningsRaw = readUtf8(path.join(targetRoot, '.loop/LEARNINGS.json'));

  const goalOk = hasMeaningfulSection(goal, 'Objective') && hasMeaningfulSection(goal, 'Done Definition') && hasMeaningfulSection(goal, 'Constraints');
  addCheck(checks, 'goal-quality', goalOk, goalOk ? 'goal sections have meaningful content' : 'GOAL.md 仍有 placeholder / 空白段落');

  const planOk = hasMeaningfulSection(plan, 'Current Slice') && hasMeaningfulSection(plan, 'Acceptance Criteria');
  addCheck(checks, 'plan-quality', planOk, planOk ? 'plan sections have meaningful content' : 'PLAN.md 缺 current slice 或 acceptance criteria');

  const policyOk =
    hasMeaningfulSection(policy, 'Default') &&
    hasMeaningfulSection(policy, 'Auto-continue') &&
    hasMeaningfulSection(policy, 'Stop Conditions');
  addCheck(checks, 'policy-quality', policyOk, policyOk ? 'policy sections ok' : 'POLICY.md 缺 default / auto-continue / stop conditions');

  const checkpointEntries = countEntryLines(checkpoints);
  addCheck(checks, 'checkpoints', checkpointEntries > 0, checkpointEntries > 0 ? `checkpoint entries=${checkpointEntries}` : 'CHECKPOINTS.md 沒有有效 entries');

  const evidenceEntries = countEntryLines(evidence);
  addCheck(checks, 'evidence', evidenceEntries > 0, evidenceEntries > 0 ? `evidence entries=${evidenceEntries}` : 'EVIDENCE.md 沒有有效 entries');

  const { learningsOk, learningEntries } = evaluateLearnings(learningsRaw, checks);

  const { state, stateSchemaOk, breakerOpen } = evaluateState(stateRaw, checks);
  const verificationFresh = Boolean(state && state.last_verified_at);
  addCheck(checks, 'last-verified', verificationFresh, verificationFresh ? `last_verified_at=${state.last_verified_at}` : 'STATE.json 尚未記錄 last_verified_at');

  const baseReady =
    goalOk &&
    planOk &&
    policyOk &&
    checkpointEntries > 0 &&
    evidenceEntries > 0 &&
    learningsOk &&
    stateSchemaOk &&
    verificationFresh &&
    !breakerOpen;

  const promotionCandidate = Boolean(
    state &&
      baseReady &&
      ['Verify', 'Review', 'Ship'].includes(state.phase) &&
      ['L0', 'L1'].includes(state.maturity_level)
  );

  const shipReady = Boolean(
    state &&
      baseReady &&
      state.phase === 'Ship' &&
      state.current_state === 'ship-prep' &&
      ['active', 'complete'].includes(state.status)
  );

  let gate = 'hold';
  if (shipReady) gate = 'ship-ready';
  else if (promotionCandidate) gate = 'promote-candidate';
  else if (baseReady) gate = 'continue';

  const passedChecks = checks.filter((item) => item.pass).length;
  const score = Math.round((passedChecks / checks.length) * 100);

  return {
    targetRoot,
    gate,
    promotionCandidate,
    shipReady,
    score,
    checks,
    summary: {
      missingFiles,
      evidenceEntries,
      checkpointEntries,
      learningEntries,
      state: state || null
    }
  };
}

function printHuman(result) {
  console.log('Session loop 評估');
  console.log(`- target: ${result.targetRoot}`);
  console.log(`- gate: ${result.gate}`);
  console.log(`- score: ${result.score}`);
  console.log(`- promotion_candidate: ${result.promotionCandidate ? 'yes' : 'no'}`);
  console.log(`- ship_ready: ${result.shipReady ? 'yes' : 'no'}`);

  console.log('\nChecks:');
  for (const check of result.checks) {
    console.log(`- ${check.pass ? 'x' : '!'} ${check.name} | ${check.detail}`);
  }

  console.log('\n建議:');
  if (result.gate === 'hold') console.log('- 先補 loop 狀態 / 證據 / policy，再談升級自治或 ship');
  else if (result.gate === 'promote-candidate') console.log('- 可考慮從 L1 升到 L2，但先確認 verifier 與權限邊界');
  else if (result.gate === 'ship-ready') console.log('- loop 證據與狀態足夠，可進入 ship / merge gate');
  else console.log('- loop 基線已齊，可繼續下一個實作切片');
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const targetRoot = path.resolve(process.cwd(), options.targetDir);
  const result = evaluateLoop(targetRoot);

  if (options.json) console.log(JSON.stringify(result, null, 2));
  else printHuman(result);

  if (options.failOnHold && result.gate === 'hold') process.exit(1);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`❌ 失敗: ${error.message}`);
    process.exit(1);
  }
}
