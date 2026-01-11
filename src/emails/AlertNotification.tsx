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

interface AlertNotificationProps {
  reportType: string;
  city: string;
  state: string;
  address?: string;
  description: string;
  timestamp: string;
  viewUrl: string;
  unsubscribeUrl: string;
}

export default function AlertNotification({
  reportType,
  city,
  state,
  address,
  description,
  timestamp,
  viewUrl,
  unsubscribeUrl,
}: AlertNotificationProps) {
  const typeColors: Record<string, string> = {
    RAID: '#ff4444',
    CHECKPOINT: '#ffaa00',
    PATROL: '#00ff88',
    DETENTION: '#ff4444',
    SURVEILLANCE: '#00ff88',
  };

  const typeColor = typeColors[reportType] || '#00ff88';

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>ICE RADAR</Text>
            <Text style={subtitle}>COMMUNITY ALERT</Text>
          </Section>

          <Section style={alertBanner}>
            <Text style={{ ...alertType, color: typeColor }}>
              {reportType} REPORTED
            </Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>New Activity in {state}</Text>

            <Section style={detailsBox}>
              <Text style={label}>LOCATION</Text>
              <Text style={value}>
                {city}, {state}
                {address && ` - ${address}`}
              </Text>

              <Text style={label}>TIME REPORTED</Text>
              <Text style={value}>{timestamp}</Text>

              <Text style={label}>DESCRIPTION</Text>
              <Text style={value}>{description}</Text>
            </Section>

            <Button style={button} href={viewUrl}>
              VIEW ON MAP
            </Button>

            <Text style={disclaimer}>
              This information is community-sourced and should be verified
              independently. This is not legal advice.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              You received this alert because you subscribed to ICE Radar
              notifications for {state}.
            </Text>
            <Text style={footerText}>
              <Link href={unsubscribeUrl} style={link}>
                Unsubscribe from alerts
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
  color: '#ff4444',
  fontSize: '12px',
  margin: '4px 0 0 0',
  letterSpacing: '1px',
  fontWeight: 'bold',
};

const alertBanner = {
  backgroundColor: '#1a0a0a',
  padding: '16px 24px',
  borderBottom: '1px solid #3a1a1a',
};

const alertType = {
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
  letterSpacing: '2px',
};

const content = {
  padding: '24px',
};

const heading = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 24px 0',
};

const detailsBox = {
  backgroundColor: '#0d1a14',
  border: '1px solid #1a3a2a',
  padding: '16px',
  marginBottom: '24px',
};

const label = {
  color: '#4a9a6a',
  fontSize: '10px',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
  letterSpacing: '1px',
};

const value = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0 0 16px 0',
  lineHeight: '20px',
};

const button = {
  backgroundColor: '#00ff88',
  color: '#0a0a0a',
  padding: '12px 24px',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '0 0 24px 0',
  letterSpacing: '1px',
};

const disclaimer = {
  color: '#606060',
  fontSize: '11px',
  lineHeight: '16px',
  margin: '0',
  padding: '12px',
  backgroundColor: '#0d0d0d',
  border: '1px solid #2a2a2a',
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
