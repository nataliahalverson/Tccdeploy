#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

function absp(p) { return path.resolve(process.cwd(), p); }

try {
  console.log('> Running build...');
  execSync('npm run build', { stdio: 'inherit' });
} catch (e) {
  console.error('Build falhou. Continuando para listar possdirveis pastas...');
}

const outNext = absp('.next');
const outExport = absp('out');

const existsNext = fs.existsSync(outNext);
const existsOut = fs.existsSync(outExport);

console.log('\nResultado:');
console.log(`- .next: ${existsNext ? 'EXISTE' : 'não existe'} (${outNext})`);
console.log(`- out:   ${existsOut ? 'EXISTE' : 'não existe'} (${outExport})`);

if (existsNext) {
  console.log(`\nPublish recomendado (SSR/ISR): .next`);
} else if (existsOut) {
  console.log(`\nPublish (Static export): out`);
} else {
  console.log(`\nNenhuma pasta de build encontrada. Verifique seu next.config e scripts.`);
}
