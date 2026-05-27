import { test, expect } from '@playwright/test';
import { clerk } from '@clerk/testing/playwright';

test.describe('Dashboard Autenticado - Gerenciamento de Serviços', () => {
  
  test('deve permitir que o prestador crie um novo serviço', async ({ page }) => {
    // 1. Interceptar chamadas da API do backend para isolar o teste no frontend
    // Mock do perfil do usuário para o hook useAuth()
    await page.route('**/api/user/profile', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: {
            id: 'mock-provider-id',
            clerkId: 'mock-clerk-id',
            email: 'provider@test.com',
            name: 'Mock Provider',
            role: 'provider',
            services: [] // Começa sem serviços
          }
        }
      });
    });

    // Mock da criação de um serviço
    await page.route('**/api/services', async (route) => {
      if (route.request().method() === 'POST') {
        const postData = JSON.parse(route.request().postData() || '{}');
        await route.fulfill({
          json: {
            success: true,
            data: {
              id: 'mock-service-id',
              ...postData
            }
          }
        });
      } else {
        await route.continue();
      }
    });

    // 2. Acessar a página desprotegida inicial para carregar o SDK da Clerk
    await page.goto('/');

    // 3. Fazer o Bypass da UI de Autenticação usando o Testing Token
    // IMPORTANTE: Este e-mail DEVE existir no seu Clerk Dashboard (ambiente de dev).
    // O @clerk/testing pula a interface, mas ainda valida o usuário na API da Clerk.
    const testEmail = process.env.E2E_CLERK_EMAIL || 'COLOQUE_SEU_EMAIL_AQUI@dominio.com';
    
    await clerk.signIn({
      page,
      emailAddress: testEmail,
    });

    // Aguarda um pequeno instante para que os redirecionamentos automáticos do Next.js/Clerk 
    // se estabilizem antes de forçarmos uma nova navegação. Isso evita o erro NS_BINDING_ABORTED.
    await page.waitForTimeout(1500);

    // 4. Navegar para a página de configurações do dashboard
    await page.goto('/dashboard/settings');

    // 5. Mudar para a aba de "Catálogo de Serviços"
    await page.getByRole('tab', { name: /Catálogo de Serviços/i }).click();

    // 6. Preencher o formulário
    await page.getByLabel(/Nome do Serviço/i).fill('Corte Degradê E2E');
    await page.getByLabel(/Descrição/i).fill('Corte feito pelo Playwright');
    await page.getByLabel(/Preço/i).fill('65');
    
    // Abrir o select de duração e escolher 45 minutos
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: '45 minutos' }).click();

    // Submeter formulário
    await page.getByRole('button', { name: 'Cadastrar Serviço' }).click();

    // 7. Validações UI
    // Aqui testaríamos o Toast de sucesso, mas como o shadcn toast pode sumir rápido, 
    // a melhor validação é garantir que o componente resetou ou mudou de estado.
    // O mock que fizemos em `/api/services` não atualiza o cache local automaticamente 
    // a menos que o React Query faça um refetch em `/api/user/profile`.
    // Como mockamos `/api/user/profile` para retornar array vazio, o serviço não vai aparecer na lista visualmente.
    // Para um teste perfeito isolado, poderíamos atualizar o mock de profile dinamicamente,
    // mas só de não ter dado erro e o botão ter voltado ao estado normal, sabemos que o frontend submeteu.
    
    // Verificamos se o form resetou (o nome do serviço deve estar vazio após o sucesso)
    await expect(page.getByLabel(/Nome do Serviço/i)).toBeEmpty();
  });
});
