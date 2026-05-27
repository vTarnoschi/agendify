import { test, expect } from '@playwright/test';
import { clerk } from '@clerk/testing/playwright';

test.describe('Onboarding do Prestador', () => {
  
  test('deve permitir que um novo usuário configure seu negócio', async ({ page }) => {
    // 1. Mock do perfil inicial do usuário ANTES do onboarding (sem slug/businessName)
    await page.route('**/api/user/profile', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: {
            id: 'new-provider-id',
            clerkId: 'mock-clerk-id',
            email: 'new_provider@test.com',
            name: 'New Provider',
            role: 'provider',
            slug: null, // Indicador de que ainda não fez onboarding
            businessName: null,
            services: []
          }
        }
      });
    });

    // 2. Mock do endpoint de submissão do onboarding
    await page.route('**/api/onboarding', async (route) => {
      if (route.request().method() === 'POST') {
        const postData = JSON.parse(route.request().postData() || '{}');
        // Podemos até validar se enviou os dados certos aqui no backend mockado
        expect(postData.businessName).toBe('Barbearia E2E');
        expect(postData.slug).toBe('barbearia-e2e');

        await route.fulfill({
          json: {
            success: true,
            data: null
          }
        });
      } else {
        await route.continue();
      }
    });

    // 3. Acessar a página inicial para carregar o SDK da Clerk
    await page.goto('/');

    // 4. Fazer o Bypass da UI de Autenticação usando o Testing Token
    const testEmail = process.env.E2E_CLERK_EMAIL || 'COLOQUE_SEU_EMAIL_AQUI@dominio.com';
    
    await clerk.signIn({
      page,
      emailAddress: testEmail,
    });

    await page.waitForTimeout(1500);

    // 5. Navegar para a página de onboarding
    await page.goto('/onboarding');

    // 6. Preencher os dados do negócio
    await page.getByLabel(/Nome do Negócio/i).fill('Barbearia E2E');
    
    // O slug deve ser gerado automaticamente, vamos validar isso
    await expect(page.getByLabel(/Seu Link Personalizado/i)).toHaveValue('barbearia-e2e');

    // 7. Submeter formulário
    await page.getByRole('button', { name: 'Concluir Configuração' }).click();

    // 8. O frontend (useOnboardingForm) vai redirecionar para o /dashboard em caso de sucesso
    await page.waitForURL('**/dashboard');
    
    // Sucesso! O teste finaliza ao comprovar que a URL mudou.
    expect(page.url()).toContain('/dashboard');
  });
});
