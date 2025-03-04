import React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

const GoogleLoginSuccessEmail = ({ userName }) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>
          Welcome back to Kika Makeup and Beauty Academy via Google!
        </Preview>
        <Container style={container}>
          <Img
            src="https://www.kikamakeupandbeautyacademy.com/assets/images/logo.png"
            width="170"
            height="50"
            alt="Kika Makeup and Beauty Academy"
            style={logo}
          />
          <Text style={heading}>Welcome, {userName}!</Text>
          <Text style={paragraph}>
            Thank you for signing in with Google! We're excited to have you back at Kika Makeup and Beauty Academy.
            Explore our latest tutorials, beauty tips, and exclusive offers.
          </Text>
          <Section style={btnContainer}>
            <Button
              style={button}
              href="https://www.kikamakeupandbeautyacademy.com/"
            >
              Go to Your Account
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            2025 © Kika Makeup and Beauty Academy, Ohrid 6000, Macedonia
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default GoogleLoginSuccessEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const logo = {
  margin: '0 auto',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: '20px 0',
  color: '#333333',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '20px',
  color: '#555555',
};

const btnContainer = {
  textAlign: 'center',
};

const button = {
  backgroundColor: '#fa7268',
  borderRadius: '4px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '12px 24px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const hr = {
  borderColor: '#eaeaea',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  textAlign: 'center',
};
