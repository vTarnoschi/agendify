import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface BookingConfirmationProps {
  clientName?: string | null;
  providerName: string;
  serviceTitle: string;
  date: string;
  time: string;
  brandColor?: string | null;
}

export default function BookingConfirmationEmail({
  clientName,
  providerName,
  serviceTitle,
  date,
  time,
  brandColor,
}: BookingConfirmationProps) {
  const previewText = `Agendamento confirmado com ${providerName}`;
  const color = brandColor || "#0f172a";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={{ ...header, backgroundColor: color }}>
            <Heading style={headerTitle}>Agendify</Heading>
          </Section>

          <Section style={content}>
            <Heading style={title}>Agendamento Confirmado! 🎉</Heading>

            <Text style={text}>Olá {clientName || "Visitante"},</Text>

            <Text style={text}>
              Seu agendamento para <strong>{serviceTitle}</strong> com{" "}
              <strong>{providerName}</strong> foi confirmado com sucesso.
            </Text>

            <Section style={detailsContainer}>
              <Text style={detailText}>📅 Data: {date}</Text>
              <Text style={detailText}>⏰ Horário: {time}</Text>
            </Section>

            <Text style={text}>
              Por favor, tente chegar com 5 minutos de antecedência. Em caso de
              imprevistos, entre em contato diretamente com o profissional.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Enviado via Agendify — A plataforma inteligente de agendamentos.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Estilos básicos Inline (React Email exige CSS-in-JS padrão)
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  overflow: "hidden",
  maxWidth: "600px",
};

const header = {
  padding: "32px",
  textAlign: "center" as const,
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
};

const content = {
  padding: "32px 40px",
};

const title = {
  fontSize: "20px",
  color: "#333",
  marginBottom: "24px",
};

const text = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#444",
  marginBottom: "16px",
};

const detailsContainer = {
  backgroundColor: "#f8fafc",
  padding: "20px",
  borderRadius: "6px",
  marginBottom: "24px",
  borderLeft: "4px solid #0ea5e9",
};

const detailText = {
  fontSize: "16px",
  margin: "8px 0",
  color: "#333",
  fontWeight: "600",
};

const footer = {
  backgroundColor: "#f8fafc",
  padding: "24px",
  textAlign: "center" as const,
  borderTop: "1px solid #e2e8f0",
};

const footerText = {
  fontSize: "12px",
  color: "#888",
  margin: "0",
};
