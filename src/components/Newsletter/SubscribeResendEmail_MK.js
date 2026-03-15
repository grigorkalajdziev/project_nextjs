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

export const SubscribeResendEmail_MK = ({ email }) => (
  <Html>
    <Head />
    <Preview>Добредојдовте во Кика Makeup и Beauty Academy!</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Лого Секција */}
        <Section style={logoContainer}>
          <Img
            src="https://www.kikamakeupandbeautyacademy.com/assets/images/logo.png"
            width="170"
            height="50"
            alt="Kika Makeup Logo"
            style={logo}
          />
        </Section>

        {/* Hero Image */}
        <Section style={heroSection}>
          <Img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop" 
            alt="Kika Makeup Academy"
            style={heroImage}
          />
        </Section>

        {/* Main Content */}
        <Section style={contentSection}>
          <Text style={heading}>Добредојдовте во Кика Makeup и Beauty Academy!</Text>
          
          <Text style={paragraph}>
            Ви благодариме што се пријавивте во <strong>Кика Makeup и Beauty Academy</strong>. 
            Возбудени сме што ќе ви помогнеме да го истражите светот на професионалната шминка и убавина.
          </Text>
          
          <Text style={paragraph}>
            Како дел од нашата заедница, први ќе добивате известувања за нови курсеви, 
            ексклузивни туторијали и специјални понуди за нашите услуги во Охрид.
          </Text>

          {/* Секција за копче */}
          <Section style={btnContainer}>
            <Button style={button} href="https://www.kikamakeupandbeautyacademy.com/">
              Посети го веб-сајтот
            </Button>
          </Section>

          <Text style={signature}>
            Поздрав,<br />
            <strong>Тимот на Кика Makeup и Beauty Academy</strong>
          </Text>
        </Section>

        <Hr style={hr} />

        {/* Social Media */}
        <Section style={socialSection}>
          <Text style={socialHeading}>Следете нè на социјалните мрежи:</Text>
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
            2026 © Кика Makeup и Beauty Academy<br />
            ул. „Туристичка“, Охрид 6000, Македонија
          </Text>
          <Text style={unsubscribeText}>
            Доколку не сакате да примате повеќе пораки, 
            <Link
              href={`https://www.kikamakeupandbeautyacademy.com/unsubscribe?email=${encodeURIComponent(email)}`}
              style={unsubscribeLink}
            >
              одјавете се тука
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default SubscribeResendEmail_MK;

// --- СТИЛОВИ (Поправени за мобилен) ---
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
  padding: '40px 20px', // Намалено од страните за мобилен
  textAlign: 'center', // Ова е клучот за центриран текст
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