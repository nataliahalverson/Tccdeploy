#!/usr/bin/env node

/**
 * FORMA+ Progress Checker — Verifica conclusão do TCC
 * Analisa: Frontend (30%), Backend (30%), Database (25%), Deploy (5%), Testes (10%)
 * Gera: FORMA_STATUS.json + console semaphore (🟢/🟡/🟠/🔴)
 * Nunca falha: relatório apenas
 */

import * as fs from 'fs'
import * as path from 'path'
import { globSync } from 'fast-glob'
import pc from 'picocolors'

const REPO_ROOT = process.cwd()

interface CheckResult {
  ok: boolean
  value?: any
  details?: string[]
}

interface FormaStatus {
  generatedAt: string
  frontend: {
    stack: { vite: boolean; next: boolean }
    pages: { expected: string[]; found: string[]; count: number }
    a11yMain: boolean
    palette: { blueHits: number; yellowHits: number; ok: boolean }
    notes?: string[]
  }
  backend: {
    entry: string | null
    hasTsconfig: boolean
    httpOnlyCookie: boolean
    corsCredentials: boolean
    endpoints: { files: string[]; count: number }
  }
  database: {
    hasPrisma: boolean
    pointEventUniqueByMetaHash: boolean
    hasUserIdIndex: boolean
    migrationFiles: string[]
    sanitizedDatabaseUrl?: string
  }
  deploy: { vercelIntent: boolean; hints?: string[] }
  tests: {
    happyPathExists: boolean
    testCount: number
    hasAxe: boolean
    screenshots?: string[]
  }
  score: number
  semaphore: 'green' | 'yellow' | 'orange' | 'red'
  weights: Record<string, number>
  errors?: string[]
}

// ============================================================================
// HELPERS
// ============================================================================

function exists(filePath: string): boolean {
  try {
    return fs.existsSync(path.resolve(REPO_ROOT, filePath))
  } catch {
    return false
  }
}

function readText(filePath: string): string {
  try {
    return fs.readFileSync(path.resolve(REPO_ROOT, filePath), 'utf-8')
  } catch {
    return ''
  }
}

function findFiles(pattern: string): string[] {
  try {
    return globSync(pattern, { cwd: REPO_ROOT })
  } catch {
    return []
  }
}

function grep(pattern: string | RegExp, filePath: string): boolean {
  const text = readText(filePath)
  if (!text) return false
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern
  return regex.test(text)
}

function grepMatches(pattern: string | RegExp, filePath: string): RegExpMatchArray[] {
  const text = readText(filePath)
  if (!text) return []
  const regex = typeof pattern === 'string' ? new RegExp(pattern, 'g') : new RegExp(pattern.source, pattern.flags + (pattern.flags.includes('g') ? '' : 'g'))
  const matches: RegExpMatchArray[] = []
  let match
  while ((match = regex.exec(text)) !== null) {
    matches.push(match)
  }
  return matches
}

function countRegexInFiles(pattern: string | RegExp, filePatterns: string[]): number {
  let count = 0
  const files = filePatterns.flatMap((p) => findFiles(p))
  for (const file of files) {
    const matches = grepMatches(pattern, file)
    count += matches.length
  }
  return count
}

function sanitizeDatabaseUrl(url: string): string {
  if (!url) return ''
  return url.replace(/([a-zA-Z0-9_-]+):([^@]+)@/, '$1:***@')
}

// ============================================================================
// CHECKS
// ============================================================================

