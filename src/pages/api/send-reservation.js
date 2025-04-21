import { Resend } from "resend";
import { renderToStaticMarkup } from "react-dom/server";
import ReservationEmailInternal from "../../components/Newsletter/ReservationEmailInternal";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, from, subject, orderID, reservationDate, reservationTime, customerName, customerEmail, paymentMethod, total, products } = req.body;

  const emailHtml = renderToStaticMarkup(
    <ReservationEmailInternal 
      orderID={orderID} 
      reservationDate={reservationDate} 
      reservationTime={reservationTime} 
      customerName={customerName} 
      customerEmail={customerEmail}
      paymentMethod={paymentMethod} 
      total={total} 
      products={products} 
    />
  );

  try {
    const data = await resend.emails.send({
      to,
      from,
      subject,
      html: emailHtml, // Assuming you want to send HTML content
    });
    console.log("Email sent:", data);
    return res.status(200).json({ message: "Email sent successfully", data });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: error.message || "Failed to send email" });
  }
}
