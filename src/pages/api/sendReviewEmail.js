import ReactDOMServer from 'react-dom/server';
import ReviewSubmittedEmail from '../../components/Newsletter/ReviewSubmittedEmail';
import ReviewSubmittedEmail_MK from '../../components/Newsletter/ReviewSubmittedEmail_MK';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, reviewerName, productName, rating, message, language } = req.body;

    try {

      const EmailTemplate = language === 'mk' ? ReviewSubmittedEmail_MK : ReviewSubmittedEmail;

      // Render the review email template
      const emailHtml = ReactDOMServer.renderToStaticMarkup(
        <EmailTemplate
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
        subject: language === 'mk' ? 'Нова рецензија е поднесена!' : 'New Review Submitted!',
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
