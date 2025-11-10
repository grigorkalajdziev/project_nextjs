import { Resend } from "resend";
import ReactDOMServer from "react-dom/server";
import ReservationEmail from "../../components/Newsletter/ReservationEmail";
import ReservationEmail_MK from "../../components/Newsletter/ReservationEmail_MK";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  const {
    to,
    from,
    orderID,
    reservationDate,
    reservationTime,
    customerName,
    customerEmail,
    paymentText,
    total,
    products,
    customerPhone,
    customerAddress,
    customerState,
    customerCity,
    customerPostalCode,
    language = "en",
    discount = 0,   
    couponCode = null
  } = req.body;

  // Basic email validation
  if (!to || !to.includes("@")) {
    return res.status(400).json({ error: "Invalid recipient email address" });
  }
  if (!from || !from.includes("@")) {
    return res.status(400).json({ error: "Invalid sender email address" });
  }

  const normalizedProducts = products.map(p => ({
    ...p,
    name: typeof p.name === 'object' ? p.name[language] || p.name.en : p.name,
    price: typeof p.price === 'object' ? p.price[language] || p.price.en : p.price,
  }));

  // Pick template based on language
  const EmailComponent =
    language === "mk" ? ReservationEmail_MK : ReservationEmail;

  // Render to static HTML
  const emailHtml = ReactDOMServer.renderToStaticMarkup(
    <EmailComponent
      orderID={orderID}
      reservationDate={reservationDate}
      reservationTime={reservationTime}
      customerName={customerName}
      customerEmail={customerEmail}
      paymentText={paymentText}
      discount={discount}          
      couponCode={couponCode} 
      total={total}
      products={normalizedProducts}
      customerPhone={customerPhone}  
      customerAddress={customerAddress}  
      customerState={customerState}  
      customerCity={customerCity}  
      customerPostalCode={customerPostalCode} 
    />
  );

  // Localized subject
  const subject =
    language === "mk"
      ? `Потврда за резервација: ${orderID}`
      : `Your Reservation Confirmation: ${orderID}`;

  try {
    const data = await resend.emails.send({
      to,
      from,
      subject,
      html: emailHtml,
    });

    console.log("Reservation email sent:", data);
    return res
      .status(200)
      .json({ message: "Email sent successfully", data });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to send email" });
  }
}
