import { Resend } from "resend";
import { render } from "@react-email/render";
import { renderToStream } from "@react-pdf/renderer";
import getStreamBuffer from "../../lib/getStreamBurffer";
import QRCode from 'qrcode';

import CancelationEmail_MK from "../../components/Newsletter/CancelationEmail_MK";
import CancelationEmail from "../../components/Newsletter/CancelationEmail"
import ReservationEmail from "../../components/Newsletter/ReservationEmail";
import ReservationEmail_MK from "../../components/Newsletter/ReservationEmail_MK";
import InvoiceDocument from "../../components/Newsletter/InvoiceDocument";
import InvoiceDocument_MK from "../../components/Newsletter/InvoiceDocument_MK";
import ConfirmationDocument from "../../components/Newsletter/ConfirmationDocument";
import ConfirmationDocument_MK from "../../components/Newsletter/ConfirmationDocument_MK";

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
  const isConfirmed = status.toLowerCase() === "confirmed";

  // Only send email if confirmed or cancelled
  if (!isCanceled && !isConfirmed) {
    return res.status(200).json({ message: "No email sent. Status is neither confirmed nor cancelled." });
  }
  const subject = isCanceled
    ? language === 'mk'
      ? `Вашата нарачка ${orderNumber} е откажана`
      : `Your order ${orderNumber} has been cancelled`
    : language === 'mk'
    ? `Вашата нарачка ${orderNumber} е потврдена`
    : `Your order ${orderNumber} is confirmed`;

  // Choose email component based on language
  let EmailComponent;
  if (isCanceled) {
    EmailComponent = language === 'mk' ? CancelationEmail_MK : CancelationEmail;
  } else {
    EmailComponent = language === 'mk' ? ReservationEmail_MK : ReservationEmail;
  }

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

  let attachments = [];

  if (isConfirmed) {
    try {
      // Build common PDF props
      const qrPayload = JSON.stringify({ orderNumber, reservationDate, reservationTime });
      const qrCodeUrl = await QRCode.toDataURL(qrPayload);

      const pdfProps = {
        orderNumber,
        date: reservationDate,
        reservationDate,
        reservationTime,
        total,
        products,
        paymentMethod,
        customerName,
        customerEmail,
        customerPhone,
        qrCodeUrl
      };

      let stream;
      let filename;

      const ConfirmationDocComponent = language === 'mk' ? ConfirmationDocument_MK : ConfirmationDocument;
      const InvoiceDocComponent = language === 'mk' ? InvoiceDocument_MK : InvoiceDocument;

      if (paymentMethod === 'payment_cash') {
        stream = await renderToStream(<ConfirmationDocComponent {...pdfProps} />);
        filename = language === 'mk' ? `Потврда-${orderNumber}.pdf` : `Confirmation-${orderNumber}.pdf`;
      } else {
        stream = await renderToStream(<InvoiceDocComponent {...pdfProps} />);
        filename = language === 'mk' ? `Фактура-${orderNumber}.pdf` : `Invoice-${orderNumber}.pdf`;
      }

      const buffer = await getStreamBuffer(stream);
      attachments.push({
        filename,
        content: buffer.toString('base64'),
        encoding: 'base64',
      });
    } catch (pdfError) {
      console.error("Failed to generate PDF attachments:", pdfError);
    }
  }

  // Send the email
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html: emailHtml,
      ...(attachments.length > 0 ? { attachments } : {}),
    });
    
    return res.status(200).json({ message: "Email sent successfully", data });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
