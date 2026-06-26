#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const profilesPath = path.join(repoRoot, 'config', 'project_config_profiles.json');

function parseArgs(argv) {
  const options = {
    targetDir: '.',
    profile: '',
    projectName: '',
    projectType: 'web-app',
    language: 'typescript',
    styling: 'none',
    database: 'none',
    qualityTool: 'biome',
    packageManager: 'npm',
    force: false,
    write: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--target') options.targetDir = argv[i + 1] || options.targetDir;
    if (arg === '--profile') options.profile = argv[i + 1] || options.profile;
    if (arg === '--name') options.projectName = argv[i + 1] || options.projectName;
    if (arg === '--project-type') options.projectType = argv[i + 1] || options.projectType;
    if (arg === '--language') options.language = argv[i + 1] || options.language;
    if (arg === '--styling') options.styling = argv[i + 1] || options.styling;
    if (arg === '--database') options.database = argv[i + 1] || options.database;
    if (arg === '--quality-tool') options.qualityTool = argv[i + 1] || options.qualityTool;
    if (arg === '--package-manager') options.packageManager = argv[i + 1] || options.packageManager;
    if (arg === '--write') options.write = true;
    if (arg === '--force') options.force = true;
  }

  return options;
}

function printUsage() {
  console.log('用法:');
  console.log('  node scripts/generate_project_configs.js --profile nextjs-app-router --name my-app --language typescript --styling tailwind --database supabase --quality-tool biome');
  console.log('  node scripts/generate_project_configs.js --profile vite-react --target ../my-app --write');
  console.log('  node scripts/generate_project_configs.js --profile node-express-api --project-type api-service --write --force');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFileIfAllowed(filePath, content, force) {
  if (!force && fs.existsSync(filePath)) {
    return 'skipped';
  }

  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  return fs.existsSync(filePath) ? 'written' : 'skipped';
}

function mergePackageJson(existing, generated, force) {
  const merged = { ...existing };

  for (const key of ['name', 'private', 'type', 'engines', 'main']) {
    if (generated[key] === undefined) continue;
    if (force || merged[key] === undefined) {
      merged[key] = generated[key];
    }
  }

  if (!force && existing.name === 'capacitor-app' && generated.name) {
    merged.name = generated.name;
  }

  if (!force && existing.main === 'index.js' && generated.main === 'main.js') {
    merged.main = generated.main;
  }

  for (const key of ['scripts', 'dependencies', 'devDependencies']) {
    merged[key] = { ...(existing[key] || {}) };
    for (const [entryKey, entryValue] of Object.entries(generated[key] || {})) {
      if (force || merged[key][entryKey] === undefined) {
        merged[key][entryKey] = entryValue;
      }
    }

    if (Object.keys(merged[key]).length === 0) {
      delete merged[key];
    }
  }

  return merged;
}

function resolveProfile(config, options) {
  const direct = config.profiles[options.profile];
  if (!direct) {
    throw new Error(`不支援的 profile: ${options.profile}`);
  }

  if (!direct.languages.includes(options.language)) {
    throw new Error(`profile ${options.profile} 不支援 language=${options.language}`);
  }

  if (!direct.styling.includes(options.styling)) {
    throw new Error(`profile ${options.profile} 不支援 styling=${options.styling}`);
  }

  if (!direct.databases.includes(options.database)) {
    throw new Error(`profile ${options.profile} 不支援 database=${options.database}`);
  }

  if (!direct.qualityTools.includes(options.qualityTool)) {
    throw new Error(`profile ${options.profile} 不支援 qualityTool=${options.qualityTool}`);
  }

  return direct;
}

function guessName(targetRoot, options) {
  if (options.projectName) return options.projectName;
  return path.basename(targetRoot);
}

function packageJsonBase(name) {
  return {
    name,
    private: true,
    scripts: {},
    dependencies: {},
    devDependencies: {}
  };
}

function buildGitignore(profile, options) {
  const lines = [
    'node_modules',
    '.env',
    '.env.local',
    '.env.*.local',
    '.DS_Store',
    'coverage'
  ];

  if (profile === 'nextjs-app-router') {
    lines.push('.next', 'out', 'next-env.d.ts');
  }

  if (profile === 'vite-react') {
    lines.push('dist', '.vite');
  }

  if (profile === 'node-express-api') {
    lines.push('dist');
  }

  if (profile === 'react-native-expo') {
    lines.push('.expo', '.expo-shared', 'dist', 'web-build');
  }

  if (profile === 'tauri-desktop') {
    lines.push('dist', '.vite', 'src-tauri/target', 'target');
  }

  if (profile === 'capacitor-mobile-app') {
    lines.push('dist', '.vite', 'android', 'ios');
  }

  if (profile === 'electron-desktop') {
    lines.push('node_modules', 'out');
  }

  if (profile === 'flutter-app') {
    lines.push('.dart_tool', '.flutter-plugins', '.flutter-plugins-dependencies', 'build');
  }

  if (options.database === 'supabase') {
    lines.push('supabase/.temp', '.branches');
  }

  return `${Array.from(new Set(lines)).join('\n')}\n`;
}

function buildBiomeConfig() {
  return `${JSON.stringify(
    {
      formatter: {
        enabled: true,
        indentStyle: 'space'
      },
      linter: {
        enabled: true
      },
      organizeImports: {
        enabled: true
      }
    },
    null,
    2
  )}\n`;
}

function buildNextPackageJson(name, options) {
  const pkg = packageJsonBase(name);
  pkg.scripts = {
    dev: 'next dev',
    build: 'next build',
    start: 'next start',
    typecheck: options.language === 'typescript' ? 'tsc --noEmit' : 'echo "No TypeScript configured"'
  };
  pkg.dependencies = {
    next: 'latest',
    react: 'latest',
    'react-dom': 'latest'
  };
  pkg.devDependencies = {};

  if (options.language === 'typescript') {
    pkg.devDependencies.typescript = 'latest';
    pkg.devDependencies['@types/node'] = 'latest';
    pkg.devDependencies['@types/react'] = 'latest';
    pkg.devDependencies['@types/react-dom'] = 'latest';
  }

  if (options.styling === 'tailwind') {
    pkg.devDependencies.tailwindcss = 'latest';
    pkg.devDependencies['@tailwindcss/postcss'] = 'latest';
    pkg.devDependencies.postcss = 'latest';
  }

  if (options.database === 'supabase') {
    pkg.dependencies['@supabase/supabase-js'] = 'latest';
  }

  if (options.qualityTool === 'biome') {
    pkg.devDependencies['@biomejs/biome'] = 'latest';
    pkg.scripts.format = 'biome format --write .';
    pkg.scripts.lint = 'biome lint .';
    pkg.scripts.check = 'biome check .';
    pkg.scripts['check:write'] = 'biome check --write .';
  }

  return pkg;
}

function buildVitePackageJson(name, options) {
  const pkg = packageJsonBase(name);
  pkg.type = 'module';
  pkg.scripts = {
    dev: 'vite',
    build: options.language === 'typescript' ? 'tsc -b && vite build' : 'vite build',
    preview: 'vite preview'
  };
  pkg.dependencies = {
    react: 'latest',
    'react-dom': 'latest'
  };
  pkg.devDependencies = {
    vite: 'latest',
    '@vitejs/plugin-react': 'latest'
  };

  if (options.language === 'typescript') {
    pkg.devDependencies.typescript = 'latest';
    pkg.devDependencies['@types/react'] = 'latest';
    pkg.devDependencies['@types/react-dom'] = 'latest';
    pkg.scripts.typecheck = 'tsc --noEmit';
  }

  if (options.styling === 'tailwind') {
    pkg.devDependencies.tailwindcss = 'latest';
    pkg.devDependencies['@tailwindcss/vite'] = 'latest';
  }

  if (options.database === 'supabase') {
    pkg.dependencies['@supabase/supabase-js'] = 'latest';
  }

  if (options.qualityTool === 'biome') {
    pkg.devDependencies['@biomejs/biome'] = 'latest';
    pkg.scripts.format = 'biome format --write .';
    pkg.scripts.lint = 'biome lint .';
    pkg.scripts.check = 'biome check .';
    pkg.scripts['check:write'] = 'biome check --write .';
  }

  return pkg;
}

function buildExpressPackageJson(name, options) {
  const pkg = packageJsonBase(name);
  pkg.type = 'module';
  pkg.scripts = {
    dev: options.language === 'typescript' ? 'tsx watch src/index.ts' : 'node --watch src/index.js',
    build: options.language === 'typescript' ? 'tsc -p tsconfig.json' : 'echo "No build step configured"',
    start: options.language === 'typescript' ? 'node dist/index.js' : 'node src/index.js'
  };
  pkg.dependencies = {
    express: 'latest'
  };
  pkg.devDependencies = {
    '@types/node': 'latest'
  };

  if (options.language === 'typescript') {
    pkg.devDependencies.typescript = 'latest';
    pkg.devDependencies['@types/express'] = 'latest';
    pkg.devDependencies.tsx = 'latest';
    pkg.scripts.typecheck = 'tsc --noEmit -p tsconfig.json';
  }

  if (options.database === 'supabase') {
    pkg.dependencies['@supabase/supabase-js'] = 'latest';
  }

  if (options.qualityTool === 'biome') {
    pkg.devDependencies['@biomejs/biome'] = 'latest';
    pkg.scripts.format = 'biome format --write .';
    pkg.scripts.lint = 'biome lint .';
    pkg.scripts.check = 'biome check .';
    pkg.scripts['check:write'] = 'biome check --write .';
  }

  return pkg;
}

function buildExpoPackageJson(name, options) {
  const pkg = packageJsonBase(name);
  pkg.scripts = {};
  pkg.dependencies = {};
  pkg.devDependencies = {};

  if (options.language === 'typescript') {
    pkg.scripts.typecheck = 'tsc --noEmit';
    pkg.devDependencies.typescript = 'latest';
  }

  if (options.database === 'supabase') {
    pkg.dependencies['@supabase/supabase-js'] = 'latest';
  }

  if (options.qualityTool === 'biome') {
    pkg.devDependencies['@biomejs/biome'] = 'latest';
    pkg.scripts.format = 'biome format --write .';
    pkg.scripts.lint = 'biome lint .';
    pkg.scripts.check = 'biome check .';
    pkg.scripts['check:write'] = 'biome check --write .';
  }

  return pkg;
}

function buildTauriPackageJson(name, options) {
  const pkg = packageJsonBase(name);
  pkg.scripts = {};
  pkg.dependencies = {};
  pkg.devDependencies = {};

  if (options.language === 'typescript') {
    pkg.scripts.typecheck = 'tsc --noEmit';
    pkg.devDependencies.typescript = 'latest';
  }

  if (options.database === 'supabase') {
    pkg.dependencies['@supabase/supabase-js'] = 'latest';
  }

  if (options.qualityTool === 'biome') {
    pkg.devDependencies['@biomejs/biome'] = 'latest';
    pkg.scripts.format = 'biome format --write .';
    pkg.scripts.lint = 'biome lint .';
    pkg.scripts.check = 'biome check .';
    pkg.scripts['check:write'] = 'biome check --write .';
  }

  return pkg;
}

function buildCapacitorPackageJson(name, options) {
  const pkg = packageJsonBase(name);
  pkg.type = 'module';
  pkg.scripts = {};
  pkg.dependencies = {};
  pkg.devDependencies = {};

  if (options.language === 'typescript') {
    pkg.devDependencies.typescript = 'latest';
    pkg.scripts.typecheck = 'tsc --noEmit';
  }

  if (options.database === 'supabase') {
    pkg.dependencies['@supabase/supabase-js'] = 'latest';
  }

  if (options.qualityTool === 'biome') {
    pkg.devDependencies['@biomejs/biome'] = 'latest';
    pkg.scripts.format = 'biome format --write .';
    pkg.scripts.lint = 'biome lint .';
    pkg.scripts.check = 'biome check .';
    pkg.scripts['check:write'] = 'biome check --write .';
  }

  return pkg;
}

function buildElectronPackageJson(name, options) {
  const pkg = packageJsonBase(name);
  pkg.main = options.language === 'typescript' ? 'main.js' : 'main.js';
  pkg.type = 'commonjs';
  pkg.scripts = {
    start: 'electron .'
  };
  pkg.dependencies = {};
  pkg.devDependencies = {};

  if (options.language === 'typescript') {
    pkg.devDependencies.typescript = 'latest';
    pkg.scripts.typecheck = 'tsc --noEmit';
  }

  if (options.database === 'supabase') {
    pkg.dependencies['@supabase/supabase-js'] = 'latest';
  }

  if (options.qualityTool === 'biome') {
    pkg.devDependencies['@biomejs/biome'] = 'latest';
    pkg.scripts.format = 'biome format --write .';
    pkg.scripts.lint = 'biome lint .';
    pkg.scripts.check = 'biome check .';
    pkg.scripts['check:write'] = 'biome check --write .';
  }

  return pkg;
}

function buildFlutterDotenv(options) {
  const lines = [
    '# Flutter 建議改用 --dart-define 或 --dart-define-from-file',
    '# 不要把真正秘密直接寫進 repo'
  ];

  if (options.database === 'supabase') {
    lines.push('SUPABASE_URL=');
    lines.push('SUPABASE_ANON_KEY=');
  }

  return `${lines.join('\n')}\n`;
}

function buildNextTsconfig() {
  return `${JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2017',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: false,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }]
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules']
    },
    null,
    2
  )}\n`;
}

function buildViteTsconfig() {
  return `${JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        useDefineForClassFields: true,
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'Bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        types: ['vite/client']
      },
      include: ['src']
    },
    null,
    2
  )}\n`;
}

function buildExpressTsconfig() {
  return `${JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        outDir: 'dist',
        rootDir: 'src',
        strict: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        skipLibCheck: true,
        resolveJsonModule: true,
        noEmitOnError: true
      },
      include: ['src/**/*.ts']
    },
    null,
    2
  )}\n`;
}

function buildNextConfig(options) {
  if (options.language === 'typescript') {
    return `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

export default nextConfig;
`;
  }

  return `const nextConfig = {};

module.exports = nextConfig;
`;
}

function buildPostcssConfig() {
  return `const config = {
  plugins: {
    "@tailwindcss/postcss": {}
  }
};

export default config;
`;
}

function buildViteConfig(options) {
  const imports = [`import { defineConfig } from 'vite';`, `import react from '@vitejs/plugin-react';`];
  const plugins = ['react()'];

  if (options.styling === 'tailwind') {
    imports.push(`import tailwindcss from '@tailwindcss/vite';`);
    plugins.push('tailwindcss()');
  }

  return `${imports.join('\n')}

export default defineConfig({
  plugins: [${plugins.join(', ')}]
});
`;
}

function nextConfigFile(options) {
  return options.language === 'typescript' ? 'next.config.ts' : 'next.config.js';
}

function viteConfigFile(options) {
  return options.language === 'typescript' ? 'vite.config.ts' : 'vite.config.js';
}

function buildEnvExample(profile, options) {
  const lines = [
    '# 不要提交真正的秘密資料',
    '# Copy to .env.local / .env and fill real values'
  ];

  if (options.database === 'supabase') {
    if (profile === 'nextjs-app-router') {
      lines.push('NEXT_PUBLIC_SUPABASE_URL=');
      lines.push('NEXT_PUBLIC_SUPABASE_ANON_KEY=');
    } else if (profile === 'react-native-expo') {
      lines.push('EXPO_PUBLIC_SUPABASE_URL=');
      lines.push('EXPO_PUBLIC_SUPABASE_ANON_KEY=');
    } else if (profile === 'capacitor-mobile-app') {
      lines.push('VITE_SUPABASE_URL=');
      lines.push('VITE_SUPABASE_ANON_KEY=');
    } else if (profile === 'vite-react') {
      lines.push('VITE_SUPABASE_URL=');
      lines.push('VITE_SUPABASE_ANON_KEY=');
    } else if (profile === 'tauri-desktop') {
      lines.push('VITE_SUPABASE_URL=');
      lines.push('VITE_SUPABASE_ANON_KEY=');
    } else if (profile === 'electron-desktop') {
      lines.push('SUPABASE_URL=');
      lines.push('SUPABASE_ANON_KEY=');
    } else if (profile === 'flutter-app') {
      lines.push('SUPABASE_URL=');
      lines.push('SUPABASE_ANON_KEY=');
    } else {
      lines.push('SUPABASE_URL=');
      lines.push('SUPABASE_ANON_KEY=');
    }
  }

  return `${lines.join('\n')}\n`;
}

function installCommand(pm, profileKey) {
  if (profileKey === 'flutter-app') return 'flutter pub get';
  if (pm === 'pnpm') return 'pnpm install';
  if (pm === 'yarn') return 'yarn install';
  if (pm === 'bun') return 'bun install';
  return 'npm install';
}

function buildStackSetup(profileKey, profile, name, options) {
  const followUps = [];
  const generated = ['.gitignore', '.env.example'];

  if (profileKey !== 'flutter-app') {
    generated.unshift('package.json');
  }

  if (options.language === 'typescript') generated.push('tsconfig.json');
  if (options.qualityTool === 'biome') generated.push('biome.json');
  if (profileKey === 'nextjs-app-router') generated.push(nextConfigFile(options));
  if (profileKey === 'nextjs-app-router' && options.styling === 'tailwind') generated.push('postcss.config.mjs');
  if (profileKey === 'vite-react') generated.push(viteConfigFile(options));
  if (profileKey === 'react-native-expo') generated.push('docs/STACK_SETUP.md');
  if (profileKey === 'capacitor-mobile-app') generated.push('docs/STACK_SETUP.md');
  if (profileKey === 'flutter-app') generated.push('docs/STACK_SETUP.md');
  if (profileKey === 'tauri-desktop') generated.push('docs/STACK_SETUP.md');
  if (profileKey === 'electron-desktop') generated.push('main.js', 'index.html', 'docs/STACK_SETUP.md');

  followUps.push(`1. 執行 \`${installCommand(options.packageManager, profileKey)}\``);
  if (profileKey === 'nextjs-app-router') {
    followUps.push('2. 建立 `src/app/` 或 `app/` 內容，並讓 `next dev` / `next build` 自動產生 `next-env.d.ts`');
  }
  if (profileKey === 'vite-react') {
    const mainFile = options.language === 'typescript' ? 'src/main.tsx' : 'src/main.jsx';
    const appFile = options.language === 'typescript' ? 'src/App.tsx' : 'src/App.jsx';
    followUps.push(`2. 建立 \`${mainFile}\`、\`${appFile}\`，若使用 Tailwind，在 CSS 中加入 \`@import "tailwindcss";\``);
  }
  if (profileKey === 'node-express-api') {
    followUps.push('2. 建立 `src/index.ts` 或 `src/index.js` 作為 API 入口');
  }
  if (profileKey === 'react-native-expo') {
    followUps.push('2. 執行 `npx expo start`，確認 iOS / Android / web dev server 可啟動');
    followUps.push('3. 需要原生目錄時，再依官方流程跑 `npx expo prebuild`');
  }
  if (profileKey === 'tauri-desktop') {
    followUps.push('2. 先確認 Rust toolchain 已安裝，再執行 `npm run tauri dev`');
    followUps.push('3. 若要改前端框架，再回官方 `create-tauri-app` 文件選別的 template');
  }
  if (profileKey === 'capacitor-mobile-app') {
    followUps.push('2. 先執行 `npm run build`，再用 `npx cap sync` 把 web bundle 同步到 native project');
    followUps.push('3. 若要進 iOS / Android，先確認 Xcode / Android Studio 環境，再執行 `npx cap add ios` / `npx cap add android`');
  }
  if (profileKey === 'flutter-app') {
    followUps.push('2. 執行 `flutter run` 或 `flutter run -d chrome` 驗證 app 可啟動');
    followUps.push('3. 秘密值優先用 `--dart-define` / `--dart-define-from-file`，不要直接硬寫在程式內');
  }
  if (profileKey === 'electron-desktop') {
    followUps.push('2. 執行 `npm run start` 啟動 Electron 主程序');
    followUps.push('3. 若要打包，後續再接 Electron Forge / Builder，不要在基線階段假裝已完成');
  }
  if (options.database === 'supabase') {
    followUps.push('4. 補齊 `.env.example` 對應的 Supabase URL / key');
    followUps.push('5. 若要本地 Supabase，依官方流程執行 `supabase init`，不要手寫 `supabase/config.toml`');
  }
  if (options.qualityTool === 'biome') {
    followUps.push('6. 依官方流程執行 `npx @biomejs/biome check --write .`');
  }

  return `# STACK SETUP

## Summary

- Profile: ${profile.displayName}
- Name: ${name}
- Language: ${options.language}
- Styling: ${options.styling}
- Database: ${options.database}
- Quality tool: ${options.qualityTool}
- Package manager: ${options.packageManager}
- Recommended Node.js: ${profile.recommendedNode}
- Official scaffold baseline: \`${profile.officialScaffold}\`

## Generated files

${generated.map((file) => `- \`${file}\``).join('\n')}

