#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega .env (opcional)
dotenv.config();

// ==== Configurável por você ====
// Se quiser que o script cobre envs obrigatórias no build, liste-as aqui:
const REQUIRED_ENVS = [
  // Aceite UMA OU OUTRA variável para a base do backend no build:
  // sintaxe "A|B" = pelo menos uma precisa estar definida
  "NEXT_PUBLIC_BACKEND_URL|NEXT_PUBLIC_API_BASE_URL",
];

// Se seu app vive em "src/" (package.json lá dentro), marque true:
const APP_IN_SRC = fs.existsSync(path.join(process.cwd(), "src", "package.json"));
// Você pode forçar com variável de ambiente: BASE_DIR=src ou BASE_DIR=.
const BASE_DIR = process.env.BASE_DIR || (APP_IN_SRC ? "src" : ".");

// ================================

const log = {
  h: (t) => console.log(chalk.bold.cyan(`\n${t}\n`)),
  ok: (t) => console.log(chalk.green(`✓ ${t}`)),
  warn: (t) => console.log(chalk.yellow(`! ${t}`)),
  err: (t) => console.log(chalk.red(`✗ ${t}`)),
  note: (t) => console.log(chalk.gray(`- ${t}`)),
};

function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); }
  catch { return null; }
}

function exists(p) { return fs.existsSync(p); }

function hasNetlifyToml(base) {
  return exists(path.join(base, "netlify.toml")) || exists(path.join(process.cwd(), "netlify.toml"));
}

function resolveBase(base) {
  return path.resolve(process.cwd(), base);
}

function detectPublishDir(pkg) {
  const build = pkg?.scripts?.build || "";
  const isExport = /\bnext\s+build\b.*\bnext\s+export\b/i.test(build) || /\bnext\s+export\b/i.test(build);
  return isExport ? "out" : ".next";
}

function summarizeSettings({ baseDir, publishDir, mode, nodeVersion, missing }) {
  console.log();
  log.h("Resumo — preencha no Netlify");
  console.log(chalk.white(`Base directory: ${chalk.bold(baseDir === "." ? "(em branco)" : baseDir)}`));
  console.log(chalk.white(`Build command:  ${chalk.bold("npm ci && npm run build")}`));
  console.log(chalk.white(`Publish dir:    ${chalk.bold(publishDir)}`));
  if (mode === "SSR") {
    console.log(chalk.white(`Plugin:         ${chalk.bold("@netlify/plugin-nextjs")}`));
  } else {
    console.log(chalk.white(`(Static export) sem plugin obrigatório`));
  }
  if (nodeVersion) {
    console.log(chalk.white(`Node:           ${chalk.bold(nodeVersion)} (defina em engines/.nvmrc)`));
  }
  if (missing.envs.length) {
    log.warn(`Faltam envs: ${missing.envs.join(", ")}`);
  }
}

(async function main() {
  log.h("Verificação Netlify + Next.js");

  const baseDirAbs = resolveBase(BASE_DIR);
  const pkgPath = path.join(baseDirAbs, "package.json");
  const pkg = readJson(pkgPath);

  if (!pkg) {
    log.err(`package.json não encontrado em ${BASE_DIR}. Ajuste BASE_DIR ou mova o app.`);
    process.exit(1);
  }
  log.ok(`package.json encontrado em ${BASE_DIR}`);

  // Scripts
  const buildScript = pkg.scripts?.build || "";
  if (!/next\s+build/.test(buildScript)) {
    log.err(`Script "build" precisa rodar "next build". Encontrado: "${buildScript || "(vazio)"}"`);
  } else {
    log.ok(`"build" = "${buildScript}"`);
  }

  // Dependência next
  const deps = { ...(pkg.dependencies || {}), ...(pkg.peerDependencies || {}) };
  const hasNext = !!deps.next;
  if (!hasNext) log.err(`"next" não está em dependencies. Adicione "next" (não só devDependencies).`);
  else log.ok(`next@${deps.next} em dependencies`);

  // Node engines
  const nodeEngine = pkg.engines?.node || "";
  if (!nodeEngine) {
    log.warn(`Sem "engines.node" no package.json. Recomendo algo como "18.x".`);
  } else {
    log.ok(`engines.node = ${nodeEngine}`);
  }

  // netlify.toml
  const hasToml = hasNetlifyToml(baseDirAbs);
  if (!hasToml) {
    log.warn(`netlify.toml não encontrado (opcional, mas recomendado).`);
  } else {
    log.ok(`netlify.toml encontrado`);
  }

  // Modo: SSR vs Static export
  const publishDir = detectPublishDir(pkg);
  const mode = publishDir === ".next" ? "SSR" : "STATIC";
  log.ok(`Modo detectado: ${mode} → publish = ${publishDir}`);

  // Plugin Next (SSR)
  let hasPlugin = false;
  if (mode === "SSR") {
    const plugins = pkg.netlify?.plugins || []; // alguns projetos declaram aqui
    try {
      const toml = fs.readFileSync(path.join(process.cwd(), "netlify.toml"), "utf8");
      hasPlugin = plugins.includes("@netlify/plugin-nextjs") || toml.includes("@netlify/plugin-nextjs");
    } catch {}
    if (!hasPlugin) log.warn(`Plugin "@netlify/plugin-nextjs" não detectado. Recomendado para SSR/ISR.`);
    else log.ok(`@netlify/plugin-nextjs detectado`);
  }

  // Envs
  const missingEnvs = REQUIRED_ENVS.filter((key) => {
    if (key.includes("|")) {
      const keys = key.split("|");
      return !keys.some((kk) => (process.env[kk] ?? "").length);
    }
    return !(process.env[key] ?? "").length;
  });
  if (REQUIRED_ENVS.length) {
    if (missingEnvs.length) log.warn(`Variáveis de ambiente ausentes: ${missingEnvs.join(", ")}`);
    else log.ok(`Todas as envs obrigatórias estão definidas`);
  } else {
    log.note(`Nenhuma env obrigatória declarada no script (REQUIRED_ENVS).`);
  }

  // Dica Base/Publish vs Netlify UI
  log.h("Dicas de configuração");
  if (BASE_DIR === "src") {
    log.note(`Como Base directory = "src", no Netlify use Publish directory = "${publishDir}" (sem "src/").`);
  } else {
    log.note(`Base directory vazio, Publish directory = "${publishDir}".`);
  }

  summarizeSettings({
    baseDir: BASE_DIR,
    publishDir,
    mode,
    nodeVersion: nodeEngine,
    missing: { envs: missingEnvs },
  });

  // Saída “semáforo”
  const failures = [];
  if (!/next\s+build/.test(buildScript)) failures.push("build-script");
  if (!hasNext) failures.push("next-dep");

  if (failures.length) {
    console.log();
    log.err(`Status: há pontos a corrigir → ${failures.join(", ")}`);
    process.exit(2);
  } else {
    console.log();
    log.ok("Status: pronto para tentar o deploy no Netlify (checagens básicas ok).");
    process.exit(0);
  }
})();
