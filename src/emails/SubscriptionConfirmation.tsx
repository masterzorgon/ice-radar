import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Link,
} from '@react-email/components';

interface SubscriptionConfirmationProps {
  verifyUrl: string;
  states: string[];
}

export default function SubscriptionConfirmation({
  verifyUrl,
  states,
}: SubscriptionConfirmationProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>ICE RADAR</Text>
            <Text style={subtitle}>COMMUNITY ALERT SYSTEM</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>Verify Your Email</Text>
            <Text style={paragraph}>
              Thank you for subscribing to ICE Radar alerts. You will receive
              notifications when new sightings are reported in:
            </Text>
            <Text style={statesList}>
              {states.join(', ')}
            </Text>
            <Text style={paragraph}>
              Please click the button below to verify your email address and
              activate your subscription.
            </Text>

            <Button style={button} href={verifyUrl}>
              VERIFY EMAIL
            </Button>

            <Text style={smallText}>
              If you didn&apos;t request this subscription, you can safely ignore
              this email.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              This is an automated message from ICE Radar.
            </Text>
            <Text style={footerText}>
              <Link href={verifyUrl} style={link}>
                Click here if the button doesn&apos;t work
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#0a0a0a',
  fontFamily: 'monospace',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const header = {
  padding: '24px',
  borderBottom: '1px solid #1a3a2a',
};

const logo = {
  color: '#00ff88',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  letterSpacing: '2px',
};

const subtitle = {
  color: '#4a9a6a',
  fontSize: '12px',
  margin: '4px 0 0 0',
  letterSpacing: '1px',
};

const content = {
  padding: '24px',
};

const heading = {
  color: '#00ff88',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const paragraph = {
  color: '#a0a0a0',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
};

const statesList = {
  color: '#00ff88',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 24px 0',
  padding: '12px',
  backgroundColor: '#0d1a14',
  border: '1px solid #1a3a2a',
};

const button = {
  backgroundColor: '#00ff88',
  color: '#0a0a0a',
  padding: '12px 24px',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '16px 0',
  letterSpacing: '1px',
};

const smallText = {
  color: '#606060',
  fontSize: '12px',
  margin: '24px 0 0 0',
};

const hr = {
  borderColor: '#1a3a2a',
  margin: '24px 0',
};

const footer = {
  padding: '0 24px',
};

const footerText = {
  color: '#606060',
  fontSize: '12px',
  margin: '4px 0',
};

const link = {
  color: '#4a9a6a',
  textDecoration: 'underline',
};
