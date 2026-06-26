#!/usr/bin/env node

/**
 * 將本 repo 的代理規範檔複製到目標專案。
 * 用法：
 *   node scripts/bootstrap_agent_files.js ../my-app
 *   node scripts/bootstrap_agent_files.js ../my-app --force
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const targetArg = args.find((arg) => !arg.startsWith('--'));
const force = args.includes('--force');

if (!targetArg) {
  console.error('用法: node scripts/bootstrap_agent_files.js <targetDir> [--force]');
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, '..');
const targetRoot = path.resolve(process.cwd(), targetArg);

function readSurfaceManifest() {
  const manifestPath = path.join(repoRoot, 'config', 'repo_surface_manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  if (!Array.isArray(manifest.bootstrap_entries) || manifest.bootstrap_entries.length === 0) {
    throw new Error('repo_surface_manifest.json 缺 bootstrap_entries');
  }

  return manifest;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyEntry(relativePath) {
  const sourcePath = path.join(repoRoot, relativePath);
  const targetPath = path.join(targetRoot, relativePath);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`找不到來源檔案: ${relativePath}`);
  }

  const sourceStat = fs.statSync(sourcePath);

  if (sourceStat.isDirectory()) {
    copyDirectory(sourcePath, targetPath, relativePath);
    return;
  }

  ensureDir(path.dirname(targetPath));

  if (!force && fs.existsSync(targetPath)) {
    console.log(`⏭️ 跳過既有檔案: ${relativePath}`);
    return;
  }

  fs.copyFileSync(sourcePath, targetPath);
  console.log(`✅ 已建立: ${relativePath}`);
}

function copyDirectory(sourceDir, targetDir, relativePath) {
  ensureDir(targetDir);

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const childRelativePath = path.join(relativePath, entry.name);
    const childSource = path.join(sourceDir, entry.name);
    const childTarget = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(childSource, childTarget, childRelativePath);
      continue;
    }

    ensureDir(path.dirname(childTarget));
    if (!force && fs.existsSync(childTarget)) {
      console.log(`⏭️ 跳過既有檔案: ${childRelativePath}`);
      continue;
    }

    fs.copyFileSync(childSource, childTarget);
    console.log(`✅ 已建立: ${childRelativePath}`);
  }
}

function main() {
  const surfaceManifest = readSurfaceManifest();
  ensureDir(targetRoot);

  console.log(`📁 目標目錄: ${targetRoot}`);
  console.log(`🧠 複製代理規範檔...`);

  for (const relativePath of surfaceManifest.bootstrap_entries) {
    copyEntry(relativePath);
  }

  console.log('\n完成。');
  console.log('下一步:');
  console.log('1. 讓 AI 先讀取 AGENTS.md');
  console.log('2. 需要英文入口時，可同步閱讀 README.en.md');
  console.log('3. 若在 GitHub / sandbox / remote，先跑 bash scripts/setup_sandbox_tools.sh --doctor');
  console.log('4. 先跑 node scripts/inspect_agent_capabilities.js');
  console.log('5. 再跑 node scripts/validate_repo_integrity.js');
  console.log('6. 若已有 .loop/*，跑 node scripts/evaluate_session_loop.js .');
  console.log('7. 讀 docs/loop_maturity_model.md、docs/engineering_phase_loop.md、docs/loop_evaluation_gate.md');
  console.log('8. 若缺 .loop/*，先跑 node scripts/init_session_loop.js . --goal "<objective>"');
  console.log('9. 新專案若要先建官方骨架，可跑 node scripts/scaffold_project.js ../my-app --profile <profile>');
  console.log('10. 技術棧確認後，可先跑 node scripts/generate_project_configs.js --profile <profile> --name <projectName>');
  console.log('11. 若要給 Hermes / OpenClaw 共用 skills，跑 bash scripts/export_skills_for_hermes_openclaw.sh --plan');
  console.log('12. 再讀 .agents/skills/using-agent-skills/SKILL.md');
  console.log('13. 視情境讀取 .agents/skills/loop-engineering/SKILL.md 與技術棧 best practices');
}

try {
  main();
} catch (error) {
  console.error(`❌ 失敗: ${error.message}`);
  process.exit(1);
}
