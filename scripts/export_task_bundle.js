#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function getSection(markdown, heading) {
  const lines = markdown.split('\n');
  const startIndex = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (startIndex === -1) return '';

  const buffer = [];
  for (let i = startIndex + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.startsWith('## ')) break;
    buffer.push(line);
  }
  return buffer.join('\n').trim();
}

function bulletLines(section) {
  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.replace(/^- /, '').trim());
}

function parseTaskTable(section) {
  const lines = section.split('\n').map((line) => line.trim()).filter(Boolean);
  const rows = lines.filter((line) => line.startsWith('|') && !line.includes('---'));
  return rows.slice(1).map((line) => {
    const cells = line
      .split('|')
      .map((cell) => cell.trim())
      .filter(Boolean);
    return {
      id: cells[0] || '',
      status: cells[1] || '',
      task: cells[2] || '',
      cites: cells[3] || ''
    };
  });
}

function buildTaskBundle(specMarkdown) {
  return {
    schema_version: '1.0.0',
    goal: getSection(specMarkdown, '§G Goal'),
    constraints: bulletLines(getSection(specMarkdown, '§C Constraints')),
    interfaces: bulletLines(getSection(specMarkdown, '§I Interfaces')),
    invariants: bulletLines(getSection(specMarkdown, '§V Invariants')),
    tasks: parseTaskTable(getSection(specMarkdown, '§T Tasks')),
    generated_at: new Date().toISOString()
  };
}

function main() {
  const args = process.argv.slice(2);
  const specPath = path.resolve(process.cwd(), args[0] || 'docs/SPEC.md');
  const outPath = path.resolve(process.cwd(), args[1] || '.loop/task_bundle.json');
  const bundle = buildTaskBundle(readUtf8(specPath));

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(bundle, null, 2)}\n`);
  console.log(`task bundle exported: ${outPath}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`task bundle export failed: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  buildTaskBundle
};
