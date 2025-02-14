// components/NewsletterEmail.js
import { Html, Head, Preview, Body, Container, Section, Text, Link } from '@react-email/components';

export const NewsletterEmail = () => (
  <Html>
    <Head />
    <Preview>Welcome to Kika Makeup and Beauty Academy Newsletter</Preview>
    <Body style={{ backgroundColor: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
      <Container style={{ backgroundColor: '#ffffff', margin: '0 auto', padding: '20px', maxWidth: '600px' }}>
        {/* Header */}
        <Section style={{ textAlign: 'center' }}>
          <img src="https://www.kikamakeupandbeautyacademy.com/assets/images/logo.png" alt="Kika Makeup and Beauty Academy Logo" width="150" />
        </Section>
        {/* Main Content */}
        <Section style={{ textAlign: 'center', padding: '20px 0' }}>
          <Text style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>
            Empower Your Beauty Journey
          </Text>
          <Text style={{ fontSize: '16px', color: '#6b7280', margin: '16px 0' }}>
            Discover expert-led courses designed to elevate your makeup artistry.
          </Text>
          <Link 
            href="https://www.kikamakeupandbeautyacademy.com/" 
            style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', display: 'inline-block' }}
          >
            Join Now
          </Link>
        </Section>
        {/* Footer */}
        <Section style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', padding: '10px 0' }}>
          &copy; 2025 Kika Makeup and Beauty Academy. All rights reserved.
        </Section>
      </Container>
    </Body>
  </Html>
);
