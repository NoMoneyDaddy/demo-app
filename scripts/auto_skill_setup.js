#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const profileConfigPath = path.join(repoRoot, 'config/skill_profiles.json');
const toolingConfigPath = path.join(repoRoot, 'config/tooling_profiles.json');
const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
const installerRoot =
  process.env.CODEX_SKILL_INSTALLER_ROOT || path.join(codexHome, 'skills', '.system', 'skill-installer');
const listScript = path.join(installerRoot, 'scripts/list-skills.py');
const installScript = path.join(installerRoot, 'scripts/install-skill-from-github.py');
const installedRoot = path.join(codexHome, 'skills');

function parseArgs(argv) {
  const options = {
    projectType: 'web-app',
    uiStyle: '',
    deployment: '',
    database: '',
    language: '',
    install: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--project-type') {
      options.projectType = argv[i + 1] || options.projectType;
      i += 1;
      continue;
    }
    if (arg === '--ui-style') {
      options.uiStyle = argv[i + 1] || '';
      i += 1;
      continue;
    }
    if (arg === '--deployment') {
      options.deployment = argv[i + 1] || '';
      i += 1;
      continue;
    }
    if (arg === '--database') {
      options.database = argv[i + 1] || '';
      i += 1;
      continue;
    }
    if (arg === '--language') {
      options.language = argv[i + 1] || '';
      i += 1;
      continue;
    }
    if (arg === '--install') options.install = true;
  }

  return options;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function listInstalledSkills() {
  if (!fs.existsSync(installedRoot)) return new Set();
  return new Set(
    fs.readdirSync(installedRoot).filter((entry) =>
      fs.statSync(path.join(installedRoot, entry)).isDirectory()
    )
  );
}

function listInternalSkills() {
  const found = new Set();
  const roots = [
    path.join(repoRoot, '.agents', 'skills'),
    path.join(repoRoot, 'skills')
  ].filter((candidate) => fs.existsSync(candidate));

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const skillMd = path.join(fullPath, 'SKILL.md');
        if (fs.existsSync(skillMd)) {
          found.add(path.basename(fullPath));
        }
        walk(fullPath);
      }
    }
  }

  for (const root of roots) {
    walk(root);
  }
  return found;
}

function matchesRule(rule, context) {
  return Object.entries(rule.when).every(([key, values]) => values.includes(context[key]));
}

function resolveProfiles(config, context) {
  const selectedGroups = new Set();
  for (const rule of config.rules) {
    if (matchesRule(rule, context)) {
      rule.include.forEach((group) => selectedGroups.add(group));
    }
  }

  const skills = [];
  for (const group of selectedGroups) {
    const entries = config.profiles[group] || [];
    for (const entry of entries) {
      skills.push(entry);
    }
  }

  return skills;
}

function commandExists(command) {
  if (!command) return false;
  const lookup = process.platform === 'win32' ? 'where' : 'which';
  const result = spawnSync(lookup, [command], { stdio: 'ignore' });
  return result.status === 0;
}

function fetchCuratedSkills() {
  if (!fs.existsSync(listScript)) {
    return [];
  }

  const result = spawnSync('python3', [listScript, '--format', 'json'], {
    encoding: 'utf8'
  });

  if (result.status !== 0) {
    return [];
  }

  try {
    return JSON.parse(result.stdout);
  } catch {
    return [];
  }
}

function installGithubSkill(skill) {
  if (!skill.repo || !skill.path) {
    console.log(`⚠️ 無法自動安裝 ${skill.name}，缺少 repo/path`);
    return false;
  }
  if (!fs.existsSync(installScript)) {
    console.log(`⚠️ 找不到 skill installer: ${installScript}`);
    return false;
  }

  const args = [installScript, '--repo', skill.repo, '--path', skill.path];
  const result = spawnSync('python3', args, { stdio: 'inherit' });
  return result.status === 0;
}

function resolveSkillStatus(skill, installed) {
  if (skill.source === 'internal') return '已內建';
  if (installed) return '已可用';
  return '未安裝';
}

function resolveCuratedStatus(skill, availableInCurated) {
  if (skill.source === 'internal') return 'repo 內建 workflow';
  if (availableInCurated) return 'curated 可用';
  return '非 curated / 外部來源';
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const config = readJson(profileConfigPath);
  const toolingConfig = fs.existsSync(toolingConfigPath)
    ? readJson(toolingConfigPath)
    : { profiles: {}, rules: [] };
  const installedSkills = listInstalledSkills();
  const internalSkills = listInternalSkills();
  const curatedSkills = fetchCuratedSkills();
  const curatedNames = new Set(curatedSkills.map((item) => item.name));
  const context = {
    projectType: options.projectType,
    uiStyle: options.uiStyle,
    deployment: options.deployment,
    database: options.database,
    language: options.language
  };

  const resolvedSkills = resolveProfiles(config, context);
  const resolvedTools = resolveProfiles(toolingConfig, context);

  if (resolvedSkills.length === 0) {
    console.log('找不到對應的 skill 配置。');
    process.exit(0);
  }

  console.log('建議 skills:');
  for (const skill of resolvedSkills) {
    const installed = skill.source === 'internal' || installedSkills.has(skill.name) || internalSkills.has(skill.name);
    const availableInCurated = curatedNames.has(skill.name);
    const status = resolveSkillStatus(skill, installed);
    const curated = resolveCuratedStatus(skill, availableInCurated);
    console.log(`- ${skill.name} | ${status} | ${curated} | ${skill.reason}`);
  }

  if (resolvedTools.length > 0) {
    console.log('\n建議外部工具:');
    for (const tool of resolvedTools) {
      const status = commandExists(tool.command) ? '已可用' : '未安裝';
      const install = tool.install ? ` | 安裝: ${tool.install}` : '';
      console.log(`- ${tool.name} | ${status} | ${tool.reason}${install}`);
      if (tool.homepage) {
        console.log(`  ${tool.homepage}`);
      }
    }
    console.log('\nSandbox / GitHub 環境可先執行: bash scripts/setup_sandbox_tools.sh --plan');
  }

  if (!options.install) {
    console.log('\n加上 `--install` 會嘗試安裝可自動安裝的 skills。外部工具仍以官方安裝流程為主。');
    process.exit(0);
  }

  for (const skill of resolvedSkills) {
    if (installedSkills.has(skill.name)) {
      continue;
    }

    if (skill.source === 'github') {
      console.log(`\n⬇️ 安裝 ${skill.name}...`);
      const ok = installGithubSkill(skill);
      if (!ok) {
        console.log(`⚠️ 安裝失敗: ${skill.name}`);
      }
      continue;
    }

    if (skill.source === 'internal') {
      console.log(`\nℹ️ ${skill.name} 為 repo 內建 workflow skill，無需額外安裝。`);
      continue;
    }

    if (skill.source === 'manual') {
      console.log(`\n⚠️ ${skill.name} 需要手動安裝：${skill.reason}`);
      continue;
    }

    console.log(`\nℹ️ ${skill.name} 為系統內建 skill，通常無需安裝。`);
  }

  for (const tool of resolvedTools) {
    if (commandExists(tool.command)) {
      continue;
    }

    console.log(`\n⚠️ ${tool.name} 建議依官方方式安裝。`);
    if (tool.install) {
      console.log(`   建議指令: ${tool.install}`);
    }
    if (tool.homepage) {
      console.log(`   官方首頁: ${tool.homepage}`);
    }
  }

  console.log('\n完成。若有新 skill 安裝成功，請重啟 Codex。');
}

main();
