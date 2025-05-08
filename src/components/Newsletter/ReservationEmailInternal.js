import React from 'react';
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

export const ReservationEmailInternal = ({
  orderID,
  reservationDate,
  reservationTime,
  customerName,
  paymentMethod, 
  products, // array with price in EUR
  customerEmail,
}) => {
  // Helper to format EUR values
  const formatEUR = (value) => `€ ${parseFloat(value).toFixed(2)}`;
  const total = products.reduce(
    (sum, product) => sum + product.quantity * parseFloat(product.price),
    0
  );
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', padding: '20px' }}>
        <Preview>New Reservation: Order {orderID}</Preview>
        <Container style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
          <Img
            src="https://www.kikamakeupandbeautyacademy.com/assets/images/logo.png"
            width="150"
            height="50"
            alt="Company Logo"
            style={{ display: 'block', margin: '0 auto 20px' }}
          />

          <Text style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
            New Reservation Notification
          </Text>
          <Text style={{ fontSize: '16px', lineHeight: '24px', marginBottom: '20px' }}>
            A new reservation has been placed. Here are the details:
          </Text>

          {/* Order Meta */}
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Order ID:</Text>
            <Text>{orderID}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Customer Name:</Text>
            <Text>{customerName}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Customer Email:</Text>
            <Text>{customerEmail}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Reservation Date:</Text>
            <Text>{reservationDate}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Reservation Time:</Text>
            <Text>{reservationTime}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Payment Method:</Text>
            <Text>{paymentMethod}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Total:</Text>
            <Text>{formatEUR(total)}</Text>
          </Section>

          {/* Services List */}
          <Text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '20px' }}>
            Services:
          </Text>
          <Section>
            {products.map((product, idx) => (
              <Text key={idx} style={{ fontSize: '14px' }}>
                – {product.name}: {product.quantity} × {formatEUR(product.price)} ={' '}
                {formatEUR(product.quantity * parseFloat(product.price))}
              </Text>
            ))}
          </Section>

          <Text style={{ fontSize: '14px', lineHeight: '24px', marginTop: '20px' }}>
            Please review the order and prepare for the customer's reservation. If you have any questions or need adjustments, feel free to reach out.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ReservationEmailInternal;
