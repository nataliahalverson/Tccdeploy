/**
 * Página: Sobre (About)
 * Route: /sobre
 *
 * Exibe informações sobre o projeto e links para documentação
 */

import Link from 'next/link';
import Main from '@/components/Main';
import { Users, BookOpen, BarChart3, Map, Clipboard, FileText } from 'lucide-react';


export const metadata = {
  title: 'Sobre o Projeto — FORMA+',
  description: 'Conheça o FORMA+, um MVP para compartilhar experiências de viagem e acompanhar pontos.',
};

export default function SobrePage() {
  return (
    <Main>
      {/* Hero / Header */}
      <section className="py-12 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
          Sobre o FORMA+
        </h1>
        <p className="text-lg text-zinc-600">
          Um MVP para educadores compartilharem experiências de viagem e receberem pontos de forma transparente e acessível.
        </p>
      </section>

      {/* Project Info */}
      <section className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Descrição */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/60">
          <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Objetivo</h2>
          <p className="text-zinc-700 leading-relaxed">
            O FORMA+ foi desenvolvido como trabalho de conclusão de curso (TCC) para demonstrar 
            uma plataforma funcional onde professores podem:
          </p>
          <ul className="mt-4 space-y-2 list-disc pl-6 text-zinc-700">
            <li>Publicar experiências de viagem e reflexões pedagógicas</li>
            <li>Acompanhar saldo e histórico de pontos em tempo real</li>
            <li>Navegar com teclado e acessibilidade de alta qualidade</li>
          </ul>
        </div>

        {/* Stack Técnico */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/60">
          <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Stack Técnico</h2>
          <dl className="space-y-3 text-sm text-zinc-700">
            <div>
              <dt className="font-semibold text-zinc-900">Frontend</dt>
              <dd>Next.js 14, React 18, TypeScript, Tailwind CSS</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-900">Backend</dt>
              <dd>Node.js, Express, Prisma ORM</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-900">Database</dt>
              <dd>MySQL (AlwaysData)</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-900">Testing</dt>
              <dd>Playwright (E2E)</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Documentação */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-zinc-900 mb-6 flex items-center gap-3">
          <BookOpen className="text-blue-700" size={22} />
          Documentação Completa
        </h2>
        <p className="text-zinc-600 mb-6">
          Acesse o portal de documentação para entender a arquitetura, roadmap e especificações técnicas completas.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Card: Portal Principal */}
          <Link
            href="/docs/INDEX.md"
            className="rounded-2xl bg-blue-50 p-6 shadow-sm ring-1 ring-blue-200/60 hover:ring-blue-300/80 transition-all hover:bg-blue-100"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <BookOpen size={18} className="text-blue-800" />
              Portal de Docs
            </h3>
            <p className="text-sm text-blue-700">
              Índice completo com guia de leitura por persona (PM, dev, QA, DevOps).
            </p>
          </Link>

          {/* Card: Executive Summary */}
          <Link
            href="/docs/EXECUTIVE_SUMMARY.md"
            className="rounded-2xl bg-blue-50 p-6 shadow-sm ring-1 ring-blue-200/60 hover:ring-blue-300/80 transition-all hover:bg-blue-100"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-800" />
              Sumário Executivo
            </h3>
            <p className="text-sm text-blue-700">
              Visão de alto nível para stakeholders, roadmap e métricas.
            </p>
          </Link>

          {/* Card: Arquitetura */}
          <Link
            href="/docs/ARCHITECTURE.md"
            className="rounded-2xl bg-blue-50 p-6 shadow-sm ring-1 ring-blue-200/60 hover:ring-blue-300/80 transition-all hover:bg-blue-100"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Map size={18} className="text-blue-800" />
              Arquitetura
            </h3>
            <p className="text-sm text-blue-700">
              Diagramas, data flow, componentes e padrões de design.
            </p>
          </Link>

          {/* Card: Escopo MVP */}
          <Link
            href="/docs/SCOPE_ONE_PAGER.md"
            className="rounded-2xl bg-blue-50 p-6 shadow-sm ring-1 ring-blue-200/60 hover:ring-blue-300/80 transition-all hover:bg-blue-100"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Clipboard size={18} className="text-blue-800" />
              Escopo MVP
            </h3>
            <p className="text-sm text-blue-700">
              1-pager com problema, objetivo, personas e critérios de aceite.
            </p>
          </Link>

          {/* Card: Acessibilidade */}
          <Link
            href="/docs/ACCESSIBILITY_CHECKLIST.md"
            className="rounded-2xl bg-blue-50 p-6 shadow-sm ring-1 ring-blue-200/60 hover:ring-blue-300/80 transition-all hover:bg-blue-100"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <FileText size={18} className="text-blue-800" />
              Acessibilidade
            </h3>
            <p className="text-sm text-blue-700">
              Skip link, teclado, focus management e validação de testes.
            </p>
          </Link>

          {/* Card: Relatório Técnico */}
          <Link
            href="/docs/PROJECT_REPORT.md"
            className="rounded-2xl bg-blue-50 p-6 shadow-sm ring-1 ring-blue-200/60 hover:ring-blue-300/80 transition-all hover:bg-blue-100"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <FileText size={18} className="text-blue-800" />
              Relatório Técnico
            </h3>
            <p className="text-sm text-blue-700">
              Stack completo, componentes, páginas e métricas de build.
            </p>
          </Link>
        </div>
      </section>

      {/* Acessibilidade Info */}
      <section className="rounded-2xl bg-zinc-50 p-6 mb-12">
        <h3 className="text-lg font-semibold text-zinc-900 mb-3 flex items-center gap-2">
          <FileText size={18} className="text-zinc-800" />
          Acessibilidade
        </h3>
        <p className="text-zinc-700 mb-4">
          Este site foi desenvolvido com acessibilidade em mente:
        </p>
        <ul className="space-y-2 list-disc pl-6 text-zinc-700">
          <li>
            <strong>Skip link</strong>: Pressione <kbd className="bg-zinc-200 px-2 py-1 rounded text-sm">Tab</kbd> para ver e usar o link "Ir para o conteúdo"
          </li>
          <li><strong>Teclado</strong>: Navegue totalmente com o teclado</li>
          <li><strong>Screen reader ready</strong>: Compatível com leitores de tela (NVDA, JAWS, VoiceOver)</li>
          <li><strong>WCAG 2.1 Level AA</strong>: Segue diretrizes internacionais</li>
        </ul>
      </section>

      {/* Equipe */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-zinc-900 mb-6 flex items-center gap-2">
          <Users size={20} className="text-zinc-800" />
          Equipe
        </h2>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/60">
          <p className="text-zinc-700">
            <strong>Desenvolvedor(a)</strong>: Natália Halverson
          </p>
          <p className="text-zinc-700 mt-2">
            <strong>Instituição</strong>: TCC — Projeto de Conclusão de Curso
          </p>
          <p className="text-zinc-700 mt-2">
            <strong>Data</strong>: 22 de outubro de 2025
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 p-8 text-center">
        <h2 className="text-2xl font-semibold text-blue-900 mb-3">Pronto para começar?</h2>
        <p className="text-blue-700 mb-6">
          Explore o projeto clicando no link de documentação ou navegue pelas páginas do site.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Ir para Home
          </Link>
          <Link
            href="/docs/INDEX.md"
            className="inline-block rounded-lg bg-white px-6 py-3 text-blue-600 font-medium border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            Ver Documentação
          </Link>
        </div>
      </section>
    </Main>
  );
}
