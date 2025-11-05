// @ts-nocheck
import { test, expect } from '@playwright/test'

test('Home → Pacote → Roteiro → Reserva', async ({ page }) => {
  await page.goto('/')

  const cta = page.getByRole('link', { name: /reservar/i })
  await expect(cta).toBeVisible()
  await cta.click()

  await expect(page).toHaveURL(/\/pacotes\/porto-seguro-3d2n#reserva/)
  await expect(page.getByRole('heading', { name: /reserva/i })).toBeVisible()

  await page.getByPlaceholder('Nome completo').fill('Maria Teste')
  await page.getByPlaceholder('Turma').fill('3A')
  await page.getByPlaceholder('Telefone').fill('(11) 99999-9999')
  await page.getByPlaceholder('Email').fill('maria@teste.com')

  await page.getByRole('button', { name: /enviar interesse/i }).click()
})
