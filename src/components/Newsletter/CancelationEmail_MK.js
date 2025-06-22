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

const CancelationEmail_MK = ({
  customerName,
  customerEmail,
  customerPhone,
}) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', padding: '20px' }}>
      <Preview>Вашата резервација е откажана</Preview>
      <Container style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
        <Img
          src="https://www.kikamakeupandbeautyacademy.com/assets/images/logo.png"
          width="150"
          height="50"
          alt="Лого на Кика Makeup и Beauty Academy"
          style={{ display: 'block', margin: '0 auto 20px' }}
        />

        <Text style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
          Откажана резервација
        </Text>
        <Text style={{ fontSize: '16px', lineHeight: '24px', marginBottom: '20px' }}>
          Почитуван(а){customerName ? ` ${customerName}` : ''},
          <br />
          Вашата резервација е откажана бидејќи терминот е зафатен за друг корисник.<br />
          Ве молиме изберете друг термин.<br />
          Доколку имате прашања, слободно контактирајте не.<br /><br />
          Ви благодариме на разбирањето!
        </Text>

        <Section>
          <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Е-пошта:</Text>
          <Text>{customerEmail}</Text>
        </Section>
        <Section>
          <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Телефон:</Text>
          <Text>{customerPhone}</Text>
        </Section>

        <Text style={{ fontSize: '14px', lineHeight: '24px', marginTop: '20px' }}>
          <b>Makeup by Kika</b><br />
          <a href="mailto:makeupbykika@hotmail.com">makeupbykika@hotmail.com</a>
        </Text>
        <Text style={{ fontSize: '12px', color: '#888', textAlign: 'center', marginTop: '16px' }}>
          2025 © Kika Makeup и Beauty Academy, Охрид 6000, Македонија
        </Text>
      </Container>
    </Body>
  </Html>
);

export default CancelationEmail_MK;