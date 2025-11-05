// @ts-nocheck
import { test, expect } from '@playwright/test'

test('skip link leva o foco para a região principal', async ({ page }) => {
  await page.goto('/')

  // Tab para focar o skip link
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: /ir para o conteúdo/i })).toBeFocused()

  // Enter para ativar o skip link
  await page.keyboard.press('Enter')

  // Verificar que o foco moveu para #conteudo
  await expect(page.locator('#conteudo')).toBeFocused()
  
  // Verificar que a URL tem o hash (comportamento esperado)
  await expect(page).toHaveURL(/#conteudo$/)
})

test('skip link visível no foco', async ({ page }) => {
  await page.goto('/')

  // Tab para focar o skip link
  await page.keyboard.press('Tab')
  const skipLink = page.getByRole('link', { name: /ir para o conteúdo/i })

  // Verificar que é visível (não está em sr-only ou display:none)
  await expect(skipLink).toBeVisible()

  // Verificar que tem foco visível (outline ou ring)
  const computedStyle = await skipLink.evaluate((el) => {
    return window.getComputedStyle(el)
  })

  // Basicamente, verifica que não é 'display: none' nem 'visibility: hidden'
  const isAccessible = computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden'
  expect(isAccessible).toBe(true)
})

test('deep-link com /#conteudo foca automaticamente', async ({ page }) => {
  // Navegar direto com hash
  await page.goto('/#conteudo')

  // Aguardar um pouco para FocusOnRouteChange executar
  await page.waitForTimeout(100)

  // Verificar que #conteudo está focado
  await expect(page.locator('#conteudo')).toBeFocused()
})

test('fluxo de teclado puro em todas as rotas', async ({ page }) => {
  const routes = ['/', '/inicio', '/pacotes', '/roteiro', '/contato', '/login', '/registro']

  for (const route of routes) {
    await page.goto(route)

    // Tab para focar o skip link
    await page.keyboard.press('Tab')
    const skipLink = page.getByRole('link', { name: /ir para o conteúdo/i })
    await expect(skipLink).toBeFocused()

    // Enter para ativar
    await page.keyboard.press('Enter')

    // Verificar que #conteudo foi focado
    await expect(page.locator('#conteudo')).toBeFocused()

    // Verificar scroll suave (scroll-mt-24 em ação)
    const boundingBox = await page.locator('#conteudo').boundingBox()
    expect(boundingBox?.y).toBeLessThanOrEqual(100) // próximo ao topo
  }
})
