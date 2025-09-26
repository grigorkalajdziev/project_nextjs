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

export const ReservationEmailInternal = ({
  orderID,
  reservationDate,
  reservationTime,
  customerName,
  paymentMethod,
  products, 
  customerEmail,
  customerPhone,
  customerAddress,
  customerState,
  customerCity,
  customerPostalCode,
  language = "en", // Default language
}) => {
  // Helper to format currency based on language
  const formatCurrency = (value) => {
    const num = parseFloat(value) || 0;
    return language === "mk"
      ? `${num.toFixed(2)} МКД`
      : `€ ${num.toFixed(2)}`;
  };

  // Calculate total from products
  const total = products.reduce((sum, product) => {
    const priceValue =
      typeof product.price === "object"
        ? product.price[language] ?? Object.values(product.price)[0]
        : product.price;
    return sum + product.quantity * parseFloat(priceValue || 0);
  }, 0);

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
        <Preview>
          {language === "mk"
            ? `Нова резервација: Нарачка ${orderID}`
            : `New Reservation: Order ${orderID}`}
        </Preview>

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
            {language === "mk"
              ? "Известување за резервација"
              : "New Reservation Notification"}
          </Text>

          <Text
            style={{
              fontSize: "16px",
              lineHeight: "24px",
              marginBottom: "20px",
            }}
          >
            {language === "mk"
              ? "Нова резервација е направена. Детали за резервацијата:"
              : "A new reservation has been placed. Here are the details:"}
          </Text>

          {/* Order Details */}
          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>Order ID:</Text>
            <Text>{orderID}</Text>
          </Section>

          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>Customer Name:</Text>
            <Text>{customerName}</Text>
          </Section>

          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>Customer Email:</Text>
            <Text>{customerEmail}</Text>
          </Section>

          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>Phone Number:</Text>
            <Text>{customerPhone}</Text>
          </Section>

          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>Address:</Text>
            <Text>
              {customerAddress}, {customerCity} {customerPostalCode}, {customerState}
            </Text>
          </Section>

          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>Reservation Date:</Text>
            <Text>{reservationDate}</Text>
          </Section>

          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>Reservation Time:</Text>
            <Text>{reservationTime}</Text>
          </Section>

          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>Payment Method:</Text>
            <Text>{paymentMethod}</Text>
          </Section>

          <Section>
            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>Total:</Text>
            <Text>{formatCurrency(total)}</Text>
          </Section>

          {/* Services */}
          <Text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "20px" }}>
            {language === "mk" ? "Услуги:" : "Services:"}
          </Text>
          <Section>
            {products.map((product, idx) => {
              const priceValue =
                typeof product.price === "object"
                  ? product.name[language] || product.name.en
                  : product.price;

              const nameValue =
                typeof product.name === "object"
                  ? product.price[language] || product.price.en
                  : product.name;

              return (
                <Text key={idx} style={{ fontSize: "14px" }}>
                  – {nameValue}: {product.quantity} × {formatCurrency(priceValue)} ={" "}
                  {formatCurrency(product.quantity * parseFloat(priceValue || 0))}
                </Text>
              );
            })}
          </Section>

          <Text style={{ fontSize: "14px", lineHeight: "24px", marginTop: "20px" }}>
            {language === "mk"
              ? "Ве молиме прегледајте ја резервацијата и подгответе се за клиентот."
              : "Please review the reservation and prepare for the customer."}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ReservationEmailInternal;
