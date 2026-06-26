#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const cwd = process.cwd();
const homeDir = os.homedir();

const skillRoots = [
  { name: 'repo-.agents', path: path.join(cwd, '.agents', 'skills') },
  { name: 'repo-skills', path: path.join(cwd, 'skills') },
  { name: 'codex-global', path: path.join(homeDir, '.codex', 'skills') },
  { name: 'claude-global', path: path.join(homeDir, '.claude', 'skills') },
  { name: 'hermes-global', path: path.join(homeDir, '.hermes', 'skills') }
];

const mcpSources = [
  { name: 'codex-user', type: 'toml', path: path.join(homeDir, '.codex', 'config.toml') },
  { name: 'codex-project', type: 'toml', path: path.join(cwd, '.codex', 'config.toml') },
  { name: 'claude-user-local', type: 'json-recursive', path: path.join(homeDir, '.claude.json') },
  { name: 'claude-project', type: 'json', path: path.join(cwd, '.mcp.json') },
  { name: 'cursor-project', type: 'json', path: path.join(cwd, '.cursor', 'mcp.json') }
];

const recommendedTools = [
  { name: 'ripgrep', command: 'rg', category: 'core' },
  { name: 'fd', command: 'fd', alternates: ['fdfind'], category: 'core' },
  { name: 'fzf', command: 'fzf', category: 'core' },
  { name: 'zoxide', command: 'zoxide', category: 'core' },
  { name: 'bat', command: 'bat', alternates: ['batcat'], category: 'core' },
  { name: 'jq', command: 'jq', category: 'core' },
  { name: 'hyperfine', command: 'hyperfine', category: 'core' },
  { name: 'delta', command: 'delta', category: 'core' },
  { name: 'Semble', command: 'semble', category: 'ai' },
  { name: 'mcp-cli', command: 'mcp-cli', category: 'ai' },
  { name: 'playwright-cli', command: 'playwright-cli', category: 'ai' },
  { name: 'agent-browser', command: 'agent-browser', category: 'ai' },
  { name: 'Biome', command: 'biome', category: 'quality' }
];

const scriptCapabilitiesPath = path.join(cwd, 'config', 'script_capabilities.json');

function commandExists(command) {
  const lookup = process.platform === 'win32' ? 'where' : 'which';
  const result = spawnSync(lookup, [command], { stdio: 'ignore' });
  return result.status === 0;
}

function findInstalledCommand(commands) {
  for (const command of commands) {
    if (commandExists(command)) return command;
  }
  return null;
}

function walkSkillRoot(rootPath, found = new Set()) {
  if (!fs.existsSync(rootPath)) return found;

  for (const entry of fs.readdirSync(rootPath, { withFileTypes: true })) {
    const fullPath = path.join(rootPath, entry.name);
    if (!entry.isDirectory()) continue;

    if (fs.existsSync(path.join(fullPath, 'SKILL.md'))) {
      found.add(entry.name);
    }
    walkSkillRoot(fullPath, found);
  }

  return found;
}

function listSkills() {
  return skillRoots.map((root) => {
    const skills = Array.from(walkSkillRoot(root.path)).sort();
    return {
      name: root.name,
      path: root.path,
      exists: fs.existsSync(root.path),
      count: skills.length,
      skills
    };
  });
}

function parseTomlMcpServers(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = new Set();

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    const direct = trimmed.match(/^\[mcp_servers\.(?:"([^"]+)"|([A-Za-z0-9_-]+))\]$/);
    if (direct) matches.add(direct[1] || direct[2]);

    const plugin = trimmed.match(/^\[plugins\."[^"]+"\.(?:mcp_servers)\.(?:"([^"]+)"|([A-Za-z0-9_-]+))\]$/);
    if (plugin) matches.add(plugin[1] || plugin[2]);
  }

  return Array.from(matches).sort();
}

function collectJsonMcpServers(node, found = new Set()) {
  if (Array.isArray(node)) {
    for (const item of node) collectJsonMcpServers(item, found);
    return found;
  }

  if (!node || typeof node !== 'object') return found;

  if (node.mcpServers && typeof node.mcpServers === 'object' && !Array.isArray(node.mcpServers)) {
    for (const name of Object.keys(node.mcpServers)) {
      found.add(name);
    }
  }

  for (const value of Object.values(node)) {
    collectJsonMcpServers(value, found);
  }

  return found;
}

function parseJsonMcpServers(filePath, recursive = false) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (recursive) {
    return Array.from(collectJsonMcpServers(data)).sort();
  }
  const servers = data.mcpServers && typeof data.mcpServers === 'object' ? Object.keys(data.mcpServers) : [];
  return servers.sort();
}

function listMcpServers() {
  return mcpSources.map((source) => {
    if (!fs.existsSync(source.path)) {
      return {
        name: source.name,
        path: source.path,
        exists: false,
        servers: []
      };
    }

    try {
      const servers =
        source.type === 'toml'
          ? parseTomlMcpServers(source.path)
          : parseJsonMcpServers(source.path, source.type === 'json-recursive');

      return {
        name: source.name,
        path: source.path,
        exists: true,
        servers
      };
    } catch (error) {
      return {
        name: source.name,
        path: source.path,
        exists: true,
        servers: [],
        error: error.message
      };
    }
  });
}

