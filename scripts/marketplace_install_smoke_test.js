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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertInsideRepo(targetPath, label) {
  const relative = path.relative(repoRoot, targetPath);
  assert(relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative)), `${label} escapes repo root`);
}

function ensureFile(filePath) {
  assert(fs.existsSync(filePath), `missing file: ${path.relative(repoRoot, filePath)}`);
}

function ensureDir(dirPath) {
  assert(fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory(), `missing dir: ${path.relative(repoRoot, dirPath)}`);
}

function main() {
  const scratchRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'obdp-marketplace-'));
  try {
    const marketplace = readJson(path.join(repoRoot, '.agents/plugins/marketplace.json'));
    const pluginEntry = Array.isArray(marketplace.plugins)
      ? marketplace.plugins.find((item) => item.name === 'one-button-done-project')
      : null;

    assert(pluginEntry, 'marketplace missing one-button-done-project entry');
    assert(pluginEntry.source?.source === 'local', 'marketplace plugin source must be local');
    assert(typeof pluginEntry.source?.path === 'string' && pluginEntry.source.path.trim().length > 0, 'marketplace plugin source.path is required');

    const pluginRoot = path.resolve(repoRoot, pluginEntry.source.path);
    assertInsideRepo(pluginRoot, 'pluginRoot');
    const pluginManifestPath = path.join(pluginRoot, '.codex-plugin', 'plugin.json');
    ensureFile(pluginManifestPath);

    const pluginManifest = readJson(pluginManifestPath);
    assert(pluginManifest.name === pluginEntry.name, 'plugin manifest name mismatch');
    assert(typeof pluginManifest.skills === 'string' && pluginManifest.skills.trim().length > 0, 'plugin manifest skills path is required');

    const skillsPath = path.resolve(pluginRoot, pluginManifest.skills);
    assertInsideRepo(skillsPath, 'skillsPath');
    ensureDir(skillsPath);
    ensureFile(path.join(skillsPath, 'using-agent-skills', 'SKILL.md'));
    ensureFile(path.join(skillsPath, 'tool-discovery-and-installation', 'SKILL.md'));

    const workspaceTarget = path.join(scratchRoot, 'workspace-target');

    run('node', ['scripts/bootstrap_agent_files.js', workspaceTarget, '--force'], repoRoot);
    run('node', ['scripts/init_project_workspace.js', workspaceTarget, '--name', 'marketplace-smoke', '--idea', 'marketplace install smoke test'], repoRoot);
    run('node', ['scripts/init_session_loop.js', workspaceTarget, '--goal', 'marketplace install smoke', '--force'], repoRoot);
    run('node', ['scripts/validate_repo_integrity.js'], workspaceTarget);

    ensureFile(path.join(workspaceTarget, 'AGENTS.md'));
    ensureFile(path.join(workspaceTarget, 'README.md'));
    ensureFile(path.join(workspaceTarget, 'docs/SPEC.md'));
    ensureFile(path.join(workspaceTarget, '.agents/skills/using-agent-skills/SKILL.md'));
    ensureFile(path.join(workspaceTarget, '.claude/skills/using-agent-skills/SKILL.md'));
    ensureFile(path.join(workspaceTarget, 'skills/using-agent-skills/SKILL.md'));

    const wrapper = fs.readFileSync(path.join(workspaceTarget, '.claude/skills/using-agent-skills/SKILL.md'), 'utf8');
    assert(wrapper.includes('Canonical content lives at'), 'mirror wrapper missing canonical pointer');

    const canonical = fs.readFileSync(path.join(workspaceTarget, '.agents/skills/using-agent-skills/SKILL.md'), 'utf8');
    assert(canonical.includes('name: using-agent-skills'), 'canonical skill name missing');
    assert(canonical.includes('## 目標'), 'canonical skill core section missing');

    console.log('marketplace install smoke test ok');
  } finally {
    fs.rmSync(scratchRoot, { recursive: true, force: true });
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`marketplace install smoke test failed: ${error.message}`);
    process.exit(1);
  }
}
