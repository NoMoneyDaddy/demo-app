const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, 'config', 'repo_surface_manifest.json'), 'utf8'));

function duplicates(items) {
  const seen = new Set();
  const dup = [];
  for (const item of items) {
    if (seen.has(item)) dup.push(item);
    seen.add(item);
  }
  return dup;
}

test('repo surface manifest has required arrays and no duplicates', () => {
  assert.ok(Array.isArray(manifest.bootstrap_entries));
  assert.ok(Array.isArray(manifest.integrity_required_files));
  assert.ok(Array.isArray(manifest.integrity_required_dirs));
  assert.equal(duplicates(manifest.bootstrap_entries).length, 0);
  assert.equal(duplicates(manifest.integrity_required_files).length, 0);
  assert.equal(duplicates(manifest.integrity_required_dirs).length, 0);
});

test('critical governance files exist in manifest', () => {
  for (const required of [
    'AGENTS.md',
    'README.md',
    'config/repo_surface_manifest.json',
    '.github/CODEOWNERS',
    'CHANGELOG.md',
    'examples/minimal-workspace/README.md'
  ]) {
    assert.ok(manifest.bootstrap_entries.includes(required) || manifest.integrity_required_files.includes(required));
  }
});