## Follow-up

${followUps.map((line) => `- ${line}`).join('\n')}

## Official notes

- Greenfield 專案若還沒建，優先用官方 scaffold 建骨架，再用本 repo 補治理層與 quality / env / config 對齊。
- Next.js 官方安裝文件已支援 TypeScript、Tailwind、AGENTS.md，手動生成時仍應回官方文件確認版本需求。
- Expo app config (\`app.json\` / \`app.config.ts\`) 會暴露 public config；秘密值不要直接寫進 app config。
- Capacitor 的 native 專案不是永遠手動編；以 \`npx cap add\` / \`npx cap sync\` 為準，不要自行編造 platform 檔樹。
- Flutter secrets 建議走 \`--dart-define\` / \`--dart-define-from-file\`，不要把正式 secrets 寫進 repo。
- Tauri 專案啟動前通常還需要 Rust toolchain；scaffold 成功不等於本機原生依賴已完備。
- Electron 官方最小 starter 只保證 dev 啟動；打包、簽章、auto-update 需額外工具鏈。
- Tailwind v4 的 Next.js / Vite 方案都不一定需要傳統 \`tailwind.config.js\`；請以官方最新安裝頁為準。
- Supabase CLI 的 \`supabase/config.toml\` 由 \`supabase init\` 產生；不要在 repo 內假造過時模板。
`;
}

