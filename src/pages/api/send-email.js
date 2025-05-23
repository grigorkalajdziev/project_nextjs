// pages/api/send-email.js

import { Resend } from "resend";
import React from "react";
import ReactDOMServer from "react-dom/server";
import EmailTemplate from "../../components/Newsletter/EmailTemplate";
import EmailTemplateMKD from "../../components/Newsletter/EmailTemplate_MK";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    to,
    from,
    subject,
    message,
    name,
    email,
    currentLanguage = "en",
  } = req.body;

  if (!to || !from || !subject || !message || !name || !email) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Choose template and subject
  const isMK = currentLanguage === "mk";
  const Template = isMK ? EmailTemplateMKD : EmailTemplate;
  const localizedSubject = isMK ? `Нова порака од ${name}` : subject;

  // Render the correct email HTML
  const emailHtml = ReactDOMServer.renderToStaticMarkup(
    <Template
      name={name}
      email={email}
      subject={subject}
      message={message}
    />
  );

  try {
    const data = await resend.emails.send({
      to,
      cc: email,
      from,
      subject: localizedSubject,
      html: emailHtml,
      reply_to: email,
    });
    console.log("Email sent:", data);
    return res.status(200).json({ message: "Email sent successfully", data });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to send email" });
  }
}
