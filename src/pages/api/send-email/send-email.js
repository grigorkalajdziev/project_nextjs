import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req, res) {
  try {
    const { to, from, subject, text, html } = await req.json();

    const response = await resend.emails.send({
      from,
      to,
      subject,
      text,
      html,
    });

    // Ensure a valid JSON response is returned from the server
    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      data: response,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    // Return a JSON response with an error message
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
    });
  }
}
