#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');

function run(cmd, args, cwd) {
  execFileSync(cmd, args, {
    cwd,
    stdio: 'inherit'
  });
}

function ensureCleanDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  fs.mkdirSync(dirPath, { recursive: true });
}

function assertJsonParses(relativePath) {
  JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function main() {
  const scratchRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'obdp-smoke-'));
  try {
    const bootstrapTarget = path.join(scratchRoot, 'bootstrap-target');
    ensureCleanDir(bootstrapTarget);

    console.log(`scratchRoot=${scratchRoot}`);

    assertJsonParses('config/agent_manifest.json');
    assertJsonParses('.codex-plugin/plugin.json');
    assertJsonParses('.agents/plugins/marketplace.json');

    run('node', ['scripts/validate_repo_integrity.js'], repoRoot);
    run('node', ['scripts/bootstrap_agent_files.js', bootstrapTarget, '--force'], repoRoot);
    run('node', ['scripts/init_project_workspace.js', bootstrapTarget, '--name', 'bootstrap-target', '--idea', 'fresh clone smoke test'], repoRoot);
    run('node', ['scripts/validate_repo_integrity.js'], bootstrapTarget);
    const workspaceTarget = path.join(scratchRoot, 'workspace-target');
    ensureCleanDir(workspaceTarget);
    run('node', ['scripts/init_project_workspace.js', workspaceTarget, '--name', 'smoke-project', '--idea', 'fresh clone smoke test'], repoRoot);
    run('node', ['scripts/init_session_loop.js', workspaceTarget, '--goal', 'verify portable loop state', '--force'], repoRoot);

    console.log('fresh clone smoke test ok');
  } finally {
    fs.rmSync(scratchRoot, { recursive: true, force: true });
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`fresh clone smoke test failed: ${error.message}`);
    process.exit(1);
  }
}
