#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const profilesPath = path.join(repoRoot, 'config', 'project_config_profiles.json');
const initWorkspaceScript = path.join(repoRoot, 'scripts', 'init_project_workspace.js');
const generateConfigsScript = path.join(repoRoot, 'scripts', 'generate_project_configs.js');
const prerequisiteDoctorScript = path.join(repoRoot, 'scripts', 'platform_prerequisite_doctor.js');

function parseArgs(argv) {
  const options = {
    targetDir: '',
    profile: '',
    projectName: '',
    projectIdea: '',
    language: 'typescript',
    styling: 'none',
    database: 'none',
    qualityTool: 'biome',
    packageManager: 'npm',
    platforms: '',
    skipInstall: false,
    run: false,
    force: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--profile') {
      options.profile = argv[i + 1] || options.profile;
      i += 1;
      continue;
    }
    if (arg === '--name') {
      options.projectName = argv[i + 1] || options.projectName;
      i += 1;
      continue;
    }
    if (arg === '--idea') {
      options.projectIdea = argv[i + 1] || options.projectIdea;
      i += 1;
      continue;
    }
    if (arg === '--language') {
      options.language = argv[i + 1] || options.language;
      i += 1;
      continue;
    }
    if (arg === '--styling') {
      options.styling = argv[i + 1] || options.styling;
      i += 1;
      continue;
    }
    if (arg === '--database') {
      options.database = argv[i + 1] || options.database;
      i += 1;
      continue;
    }
    if (arg === '--quality-tool') {
      options.qualityTool = argv[i + 1] || options.qualityTool;
      i += 1;
      continue;
    }
    if (arg === '--package-manager') {
      options.packageManager = argv[i + 1] || options.packageManager;
      i += 1;
      continue;
    }
    if (arg === '--platforms') {
      options.platforms = argv[i + 1] || options.platforms;
      i += 1;
      continue;
    }
    if (arg === '--skip-install') options.skipInstall = true;
    if (arg === '--run') options.run = true;
    if (arg === '--force') options.force = true;
    if (!arg.startsWith('--') && !options.targetDir) options.targetDir = arg;
  }

  return options;
}

function printUsage() {
  console.log('用法:');
  console.log('  node scripts/scaffold_project.js ../my-app --profile nextjs-app-router --styling tailwind --database supabase --quality-tool biome');
  console.log('  node scripts/scaffold_project.js ../my-app --profile vite-react --language typescript --styling tailwind --run');
  console.log('  node scripts/scaffold_project.js ../my-api --profile node-express-api --database supabase --run --force');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function isNonEmptyDir(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory() && fs.readdirSync(dirPath).length > 0;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function slugifyIdentifier(value) {
  return String(value || 'app')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/^[^a-z]+/, '')
    || 'app';
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    cwd: options.cwd || process.cwd(),
    shell: process.platform === 'win32'
  });

  if (result.status !== 0) {
    throw new Error(`指令失敗: ${command} ${args.join(' ')}`);
  }
}

function runJsonCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || process.cwd(),
    encoding: 'utf8',
    shell: process.platform === 'win32'
  });

  if (result.status !== 0) {
    throw new Error(`指令失敗: ${command} ${args.join(' ')}`);
  }

  return JSON.parse((result.stdout || '').trim());
}

function runPrerequisiteGate(profileKey) {
  const payload = runJsonCommand(process.execPath, [prerequisiteDoctorScript, '--profile', profileKey, '--json']);
  const result = payload.results[0];
  if (!result) return;

  if (result.status === 'not-ready') {
    const blockers = result.checks
      .filter((item) => item.status === 'fail')
      .map((item) => `${item.displayName}(${item.actual})`)
      .join(', ');
    throw new Error(`profile ${profileKey} prerequisite not-ready: ${blockers}`);
  }

  if (result.status === 'partial') {
    const warnings = result.checks
      .filter((item) => item.status === 'warn')
      .map((item) => `${item.displayName}(${item.actual})`)
      .join(', ');
    console.log(`⚠️ prerequisite partial: ${warnings}`);
  }
}

function resolveProfile(config, options) {
  const profile = config.profiles[options.profile];
  if (!profile) {
    throw new Error(`不支援的 profile: ${options.profile}`);
  }

  if ((profile.supportLevel || 'full') === 'plan-only') {
    return profile;
  }

  if (!profile.languages.includes(options.language)) {
    throw new Error(`profile ${options.profile} 不支援 language=${options.language}`);
  }
  if (!profile.styling.includes(options.styling)) {
    throw new Error(`profile ${options.profile} 不支援 styling=${options.styling}`);
  }
  if (!profile.databases.includes(options.database)) {
    throw new Error(`profile ${options.profile} 不支援 database=${options.database}`);
  }
  if (!profile.qualityTools.includes(options.qualityTool)) {
    throw new Error(`profile ${options.profile} 不支援 qualityTool=${options.qualityTool}`);
  }

  return profile;
}

