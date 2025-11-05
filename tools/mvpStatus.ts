#!/usr/bin/env tsx
/**
 * MVP Status Checker — Verificador de Progresso do Projeto Natália TCC
 *
 * Objetivo:
 *   Vasculha o repositório e mede o quanto do MVP já está pronto
 *   Emite: MVP_STATUS.json (métricas) + resumo colorido no console (semáforo)
 *
 * Uso:
 *   npx tsx tools/mvpStatus.ts
 *   ou
 *   npm run status:mvp
 *
 * Checks implementados:
 *   (A) Documentação (7 arquivos esperados)
 *   (B) Frontend (A11y, skip link, httpClient, etc)
 *   (C) Backend (Express, rotas, cookies, CORS)
 *   (D) Banco/Prisma (schema, índices, migrações)
 *   (E) Testes (E2E, count, axe)
 *
 * Score: 0-100 (ponderado por seção)
 * Semáforo: 🟢 (85+) | 🟡 (70-84) | 🟠 (50-69) | 🔴 (<50)
 */

import fs from 'fs';
import path from 'path';
import { globSync } from 'fast-glob';
import colors from 'picocolors';

// ========== TYPES ==========

interface CheckResult {
  ok: boolean;
  details?: Record<string, any>;
  value?: any;
}

interface StatusReport {
  generatedAt: string;
  docs: {
    expected: string[];
    present: string[];
    missing: string[];
    score: number;
  };
  frontend: {
    pagesWithMain: number;
    focusRing: boolean;
    scrollMt: boolean;
    rotaReserva: boolean;
    noLocalStorageToken: boolean;
    httpClientCredentialsInclude: boolean;
    notes?: string[];
    score: number;
  };
  backend: {
    serverEntry: string | null;
    routesFound: string[];
    endpointsCount: number;
    httpOnlyCookie: boolean;
    corsCredentials: boolean;
    hasHealth: boolean;
    score: number;
  };
  database: {
    hasPointEventUniqueMetaHash: boolean;
    hasUserIdIndex: boolean;
    migrationFiles: string[];
    sanitizedDatabaseUrl?: string;
    score: number;
  };
  tests: {
    happyPathExists: boolean;
    testCount: number;
    hasAxe: boolean;
    score: number;
  };
  totalScore: number;
  semaphore: 'green' | 'yellow' | 'orange' | 'red';
  errors?: string[];
}

// ========== HELPERS ==========

const ROOT = process.cwd();

function exists(filePath: string): boolean {
  return fs.existsSync(path.join(ROOT, filePath));
}

function readText(filePath: string): string {
  try {
    return fs.readFileSync(path.join(ROOT, filePath), 'utf-8');
  } catch {
    return '';
  }
}

function findFiles(glob: string): string[] {
  try {
    return globSync(glob, { cwd: ROOT, absolute: false });
  } catch {
    return [];
  }
}

function grep(regex: RegExp, text: string): boolean {
  return regex.test(text);
}

function grepMatches(regex: RegExp, text: string): RegExpMatchArray[] {
  return Array.from(text.matchAll(regex));
}

function sanitizeUrl(url: string): string {
  // Remover senha de DATABASE_URL (mysql://user:pass@host → mysql://user:***@host)
  return url.replace(/(:\/\/[^:]+:)[^@]+(@)/, '$1***$2');
}

// ========== CHECKS ==========

function checkDocs(): { result: CheckResult; score: number } {
  const expected = [
    'INDEX.md',
    'SCOPE_ONE_PAGER.md',
    'EXECUTIVE_SUMMARY.md',
    'MIGRATION_GUIDE.md',
    'MVP_IMPLEMENTATION_STATUS.md',
    'MVP_DELIVERY.md',
    'DELIVERY_SUMMARY.md',
    '.env.example',
  ];

  const present = expected.filter((doc) => exists(doc));
  const missing = expected.filter((doc) => !exists(doc));

  const score = (present.length / expected.length) * 100;

  return {
    result: {
      ok: missing.length === 0,
      details: {
        present: present,
        missing: missing,
      },
    },
    score,
  };
}

