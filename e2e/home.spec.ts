import { test, expect } from '@playwright/test';

test('homepage loads and has title', async ({ page }) => {
  await page.goto('/');
  // Verifica se o título da página contém a palavra "Agendify" (ou texto correspondente ao site).
  // Se a página inicial não tiver esse título exato, você pode mudar o texto da regex abaixo.
  await expect(page).toHaveTitle(/Agendify/i);
});
