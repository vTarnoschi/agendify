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
    question: "Clientes precisam criar conta?",
    answer:
      "Sim. O cadastro é rápido e necessário para que os clientes possam visualizar agendamentos, receber lembretes e gerenciar suas reservas.",
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
        className="w-full space-y-4 max-w-3xl m-auto"
      >
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Accordion>
    </section>
  );
}
