import { render } from '@react-email/render';
import ReviewSubmittedEmail from '../../components/Newsletter/ReviewSubmittedEmail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, reviewerName, productName, rating, message } = req.body;

    try {
      // Render the review email template
      const emailHtml = await render(
        <ReviewSubmittedEmail
          reviewerName={reviewerName}
          productName={productName}
          rating={rating}
          message={message}
        />
      );

      // Send email with Resend API
      await resend.emails.send({
        from: 'reviews@kikamakeupandbeautyacademy.com',
        to: email, // Or any other email you want to receive review notifications
        subject: 'New Review Submitted!',
        html: emailHtml,
      });

      res.status(200).json({ message: 'Review submission email sent!' });
    } catch (error) {
      console.error('Error sending review submission email:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