function checkFrontend(): { result: CheckResult; score: number } {
  const checks: Record<string, boolean> = {
    focusRing: false,
    scrollMt: false,
    rotaReserva: false,
    noLocalStorageToken: true,
    httpClientCredentialsInclude: false,
  };

  let pagesWithMain = 0;
  const notes: string[] = [];

  // Check skip link + main tag
  const pageFiles = findFiles('src/app/**/page.tsx');
  for (const file of pageFiles) {
    const text = readText(file);
    if (grep(/<main[^>]*id\s*=\s*['""]conteudo['""]/i, text)) {
      pagesWithMain++;
    }
  }

  // Check focus-ring CSS
  const globalCss = readText('src/app/globals.css');
  checks.focusRing = grep(/\.focus-ring/i, globalCss);

  // Check scroll-mt in layout
  const layoutTsx = readText('src/app/layout.tsx');
  checks.scrollMt = grep(/scroll-mt-24/i, layoutTsx);

  // Check rotaReserva usage
  const srcText = findFiles('src/**/*.tsx').map(readText).join('\n');
  checks.rotaReserva = grep(/rotaReserva\s*\(/i, srcText);

  // Check NO localStorage.getItem('token') in services
  const servicesText = findFiles('src/lib/**/*.ts').map(readText).join('\n');
  const hasLocalStorageToken = grep(/localStorage\s*\.\s*getItem\s*\(\s*['""]token['""]\s*\)/i, servicesText);
  checks.noLocalStorageToken = !hasLocalStorageToken;
  if (hasLocalStorageToken) {
    notes.push('⚠️ Encontrado localStorage.getItem(token) em services — migrar para cookies httpOnly');
  }

  // Check httpClient credentials
  const httpClientPath = 'src/lib/httpClient.ts';
  const httpClientText = readText(httpClientPath);
  checks.httpClientCredentialsInclude = grep(/credentials\s*:\s*['"]include['"]/i, httpClientText);
  if (!checks.httpClientCredentialsInclude) {
    notes.push('⚠️ httpClient não tem credentials: include — necessário para CORS + cookies');
  }

  const checkCount = Object.values(checks).filter(Boolean).length;
  const score = (checkCount / Object.keys(checks).length) * 100;

  return {
    result: {
      ok: score === 100,
      details: {
        checks,
        pagesWithMain,
        notes,
      },
    },
    score,
  };
}

function checkBackend(): { result: CheckResult; score: number } {
  const checks: Record<string, boolean> = {
    serverEntry: false,
    httpOnlyCookie: false,
    corsCredentials: false,
    hasHealth: false,
  };

  let serverEntry: string | null = null;
  let routesFound: string[] = [];
  let endpointsCount = 0;

  // Check server entry point
  if (exists('src/server/index.ts')) {
    serverEntry = 'src/server/index.ts';
    checks.serverEntry = true;
  } else if (exists('src/server.ts')) {
    serverEntry = 'src/server.ts';
    checks.serverEntry = true;
  }

  // Check routes
  const routeFiles = findFiles('src/server/routes/**/*.ts');
  routesFound = routeFiles;

  // Count endpoints via regex
  for (const file of routeFiles) {
    const text = readText(file);
    const matches = grepMatches(/router\s*\.\s*(get|post|delete|put|patch)\s*\(/gi, text);
    endpointsCount += matches.length;
  }

  // Check cookies httpOnly
  if (serverEntry) {
    const serverText = readText(serverEntry);
    checks.httpOnlyCookie = grep(/httpOnly\s*:\s*true/i, serverText);
  }

  // Check CORS credentials
  if (serverEntry) {
    const serverText = readText(serverEntry);
    checks.corsCredentials = grep(/credentials\s*:\s*true/i, serverText);
  }

  // Check health route
  if (serverEntry) {
    const serverText = readText(serverEntry);
    checks.hasHealth = grep(/\/health|get\s*\(\s*['""]\/health['"]/i, serverText);
  }

  const checkCount = Object.values(checks).filter(Boolean).length;
  const score = (checkCount / Object.keys(checks).length) * 100;

  return {
    result: {
      ok: score === 100,
      details: {
        checks,
        serverEntry,
        routesFound,
        endpointsCount,
      },
    },
    score,
  };
}

function checkDatabase(): { result: CheckResult; score: number } {
  const checks: Record<string, boolean> = {
    hasPointEventUniqueMetaHash: false,
    hasUserIdIndex: false,
  };

  let migrationFiles: string[] = [];
  let sanitizedDatabaseUrl: string | undefined;

  // Check Prisma schema
  const schemaPath = 'prisma/schema.prisma';
  const schemaText = readText(schemaPath);

  checks.hasPointEventUniqueMetaHash = grep(/@@unique\s*\(\s*\[\s*userId\s*,\s*type\s*,\s*metaHash\s*\]\s*\)/i, schemaText);
  checks.hasUserIdIndex = grep(/@@index\s*\(\s*\[\s*userId\s*\]\s*\)|index\s*:\s*true/i, schemaText);

  // Check migration files
  migrationFiles = findFiles('prisma/migrations/**/*.sql');

  // Check .env for DATABASE_URL
  const envText = readText('.env');
  const envMatch = envText.match(/DATABASE_URL\s*=\s*["']?([^"'\n]+)["']?/);
  if (envMatch) {
    sanitizedDatabaseUrl = sanitizeUrl(envMatch[1]);
  }

  const checkCount = Object.values(checks).filter(Boolean).length;
  const score = (checkCount / Object.keys(checks).length) * 100;

  return {
    result: {
      ok: score === 100,
      details: {
        checks,
        migrationFiles,
        sanitizedDatabaseUrl,
      },
    },
    score,
  };
}

function checkTests(): { result: CheckResult; score: number } {
  const checks: Record<string, boolean> = {
    happyPathExists: false,
    hasAxe: false,
  };

  let testCount = 0;

  // Check happy-path.spec.ts exists
  const happyPathPath = 'tests/e2e/happy-path.spec.ts';
  const happyPathExists = exists(happyPathPath);
  checks.happyPathExists = happyPathExists;

  if (happyPathExists) {
    const text = readText(happyPathPath);
    const matches = grepMatches(/test\s*\(/gi, text);
    testCount = matches.length;

    // Check for axe-core/playwright
    checks.hasAxe = grep(/@axe-core\/playwright|injectAxe|checkA11y/i, text);
  }

  const checkCount = Object.values(checks).filter(Boolean).length;
  const score = (checkCount / Object.keys(checks).length) * 100;

  return {
    result: {
      ok: score === 100,
      details: {
        checks,
        testCount,
      },
    },
    score,
  };
}

// ========== MAIN ==========

async function main() {
  const errors: string[] = [];

  try {
    console.log(colors.bold('\n📊 MVP Status Checker — Natália TCC\n'));
    console.log(colors.gray(`Rodando em: ${ROOT}\n`));

    // Collect results
    const docsResult = checkDocs();
    const frontendResult = checkFrontend();
    const backendResult = checkBackend();
    const databaseResult = checkDatabase();
    const testsResult = checkTests();

    // Calculate total score (ponderado)
    const weights = {
      docs: 0.2,
      frontend: 0.2,
      backend: 0.25,
      database: 0.2,
      tests: 0.15,
    };

    const totalScore =
      docsResult.score * weights.docs +
      frontendResult.score * weights.frontend +
      backendResult.score * weights.backend +
      databaseResult.score * weights.database +
      testsResult.score * weights.tests;

    // Determine semaphore
    let semaphore: 'green' | 'yellow' | 'orange' | 'red';
    if (totalScore >= 85) semaphore = 'green';
    else if (totalScore >= 70) semaphore = 'yellow';
    else if (totalScore >= 50) semaphore = 'orange';
    else semaphore = 'red';

    // Build report
    const report: StatusReport = {
      generatedAt: new Date().toISOString(),
      docs: {
        expected: docsResult.result.details?.expected || [],
        present: docsResult.result.details?.present || [],
        missing: docsResult.result.details?.missing || [],
        score: Math.round(docsResult.score),
      },
      frontend: {
        pagesWithMain: frontendResult.result.details?.pagesWithMain || 0,
        focusRing: frontendResult.result.details?.checks?.focusRing || false,
        scrollMt: frontendResult.result.details?.checks?.scrollMt || false,
        rotaReserva: frontendResult.result.details?.checks?.rotaReserva || false,
        noLocalStorageToken: frontendResult.result.details?.checks?.noLocalStorageToken || false,
        httpClientCredentialsInclude: frontendResult.result.details?.checks?.httpClientCredentialsInclude || false,
        notes: frontendResult.result.details?.notes,
        score: Math.round(frontendResult.score),
      },
      backend: {
        serverEntry: backendResult.result.details?.serverEntry || null,
        routesFound: backendResult.result.details?.routesFound || [],
        endpointsCount: backendResult.result.details?.endpointsCount || 0,
        httpOnlyCookie: backendResult.result.details?.checks?.httpOnlyCookie || false,
        corsCredentials: backendResult.result.details?.checks?.corsCredentials || false,
        hasHealth: backendResult.result.details?.checks?.hasHealth || false,
        score: Math.round(backendResult.score),
      },
      database: {
        hasPointEventUniqueMetaHash: databaseResult.result.details?.checks?.hasPointEventUniqueMetaHash || false,
        hasUserIdIndex: databaseResult.result.details?.checks?.hasUserIdIndex || false,
        migrationFiles: databaseResult.result.details?.migrationFiles || [],
        sanitizedDatabaseUrl: databaseResult.result.details?.sanitizedDatabaseUrl,
        score: Math.round(databaseResult.score),
      },
      tests: {
        happyPathExists: testsResult.result.details?.checks?.happyPathExists || false,
        testCount: testsResult.result.details?.testCount || 0,
        hasAxe: testsResult.result.details?.checks?.hasAxe || false,
        score: Math.round(testsResult.score),
      },
      totalScore: Math.round(totalScore),
      semaphore,
      ...(errors.length > 0 && { errors }),
    };

    // Write JSON
    fs.writeFileSync(path.join(ROOT, 'MVP_STATUS.json'), JSON.stringify(report, null, 2));

    // Print console output
    console.log(colors.bold('📋 Resumo do MVP Status\n'));

    const semaColor =
      semaphore === 'green'
        ? colors.green
        : semaphore === 'yellow'
          ? colors.yellow
          : semaphore === 'orange'
            ? (s: string) => colors.yellow(colors.inverse(s))
            : colors.red;

    const semaIcon =
      semaphore === 'green'
        ? '🟢'
        : semaphore === 'yellow'
          ? '🟡'
          : semaphore === 'orange'
            ? '🟠'
            : '🔴';

    console.log(semaColor(`${semaIcon} Score Total: ${report.totalScore}/100\n`));

    console.log(colors.bold('Seções:\n'));
    console.log(`  📚 Documentação   ${report.docs.score}%    (${report.docs.present.length}/${report.docs.expected.length})`);
    console.log(`  🎨 Frontend       ${report.frontend.score}%    (${report.frontend.pagesWithMain} páginas com skip link)`);
    console.log(`  ⚙️  Backend        ${report.backend.score}%    (${report.backend.endpointsCount} endpoints)`);
    console.log(`  🗄️  Database       ${report.database.score}%    (${report.database.migrationFiles.length} migrações)`);
    console.log(`  🧪 Testes         ${report.tests.score}%    (${report.tests.testCount} testes E2E)`);

    console.log(colors.gray('\n✅ MVP_STATUS.json gerado com sucesso!\n'));

    // Warnings
    if (report.frontend.notes && report.frontend.notes.length > 0) {
      console.log(colors.yellow('⚠️  Avisos Frontend:\n'));
      for (const note of report.frontend.notes) {
        console.log(`   ${note}`);
      }
      console.log('');
    }

    // Next steps
    if (report.totalScore < 85) {
      console.log(colors.bold('🚀 Próximos passos:\n'));
      if (report.docs.score < 100) {
        console.log(`   • Documentação: faltam ${report.docs.missing.join(', ')}`);
      }
      if (report.frontend.score < 100) {
        console.log(`   • Frontend: revisar acessibilidade e skip links`);
      }
      if (report.backend.score < 100) {
        console.log(`   • Backend: verificar cookies httpOnly e CORS credentials`);
      }
      if (report.database.score < 100) {
        console.log(`   • Database: verificar Prisma schema (unique, índices)`);
      }
      if (report.tests.score < 100) {
        console.log(`   • Testes: rodar 'npm run test:e2e' ou 'npx playwright test'`);
      }
      console.log('');
    }
  } catch (error) {
    errors.push(`Erro: ${error instanceof Error ? error.message : String(error)}`);
    console.error(colors.red(`❌ Erro durante verificação: ${errors[0]}\n`));
  }
}

main().catch(console.error);
