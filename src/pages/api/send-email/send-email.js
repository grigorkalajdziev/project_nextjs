import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { to, from, subject, text, html } = req.body;

    const response = await resend.emails.send({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log("Email API response:", response);

    // ✅ Ensure valid JSON response
    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      data: response,
    });

  } catch (error) {
    console.error("Error sending email:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
}