function buildNextCommand(projectName, options) {
  const args = [
    'create-next-app@latest',
    projectName,
    options.language === 'typescript' ? '--ts' : '--js',
    options.styling === 'tailwind' ? '--tailwind' : '--no-tailwind',
    '--app',
    '--src-dir',
    '--empty',
    '--yes',
    '--disable-git',
    `--use-${options.packageManager}`
  ];

  if (options.qualityTool === 'biome') {
    args.push('--no-eslint');
  } else {
    args.push('--no-eslint');
  }

  if (options.skipInstall) {
    args.push('--skip-install');
  }

  return {
    command: 'npx',
    args
  };
}

function buildViteCommand(projectName, options) {
  const template = options.language === 'typescript' ? 'react-ts' : 'react';

  if (options.packageManager === 'pnpm') {
    return {
      command: 'pnpm',
      args: ['create', 'vite', projectName, '--template', template, '--no-interactive']
    };
  }

  if (options.packageManager === 'yarn') {
    return {
      command: 'yarn',
      args: ['create', 'vite', projectName, '--template', template, '--no-interactive']
    };
  }

  if (options.packageManager === 'bun') {
    return {
      command: 'bun',
      args: ['create', 'vite', projectName, '--template', template, '--no-interactive']
    };
  }

  return {
    command: 'npm',
    args: ['create', 'vite@latest', projectName, '--', '--template', template, '--no-interactive']
  };
}

function buildApiCommand(targetRoot) {
  return {
    command: 'npm',
    args: ['init', '-y'],
    cwd: targetRoot
  };
}

function buildManualPlanCommand(label) {
  return {
    command: 'manual',
    args: [label]
  };
}

function buildScaffoldCommand(profileKey, projectName, targetRoot, options) {
  if (profileKey === 'nextjs-app-router') {
    return buildNextCommand(projectName, options);
  }

  if (profileKey === 'vite-react') {
    return buildViteCommand(projectName, options);
  }

  if (profileKey === 'node-express-api') {
    return buildApiCommand(targetRoot);
  }

  if (profileKey === 'react-native-expo') {
    const template = options.language === 'typescript' ? 'blank-typescript' : 'blank';
    const args = ['create-expo-app@latest', projectName, '--yes', '--template', template, '--no-agents-md'];
    if (options.skipInstall) {
      args.push('--no-install');
    }
    return {
      command: 'npx',
      args
    };
  }

  if (profileKey === 'capacitor-mobile-app') {
    return {
      command: 'npm',
      args: [
        'init',
        '@capacitor/app@latest',
        targetRoot,
        '--',
        '--name',
        projectName,
        '--app-id',
        `com.nomoneydaddy.${slugifyIdentifier(projectName)}`
      ]
    };
  }

  if (profileKey === 'flutter-app') {
    const args = ['create', projectName];
    if (options.platforms) {
      args.push('--platforms', options.platforms);
    }
    return {
      command: 'flutter',
      args
    };
  }

  if (profileKey === 'tauri-desktop') {
    const template = options.language === 'typescript' ? 'vanilla-ts' : 'vanilla';
    return {
      command: 'npm',
      args: ['create', 'tauri-app@latest', projectName, '--', '--manager', options.packageManager, '--template', template, '--yes']
    };
  }

  if (profileKey === 'electron-desktop') {
    return {
      command: 'internal-electron-bootstrap',
      args: [projectName]
    };
  }

  if (profileKey === 'ios-swiftui') {
    return buildManualPlanCommand('create a new Xcode SwiftUI project');
  }

  if (profileKey === 'android-kotlin') {
    return buildManualPlanCommand('create a new Android Studio Kotlin project');
  }

  throw new Error(`尚未支援的 scaffold profile: ${profileKey}`);
}

function installCommand(packageManager, profileKey) {
  if (profileKey === 'flutter-app') return 'flutter pub get';
  if (packageManager === 'pnpm') return 'pnpm install';
  if (packageManager === 'yarn') return 'yarn install';
  if (packageManager === 'bun') return 'bun install';
  return 'npm install';
}

function formatCommand(scaffold) {
  if (scaffold.command === 'internal-electron-bootstrap') {
    return `mkdir -p <target> && (cd <target> && npm init -y && npm install -D electron)`;
  }
  const command = `${scaffold.command} ${scaffold.args.join(' ')}`;
  return scaffold.cwd ? `(cd ${scaffold.cwd} && ${command})` : command;
}

