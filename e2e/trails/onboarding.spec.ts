import { test, expect } from '@playwright/test';

test.describe('Trilha Onboarding Xperience', () => {
  test('Deve preencher o onboarding e persistir em reloads simulados', async ({ page }) => {
    // Navigate to the onboarding trail
    await page.goto('/trails/onboarding');

    // Step 1: Bem-vindo à Xperience
    await expect(page.getByRole('heading', { name: 'Bem-vindo à Xperience' })).toBeVisible();

    await page.fill('input[id="nome_completo"]', 'Maria Antonieta');
    await page.selectOption('select[id="objetivo_principal"]', 'escalar');

    await page.getByRole('button', { name: 'Próximo' }).click();

    // Step 2: Sobre seu Negócio
    await expect(page.getByRole('heading', { name: 'Sobre seu Negócio' })).toBeVisible();

    await page.fill('input[id="nicho"]', 'SaaS para Clínicas Médicas');

    // Reload before completing step 2
    await page.reload();

    await expect(page.getByRole('heading', { name: 'Sobre seu Negócio' })).toBeVisible();

    // Verify nicho persisted
    const nichoValue = await page.locator('input[id="nicho"]').inputValue();
    expect(nichoValue).toBe('SaaS para Clínicas Médicas');

    // Mock API
    await page.route('**/api/report', async route => {
      const json = { content: 'Mock AI Response' };
      await route.fulfill({ json });
    });

    // Complete Step 2
    await page.locator('label').filter({ hasText: 'R$ 10k - R$ 50k' }).click();

    await page.getByRole('button', { name: 'Próximo' }).click();

    // Wait for the new AI Step selection screen
    await expect(page.getByRole('heading', { name: 'Jules processou seus dados!' })).toBeVisible({ timeout: 15000 });

    // Mock API Before advancing to the AI step (using new API route)
    await page.route('**/api/trail-agent', async route => {
      const json = { result: 'Mock AI Response' };
      await route.fulfill({ json });
    });

    // Select to generate dossier
    await page.getByRole('button', { name: 'Gerar Dossiê' }).click();

    // Wait for the AI result to load
    await expect(page.getByRole('heading', { name: 'Seu Dossiê' })).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: 'Finalizar Jornada' }).click();

    await expect(page.getByRole('heading', { name: 'Parabéns!' })).toBeVisible();
    await expect(page.getByText('Você completou a jornada Onboarding Xperience com sucesso.')).toBeVisible();
  });
});
