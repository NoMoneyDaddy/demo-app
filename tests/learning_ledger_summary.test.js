const test = require('node:test');
const assert = require('node:assert/strict');

const { summarizeLearningLedger } = require('../scripts/summarize_learning_ledger');

test('summarizeLearningLedger aggregates decisions and score', () => {
  const summary = summarizeLearningLedger({
    schema_version: '1.0.0',
    updated_at: '2026-06-25T00:00:00Z',
    rollup: {
      retained_patterns: ['a'],
      discarded_patterns: ['b'],
      next_experiments: ['c']
    },
    entries: [
      { decision: 'keep', result: 'ok', evidence_refs: ['a'] },
      { decision: 'keep', result: 'ok', evidence_refs: ['b'] },
      { decision: 'discard', result: 'bad', evidence_refs: ['c'] },
      { decision: 'retry', result: 'partial', evidence_refs: ['d'] },
      { decision: 'investigate', result: 'unknown', evidence_refs: ['e'] }
    ]
  });

  assert.equal(summary.total_entries, 5);
  assert.equal(summary.decisions.keep, 2);
  assert.equal(summary.decisions.discard, 1);
  assert.equal(summary.decisions.retry, 1);
  assert.equal(summary.decisions.investigate, 1);
  assert.equal(summary.keep_ratio, 0.4);
  assert.equal(summary.net_score, 1);
});
