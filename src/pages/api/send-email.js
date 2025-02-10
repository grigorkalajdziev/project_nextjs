import resend from 'resend';

// Initialize Resend with your API Key
const client = resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { to, from, subject, text, html } = req.body;

  try {
    // Send email using Resend API
    const response = await client.emails.send({
      to: to,
      from: from,
      subject: subject,
      text: text,
      html: html,
    });

    // Log the response to help with debugging
    console.log("Resend API Response:", response);

    if (response.status === 'success') {
      return res.status(200).json({ message: "Email sent successfully!" });
    } else {
      return res.status(500).json({ error: "Failed to send email", details: response });
    }
  } catch (error) {
    // Log and return the error details
    console.error("Error sending email:", error);
    return res.status(500).json({ error: error.message });
  }
}
