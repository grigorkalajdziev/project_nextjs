import resend from 'resend';

// Initialize Resend with your API Key (ensure the key is stored securely, not hardcoded)
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
      html: html
    });

    // Check if the email was sent successfully
    if (response.status === 'success') {
      return res.status(200).json({ message: "Email sent successfully!" });
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
