const test = require('node:test');
const assert = require('node:assert/strict');

const { evaluateProfiles } = require('../scripts/platform_prerequisite_doctor');
const config = require('../config/platform_prerequisites.json');

test('evaluateProfiles marks tauri not-ready when rust is missing', () => {
  const probes = {
    node: { present: true, major: 22 },
    rustc: { present: false, major: null },
    cargo: { present: false, major: null },
    'xcode-select': { present: true, major: null }
  };

  const [result] = evaluateProfiles(config, probes, { profile: 'tauri-desktop' });
  assert.equal(result.status, 'not-ready');
  assert.equal(result.checks.some((item) => item.check === 'rustc' && item.status === 'fail'), true);
});

test('evaluateProfiles marks capacitor partial when native mobile deps are missing', () => {
  const probes = {
    node: { present: true, major: 22 },
    xcodebuild: { present: false, major: null },
    'xcode-select': { present: false, major: null },
    adb: { present: false, major: null },
    sdkmanager: { present: false, major: null }
  };

  const [result] = evaluateProfiles(config, probes, { profile: 'capacitor-mobile-app' });
  assert.equal(result.status, 'partial');
  assert.equal(result.checks.some((item) => item.status === 'warn'), true);
});

test('evaluateProfiles marks electron ready with node and npm present', () => {
  const probes = {
    node: { present: true, major: 22 },
    npm: { present: true, major: 10 }
  };

  const [result] = evaluateProfiles(config, probes, { profile: 'electron-desktop' });
  assert.equal(result.status, 'ready');
});

test('evaluateProfiles marks ios-swiftui partial when simulator tooling is missing', () => {
  const probes = {
    xcodebuild: { present: true, major: 26 },
    'xcode-select': { present: true, major: null },
    'xcode-app': { present: true, major: null },
    'xcrun-simctl': { present: false, major: null },
    cocoapods: { present: false, major: null }
  };

  const [result] = evaluateProfiles(config, probes, { profile: 'ios-swiftui' });
  assert.equal(result.status, 'partial');
  assert.equal(result.checks.some((item) => item.check === 'xcrun-simctl' && item.status === 'warn'), true);
});

test('evaluateProfiles marks android-kotlin partial when emulator tooling is missing', () => {
  const probes = {
    java: { present: true, major: 26 },
    adb: { present: true, major: null },
    sdkmanager: { present: true, major: null },
    'android-studio-app': { present: true, major: null },
    avdmanager: { present: false, major: null },
    emulator: { present: false, major: null }
  };

  const [result] = evaluateProfiles(config, probes, { profile: 'android-kotlin' });
  assert.equal(result.status, 'partial');
  assert.equal(result.checks.some((item) => item.check === 'avdmanager' && item.status === 'warn'), true);
  assert.equal(result.checks.some((item) => item.check === 'emulator' && item.status === 'warn'), true);
});

test('evaluateProfiles marks android-kotlin not-ready when java runtime is missing', () => {
  const probes = {
    java: { present: false, major: null },
    adb: { present: true, major: null },
    sdkmanager: { present: true, major: null },
    'android-studio-app': { present: true, major: null },
    avdmanager: { present: true, major: null },
    emulator: { present: true, major: null }
  };

  const [result] = evaluateProfiles(config, probes, { profile: 'android-kotlin' });
  assert.equal(result.status, 'not-ready');
  assert.equal(result.checks.some((item) => item.check === 'java' && item.status === 'fail'), true);
});
