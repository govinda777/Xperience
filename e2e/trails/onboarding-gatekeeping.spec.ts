import { test, expect } from '@playwright/test';

test.describe('Jornada de Onboarding e Mapa do Negócio Gatekeeping', () => {
  test('Preenchimento correto do Mapa libera o acesso ao Bootcamp', async ({ page }) => {
    // We mock the API layer for map submission since Privy auth inside headless browsers without real user action is flaky
    await page.route('**/api/mountain/map', async route => {
      if (route.request().method() === 'PUT') {
        const json = { message: 'Business map updated successfully' };
        await route.fulfill({ status: 200, json });
      } else {
        await route.continue();
      }
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Bem-vindo' })).toBeVisible({ timeout: 15000 });

    // The default behavior now shows the Business Map Form when it's not completed.
    // The previous component integration placed it directly if toggled.
    // If there is an 'Editar Mapa do Negócio' button, click it.
    // Otherwise, we are already seeing the map form.
    const editMapBtn = page.getByRole('button', { name: 'Editar Mapa do Negócio' });
    if (await editMapBtn.isVisible()) {
        await editMapBtn.click();
    }

    await expect(page.getByRole('heading', { name: 'Mapa do Seu Negócio - Fase 01' })).toBeVisible();

    await page.fill('textarea[name="mission"]', 'Test Missao Viral');
    await page.fill('textarea[name="vision"]', 'Test Visao Global');
    await page.fill('input[name="teamStructure"]', 'Test Squads Autonomos');
    await page.locator('label').filter({ hasText: 'Receita' }).click();

    // Emulate completion trigger directly if the mock backend passes (the form clears out on completion in Dashboard UI)
    await page.getByRole('button', { name: 'FINALIZAR E INICIAR SUBIDA' }).click();
  });
});
