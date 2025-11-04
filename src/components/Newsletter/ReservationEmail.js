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

const ReservationEmail = ({
   orderID,
  reservationDate,
  reservationTime,
  customerName,
  paymaentText,
  products, 
  customerEmail,
  customerPhone,
  customerAddress,
  customerState,
  customerCity,
  customerPostalCode,
}) => {
  const formatEUR = (value) => `€ ${parseFloat(value).toFixed(2)}`;
  const total = products.reduce(
    (sum, product) => sum + product.quantity * parseFloat(product.price),
    0
  );
  const paragraph = { fontSize: '14px', marginTop: '24px' };
  const hr = { border: 'none', borderTop: '1px solid #eee', margin: '24px 0' };
  const footer = { fontSize: '12px', color: '#888', textAlign: 'center' };

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', padding: '20px' }}>
        <Preview>Your reservation is confirmed!</Preview>
        <Container style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
          <Img
            src="https://www.kikamakeupandbeautyacademy.com/assets/images/logo.png"
            width="150"
            height="50"
            alt="Kika Makeup and Beauty Academy Logo"
            style={{ display: 'block', margin: '0 auto 20px' }}
          />

          <Text style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
            Reservation Confirmation
          </Text>
          <Text style={{ fontSize: '16px', lineHeight: '24px', marginBottom: '20px' }}>
            Dear {customerName},
            <br />
            Thank you for your reservation. Here are your reservation details:
          </Text>

           <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
              Order ID:
            </Text>
            <Text>{orderID}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
              Customer Name:
            </Text>
            <Text>{customerName}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
              Customer Email:
            </Text>
            <Text>{customerEmail}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
              Phone Number:
            </Text>
            <Text>{customerPhone}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
              Address:
            </Text>
            <Text>{customerAddress}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
              Country:
            </Text>
            <Text>{customerState}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
              City:
            </Text>
            <Text>{customerCity}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
              ZIP Code:
            </Text>
            <Text>{customerPostalCode}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
              Reservation Date:
            </Text>
            <Text>{reservationDate}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
              Reservation Time:
            </Text>
            <Text>{reservationTime}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
              Payment Method:
            </Text>
            <Text>{paymaentText}</Text>
          </Section>
          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
              Total:
            </Text>
            <Text>{formatEUR(total)}</Text>
          </Section>

          {/* Services List */}
          <Text
            style={{ fontSize: "16px", fontWeight: "bold", marginTop: "20px" }}
          >
            Services:
          </Text>
          <Section>
            {products.map((product, idx) => (
              <Text key={idx} style={{ fontSize: "14px" }}>
                – {product.name}: {product.quantity} ×{" "}
                {formatEUR(product.price)} ={" "}
                {formatEUR(product.quantity * parseFloat(product.price))}
              </Text>
            ))}
          </Section>

          <Text style={{ fontSize: '14px', lineHeight: '24px', marginTop: '20px' }}>
            We look forward to serving you. If you have any questions or need to make changes to your reservation, please contact us.
          </Text>
          <Text style={paragraph}>
            Best regards,<br />
            The Kika Makeup and Beauty Academy Team
          </Text>
          <hr style={hr} />
          <Text style={footer}>
            2025 © Kika Makeup and Beauty Academy, Ohrid 6000, Macedonia
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ReservationEmail;
