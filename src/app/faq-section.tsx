import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const faqs = [
  {
    question: "O que é o Agendify?",
    answer:
      "O Agendify é uma plataforma de agendamento inteligente, feita para conectar prestadores de serviço e clientes com rapidez e organização.",
  },
  {
    question: "Preciso pagar para usar?",
    answer:
      "Não! O Agendify oferece uma versão gratuita para clientes e uma versão gratuita com funcionalidades básicas para prestadores.",
  },
  {
    question: "Sou prestador. Posso configurar meus horários?",
    answer:
      "Sim. Você poderá definir sua disponibilidade, dias da semana e horários diretamente no painel do prestador.",
  },
  {
    question: "Clientes precisam criar conta para agendar?",
    answer:
      "Não! O processo foi simplificado. Os clientes podem realizar agendamentos fornecendo apenas informações básicas de contato (Nome, Telefone e E-mail), sem a necessidade de criar uma conta na plataforma.",
  },
  {
    question: "Como funciona a integração com o Google Agenda do prestador?",
    answer:
      "O Agendify conecta-se de forma segura à conta Google do prestador de serviços. Isso permite checar a sua disponibilidade em tempo real para evitar conflitos de horários e adicionar automaticamente novos agendamentos à agenda do prestador.",
  },
];

export function FAQSection() {
  return (
    <section className="px-6 py-16">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-semibold mb-2">Perguntas Frequentes</h3>
        <p className="text-muted-foreground text-lg">
          Dúvidas sobre como o Agendify funciona? A gente responde.
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full flex flex-col gap-4 max-w-3xl mx-auto"
      >
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
