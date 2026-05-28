import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test.describe('Public Booking Flow', () => {
  let providerId: string;
  let testSlug: string;

  test.beforeAll(async ({}, testInfo) => {
    testSlug = `e2e-test-provider-${testInfo.workerIndex}`;
    // 1. Limpeza de dados antigos se existirem (evita falhas de estado fantasma)
    await prisma.appointment.deleteMany({
      where: { provider: { slug: testSlug } }
    });
    await prisma.service.deleteMany({
      where: { provider: { slug: testSlug } }
    });
    await prisma.user.deleteMany({
      where: { slug: testSlug }
    });

    // 2. Criação do prestador E2E simulado no banco
    const provider = await prisma.user.create({
      data: {
        email: `e2e-${testInfo.workerIndex}@test.com`,
        clerkId: `mocked-clerk-id-${testInfo.workerIndex}`,
        slug: testSlug,
        role: 'provider',
        name: 'E2E Test Provider',
        businessName: 'E2E Barbershop',
        workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        workStart: "08:00",
        workEnd: "20:00",
        services: {
          create: [
            {
              name: 'Corte E2E',
              description: 'Serviço de teste automatizado',
              price: 50,
              duration: 30
            }
          ]
        }
      }
    });
    providerId = provider.id;
  });

  test.afterAll(async () => {
    // 3. Limpeza após a suíte de testes
    if (providerId) {
      await prisma.appointment.deleteMany({
        where: { providerId }
      });
      await prisma.service.deleteMany({
        where: { providerId }
      });
      await prisma.user.delete({
        where: { id: providerId }
      });
    }
    await prisma.$disconnect();
  });

  test('deve permitir que um visitante realize um agendamento', async ({ page }) => {
    // Intercepta a rota de availability ANTES de carregar a página
    // Isso é crucial porque o calendário pode disparar o fetch assim que a página renderizar.
    await page.route('**/api/availability*', async (route) => {
      const json = { data: { slots: ["10:00", "10:30", "11:00"], hasGoogleIntegration: false }, success: true };
      await route.fulfill({ json });
    });

    // Acessa a página pública do provider de teste
    await page.goto(`/${testSlug}`);

    // Valida carregamento inicial
    await expect(page.locator('h1')).toContainText('E2E Barbershop');

    // Seleciona o serviço clicando no card que tem o texto correspondente
    await page.getByText('Corte E2E').click();

    // O Playwright espera automaticamente o elemento estar visível antes do clique (Web-first locator)
    await page.getByRole('button', { name: '10:00', exact: true }).click();

    // Na nota de agendamento (BookingNotes), clica em Confirmar Agendamento.
    // Como o usuário não está logado, isso abrirá o modal (GuestContactModal)
    await page.getByRole('button', { name: 'Confirmar Agendamento', exact: true }).click();

    // Preenche o formulário no GuestContactModal
    await page.getByPlaceholder('Ex: João da Silva').fill('Cliente E2E');
    await page.getByPlaceholder('Ex: joao@email.com').fill('cliente.e2e@test.com');
    await page.getByPlaceholder('(11) 99999-9999').fill('11999999999');

    // Intercepta a criação do agendamento para não enviar e-mails reais via Resend
    // ou inserir sujeira no banco de dados desnecessariamente.
    await page.route('**/api/appointments', async (route) => {
      const json = { data: { id: "mocked-appointment-id" }, success: true };
      await route.fulfill({ json });
    });

    // Submete o modal clicando no botão Confirmar de dentro do dialog
    await page.getByRole('dialog').getByRole('button', { name: 'Confirmar Agendamento' }).click();

    // Valida a tela de sucesso
    await expect(page.getByText('Agendamento Confirmado!')).toBeVisible();
    await expect(page.getByText('10:00')).toBeVisible();
    await expect(page.getByText('Corte E2E')).toBeVisible();
  });

  test('deve tratar erros de rede (500) adequadamente ao agendar', async ({ page }) => {
    await page.route('**/api/availability*', async (route) => {
      const json = { data: { slots: ["10:00"], hasGoogleIntegration: false }, success: true };
      await route.fulfill({ json });
    });

    await page.goto(`/${testSlug}`);
    await page.getByText('Corte E2E').click();
    await page.getByRole('button', { name: '10:00', exact: true }).click();
    await page.getByRole('button', { name: 'Confirmar Agendamento', exact: true }).click();

    await page.getByPlaceholder('Ex: João da Silva').fill('Cliente E2E');
    await page.getByPlaceholder('Ex: joao@email.com').fill('cliente.e2e@test.com');
    await page.getByPlaceholder('(11) 99999-9999').fill('11999999999');

    // Intercepta e simula erro 500
    await page.route('**/api/appointments', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: "Internal Server Error" }),
      });
    });

    await page.getByRole('dialog').getByRole('button', { name: 'Confirmar Agendamento' }).click();

    // Valida que a tela de erro ou toast de erro foi exibido (se tiver toast)
    // Supondo que o toast exibe a mensagem de erro da API
    await expect(page.getByText(/Erro/i)).toBeVisible();
    // A tela de sucesso NÃO deve estar visível
    await expect(page.getByText('Agendamento Confirmado!')).toBeHidden();
  });
});
