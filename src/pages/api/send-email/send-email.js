// pages/api/send-email.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req, res) => {
  if (req.method === "POST") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const { to, from, subject, text, html } = req.body;
    
    try {
      const emailResponse = await resend.emails.send({
        from,
        to,
        subject,
        text,
        html,
      });

      return res.status(200).json(emailResponse);
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};
