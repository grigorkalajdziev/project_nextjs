import { Resend } from "resend";
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import EmailTemplate from "../../components/Newsletter/EmailTemplate";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, from, subject, message, name, email } = req.body;

  const emailHtml = ReactDOMServer.renderToStaticMarkup(
    <EmailTemplate name={name} email={email} subject={subject} message={message} />
  );

  try {
    const data = await resend.emails.send({
      to,
      cc: email,
      from,
      subject,
      html: emailHtml,
    });
    console.log("Email sent:", data);
    return res.status(200).json({ message: "Email sent successfully", data });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: error.message || "Failed to send email" });
  }
}
