#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const configPath = path.join(repoRoot, 'config', 'platform_prerequisites.json');

function parseArgs(argv) {
  const options = {
    profile: 'all',
    json: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--profile') {
      options.profile = argv[i + 1] || options.profile;
      i += 1;
      continue;
    }
    if (arg === '--json') {
      options.json = true;
    }
  }

  return options;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function currentHost() {
  if (process.platform === 'darwin') return 'macos';
  if (process.platform === 'win32') return 'windows';
  return 'linux';
}

function uniqueChecksForProfiles(profileEntries) {
  const names = new Set();
  for (const [, profile] of profileEntries) {
    for (const item of [...(profile.required || []), ...(profile.optional || [])]) {
      names.add(item.check);
    }
  }
  return Array.from(names).sort();
}

function runCheck(definition) {
  if (definition.type === 'command-exists') {
    const result = spawnSync(definition.command, definition.args || ['--version'], { encoding: 'utf8' });
    return {
      present: result.status === 0 || result.error == null,
      output: `${result.stdout || ''}${result.stderr || ''}`.trim()
    };
  }

  if (definition.type === 'path-exists') {
    return {
      present: fs.existsSync(definition.path),
      output: definition.path
    };
  }

  const result = spawnSync(definition.command, definition.args || [], { encoding: 'utf8' });
  const output = `${result.stdout || ''}${result.stderr || ''}`.trim();
  const match = definition.version_pattern ? output.match(new RegExp(definition.version_pattern, 'i')) : null;
  return {
    present: result.status === 0,
    output,
    major: match ? Number(match[1]) : null
  };
}

function evaluateRequirement(requirement, probe, definitions) {
  const checkDefinition = definitions[requirement.check];
  const severity = requirement.severity || 'fail';
  const missingStatus = severity === 'fail' ? 'fail' : 'warn';

  if (!probe.present) {
    return {
      check: requirement.check,
      displayName: checkDefinition.displayName,
      status: missingStatus,
      reason: requirement.reason,
      expected: requirement.min_major ? `>=${requirement.min_major}` : 'present',
      actual: 'missing'
    };
  }

  if (requirement.min_major && typeof probe.major === 'number' && probe.major < requirement.min_major) {
    return {
      check: requirement.check,
      displayName: checkDefinition.displayName,
      status: severity === 'fail' ? 'fail' : 'warn',
      reason: requirement.reason,
      expected: `>=${requirement.min_major}`,
      actual: probe.major
    };
  }

  return {
    check: requirement.check,
    displayName: checkDefinition.displayName,
    status: 'pass',
    reason: requirement.reason,
    expected: requirement.min_major ? `>=${requirement.min_major}` : 'present',
    actual: typeof probe.major === 'number' ? probe.major : 'present'
  };
}

function evaluateProfiles(config, probes, options) {
  const entries = Object.entries(config.profiles).filter(([name]) => options.profile === 'all' || name === options.profile);
  if (entries.length === 0) {
    throw new Error(`unknown profile: ${options.profile}`);
  }

  return entries.map(([profileName, profile]) => {
    const checks = [...(profile.required || []), ...(profile.optional || [])].map((requirement) =>
      evaluateRequirement(requirement, probes[requirement.check] || { present: false }, config.checks)
    );

    const hasFail = checks.some((item) => item.status === 'fail');
    const hasWarn = checks.some((item) => item.status === 'warn');

    return {
      profile: profileName,
      displayName: profile.displayName,
      host: currentHost(),
      status: hasFail ? 'not-ready' : hasWarn ? 'partial' : 'ready',
      checks,
      official_docs: profile.official_docs || []
    };
  });
}

function printHuman(results) {
  console.log(`Platform prerequisite doctor`);
  console.log(`- host: ${currentHost()}`);

  for (const result of results) {
    console.log(`\n[${result.profile}] ${result.displayName}`);
    console.log(`- status: ${result.status}`);
    for (const item of result.checks) {
      const icon = item.status === 'pass' ? '✅' : item.status === 'warn' ? '⚠️' : '❌';
      console.log(`  ${icon} ${item.displayName} | expected=${item.expected} | actual=${item.actual} | ${item.reason}`);
    }
    if (result.official_docs.length > 0) {
      console.log(`- official docs:`);
      for (const link of result.official_docs) {
        console.log(`  - ${link}`);
      }
    }
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const config = readJson(configPath);
  const checkNames = uniqueChecksForProfiles(
    Object.entries(config.profiles).filter(([name]) => options.profile === 'all' || name === options.profile)
  );
  const probes = {};

  for (const checkName of checkNames) {
    probes[checkName] = runCheck(config.checks[checkName]);
  }

  const results = evaluateProfiles(config, probes, options);
  if (options.json) {
    console.log(JSON.stringify({ host: currentHost(), results }, null, 2));
    return;
  }

  printHuman(results);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`platform prerequisite doctor failed: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  evaluateProfiles
};
