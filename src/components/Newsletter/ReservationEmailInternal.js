import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const ReservationEmailInternal = ({
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
  // Helper to format EUR values
  const formatEUR = (value) => `€ ${parseFloat(value).toFixed(2)}`;  

  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f4f4f4",
          padding: "20px",
        }}
      >
        <Preview>New Reservation: Order {orderID}</Preview>
        <Container
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <Img
            src="https://www.kikamakeupandbeautyacademy.com/assets/images/logo.png"
            width="150"
            height="50"
            alt="Company Logo"
            style={{ display: "block", margin: "0 auto 20px" }}
          />

          <Text
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            New Reservation Notification
          </Text>
          <Text
            style={{
              fontSize: "16px",
              lineHeight: "24px",
              marginBottom: "20px",
            }}
          >
            A new reservation has been placed. Here are the details:
          </Text>

          {/* Order Meta */}
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
            <Text>{paymentMethod}</Text>
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

          <Text
            style={{ fontSize: "14px", lineHeight: "24px", marginTop: "20px" }}
          >
            Please review the reservation and prepare for the customer. If you
            have any questions or need adjustments, feel free to reach out.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ReservationEmailInternal;
