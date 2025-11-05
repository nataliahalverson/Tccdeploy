/**
 * Teste E2E: Happy Path
 * Route: tests/e2e/happy-path.spec.ts
 *
 * Cenário: login -> novo post -> pontos aparecem em perfil
 *
 * Pré-requisitos:
 * - Backend rodando (http://localhost:3000/api)
 * - Banco de dados com User, Post, PointEvent tables
 * - Usuário teste: demo@exemplo.com / demodemodemo
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Happy Path — Fluxo Completo', () => {
  const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';
  const TEST_EMAIL = 'demo@exemplo.com';
  const TEST_PASSWORD = 'demodemodemo';
  const TEST_POST_TITLE = 'Experiência em Ouro Preto';
  const TEST_POST_CONTENT = 'Notas de campo e roteiro pedagógico para alunos explorarem.';

  // @ts-expect-error — Playwright fixtures
  test('Skip link visível e funcional', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Skip link deve estar no DOM mas não visível inicialmente
    const skipLink = page.getByRole('link', { name: /ir para o conteúdo/i });
    await expect(skipLink).toBeInTheDOM();

    // Pressionar Tab deve fazer o skip link aparecer
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();

    // Verificar que está visível após focus
    const box = await skipLink.boundingBox();
    expect(box).not.toBeNull();

    // Pressionar Enter deve focar #conteudo
    await page.keyboard.press('Enter');
    const mainContent = page.locator('#conteudo');
    await expect(mainContent).toBeFocused();
  });

  // @ts-expect-error — Playwright fixtures
  test('Login -> Novo Post -> Pontos aparecem no Perfil', async ({ page }) => {
    // ============================================
    // 1. Ir para home
    // ============================================
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByRole('heading', { name: /bem-vindo/i })).toBeVisible();

    // ============================================
    // 2. Navegar para login
    // ============================================
    await page.getByRole('link', { name: /entrar|login/i }).click();
    await expect(page).toHaveURL(`${BASE_URL}/login`);
    await expect(page.getByRole('heading', { name: /entrar|login/i })).toBeVisible();

    // ============================================
    // 3. Fazer login
    // ============================================
    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/senha|password/i).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /entrar|login/i }).click();

    // Esperar redirecionamento após login (pode ir para home ou perfil)
    await page.waitForURL(/\/(perfil|inicio|)$/);
    
    // Verificar que cookie foi setado
    const cookies: any = await page.context().cookies();
    const hasAccessToken = cookies.some((c: any) => c.name === 'access_token');
    expect(hasAccessToken).toBeTruthy();

    // ============================================
    // 4. Navegar para "Novo Post"
    // ============================================
    await page.getByRole('link', { name: /novo post|criar post/i }).click();
    await expect(page).toHaveURL(`${BASE_URL}/novo-post`);

    // ============================================
    // 5. Preencher e enviar formulário
    // ============================================
    await page.getByLabel(/título/i).fill(TEST_POST_TITLE);
    await page.getByLabel(/conteúdo|content|description/i).fill(TEST_POST_CONTENT);
    await page.getByRole('button', { name: /publicar|enviar|submit/i }).click();

    // ============================================
    // 6. Verificar mensagem de sucesso
    // ============================================
    const successMessage = page.getByText(/publicado|sucesso|criado/i);
    await expect(successMessage).toBeVisible({ timeout: 5000 });

    // ============================================
    // 7. Navegar para perfil
    // ============================================
    await page.getByRole('link', { name: /perfil|profile/i }).click();
    await expect(page).toHaveURL(`${BASE_URL}/perfil`);

    // ============================================
    // 8. Verificar que saldo foi atualizado
    // ============================================
    const balanceLabel = page.getByText(/saldo de pontos|total de pontos|points balance/i);
    await expect(balanceLabel).toBeVisible();

    // ============================================
    // 9. Verificar que evento POST_CREATED aparece
    // ============================================
    const postCreatedEvent = page.getByText(/POST_CREATED/);
    await expect(postCreatedEvent).toBeVisible();

    // ============================================
    // 10. Verificar que pontos (10 pts) foram creditados
    // ============================================
    const pointsValue = page.getByText(/^\s*10\s*$|^\s*10pts\s*$/);
    await expect(pointsValue).toBeVisible();

    // Verificar que o post criado aparece na lista de posts recentes
    const postTitle = page.getByText(TEST_POST_TITLE);
    await expect(postTitle).toBeVisible();
  });

  // @ts-expect-error — Playwright fixtures
  test('Deep link /#conteudo deve focar automaticamente', async ({ page }) => {
    await page.goto(`${BASE_URL}/#conteudo`);
    
    const mainContent = page.locator('#conteudo');
    
    // Esperar que a página carregue completamente
    await page.waitForLoadState('networkidle');
    
    // Verificar que #conteudo tem atributo tabIndex (para poder ser focado)
    const tabIndex = await mainContent.getAttribute('tabIndex');
    expect(tabIndex).toBe('-1');
    
    // Verificar que está visível
    await expect(mainContent).toBeVisible();
  });

  // @ts-expect-error — Playwright fixtures
  test('Navegação por teclado entre elementos principais', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Start from skip link
    await page.keyboard.press('Tab');
    let focused = await page.evaluate(() => document.activeElement?.getAttribute('class') || '');
    expect(focused).toContain('skip-link');

    // Move to next focusable element (should be a link or button)
    await page.keyboard.press('Tab');
    focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focused);

    // Can press Escape to get back (generic behavior)
    await page.keyboard.press('Escape');

    // Verificar que ainda temos elementos focáveis
    const focusableElements = await page.locator(
      'a, button, input, textarea, select, [tabindex]'
    );
    const count = await focusableElements.count();
    expect(count).toBeGreaterThan(0);
  });

  // @ts-expect-error — Playwright fixtures
  test('Logout remove cookie e redireciona', async ({ page }) => {
    // Login primeiro
    await page.goto(`${BASE_URL}/login`);
    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/senha/i).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/\/(perfil|inicio|)$/);

    // Verificar que cookie existe
    let cookies: any = await page.context().cookies();
    let hasToken = cookies.some((c: any) => c.name === 'access_token');
    expect(hasToken).toBeTruthy();

    // Fazer logout
    await page.getByRole('button', { name: /sair|logout/i }).click();
    await expect(page).toHaveURL(`${BASE_URL}/login`);

    // Verificar que cookie foi removido
    cookies = await page.context().cookies();
    hasToken = cookies.some((c: any) => c.name === 'access_token' && c.value);
    expect(hasToken).toBeFalsy();
  });
});

test.describe('Accessibility — Validações A11Y', () => {
  const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

  // @ts-expect-error — Playwright fixtures
  test('Todas as imagens têm alt text', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  // @ts-expect-error — Playwright fixtures
  test('Headings têm hierarquia correta', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let lastLevel = 0;

    for (const heading of headings) {
      const tagName: string = await heading.evaluate((el: any) => el.tagName);
      const level = parseInt(tagName[1]);

      // H2 não deve vir logo após H1 sem H1
      // (simplificado: apenas não saltar mais de 1 nível)
      expect(level - lastLevel).toBeLessThanOrEqual(1);
      lastLevel = level;
    }
  });

  // @ts-expect-error — Playwright fixtures
  test('Botões têm labels acessíveis', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');

      // Botão deve ter texto visível OU aria-label
      const hasLabel = text && text.trim().length > 0 || ariaLabel;
      expect(hasLabel).toBeTruthy();
    }
  });

  test('Accessibility check with Axe', async ({ page }: any) => {
    await page.goto(`${BASE_URL}/`);
    await injectAxe(page);
    await checkA11y(page);
  });
});
