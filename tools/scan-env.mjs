#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';

const root = process.cwd();

const EXCLUDES = [
  '**/node_modules/**',
  '**/.git/**',
  '**/.next/**',
  'src/.next/**',
  '**/dist/**',
  '**/build/**',
  'public/assets/**',
];

const FILES = [
  '**/*.{ts,tsx,js,jsx,mjs,cjs,prisma,sql,tsm,json}',
  'next.config.mjs',
  'playwright.config.ts',
  'tailwind.config.{ts,js}',
  'postcss.config.{ts,js}',
];

const isConfigFile = (p) => /(^|\\|\/)next\.config\.mjs$/.test(p)
  || /(^|\\|\/)playwright\.config\.ts$/.test(p)
  || /(^|\\|\/)tailwind\.config\.(t|j)s$/.test(p)
  || /(^|\\|\/)postcss\.config\.(t|j)s$/.test(p);

const categorize = (filePath) => {
  const p = filePath.replace(/\\/g, '/');
  if (p.startsWith('src/')) return 'frontend';
  if (p.startsWith('backend/')) return 'backend';
  if (p.includes('/prisma/') || p.endsWith('.prisma')) return 'prisma';
  if (p.startsWith('tests/')) return 'tests';
  if (isConfigFile(p)) return 'build';
  if (p.startsWith('docs/')) return 'docs';
  return 'other';
};

const ENV_REGEXES = [
  /process\.env\.([A-Z0-9_]+)/g,
  /process\.env\[["']([A-Z0-9_]+)["']\]/g,
  /env\(["']([A-Z0-9_]+)["']\)/g, // Prisma schema env("VAR")
];

const URL_REGEX = /https?:\/\/[^\s'"`]+/g;

const results = {
  variables: {
    frontend: {},
    backend: {},
    prisma: {},
    tests: {},
    build: {},
    docs: {},
    other: {},
  },
  hardcodedUrls: {
    code: [],
    tests: [],
    docs: [],
    other: [],
  },
};

function addVar(ctx, name, file, line) {
  const bucket = results.variables[ctx] || (results.variables[ctx] = {});
  if (!bucket[name]) bucket[name] = [];
  bucket[name].push(`${file}:${line}`);
}

function addUrl(ctx, url, file, line, snippet) {
  const rec = { file, line, url, snippet };
  if (ctx === 'frontend' || ctx === 'backend' || ctx === 'prisma' || ctx === 'build' || ctx === 'other') {
    results.hardcodedUrls.code.push(rec);
  } else if (ctx === 'tests') {
    results.hardcodedUrls.tests.push(rec);
  } else if (ctx === 'docs') {
    results.hardcodedUrls.docs.push(rec);
  } else {
    results.hardcodedUrls.other.push(rec);
  }
}

function getLines(content) {
  return content.split(/\r?\n/);
}

(async function main() {
  const files = await fg(FILES, { cwd: root, ignore: EXCLUDES, dot: false, onlyFiles: true });

  for (const rel of files) {
    const abs = path.join(root, rel);
    let content;
    try { content = fs.readFileSync(abs, 'utf8'); } catch { continue; }
    const lines = getLines(content);
    const ctx = categorize(rel);

    // ENV vars
    for (const rx of ENV_REGEXES) {
      let m;
      while ((m = rx.exec(content)) !== null) {
        const name = m[1];
        // approximate line number
        const upto = content.slice(0, m.index);
        const line = (upto.match(/\n/g) || []).length + 1;
        addVar(ctx, name, rel, line);
      }
    }

    // URLs
    let um;
    while ((um = URL_REGEX.exec(content)) !== null) {
      const url = um[0];
      const upto = content.slice(0, um.index);
      const line = (upto.match(/\n/g) || []).length + 1;
      const snippet = lines[line - 1]?.trim()?.slice(0, 200) ?? '';
      addUrl(ctx, url, rel, line, snippet);
    }
  }

  // Write env.report.json
  const reportPath = path.join(root, 'env.report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  // Create ENV_SUMMARY.md
  const md = [];
  md.push('# ENV Summary');
  md.push('');
  md.push('## Variáveis por contexto');
  for (const ctx of Object.keys(results.variables)) {
    const vars = results.variables[ctx];
    const names = Object.keys(vars).sort();
    if (!names.length) continue;
    md.push(`### ${ctx}`);
    for (const v of names) {
      md.push(`- ${v} → ${vars[v].length} referência(s)`);
    }
    md.push('');
  }
  md.push('');
  md.push('## URLs hardcoded (atenção)');
  const sections = [
    ['code', 'Código (src/backend/prisma/build)'],
    ['tests', 'Testes'],
    ['docs', 'Docs'],
    ['other', 'Outros'],
  ];
  for (const [key, label] of sections) {
    const list = results.hardcodedUrls[key];
    if (!list || !list.length) continue;
    md.push(`### ${label}`);
    for (const { file, line, url } of list.slice(0, 200)) {
      md.push(`- ${file}:${line} → ${url}`);
    }
    if (list.length > 200) md.push(`- ... +${list.length - 200} omitidos`);
    md.push('');
  }
  md.push('');
  md.push('---');
  md.push('Notas:');
  md.push('- Prefira usar variáveis de ambiente no lugar de URLs hardcoded em código.');
  md.push('- Em produção, evite `localhost` em configurações de CORS e URLs públicas.');
  fs.writeFileSync(path.join(root, 'ENV_SUMMARY.md'), md.join('\n'));

  console.log('Env scan concluída → env.report.json e ENV_SUMMARY.md gerados.');
})();
