// pages/api/resend-reservation.js
import { Resend } from "resend";
import React from "react";
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
    paymentMethod,
    total,
    products,
    language = 'en', // exactly the same prop name as your subscribe endpoint
  } = req.body;
 

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
      paymentMethod={paymentMethod}
      total={total}
      products={products}
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
