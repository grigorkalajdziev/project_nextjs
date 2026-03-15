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
  Link,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

export const SubscribeResendEmail = ({ email }) => (
  <Html>
    <Head />
    <Preview>Welcome to Kika Makeup and Beauty Academy!</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Logo Section */}
        <Section style={logoContainer}>
          <Img
            src="https://www.kikamakeupandbeautyacademy.com/assets/images/logo.png"
            width="170"
            height="50"
            alt="Kika Makeup Logo"
            style={logo}
          />
        </Section>

        {/* Hero Image - Same as screenshot */}
        <Section style={heroSection}>
          <Img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop" 
            alt="Kika Makeup Products"
            style={heroImage}
          />
        </Section>

        {/* Main Content */}
        <Section style={contentSection}>
          <Text style={heading}>Welcome to Kika Makeup and Beauty Academy!</Text>
          
          <Text style={paragraph}>
            Thank you for joining <strong>Kika Makeup and Beauty Academy</strong>. 
            We are excited to help you explore the professional world of makeup and beauty.
          </Text>
          
          <Text style={paragraph}>
            As a part of our community, you will be the first to receive updates on new courses, 
            exclusive tutorials, and special offers for our services in Ohrid.
          </Text>

          {/* Button Section */}
          <Section style={btnContainer}>
            <Button style={button} href="https://www.kikamakeupandbeautyacademy.com/">
              Visit Website
            </Button>
          </Section>

          <Text style={signature}>
            Best regards,<br />
            <strong>The Kika Makeup and Beauty Academy Team</strong>
          </Text>
        </Section>

        <Hr style={hr} />

        {/* Social Media */}
        <Section style={socialSection}>
          <Text style={socialHeading}>Follow us on social media:</Text>
          <Row style={socialRow}>
            <Column align="right" style={{ paddingRight: '10px' }}>
              <Link href="https://www.instagram.com/kikamakeupandbeautyacademy/">
                <Img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" width="30" height="30" alt="Instagram" />
              </Link>
            </Column>
            <Column align="left" style={{ paddingLeft: '10px' }}>
              <Link href="https://www.facebook.com/kikamakeupandbeautyacademy/">
                <Img src="https://cdn-icons-png.flaticon.com/512/174/174848.png" width="30" height="30" alt="Facebook" />
              </Link>
            </Column>
          </Row>
        </Section>

        {/* Footer */} 
        <Section style={footer}>
          <Text style={footerNote}>
            2026 © Kika Makeup and Beauty Academy<br />
            Turistichka Blvd, Ohrid 6000, Macedonia
          </Text>
          <Text style={{ ...footerNote, marginTop: '10px' }}>
            <Link 
              href={`https://www.kikamakeupandbeautyacademy.com/unsubscribe?email=${encodeURIComponent(email)}`}
              style={{ color: '#fa7268', textDecoration: 'underline' }}
            >
              Unsubscribe
            </Link> from this newsletter
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default SubscribeResendEmail;

// --- STYLES (Same as MK version for perfect centering) ---
const main = {
  backgroundColor: '#f4f4f4',
  fontFamily: 'Helvetica, Arial, sans-serif',
  margin: '0',
  padding: '0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  width: '100%',
  maxWidth: '600px',
};

const logoContainer = {
  padding: '40px 20px 30px 20px',
  textAlign: 'center',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const heroSection = {
  width: '100%',
};

const heroImage = {
  width: '100%',
  height: 'auto',
  display: 'block',
};

const contentSection = {
  padding: '40px 20px',
  textAlign: 'center',
};

const heading = {
  fontSize: '22px',
  lineHeight: '30px',
  fontWeight: 'bold',
  color: '#333333',
  margin: '0 0 20px',
  textAlign: 'center',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
  margin: '0 0 20px',
  textAlign: 'center',
};

const btnContainer = {
  textAlign: 'center',
  margin: '30px auto',
};

const button = {
  backgroundColor: '#fa7268',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '16px 32px',
};

const signature = {
  fontSize: '16px',
  color: '#333333',
  textAlign: 'center',
  marginTop: '20px',
};

const hr = {
  borderColor: '#eeeeee',
  margin: '0 20px',
};

const socialSection = {
  padding: '30px 0',
  textAlign: 'center',
};

const socialHeading = {
  fontSize: '14px',
  color: '#888888',
  marginBottom: '15px',
};

const socialRow = {
  width: '100px',
  margin: '0 auto',
};

const footer = {
  backgroundColor: '#fafafa',
  padding: '30px 20px',
  textAlign: 'center',
};

const footerNote = {
  fontSize: '12px',
  color: '#aaaaaa',
  lineHeight: '18px',
  textAlign: 'center',
  margin: '0',
};

const unsubscribeText = {
  fontSize: '11px',
  color: '#aaaaaa',
  textAlign: 'center',
  marginTop: '15px',
};

const unsubscribeLink = {
  color: '#888888',
  textDecoration: 'underline',
};