function checkFrontendStack(): CheckResult {
  const hasViteConfig = exists('vite.config.ts') || exists('vite.config.js')
  const hasIndexHtml = exists('index.html')
  const hasNextConfig = exists('next.config.js') || exists('next.config.mjs')
  const pkgJson = readText('package.json')
  const hasReactDep = /["']react["']\s*:/.test(pkgJson)

  const isVite = hasViteConfig && hasIndexHtml && hasReactDep
  const isNext = hasNextConfig && hasReactDep

  return {
    ok: isVite || isNext,
    value: { vite: isVite, next: isNext },
    details: [
      `Vite detected: ${isVite}`,
      `Next.js detected: ${isNext}`,
      `React dependency: ${hasReactDep}`,
    ],
  }
}

function checkFrontendPages(): CheckResult {
  const appFiles = findFiles('src/app/**/page.tsx')
  const pagesFiles = findFiles('src/pages/**/*.{tsx,ts,jsx,js}')

  let found: string[] = []

  // Next.js App Router: src/app/[route]/page.tsx
  for (const file of appFiles) {
    if (/\(home\)|^src\/app\/page\.tsx/.test(file)) found.push('home')
    if (/pacotes/.test(file)) found.push('pacotes')
    if (/contato/.test(file)) found.push('contato')
  }

  // Next.js Pages Router: src/pages/[route].*
  for (const file of pagesFiles) {
    if (/pages\/index\.|pages\/\[index\]/.test(file)) found.push('home')
    if (/pages\/pacotes/.test(file)) found.push('pacotes')
    if (/pages\/contato/.test(file)) found.push('contato')
  }

  found = [...new Set(found)]
  const expected = ['home', 'pacotes', 'contato']
  const count = expected.filter((p) => found.includes(p)).length

  return {
    ok: count >= 3,
    value: { expected, found, count },
    details: [
      `Expected pages: ${expected.join(', ')}`,
      `Found pages: ${found.join(', ')}`,
      `Match count: ${count}/3`,
    ],
  }
}

function checkFrontendA11y(): CheckResult {
  const pageFiles = findFiles('src/**/*page*.tsx')
  const layoutFiles = findFiles('src/**/layout.tsx')
  const allFiles = [...pageFiles, ...layoutFiles]
  let found = false

  for (const file of allFiles) {
    const text = readText(file)
    if (
      /id\s*=\s*["']conteudo["']/i.test(text) &&
      /tabIndex\s*=\s*\{?\s*-1\s*\}?/.test(text) &&
      /scroll-mt-24/.test(text)
    ) {
      found = true
      break
    }
  }

  return {
    ok: found,
    details: [
      `<main id="conteudo">: ${found}`,
      `tabIndex={-1} pattern: ${found}`,
      `scroll-mt-24 class: ${found}`,
    ],
  }
}

function checkFrontendPalette(): CheckResult {
  const cssFiles = findFiles('src/**/*.css') // React + Tailwind
  const tsxFiles = findFiles('src/**/*.tsx') // Tailwind classes

  let blueHits = 0
  let yellowHits = 0

  // Check CSS files
  for (const file of cssFiles) {
    const text = readText(file)
    blueHits += (text.match(/blue|azul/gi) || []).length
    yellowHits += (text.match(/yellow|amarelo/gi) || []).length
  }

  // Check TSX for Tailwind classes
  for (const file of tsxFiles) {
    const text = readText(file)
    blueHits += (text.match(/\b(text-blue|bg-blue|border-blue|from-blue|to-blue)/gi) || []).length
    yellowHits += (text.match(/\b(text-yellow|bg-yellow|border-yellow|from-yellow|to-yellow)/gi) || []).length
  }

  const ok = blueHits > 0 && yellowHits > 0

  return {
    ok,
    value: { blueHits, yellowHits },
    details: [
      `Blue references: ${blueHits}`,
      `Yellow references: ${yellowHits}`,
      `Color palette detected: ${ok}`,
    ],
  }
}

function checkBackendEntry(): CheckResult {
  const serverTs = exists('src/server.ts')
  const serverIndexTs = exists('src/server/index.ts')
  const indexTs = exists('src/index.ts')

  const entry = serverTs ? 'src/server.ts' : serverIndexTs ? 'src/server/index.ts' : indexTs ? 'src/index.ts' : null

  return {
    ok: entry !== null,
    value: entry,
    details: [`Server entry point: ${entry || 'not found'}`],
  }
}

function checkBackendTypeScript(): CheckResult {
  const hasTsconfig = exists('tsconfig.json')
  const serverFiles = findFiles('src/server/**/*.ts')

  return {
    ok: hasTsconfig && serverFiles.length > 0,
    value: { hasTsconfig, serverFilesCount: serverFiles.length },
    details: [
      `tsconfig.json: ${hasTsconfig}`,
      `Server TypeScript files: ${serverFiles.length}`,
    ],
  }
}

function checkBackendHttpOnlyCookie(): CheckResult {
  const routeFiles = findFiles('src/server/**/*.ts')
  let found = false

  for (const file of routeFiles) {
    if (grep(/res\.cookie\([^)]*httpOnly\s*:\s*true/i, file)) {
      found = true
      break
    }
  }

  return {
    ok: found,
    details: [`res.cookie( with httpOnly: true: ${found}`],
  }
}

function checkBackendCorsCredentials(): CheckResult {
  const files = findFiles('src/server/**/*.ts')
  let found = false

  for (const file of files) {
    if (grep(/cors\(\s*\{[^}]*credentials\s*:\s*true/i, file)) {
      found = true
      break
    }
  }

  return {
    ok: found,
    details: [`cors({ credentials: true }): ${found}`],
  }
}

function checkBackendEndpoints(): CheckResult {
  const count = countRegexInFiles(/router\.(get|post|put|patch|delete)\(/i, [
    'src/server/routes/**/*.ts',
  ])

  return {
    ok: count >= 8, // Esperado: ~8 endpoints
    value: { count },
    details: [
      `Endpoints count: ${count}`,
      `Expected: ≥8 for auth, posts, profile, users/me/points`,
    ],
  }
}

function checkDatabasePrisma(): CheckResult {
  const hasPrisma = exists('prisma/schema.prisma')

  return {
    ok: hasPrisma,
    details: [`prisma/schema.prisma: ${hasPrisma}`],
  }
}

function checkDatabasePointEventUnique(): CheckResult {
  const schema = readText('prisma/schema.prisma')
  const hasUniqueMetaHash = /@@unique\(\s*\[\s*userId\s*,\s*type\s*,\s*metaHash\s*\]\s*\)/i.test(
    schema
  )

  return {
    ok: hasUniqueMetaHash,
    details: [
      `PointEvent unique constraint [userId, type, metaHash]: ${hasUniqueMetaHash}`,
    ],
  }
}

function checkDatabaseIndexes(): CheckResult {
  const schema = readText('prisma/schema.prisma')
  const hasUserIdIndex = /@@index\(\s*\[\s*userId/i.test(schema)

  return {
    ok: hasUserIdIndex,
    details: [`userId index: ${hasUserIdIndex}`],
  }
}

function checkDatabaseMigrations(): CheckResult {
  const migrationFiles = findFiles('prisma/migrations/**/migration.sql')
  const sqlRoot = findFiles('prisma/migrations/**/add_user_post_points.sql')
  const sqlRoot2 = findFiles('**/add_user_post_points.sql')

  const allFiles = [...new Set([...migrationFiles, ...sqlRoot, ...sqlRoot2])]

  return {
    ok: allFiles.length > 0,
    value: allFiles,
    details: [
      `Migration files: ${allFiles.length}`,
      `Files: ${allFiles.slice(0, 3).join(', ')}${allFiles.length > 3 ? '...' : ''}`,
    ],
  }
}

function checkDatabaseEnv(): CheckResult {
  const envLocal = readText('.env.local')
  const env = readText('.env')
  const envContent = envLocal || env

  const hasDatabaseUrl = /DATABASE_URL\s*=/.test(envContent)
  const sanitized = sanitizeDatabaseUrl(envContent)

  return {
    ok: hasDatabaseUrl,
    value: { hasDatabaseUrl, sanitized },
    details: [`DATABASE_URL in .env: ${hasDatabaseUrl}`],
  }
}

function checkDeployVercel(): CheckResult {
  const hasVercelJson = exists('vercel.json')
  const hasVercelDir = exists('.vercel')
  const pkgJson = readText('package.json')
  const hasVercelScript = /"vercel"\s*:/.test(pkgJson)

  const ok = hasVercelJson || hasVercelDir || hasVercelScript

  const hints: string[] = []
  if (!hasVercelJson) hints.push('Create vercel.json for config')
  if (!hasVercelScript) hints.push('Add "vercel" script to package.json')

  return {
    ok,
    value: { hasVercelJson, hasVercelDir, hasVercelScript },
    details: [
      `vercel.json: ${hasVercelJson}`,
      `/.vercel dir: ${hasVercelDir}`,
      `npm script "vercel": ${hasVercelScript}`,
    ],
  }
}

function checkTestsE2E(): CheckResult {
  const happyPath = exists('tests/e2e/happy-path.spec.ts')
  const testCount = happyPath ? (grepMatches(/test\(/g, 'tests/e2e/happy-path.spec.ts') || []).length : 0

  return {
    ok: happyPath && testCount >= 4,
    value: { testCount },
    details: [
      `happy-path.spec.ts: ${happyPath}`,
      `Test cases: ${testCount}`,
      `Expected: ≥4`,
    ],
  }
}

function checkTestsAxe(): CheckResult {
  const testFiles = findFiles('tests/**/*.spec.ts')
  let found = false

  for (const file of testFiles) {
    if (grep(/@axe-core\/playwright|injectAxe|checkA11y/i, file)) {
      found = true
      break
    }
  }

  return {
    ok: found,
    details: [`@axe-core/playwright or injectAxe: ${found}`],
  }
}

function checkTestsScreenshots(): CheckResult {
  const screenshots = findFiles('tests/e2e/__screenshots__/**/*')

  return {
    ok: screenshots.length >= 3,
    value: { count: screenshots.length },
    details: [
      `Screenshots: ${screenshots.length}`,
      `Expected: ≥3`,
    ],
  }
}

// ============================================================================
// SCORING
// ============================================================================

interface Weights {
  [key: string]: number
}

const WEIGHTS: Weights = {
  'frontend.stack': 5,
  'frontend.pages': 10,
  'frontend.a11y': 10,
  'frontend.palette': 5,
  'backend.entry': 5,
  'backend.typescript': 5,
  'backend.httpOnlyCookie': 10,
  'backend.corsCredentials': 5,
  'backend.endpoints': 5,
  'database.prisma': 5,
  'database.unique': 10,
  'database.indexes': 5,
  'database.migrations': 5,
  'database.env': 0, // Informational, not graded
  'deploy.vercel': 5,
  'tests.e2e': 7,
  'tests.axe': 2,
  'tests.screenshots': 1,
}

function calculateScore(
  checks: Record<string, CheckResult>,
  results: FormaStatus
): number {
  let totalScore = 0
  let totalWeight = 0

  for (const [key, weight] of Object.entries(WEIGHTS)) {
    if (weight === 0) continue // Skip informational checks
    const checkKey = key.replace(/\./g, '') // "frontend.stack" -> "frontendstack"
    const result = Object.entries(checks).find(([k]) =>
      k.toLowerCase().includes(key.replace(/\./g, ''))
    )

    if (result) {
      const [, check] = result
      const contribution = check.ok ? weight : 0
      totalScore += contribution
      totalWeight += weight
    }
  }

  return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0
}

function getSemaphore(score: number): 'green' | 'yellow' | 'orange' | 'red' {
  if (score >= 85) return 'green'
  if (score >= 70) return 'yellow'
  if (score >= 50) return 'orange'
  return 'red'
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const checks: Record<string, CheckResult> = {
    frontendStack: checkFrontendStack(),
    frontendPages: checkFrontendPages(),
    frontendA11y: checkFrontendA11y(),
    frontendPalette: checkFrontendPalette(),
    backendEntry: checkBackendEntry(),
    backendTypeScript: checkBackendTypeScript(),
    backendHttpOnlyCookie: checkBackendHttpOnlyCookie(),
    backendCorsCredentials: checkBackendCorsCredentials(),
    backendEndpoints: checkBackendEndpoints(),
    databasePrisma: checkDatabasePrisma(),
    databasePointEventUnique: checkDatabasePointEventUnique(),
    databaseIndexes: checkDatabaseIndexes(),
    databaseMigrations: checkDatabaseMigrations(),
    databaseEnv: checkDatabaseEnv(),
    deployVercel: checkDeployVercel(),
    testsE2E: checkTestsE2E(),
    testsAxe: checkTestsAxe(),
    testsScreenshots: checkTestsScreenshots(),
  }

  const score = calculateScore(checks, {} as FormaStatus)
  const semaphore = getSemaphore(score)

  const result: FormaStatus = {
    generatedAt: new Date().toISOString(),
    frontend: {
      stack: checks.frontendStack.value,
      pages: checks.frontendPages.value,
      a11yMain: checks.frontendA11y.ok,
      palette: checks.frontendPalette.value,
      notes: checks.frontendStack.value?.next
        ? ['Next.js detected (compatible with Vite/React requirements)']
        : undefined,
    },
    backend: {
      entry: checks.backendEntry.value,
      hasTsconfig: checks.backendTypeScript.value?.hasTsconfig,
      httpOnlyCookie: checks.backendHttpOnlyCookie.ok,
      corsCredentials: checks.backendCorsCredentials.ok,
      endpoints: {
        files: findFiles('src/server/routes/**/*.ts'),
        count: checks.backendEndpoints.value?.count || 0,
      },
    },
    database: {
      hasPrisma: checks.databasePrisma.ok,
      pointEventUniqueByMetaHash: checks.databasePointEventUnique.ok,
      hasUserIdIndex: checks.databaseIndexes.ok,
      migrationFiles: checks.databaseMigrations.value || [],
      sanitizedDatabaseUrl: checks.databaseEnv.value?.sanitized,
    },
    deploy: {
      vercelIntent: checks.deployVercel.ok,
      hints: checks.deployVercel.value?.hasVercelScript === false
        ? ['Add "vercel" script to package.json for CI/CD']
        : undefined,
    },
    tests: {
      happyPathExists: checks.testsE2E.ok,
      testCount: checks.testsE2E.value?.testCount || 0,
      hasAxe: checks.testsAxe.ok,
      screenshots: checks.testsScreenshots.value?.count || 0,
    },
    score,
    semaphore,
    weights: WEIGHTS,
  }

  // Write JSON
  fs.writeFileSync(
    path.resolve(REPO_ROOT, 'FORMA_STATUS.json'),
    JSON.stringify(result, null, 2)
  )

  // Console output
  const semaphoreChar =
    semaphore === 'green'
      ? pc.green('🟢')
      : semaphore === 'yellow'
        ? pc.yellow('🟡')
        : semaphore === 'orange'
          ? pc.yellow('🟠')
          : pc.red('🔴')

  console.log('\n' + pc.bold('='.repeat(70)))
  console.log(pc.bold(pc.blue('📊 FORMA+ Progress Checker')))
  console.log('='.repeat(70) + '\n')

  // Frontend
  console.log(pc.cyan('📱 FRONTEND (Stack + Pages + A11y + Palette)'))
  console.log(`  ${checks.frontendStack.ok ? '✅' : '❌'} Stack: ${checks.frontendStack.value?.vite ? 'Vite' : checks.frontendStack.value?.next ? 'Next.js' : 'None'}`)
  console.log(`  ${checks.frontendPages.ok ? '✅' : '⚠️'} Pages: ${checks.frontendPages.value?.count || 0}/3 (${checks.frontendPages.value?.found?.join(', ') || 'none'})`)
  console.log(`  ${checks.frontendA11y.ok ? '✅' : '❌'} A11y: <main id="conteudo">, tabIndex, scroll-mt-24`)
  console.log(`  ${checks.frontendPalette.ok ? '✅' : '❌'} Palette: 🔵 (${checks.frontendPalette.value?.blueHits || 0}) 🟡 (${checks.frontendPalette.value?.yellowHits || 0})\n`)

  // Backend
  console.log(pc.cyan('🔧 BACKEND (Node.js + TS + Auth + Routes)'))
  console.log(`  ${checks.backendEntry.ok ? '✅' : '❌'} Entry: ${checks.backendEntry.value || 'not found'}`)
  console.log(`  ${checks.backendTypeScript.ok ? '✅' : '❌'} TypeScript: tsconfig.json + .ts files`)
  console.log(`  ${checks.backendHttpOnlyCookie.ok ? '✅' : '❌'} httpOnly Cookies: res.cookie( with httpOnly: true`)
  console.log(`  ${checks.backendCorsCredentials.ok ? '✅' : '❌'} CORS Credentials: cors({ credentials: true })`)
  console.log(`  ${checks.backendEndpoints.ok ? '✅' : '⚠️'} Endpoints: ${checks.backendEndpoints.value?.count || 0}/8+\n`)

  // Database
  console.log(pc.cyan('🗄️  DATABASE (Prisma + Unique + Indexes + Migrations)'))
  console.log(`  ${checks.databasePrisma.ok ? '✅' : '❌'} Prisma: schema.prisma found`)
  console.log(`  ${checks.databasePointEventUnique.ok ? '✅' : '❌'} Unique Constraint: [userId, type, metaHash]`)
  console.log(`  ${checks.databaseIndexes.ok ? '✅' : '❌'} Indexes: userId index on PointEvent`)
  console.log(`  ${checks.databaseMigrations.ok ? '✅' : '⚠️'} Migrations: ${(checks.databaseMigrations.value || []).length} files`)
  console.log(`  ${checks.databaseEnv.ok ? '✅' : '⚠️'} .env: DATABASE_URL ${checks.databaseEnv.ok ? 'found' : 'missing'}\n`)

  // Deploy
  console.log(pc.cyan('🚀 DEPLOY (Vercel)'))
  console.log(`  ${checks.deployVercel.ok ? '✅' : '⚠️'} Vercel Intent: ${checks.deployVercel.value?.hasVercelJson ? 'vercel.json' : checks.deployVercel.value?.hasVercelDir ? '.vercel dir' : checks.deployVercel.value?.hasVercelScript ? 'script' : 'not configured'}\n`)

  // Tests
  console.log(pc.cyan('✅ TESTS (E2E + A11y + Screenshots)'))
  console.log(`  ${checks.testsE2E.ok ? '✅' : '⚠️'} E2E: ${checks.testsE2E.value?.testCount || 0} tests in happy-path.spec.ts`)
  console.log(`  ${checks.testsAxe.ok ? '✅' : '⚠️'} A11y: @axe-core/playwright ${checks.testsAxe.ok ? 'found' : 'not found'}`)
  console.log(`  ${checks.testsScreenshots.ok ? '✅' : '⚠️'} Screenshots: ${checks.testsScreenshots.value?.count || 0}\n`)

  // Score
  console.log(pc.bold('='.repeat(70)))
  console.log(
    `${semaphoreChar} ${pc.bold(`FORMA+ Score: ${score}/100`)} — ${
      semaphore === 'green'
        ? pc.green('Ready for Delivery')
        : semaphore === 'yellow'
          ? pc.yellow('Almost There')
          : semaphore === 'orange'
            ? pc.yellow('In Progress')
            : pc.red('Needs Attention')
    }`
  )
  console.log(pc.bold('='.repeat(70)))
  console.log(`\n✨ Report saved to: ${pc.gray('FORMA_STATUS.json')}\n`)
}

main().catch((err) => {
  console.error(pc.red('❌ Error:'), err.message)
  // Do NOT call process.exit(1) — just report
})
