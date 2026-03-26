import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Section,
  Code,
  Preview,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Your verification code is {otp}</Preview>

      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Verify Your Account</Heading>

          <Text style={text}>Hi {username},</Text>

          <Text style={text}>
            Thank you for signing up. Please use the following verification code
            to complete your registration:
          </Text>

          <Section style={codeContainer}>
            <Code style={code}>{otp}</Code>
          </Section>

          <Text style={text}>
            This code will expire in 10 minutes. If you didn’t request this, you
            can safely ignore this email.
          </Text>

          <Text style={footer}>— Your App Team</Text>
        </Container>
      </Body>
    </Html>
  );
}

// ✅ Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Arial, sans-serif",
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "8px",
  maxWidth: "500px",
  margin: "0 auto",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const text = {
  fontSize: "14px",
  color: "#333",
  lineHeight: "1.5",
  marginBottom: "15px",
};

const codeContainer = {
  textAlign: "center" as const,
  margin: "20px 0",
};

const code = {
  display: "inline-block",
  padding: "12px 20px",
  fontSize: "20px",
  letterSpacing: "4px",
  backgroundColor: "#f4f4f4",
  borderRadius: "6px",
  fontWeight: "bold",
};

const footer = {
  fontSize: "12px",
  color: "#888",
  marginTop: "20px",
};