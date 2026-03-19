import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Button,
  Row,
  Column,
} from "@react-email/components";

const ReservationEmail = ({
  orderID,
  reservationDate,
  reservationTime,
  customerName,
  paymentText,
  total,
  discount = 0,
  couponCode = null,
  products = [],
  customerEmail,
  customerPhone,
  customerAddress,
  customerState,
  customerCity,
  customerPostalCode,
}) => {
  const BRAND = "#c1558b";
  const BRAND_LIGHT = "#f7e4ed";
  const BG = "#faf7f9";
  const CARD = "#ffffff";
  const MUTED = "#777";

  const formatEUR = (value) => {
    const v = typeof value === "number" ? value : parseFloat(value || 0);
    return `€ ${v.toFixed(2)}`;
  };

  const subtotal = products.reduce(
    (s, p) => s + parseFloat(p.price || 0) * (p.quantity || 1),
    0,
  );
  const discountAmount = Number(discount || 0);
  const totalAfterDiscount = Math.max(0, subtotal - discountAmount);

  const containerStyle = {
    backgroundColor: BG,
    padding: "32px 16px",
    fontFamily: "'Noto Sans', Arial, Helvetica, sans-serif",
    color: "#222",
  };

  const cardStyle = {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 26,
    maxWidth: 640,
    margin: "0 auto",
    boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
  };

  const headerGradient = {
    background: `linear-gradient(135deg, ${BRAND_LIGHT}, #ffffff)`,
    borderRadius: "10px",
    padding: "18px 20px",
    marginBottom: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const logoStyle = { display: "block", maxWidth: 160 };
  const titleStyle = {
    fontSize: 22,
    fontWeight: 700,
    color: BRAND,
    margin: "12px 0 4px",
    textAlign: "center",
  };
  const smallMuted = { fontSize: 13, color: MUTED, marginTop: 4 };
  const sectionTitle = {
    fontSize: 15,
    fontWeight: 700,
    color: BRAND,
    margin: "20px 0 10px",
    borderBottom: `1px solid ${BRAND_LIGHT}`,
    paddingBottom: 6,
  };
  const infoRow = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
    fontSize: 14,
  };
  const productRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px dashed #eee",
    fontSize: 14,
  };
  const productName = { maxWidth: "60%", fontSize: 14 };
  const productQty = { width: 50, textAlign: "center", color: MUTED };
  const productPrice = { textAlign: "right", minWidth: 90 };
  const totalRow = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
    fontSize: 15,
  };
  const grandTotal = { fontSize: 18, fontWeight: 700, color: BRAND };

  return (
    <Html>
      <Head />
      <Preview>
        💄 Reservation Confirmation #{orderID} — Kika Makeup & Beauty Academy
      </Preview>
      <Body style={containerStyle}>
        <Container style={cardStyle}>
          {/* Header */}
          <div style={headerGradient}>
            <Img
              src="https://www.kikamakeupandbeautyacademy.com/assets/images/logo.png"
              alt="Kika Makeup & Beauty Academy"
              width="160"
              height="48"
              style={logoStyle}
            />
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: MUTED }}>Reservation</div>
              <div style={{ fontWeight: 700, color: BRAND }}>#{orderID}</div>
            </div>
          </div>

          {/* Greeting */}
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <h1 style={titleStyle}>Your Reservation is Confirmed</h1>
            <div style={smallMuted}>
              Dear <strong>{customerName}</strong>, your reservation has been
              successfully confirmed!
            </div>
          </div>

          {/* Reservation summary */}
          <Section>
            <div style={sectionTitle}>💅 Reservation Details</div>
            <div style={infoRow}>
              <div style={{ color: MUTED }}>Date:</div>
              <div>{reservationDate}</div>
            </div>
            <div style={infoRow}>
              <div style={{ color: MUTED }}>Time:</div>
              <div>{reservationTime}</div>
            </div>
            <div style={infoRow}>
              <div style={{ color: MUTED }}>Payment Method:</div>
              <div>{paymentText}</div>
            </div>
          </Section>

          {/* Contact info */}
          <Section style={{ marginTop: 10 }}>
            <div style={sectionTitle}>📞 Contact Information</div>
            <div style={infoRow}>
              <div style={{ color: MUTED }}>Name:</div>
              <div>{customerName}</div>
            </div>
            <div style={infoRow}>
              <div style={{ color: MUTED }}>Email:</div>
              <div>{customerEmail}</div>
            </div>
            <div style={infoRow}>
              <div style={{ color: MUTED }}>Phone:</div>
              <div>{customerPhone}</div>
            </div>
            {(customerAddress || customerCity || customerState) && (
              <div style={infoRow}>
                <div style={{ color: MUTED }}>Address:</div>
                <div>
                  {customerAddress}
                  {customerCity && `, ${customerCity}`}
                  {customerPostalCode && `, (${customerPostalCode})`}
                  {customerState && ` ${customerState}`}
                </div>
              </div>
            )}
          </Section>

          {/* Products */}
          <Section style={{ marginTop: 18 }}>
            <div style={sectionTitle}>💖 Selected Services</div>
            {products.length === 0 && (
              <div style={{ color: MUTED }}>No services added.</div>
            )}
            {products.map((p, i) => (
              <div key={p.id || i} style={productRow}>
                <div style={productName}>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  {p.variant && (
                    <div style={{ color: MUTED, fontSize: 12 }}>
                      {p.variant}
                    </div>
                  )}
                </div>
                <div style={productQty}>x {p.quantity || 1}</div>
                <div style={productPrice}>{formatEUR(p.price)}</div>
              </div>
            ))}
          </Section>

          {/* Totals */}
          <Section>
            <div style={totalRow}>
              <div style={{ color: MUTED }}>Subtotal:</div>
              <div>{formatEUR(subtotal)}</div>
            </div>
            {discountAmount > 0 && (
              <div style={totalRow}>
                <div style={{ color: MUTED }}>
                  Discount {couponCode ? `(${couponCode})` : ""}
                </div>
                <div>-{formatEUR(discountAmount)}</div>
              </div>
            )}
            <div style={{ ...totalRow, marginTop: 12 }}>
              <div style={grandTotal}>Total:</div>
              <div style={grandTotal}>{formatEUR(totalAfterDiscount)}</div>
            </div>
          </Section>

          {/* CTA */}
          <Section style={{ textAlign: "center", marginTop: 24 }}>
            <Button
              pX={24}
              pY={16}
              style={{
                backgroundColor: BRAND,
                color: "#fff",
                borderRadius: 5,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 15,
                boxShadow: "0 3px 6px rgba(193,85,139,0.3)",
              }}
              href={`https://www.kikamakeupandbeautyacademy.com/my-account/orders/${orderID}`}
            >
              💋 View Your Reservation
            </Button>
          </Section>

          {/* Note */}
          <Section style={{ marginTop: 18 }}>
            <Text style={{ color: MUTED, fontSize: 13, lineHeight: "20px" }}>
              If you have any questions or want to change your reservation,
              email us at{" "}
              <a
                href="mailto:makeupbykika@hotmail.com"
                style={{ color: BRAND, textDecoration: "none" }}
              >
                makeupbykika@hotmail.com
              </a>{" "}
              or call (+389) 78 / 343 - 377.
            </Text>
          </Section>

          {/* Footer */}
          {/* Footer */}
          <Section
            style={{
              marginTop: 24,
              borderTop: "1px solid #f0f0f0",
              paddingTop: 16,
              textAlign: "center",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: MUTED,
                lineHeight: "18px",
                margin: "0 0 10px",
              }}
            >
              © {new Date().getFullYear()} Kika Makeup & Beauty Academy —
              Ohrid, Macedonia
            </Text>

            <div>
              <a
                href="https://instagram.com/"
                style={{ display: "inline-block", marginRight: 10 }}
              >
                <Img
                  src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                  alt="Instagram"
                  width={20}
                  height={20}
                />
              </a>

              <a
                href="https://facebook.com/"
                style={{ display: "inline-block", marginLeft: 10 }}
              >
                <Img
                  src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                  alt="Facebook"
                  width={20}
                  height={20}
                />
              </a>
            </div>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ReservationEmail;
