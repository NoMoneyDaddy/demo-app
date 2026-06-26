const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { parseArgs, buildScaffoldCommand, resolveProfile } = require('../scripts/scaffold_project');

test('parseArgs accepts --platforms for flutter scaffold', () => {
  const options = parseArgs([
    '/tmp/flutter-app',
    '--profile', 'flutter-app',
    '--platforms', 'android,web',
    '--run'
  ]);

  assert.equal(options.targetDir, '/tmp/flutter-app');
  assert.equal(options.profile, 'flutter-app');
  assert.equal(options.platforms, 'android,web');
  assert.equal(options.run, true);
});

test('buildScaffoldCommand forwards flutter platforms', () => {
  const scaffold = buildScaffoldCommand(
    'flutter-app',
    'flutter_smoke',
    '/tmp/flutter-smoke',
    {
      platforms: 'android,web'
    }
  );

  assert.equal(scaffold.command, 'flutter');
  assert.deepEqual(scaffold.args, ['create', 'flutter_smoke', '--platforms', 'android,web']);
});

test('native plan-only profiles declare manual runbooks and official docs', () => {
  const configPath = path.join(__dirname, '..', 'config', 'project_config_profiles.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const ios = config.profiles['ios-swiftui'];
  const android = config.profiles['android-kotlin'];

  assert.equal(ios.supportLevel, 'plan-only');
  assert.match(ios.manualRunbook, /native_app_bootstrap_runbook\.md#ios-swiftui/);
  assert.equal(Array.isArray(ios.officialDocs), true);
  assert.equal(ios.officialDocs.length >= 2, true);

  assert.equal(android.supportLevel, 'plan-only');
  assert.match(android.manualRunbook, /native_app_bootstrap_runbook\.md#android-kotlin/);
  assert.equal(Array.isArray(android.officialDocs), true);
  assert.equal(android.officialDocs.length >= 2, true);
});

test('resolveProfile lets plan-only native profiles bypass web defaults', () => {
  const configPath = path.join(__dirname, '..', 'config', 'project_config_profiles.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const ios = resolveProfile(config, {
    profile: 'ios-swiftui',
    language: 'typescript',
    styling: 'none',
    database: 'none',
    qualityTool: 'biome'
  });

  assert.equal(ios.displayName, 'iOS SwiftUI');
  assert.equal(ios.supportLevel, 'plan-only');
});
