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

const ReservationEmail_MK = ({
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
  const BRAND = "#c1558b"; // refined pink tone
  const BRAND_LIGHT = "#f7e4ed";
  const BG = "#faf7f9";
  const CARD = "#ffffff";
  const MUTED = "#777";

  const formatMKD = (value) => {
    const v = typeof value === "number" ? value : parseFloat(value || 0);
    return `${v.toFixed(2)} ден.`;
  };

  const subtotal = products.reduce(
    (s, p) => s + parseFloat(p.price || 0) * (p.quantity || 1),
    0
  );
  const discountAmount = Number(discount || 0);
  const totalAfterDiscount = Math.max(0, subtotal - discountAmount);

  // Styles
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
      <Body style={containerStyle}>
        <Preview>
          💄 Потврда за резервација #{orderID} — Kika Makeup & Beauty Academy
        </Preview>

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
              <div style={{ fontSize: 12, color: MUTED }}>Резервација</div>
              <div style={{ fontWeight: 700, color: BRAND }}> #{orderID}</div>
            </div>
          </div>

          {/* Greeting */}
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <h1 style={titleStyle}>Потврда за вашата резервација</h1>
            <div style={smallMuted}>
              Почитуван(а) <strong>{customerName}</strong>, вашата резервација е
              успешно потврдена!
            </div>
          </div>

          {/* Reservation summary */}
          <Section>
            <div style={sectionTitle}>💅 Детали за резервацијата</div>

            <div style={infoRow}>
              <div style={{ color: MUTED }}>Датум: </div>
              <div>{reservationDate}</div>
            </div>

            <div style={infoRow}>
              <div style={{ color: MUTED }}>Време: </div>
              <div>{reservationTime}</div>
            </div>

            <div style={infoRow}>
              <div style={{ color: MUTED }}>Начин на плаќање: </div>
              <div>{paymentText}</div>
            </div>
          </Section>

          {/* Contact info */}
          <Section style={{ marginTop: 10 }}>
            <div style={sectionTitle}>📞 Контакт информации</div>
            <div style={infoRow}>
              <div style={{ color: MUTED }}>Име: </div>
              <div>{customerName}</div>
            </div>
            <div style={infoRow}>
              <div style={{ color: MUTED }}>Е-пошта: </div>
              <div>{customerEmail}</div>
            </div>
            <div style={infoRow}>
              <div style={{ color: MUTED }}>Телефон: </div>
              <div>{customerPhone}</div>
            </div>
            {(customerAddress || customerCity || customerState) && (
              <div style={infoRow}>
                <div style={{ color: MUTED }}>Адреса: </div>
                <div>
                  {customerAddress}
                  {customerCity && `, ${customerCity}`}
                  {customerPostalCode && `, (${customerPostalCode})`}
                  {customerState && ` ${customerState}`}
                </div>
              </div>
            )}
          </Section>

          {/* Services */}
          <Section style={{ marginTop: 18 }}>
            <div style={sectionTitle}>💖 Избрани услуги</div>

            {products.length === 0 && (
              <div style={{ color: MUTED }}>Нема објавени услуги.</div>
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
                <div style={productPrice}>{formatMKD(p.price)}</div>
              </div>
            ))}
          </Section>

          {/* Totals and discount */}
          <Section>
            <div style={totalRow}>
              <div style={{ color: MUTED }}>Меѓузбир: </div>
              <div>{formatMKD(subtotal)}</div>
            </div>

            {discountAmount > 0 && (
              <div style={totalRow}>
                <div style={{ color: MUTED }}>
                  Попуст {couponCode ? `(${couponCode})` : ""}
                </div>
                <div> -{formatMKD(discountAmount)}</div>
              </div>
            )}

            <div style={{ ...totalRow, marginTop: 12 }}>
              <div style={grandTotal}>Вкупно: </div>
              <div style={grandTotal}>{formatMKD(totalAfterDiscount)}</div>
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
              💋 Прегледај ја резервацијата
            </Button>
          </Section>

          {/* Note */}
          <Section style={{ marginTop: 18 }}>
            <Text style={{ color: MUTED, fontSize: 13, lineHeight: "20px" }}>
              Доколку имате прашања или сакате промена на резервацијата, пишете
              ни на{" "}
              <a
                href="mailto:makeupbykika@hotmail.com"
                style={{ color: BRAND, textDecoration: "none" }}
              >
                makeupbykika@hotmail.com
              </a>{" "}
              или јавете се на (+389) 78 / 343 - 377.
            </Text>
          </Section>

          {/* Footer */}
          <Section
            style={{
              marginTop: 24,
              borderTop: "1px solid #f0f0f0",
              paddingTop: 12,
            }}
          >
            <Row
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Column
                style={{
                  width: "60%",
                  display: "flex",
                  alignItems: "center",
                  paddingRight: "12px",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: MUTED,
                    lineHeight: "18px",
                    margin: 0,
                  }}
                >
                  © 2025 Kika Makeup и Beauty Academy — Охрид, Македонија
                </Text>
              </Column>

              <Column
                style={{
                  width: "40%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {/* Use both gap and explicit margin as fallback for email clients */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <a
                    href="https://instagram.com/"
                    style={{ display: "inline-block", marginRight: "0" }}
                  >
                    <Img
                      src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                      alt="Instagram"
                      width={20}
                      height={20}
                      style={{ display: "block" }}
                    />
                  </a>

                  <a
                    href="https://facebook.com/"
                    style={{ display: "inline-block", marginLeft: "12px" }}
                  >
                    <Img
                      src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                      alt="Facebook"
                      width={20}
                      height={20}
                      style={{ display: "block" }}
                    />
                  </a>
                </div>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ReservationEmail_MK;
