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

export const ReservationEmailInternal_MK = ({
  orderID,
  reservationDate,
  reservationTime,
  customerName,
  paymentMethod,
  total,    
  products, 
  customerEmail,
  customerPhone,  
  customerAddress,  
  customerState,  
  customerCity,  
  customerPostalCode, 
}) => {
  // Helper to format MKD values
  const formatMKD = (value) => `${parseFloat(value).toFixed(2)} ден.`;

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', padding: '20px' }}>
        <Preview>Нова резервација: Нарачка {orderID}</Preview>
        <Container style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
          <Img
            src="https://www.kikamakeupandbeautyacademy.com/assets/images/logo.png"
            width="150"
            height="50"
            alt="Kika Logo"
            style={{ display: 'block', margin: '0 auto 20px' }}
          />

          <Text style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
            Известување за нова резервација
          </Text>
          <Text style={{ fontSize: '16px', lineHeight: '24px', marginBottom: '20px' }}>
            Направена е нова резервација. Деталите се прикажани подолу:
          </Text>         
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>ИД на нарачка:</Text>
            <Text>{orderID}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Име на клиент:</Text>
            <Text>{customerName}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Е-пошта:</Text>
            <Text>{customerEmail}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Телефон:</Text>
            <Text>{customerPhone}</Text>  
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Адреса:</Text>
            <Text>{customerAddress}</Text> 
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Држава:</Text>
            <Text>{customerState}</Text> 
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Град:</Text>
            <Text>{customerCity}</Text> 
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Поштенски код:</Text>
            <Text>{customerPostalCode}</Text> 
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Датум на резервација:</Text>
            <Text>{reservationDate}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Време на резервација:</Text>
            <Text>{reservationTime}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Начин на плаќање:</Text>
            <Text>{paymentMethod}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Вкупно:</Text>
            <Text>{formatMKD(total)}</Text>
          </Section>

          {/* Services List */}
          <Text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '20px' }}>
            Услуги:
          </Text>
          <Section>
            {products.map((product, idx) => (
              <Text key={idx} style={{ fontSize: '14px' }}>
                – {product.name}: {product.quantity} × {formatMKD(product.price)} ={' '}
                {formatMKD(product.quantity * parseFloat(product.price))}
              </Text>
            ))}
          </Section>

          <Text style={{ fontSize: '14px', lineHeight: '24px', marginTop: '20px' }}>
            Ве молиме прегледајте ја резервацијата и подгответе се за клиентот. Ако имате прашања или треба промени, слободно контактирајте нѐ.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ReservationEmailInternal_MK;
