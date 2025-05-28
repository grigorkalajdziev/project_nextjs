import { Resend } from "resend";
import { render } from "@react-email/render";
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
    orderNumber,
    status,
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
    language = 'en',
  } = req.body;  

  if (!to || !orderNumber || !status) {    
    return res.status(400).json({ error: "Missing required fields" });
  }

  const isCanceled = status.toLowerCase().startsWith("cancel");
  const subject = isCanceled
    ? language === 'mk'
      ? `Вашата нарачка ${orderNumber} е откажана`
      : `Your order ${orderNumber} has been cancelled`
    : language === 'mk'
    ? `Вашата нарачка ${orderNumber} е потврдена`
    : `Your order ${orderNumber} is confirmed`;

  // Choose email component based on language
  const EmailComponent = language === 'mk' ? ReservationEmail_MK : ReservationEmail;

  // Render email content to HTML
  let emailHtml;
  try {
    emailHtml = await render(
      <EmailComponent
        orderID={orderNumber}
        reservationDate={reservationDate}
        reservationTime={reservationTime}
        customerName={customerName}
        paymentMethod={paymentMethod}
        total={total}
        products={products}
        customerEmail={customerEmail}
        customerPhone={customerPhone}
        customerAddress={customerAddress}
        customerState={customerState}
        customerCity={customerCity}
        customerPostalCode={customerPostalCode}
      />
    );    
  } catch (renderError) {    
    return res.status(500).json({ error: "Failed to render email HTML" });
  }

  // Send the email
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html: emailHtml,
    });
    
    return res.status(200).json({ message: "Email sent successfully", data });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