function printPlan(profileKey, profile, targetRoot, projectName, options, scaffold) {
  console.log('Scaffold 計畫');
  console.log(`- 目標目錄: ${targetRoot}`);
  console.log(`- Profile: ${profile.displayName} (${profileKey})`);
  console.log(`- Support level: ${profile.supportLevel || 'full'}`);
  console.log(`- 官方 scaffold baseline: ${profile.officialScaffold}`);
  if (profile.manualRunbook) {
    console.log(`- Manual runbook: ${profile.manualRunbook}`);
  }
  console.log(`- Recommended Node.js: ${profile.recommendedNode}`);
  console.log(`- Language: ${options.language}`);
  console.log(`- Styling: ${options.styling}`);
  console.log(`- Database: ${options.database}`);
  console.log(`- Quality tool: ${options.qualityTool}`);
  console.log(`- Package manager: ${options.packageManager}`);
  console.log(`- Platforms: ${options.platforms || 'default'}`);
  console.log(`- Project name: ${projectName}`);
  console.log(`- skipInstall: ${options.skipInstall ? 'yes' : 'no'}`);
  console.log('\n將執行:');
  console.log(`1. 官方 scaffold: ${formatCommand(scaffold)}`);
  console.log(`2. 套治理層: node scripts/init_project_workspace.js ${targetRoot} --name ${projectName} --idea "${options.projectIdea || '待補'}" --force`);
  console.log(`3. 對齊設定檔: node scripts/generate_project_configs.js --profile ${profileKey} --target ${targetRoot} --name ${projectName} --language ${options.language} --styling ${options.styling} --database ${options.database} --quality-tool ${options.qualityTool} --package-manager ${options.packageManager} --write`);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.targetDir || !options.profile) {
    printUsage();
    process.exit(1);
  }

  const config = readJson(profilesPath);
  const profile = resolveProfile(config, options);
  const targetRoot = path.resolve(process.cwd(), options.targetDir);
  const projectName = options.projectName || path.basename(targetRoot);

  if (isNonEmptyDir(targetRoot) && !options.force) {
    throw new Error(`目標目錄已存在且非空：${targetRoot}。若要覆蓋流程檔，請加 --force。`);
  }

  const scaffold = buildScaffoldCommand(options.profile, projectName, targetRoot, options);

  if (!options.run) {
    printPlan(options.profile, profile, targetRoot, projectName, options, scaffold);
    console.log('\n提示:');
    console.log(`- 真的執行時，加上 --run`);
    console.log(`- 若只想先看治理層，可用 node scripts/init_project_workspace.js ${targetRoot} --name ${projectName} --idea "${options.projectIdea || '待補'}"`);
    return;
  }

  if ((profile.supportLevel || 'full') === 'plan-only') {
    const runbookHint = profile.manualRunbook ? `；先照 ${profile.manualRunbook} 走官方建立流程` : '';
    throw new Error(`profile ${options.profile} 目前是 plan-only；已整理官方 scaffold 路徑，但尚未開放自動執行${runbookHint}`);
  }

  runPrerequisiteGate(options.profile);

  ensureDir(path.dirname(targetRoot));

  if (options.profile === 'node-express-api') {
    ensureDir(targetRoot);
  }

  if (options.profile === 'electron-desktop') {
    ensureDir(targetRoot);
    runCommand('npm', ['init', '-y'], { cwd: targetRoot });
    if (!options.skipInstall) {
      runCommand('npm', ['install', '-D', 'electron'], { cwd: targetRoot });
    }
  } else {
    runCommand(scaffold.command, scaffold.args, { cwd: scaffold.cwd || path.dirname(targetRoot) });
  }
  runCommand(process.execPath, [initWorkspaceScript, targetRoot, '--name', projectName, '--idea', options.projectIdea || '', '--force']);
  runCommand(process.execPath, [
    generateConfigsScript,
    '--profile',
    options.profile,
    '--target',
    targetRoot,
    '--name',
    projectName,
    '--language',
    options.language,
    '--styling',
    options.styling,
    '--database',
    options.database,
    '--quality-tool',
    options.qualityTool,
    '--package-manager',
    options.packageManager,
    '--write'
  ]);

  console.log('\nScaffold 完成。');
  console.log('下一步:');
  if (options.skipInstall) {
    console.log(`- 先執行 ${installCommand(options.packageManager, options.profile)}`);
  }
  console.log(`- cd ${targetRoot}`);
  console.log('- 讀 AGENTS.md 與 .loop/*');
  console.log('- 跑 node scripts/inspect_agent_capabilities.js');
  console.log('- 跑 node scripts/validate_repo_integrity.js');
  console.log('- 讀 docs/STACK_SETUP.md');
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`❌ 失敗: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  parseArgs,
  buildScaffoldCommand,
  resolveProfile
};
