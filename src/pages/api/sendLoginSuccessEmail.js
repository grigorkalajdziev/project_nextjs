import { render } from '@react-email/render';
import LoginSuccessEmail from '../../components/Newsletter/LoginSuccessEmail';
import GoogleLoginSuccessEmail from '../../components/Newsletter/GoogleLoginSuccessEmail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, provider, userName } = req.body;

    try {
      let emailHtml;
      
      if (provider === 'google') {
        emailHtml = await render(<GoogleLoginSuccessEmail userName={userName} />);
      } else {
        emailHtml = await render(<LoginSuccessEmail />);
      }

      await resend.emails.send({
        from: 'login@kikamakeupandbeautyacademy.com',
        to: email,
        subject: 'Successful Login to Kika Makeup and Beauty Academy!',
        html: emailHtml,
      });

      res.status(200).json({ message: 'Login success email sent!' });
    } catch (error) {
      console.error('Error sending login success email:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
