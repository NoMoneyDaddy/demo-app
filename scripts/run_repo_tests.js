#!/usr/bin/env node

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

function main() {
  const testsDir = path.join(repoRoot, 'tests');
  const testFiles = fs
    .readdirSync(testsDir)
    .filter((name) => name.endsWith('.test.js'))
    .sort()
    .map((name) => path.join('tests', name));

  execFileSync('node', ['--test', ...testFiles], {
    cwd: repoRoot,
    stdio: 'inherit'
  });
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`repo tests failed: ${error.message}`);
    process.exit(1);
  }
}
