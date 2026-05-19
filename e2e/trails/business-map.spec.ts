import { test, expect } from '@playwright/test';

test.describe('Trilha Mapa do Negócio', () => {
  test('Deve preencher passo 1, persistir durante reload no passo 2 e finalizar na IA', async ({ page }) => {
    // Navigate to the specific trail
    await page.goto('/trails/business-map');

    // Wait for the form to be ready
    await expect(page.getByRole('heading', { name: 'Visão Estratégica' })).toBeVisible();

    // Step 1: Visão Estratégica
    await page.fill('textarea[id="proposito"]', 'Transformar a educação no Brasil com tecnologia acessível.');
    await page.fill('textarea[id="proposta_valor"]', 'Software de gestão que economiza 20h por semana para professores.');

    // Click 'Continuar'
    await page.getByRole('button', { name: 'Próximo' }).click();

    // Verify Step 2: Operação e Equipe
    await expect(page.getByRole('heading', { name: 'Operação e Equipe' })).toBeVisible();

    // Fill partially step 2
    await page.selectOption('select[id="tamanho_equipe"]', '2_5');
    await page.locator('label').filter({ hasText: 'Tráfego Pago' }).click();

    // Reload the page!
    await page.reload();

    // Verify we are still on Step 2
    await expect(page.getByRole('heading', { name: 'Operação e Equipe' })).toBeVisible();

    // Verify previous data in Step 2 is still there
    const selectValue = await page.locator('select[id="tamanho_equipe"]').inputValue();
    expect(selectValue).toBe('2_5');

    const checkboxChecked = await page.locator('input[value="trafego_pago"]').isChecked();
    expect(checkboxChecked).toBeTruthy();

    // Mock API Before advancing to the AI step
    await page.route('**/api/agent/orchestrator', async route => {
      const json = { result: 'Mock AI Response' };
      await route.fulfill({ json });
    });

    // Complete Step 2
    await page.locator('label').filter({ hasText: 'Orgânico / Redes Sociais' }).click();

    // Click 'Continuar'
    await page.getByRole('button', { name: 'Próximo' }).click();

    // Wait for the new AI Step selection screen
    await expect(page.getByRole('heading', { name: 'Jules processou seus dados!' })).toBeVisible({ timeout: 15000 });

    // Select to generate dossier
    await page.getByRole('button', { name: 'Gerar Dossiê' }).click();

    // Wait for the AI result to load
    await expect(page.getByText('Mock AI Response')).toBeVisible({ timeout: 15000 });

    // Click 'Finalizar Jornada'
    await page.getByRole('button', { name: 'Finalizar Jornada' }).click();

    // Verify final success screen
    await expect(page.getByRole('heading', { name: 'Parabéns!' })).toBeVisible();
    await expect(page.getByText('Você completou a jornada Mapa do seu Negócio com sucesso.')).toBeVisible();
  });
});
