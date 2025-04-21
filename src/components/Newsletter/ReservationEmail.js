import React from 'react';
import { Body, Container, Head, Html, Img, Preview, Section, Text } from '@react-email/components';

const ReservationEmail = ({ orderID, reservationDate, reservationTime, customerName }) => {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', padding: '20px' }}>
        <Preview>Your reservation is confirmed!</Preview>
        <Container style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
          <Img src="https://www.kikamakeupandbeautyacademy.com/assets/images/logo.png" width="150" height="50" alt="Your Company Logo" style={{ display: 'block', margin: '0 auto 20px' }} />
          <Text style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>Reservation Confirmation</Text>
          <Text style={{ fontSize: '16px', lineHeight: '24px', marginBottom: '20px' }}>
            Dear {customerName},
            <br />
            Thank you for your reservation. Here are your reservation details:
          </Text>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Order ID:</Text>
            <Text>{orderID}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Reservation Date:</Text>
            <Text>{reservationDate}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Reservation Time:</Text>
            <Text>{reservationTime}</Text>
          </Section>
          <Text style={{ fontSize: '14px', lineHeight: '24px', marginTop: '20px' }}>
            We look forward to serving you. If you have any questions or need to make changes to your reservation, please contact us.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ReservationEmail;
