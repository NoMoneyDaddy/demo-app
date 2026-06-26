#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const decisionWeights = {
  keep: 1,
  discard: -1,
  retry: 0,
  investigate: 0
};

function round(value) {
  return Math.round(value * 100) / 100;
}

function summarizeLearningLedger(ledger) {
  const entries = Array.isArray(ledger.entries) ? ledger.entries : [];
  const decisions = {
    keep: 0,
    discard: 0,
    retry: 0,
    investigate: 0
  };

  let netScore = 0;

  for (const entry of entries) {
    const decision = typeof entry.decision === 'string' ? entry.decision : 'investigate';
    if (!(decision in decisions)) continue;
    decisions[decision] += 1;
    netScore += decisionWeights[decision];
  }

  const total = entries.length;
  const keepRatio = total === 0 ? 0 : round(decisions.keep / total);
  const discardRatio = total === 0 ? 0 : round(decisions.discard / total);
  const retryRatio = total === 0 ? 0 : round(decisions.retry / total);
  const confidenceScore = total === 0 ? 0 : round((decisions.keep - decisions.discard) / total);

  return {
    schema_version: ledger.schema_version || 'unknown',
    updated_at: ledger.updated_at || null,
    total_entries: total,
    decisions,
    keep_ratio: keepRatio,
    discard_ratio: discardRatio,
    retry_ratio: retryRatio,
    net_score: netScore,
    confidence_score: confidenceScore,
    retained_patterns: Array.isArray(ledger.rollup?.retained_patterns) ? ledger.rollup.retained_patterns.length : 0,
    discarded_patterns: Array.isArray(ledger.rollup?.discarded_patterns) ? ledger.rollup.discarded_patterns.length : 0,
    next_experiments: Array.isArray(ledger.rollup?.next_experiments) ? ledger.rollup.next_experiments.length : 0
  };
}

function printHuman(summary) {
  console.log('Learning ledger summary');
  console.log(`- total_entries: ${summary.total_entries}`);
  console.log(`- keep: ${summary.decisions.keep}`);
  console.log(`- discard: ${summary.decisions.discard}`);
  console.log(`- retry: ${summary.decisions.retry}`);
  console.log(`- investigate: ${summary.decisions.investigate}`);
  console.log(`- keep_ratio: ${summary.keep_ratio}`);
  console.log(`- confidence_score: ${summary.confidence_score}`);
  console.log(`- net_score: ${summary.net_score}`);
  console.log(`- retained_patterns: ${summary.retained_patterns}`);
  console.log(`- discarded_patterns: ${summary.discarded_patterns}`);
  console.log(`- next_experiments: ${summary.next_experiments}`);
}

function main() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const fileArg = args.find((arg) => !arg.startsWith('--')) || '.loop/LEARNINGS.json';
  const targetPath = path.resolve(process.cwd(), fileArg);
  const ledger = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
  const summary = summarizeLearningLedger(ledger);

  if (json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  printHuman(summary);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`learning ledger summary failed: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  summarizeLearningLedger
};