function inspectTools() {
  return recommendedTools.map((tool) => {
    const detectedCommand = findInstalledCommand([tool.command, ...(tool.alternates || [])]);
    return {
      ...tool,
      installed: Boolean(detectedCommand),
      detectedCommand
    };
  });
}

function listScriptCapabilities() {
  if (!fs.existsSync(scriptCapabilitiesPath)) {
    return {
      exists: false,
      path: scriptCapabilitiesPath,
      scripts: []
    };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(scriptCapabilitiesPath, 'utf8'));
    const scripts = Array.isArray(parsed.scripts) ? parsed.scripts : [];
    return {
      exists: true,
      path: scriptCapabilitiesPath,
      scripts
    };
  } catch (error) {
    return {
      exists: true,
      path: scriptCapabilitiesPath,
      scripts: [],
      error: error.message
    };
  }
}

function buildSummary(payload) {
  const missingCore = payload.tools.filter((tool) => tool.category === 'core' && !tool.installed);
  const uniqueMcp = new Set(payload.mcp.flatMap((source) => source.servers));
  const repoInternal = payload.skills.find((group) => group.name === 'repo-.agents');
  const summary = [];

  summary.push(`專案目錄: ${payload.cwd}`);
  summary.push(`repo 內建 skills: ${repoInternal ? repoInternal.count : 0}`);
  summary.push(`已偵測 MCP 伺服器: ${uniqueMcp.size}`);

  if (missingCore.length > 0) {
    summary.push(`缺少 core 工具: ${missingCore.map((tool) => tool.command).join(', ')}`);
  } else {
    summary.push('core 工具齊備');
  }

  if (payload.scriptCapabilities.exists) {
    summary.push(`腳本能力檔: ${payload.scriptCapabilities.scripts.length} 個腳本`);
  } else {
    summary.push('腳本能力檔未找到');
  }

  return summary;
}

function buildPayload() {
  return {
    cwd,
    skills: listSkills(),
    mcp: listMcpServers(),
    tools: inspectTools(),
    scriptCapabilities: listScriptCapabilities(),
    summary: []
  };
}

function printHuman(payload) {
  console.log('Agent 能力盤點');
  console.log(`- 專案目錄: ${payload.cwd}`);

  console.log('\nSkills:');
  for (const group of payload.skills) {
    const status = group.exists ? `${group.count} 個` : '未找到';
    console.log(`- ${group.name}: ${status}`);
    if (group.skills.length > 0) {
      console.log(`  ${group.skills.join(', ')}`);
    }
  }

  console.log('\nMCP:');
  for (const source of payload.mcp) {
    if (!source.exists) {
      console.log(`- ${source.name}: 未找到設定`);
      continue;
    }

    if (source.error) {
      console.log(`- ${source.name}: 讀取失敗 | ${source.error}`);
      continue;
    }

    console.log(`- ${source.name}: ${source.servers.length} 個`);
    if (source.servers.length > 0) {
      console.log(`  ${source.servers.join(', ')}`);
    }
  }

  console.log('\n工具:');
  for (const tool of payload.tools) {
    if (tool.installed && tool.detectedCommand && tool.detectedCommand !== tool.command) {
      console.log(`- ${tool.command}: 已安裝(${tool.detectedCommand}) | ${tool.category}`);
      continue;
    }

    console.log(`- ${tool.command}: ${tool.installed ? '已安裝' : '未安裝'} | ${tool.category}`);
  }

  console.log('\n腳本能力:');
  if (!payload.scriptCapabilities.exists) {
    console.log('- 未找到 config/script_capabilities.json');
  } else if (payload.scriptCapabilities.error) {
    console.log(`- 讀取失敗 | ${payload.scriptCapabilities.error}`);
  } else {
    for (const script of payload.scriptCapabilities.scripts) {
      console.log(
        `- ${script.path}: ${script.category} | requires=${script.requires.join(', ')} | fallback=${script.fallback_mode}`
      );
    }
  }

  console.log('\n摘要:');
  for (const line of payload.summary) {
    console.log(`- ${line}`);
  }

  console.log('\n建議下一步:');
  console.log('- 新專案：先做想法釐清 → 技術棧 → 能力盤點 → API Key → 初步方案 → 完整計畫 → loop');
  console.log('- 舊專案：先做能力盤點 → 架構/測試/依賴審查 → 提改善建議與重構切片，再等確認');
  console.log('- 若缺 CLI / sandbox 工具：先跑 bash scripts/setup_sandbox_tools.sh --doctor');
  console.log('- JS / TS 專案：若有 Biome，切片後跑 check --write；合併前跑 ci');
  console.log('- 技術棧若已確認：先跑 scripts/generate_project_configs.js，把 package / tsconfig / env example / framework config 落地');
  console.log('- 若腳本跑不了：改讀 docs/script_fallback_matrix.md，走對應 fallback');
}

function main() {
  const jsonMode = process.argv.includes('--json');
  const payload = buildPayload();
  payload.summary = buildSummary(payload);

  if (jsonMode) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  printHuman(payload);
}

main();
