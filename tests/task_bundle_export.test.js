const test = require('node:test');
const assert = require('node:assert/strict');

const { buildTaskBundle } = require('../scripts/export_task_bundle');

test('buildTaskBundle extracts structured data from SPEC markdown', () => {
  const markdown = `# SPEC

## §G Goal

Make repo portable.

## §C Constraints

- No stale docs
- Keep machine-readable outputs

## §I Interfaces

- AGENTS.md
- docs/SPEC.md

## §V Invariants

- Canonical skills in .agents/skills

## §T Tasks

| id | status | task | cites |
| --- | --- | --- | --- |
| T1 | x | Do thing | G1 |
| T2 | ~ | Do next thing | V1 |
`;

  const bundle = buildTaskBundle(markdown);
  assert.equal(bundle.goal, 'Make repo portable.');
  assert.equal(bundle.constraints.length, 2);
  assert.equal(bundle.interfaces.length, 2);
  assert.equal(bundle.invariants.length, 1);
  assert.equal(bundle.tasks.length, 2);
  assert.equal(bundle.tasks[0].id, 'T1');
});
