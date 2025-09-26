import { Resend } from "resend";
import ReactDOMServer from "react-dom/server";
import ReservationEmailInternal from "../../components/Newsletter/ReservationEmailInternal";
import ReservationEmailInternal_MK from "../../components/Newsletter/ReservationEmailInternal_MK";

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
    language = 'en', // exactly the same prop name as your subscribe endpoint
  } = req.body;
 
   const normalizedProducts = products.map(p => ({
    ...p,
    name: typeof p.name === 'object' ? p.name[language] || p.name.en : p.name,
    price: typeof p.price === 'object' ? p.price[language] || p.price.en : p.price,
  }));

  // Pick the right React component
  const EmailComponent =
  language === 'mk'
      ? ReservationEmailInternal_MK
      : ReservationEmailInternal;

  // Render to static HTML
  const emailHtml = ReactDOMServer.renderToStaticMarkup(
    <EmailComponent
      orderID={orderID}
      reservationDate={reservationDate}
      reservationTime={reservationTime}
      customerName={customerName}
      customerEmail={customerEmail}
      paymentMethod={paymentText}
      total={total}
      products={normalizedProducts}
      customerPhone={customerPhone}  
      customerAddress={customerAddress}  
      customerState={customerState}  
      customerCity={customerCity}  
      customerPostalCode={customerPostalCode}  
      language={language}
    />
  );

  // Localized default subject
  const subject =
  language === 'mk'
      ? `Нова резервација од ${customerName}`
      : `New reservation from ${customerName}`;

  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html: emailHtml,
    });

    console.log("Reservation email sent:", data);
    return res.status(200).json({ message: "Email sent successfully", data });
  } catch (error) {
    console.error("Error sending reservation email:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to send email" });
  }
}
