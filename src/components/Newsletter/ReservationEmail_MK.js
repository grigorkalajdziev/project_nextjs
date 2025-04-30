import React from 'react';
import { Body, Container, Head, Html, Img, Preview, Section, Text } from '@react-email/components';

const ReservationEmail_MK = ({ orderID, reservationDate, reservationTime, customerName }) => {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', padding: '20px' }}>
        <Preview>Вашата резервација е потврдена!</Preview>
        <Container style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
          <Img
            src="https://www.kikamakeupandbeautyacademy.com/assets/images/logo.png"
            width="150"
            height="50"
            alt="Лого на Кика Makeup и Beauty Academy"
            style={{ display: 'block', margin: '0 auto 20px' }}
          />
          <Text style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
            Потврда на резервацијата
          </Text>
          <Text style={{ fontSize: '16px', lineHeight: '24px', marginBottom: '20px' }}>
            Почитуван(а) {customerName},
            <br />
            Ви благодариме за вашата резервација. Еве ги деталите за вашата резервација:
          </Text>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>ID на нарачка:</Text>
            <Text>{orderID}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Датум на резервација:</Text>
            <Text>{reservationDate}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Време на резервација:</Text>
            <Text>{reservationTime}</Text>
          </Section>
          <Text style={{ fontSize: '14px', lineHeight: '24px', marginTop: '20px' }}>
            Со нетрпение очекуваме да ве услужиме. Доколку имате прашања или сакате да направите промени во резервацијата,
            ве молиме контактирајте не.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ReservationEmail_MK;
