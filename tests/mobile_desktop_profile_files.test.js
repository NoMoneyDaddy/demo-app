const test = require('node:test');
const assert = require('node:assert/strict');

const { buildProfileFiles, buildEnvExample } = require('../scripts/generate_project_configs');

test('react-native-expo profile emits env and quality baseline', () => {
  const files = buildProfileFiles(
    'react-native-expo',
    {
      displayName: 'React Native + Expo',
      officialScaffold: 'npx create-expo-app@latest',
      recommendedNode: '20+'
    },
    'expo-smoke',
    {
      language: 'typescript',
      styling: 'none',
      database: 'supabase',
      qualityTool: 'biome',
      packageManager: 'npm'
    }
  );

  const packageJson = JSON.parse(files.get('package.json'));
  assert.equal(packageJson.devDependencies['@biomejs/biome'], 'latest');
  assert.equal(packageJson.dependencies['@supabase/supabase-js'], 'latest');
  assert.match(files.get('docs/STACK_SETUP.md'), /npx expo start/);
  assert.match(buildEnvExample('react-native-expo', { database: 'supabase' }), /EXPO_PUBLIC_SUPABASE_URL/);
});

test('tauri-desktop profile emits rust note and vite env prefix', () => {
  const files = buildProfileFiles(
    'tauri-desktop',
    {
      displayName: 'Tauri Desktop',
      officialScaffold: 'npm create tauri-app@latest',
      recommendedNode: '20+'
    },
    'tauri-smoke',
    {
      language: 'typescript',
      styling: 'none',
      database: 'supabase',
      qualityTool: 'biome',
      packageManager: 'npm'
    }
  );

  const packageJson = JSON.parse(files.get('package.json'));
  assert.equal(packageJson.devDependencies['@biomejs/biome'], 'latest');
  assert.equal(packageJson.dependencies['@supabase/supabase-js'], 'latest');
  assert.match(files.get('docs/STACK_SETUP.md'), /Rust toolchain/);
  assert.match(buildEnvExample('tauri-desktop', { database: 'supabase' }), /VITE_SUPABASE_URL/);
});

test('capacitor-mobile-app profile emits native sync note and vite env prefix', () => {
  const files = buildProfileFiles(
    'capacitor-mobile-app',
    {
      displayName: 'Capacitor Mobile App',
      officialScaffold: 'npm init @capacitor/app@latest',
      recommendedNode: '22+'
    },
    'capacitor-smoke',
    {
      language: 'typescript',
      styling: 'none',
      database: 'supabase',
      qualityTool: 'biome',
      packageManager: 'npm'
    }
  );

  const packageJson = JSON.parse(files.get('package.json'));
  assert.equal(packageJson.devDependencies['@biomejs/biome'], 'latest');
  assert.equal(packageJson.dependencies['@supabase/supabase-js'], 'latest');
  assert.match(files.get('docs/STACK_SETUP.md'), /npx cap sync/);
  assert.match(buildEnvExample('capacitor-mobile-app', { database: 'supabase' }), /VITE_SUPABASE_URL/);
});

test('electron-desktop profile emits main process starter and secret env baseline', () => {
  const files = buildProfileFiles(
    'electron-desktop',
    {
      displayName: 'Electron Desktop',
      officialScaffold: 'electron official first app tutorial',
      recommendedNode: '20+'
    },
    'electron-smoke',
    {
      language: 'typescript',
      styling: 'none',
      database: 'supabase',
      qualityTool: 'biome',
      packageManager: 'npm'
    }
  );

  const packageJson = JSON.parse(files.get('package.json'));
  assert.equal(packageJson.scripts.start, 'electron .');
  assert.equal(packageJson.devDependencies['@biomejs/biome'], 'latest');
  assert.equal(packageJson.dependencies['@supabase/supabase-js'], 'latest');
  assert.match(files.get('main.js'), /BrowserWindow/);
  assert.match(files.get('index.html'), /Hello from Electron renderer/);
  assert.match(buildEnvExample('electron-desktop', { database: 'supabase' }), /SUPABASE_URL/);
});

test('flutter-app profile emits dart-define baseline and flutter follow-up note', () => {
  const files = buildProfileFiles(
    'flutter-app',
    {
      displayName: 'Flutter App',
      officialScaffold: 'flutter create',
      recommendedNode: 'n/a'
    },
    'flutter-smoke',
    {
      language: 'typescript',
      styling: 'none',
      database: 'supabase',
      qualityTool: 'biome',
      packageManager: 'npm'
    }
  );

  assert.equal(files.has('package.json'), false);
  assert.match(files.get('.env.example'), /dart-define/);
  assert.match(files.get('.env.example'), /SUPABASE_URL/);
  assert.match(files.get('docs/STACK_SETUP.md'), /flutter run/);
});
