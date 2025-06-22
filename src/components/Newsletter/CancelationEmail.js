import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

const CancelationEmail = ({
  customerName,
  customerEmail,
  customerPhone,
}) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', padding: '20px' }}>
      <Preview>Your reservation has been canceled</Preview>
      <Container style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
        <Img
          src="https://www.kikamakeupandbeautyacademy.com/assets/images/logo.png"
          width="150"
          height="50"
          alt="Kika Makeup and Beauty Academy Logo"
          style={{ display: 'block', margin: '0 auto 20px' }}
        />

        <Text style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
          Reservation Canceled
        </Text>
        <Text style={{ fontSize: '16px', lineHeight: '24px', marginBottom: '20px' }}>
          Dear{customerName ? ` ${customerName}` : ''},
          <br />
          Your reservation has been canceled because the time slot was taken by another customer.<br />
          Please choose another time slot.<br />
          If you have any questions, feel free to contact us.<br /><br />
          Thank you for your understanding!
        </Text>

        <Section>
          <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Email:</Text>
          <Text>{customerEmail}</Text>
        </Section>
        <Section>
          <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Phone:</Text>
          <Text>{customerPhone}</Text>
        </Section>

        <Text style={{ fontSize: '14px', lineHeight: '24px', marginTop: '20px' }}>
          <b>Makeup by Kika</b><br />
          <a href="mailto:makeupbykika@hotmail.com" style={{ color: '#fa7268', textDecoration: 'none' }}>makeupbykika@hotmail.com</a>
        </Text>
        <Text style={{ fontSize: '12px', color: '#888', textAlign: 'center', marginTop: '16px' }}>
          2025 © Kika Makeup and Beauty Academy, Ohrid 6000, Macedonia
        </Text>

      </Container>
    </Body>
  </Html>
);

export default CancelationEmail;