function buildElectronMain() {
  return `const { app, BrowserWindow } = require('electron/main');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
`;
}

function buildElectronIndexHtml() {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'" />
    <meta http-equiv="X-Content-Security-Policy" content="default-src 'self'; script-src 'self'" />
    <title>Hello from Electron renderer!</title>
  </head>
  <body>
    <h1>Hello from Electron renderer!</h1>
    <p>👋</p>
  </body>
</html>
`;
}

function buildProfileFiles(profileKey, profile, name, options) {
  const packageBuilders = {
    'nextjs-app-router': buildNextPackageJson,
    'vite-react': buildVitePackageJson,
    'node-express-api': buildExpressPackageJson,
    'react-native-expo': buildExpoPackageJson,
    'capacitor-mobile-app': buildCapacitorPackageJson,
    'tauri-desktop': buildTauriPackageJson,
    'electron-desktop': buildElectronPackageJson
  };
  const files = new Map();
  const packageBuilder = packageBuilders[profileKey];
  if (packageBuilder) {
    const packageJson = packageBuilder(name, options);
    files.set('package.json', `${JSON.stringify(packageJson, null, 2)}\n`);
  }
  files.set('.gitignore', buildGitignore(profileKey, options));
  files.set('.env.example', profileKey === 'flutter-app' ? buildFlutterDotenv(options) : buildEnvExample(profileKey, options));
  files.set('docs/STACK_SETUP.md', buildStackSetup(profileKey, profile, name, options));

  if (options.qualityTool === 'biome') {
    files.set('biome.json', buildBiomeConfig());
  }

  if (options.language === 'typescript') {
    if (profileKey === 'nextjs-app-router') {
      files.set('tsconfig.json', buildNextTsconfig());
    } else if (profileKey === 'vite-react') {
      files.set('tsconfig.json', buildViteTsconfig());
    } else if (profileKey === 'node-express-api') {
      files.set('tsconfig.json', buildExpressTsconfig());
    }
  }

  if (profileKey === 'nextjs-app-router') {
    files.set(nextConfigFile(options), buildNextConfig(options));
    if (options.styling === 'tailwind') {
      files.set('postcss.config.mjs', buildPostcssConfig());
    }
  }

  if (profileKey === 'vite-react') {
    files.set(viteConfigFile(options), buildViteConfig(options));
  }

  if (profileKey === 'electron-desktop') {
    files.set('main.js', buildElectronMain());
    files.set('index.html', buildElectronIndexHtml());
  }

  return files;
}

function plan(profileKey, profile, targetRoot, name, options, files) {
  console.log('設定檔產生計畫');
  console.log(`- 目標目錄: ${targetRoot}`);
  console.log(`- Profile: ${profile.displayName} (${profileKey})`);
  console.log(`- 語言: ${options.language}`);
  console.log(`- 樣式: ${options.styling}`);
  console.log(`- 資料庫: ${options.database}`);
  console.log(`- 品質工具: ${options.qualityTool}`);
  console.log(`- 套件管理器: ${options.packageManager}`);
  console.log(`- 專案名稱: ${name}`);
  console.log(`- 官方 scaffold baseline: ${profile.officialScaffold}`);
  console.log('\n將處理檔案:');
  for (const relativePath of files.keys()) {
    const targetPath = path.join(targetRoot, relativePath);
    const exists = fs.existsSync(targetPath);
    console.log(`- ${relativePath} | ${exists ? '已存在，預設跳過/合併' : '將建立'}`);
  }

  console.log('\n執行方式:');
  console.log(`- 寫入: node scripts/generate_project_configs.js --profile ${profileKey} --name ${name} --language ${options.language} --styling ${options.styling} --database ${options.database} --quality-tool ${options.qualityTool} --package-manager ${options.packageManager} --target ${targetRoot} --write`);
}

function writeAll(targetRoot, files, options) {
  const results = [];

  for (const [relativePath, content] of files.entries()) {
    const targetPath = path.join(targetRoot, relativePath);
    if (relativePath === 'package.json') {
      ensureDir(path.dirname(targetPath));
      const generated = JSON.parse(content);
      const existed = fs.existsSync(targetPath);
      const existing = existed ? readJson(targetPath) : {};
      const merged = mergePackageJson(existing, generated, options.force);
      fs.writeFileSync(targetPath, `${JSON.stringify(merged, null, 2)}\n`);
      results.push({ file: relativePath, action: existed ? 'merged' : 'written' });
      continue;
    }

    const action = writeFileIfAllowed(targetPath, content, options.force);
    results.push({ file: relativePath, action });
  }

  return results;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.profile) {
    printUsage();
    process.exit(1);
  }

  const targetRoot = path.resolve(process.cwd(), options.targetDir);
  const config = readJson(profilesPath);
  const profile = resolveProfile(config, options);
  const name = guessName(targetRoot, options);
  const files = buildProfileFiles(options.profile, profile, name, options);

  if (!options.write) {
    plan(options.profile, profile, targetRoot, name, options, files);
    return;
  }

  ensureDir(targetRoot);
  const results = writeAll(targetRoot, files, options);
  console.log('設定檔產生完成');
  for (const result of results) {
    console.log(`- ${result.file} | ${result.action}`);
  }
  console.log('\n下一步:');
  console.log(`- ${installCommand(options.packageManager, options.profile)}`);
  console.log('- 讀 docs/STACK_SETUP.md');
  console.log('- 跑對應驗證指令');
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
  buildProfileFiles,
  buildEnvExample,
  buildStackSetup
};
