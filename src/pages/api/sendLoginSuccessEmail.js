import ReactDOMServer from 'react-dom/server';
import LoginSuccessEmail from '../../components/Newsletter/LoginSuccessEmail';
import LoginSuccessEmail_MK from '../../components/Newsletter/LoginSuccessEmail_MK';
import GoogleLoginSuccessEmail from '../../components/Newsletter/GoogleLoginSuccessEmail';
import GoogleLoginSuccessEmail_MK from '../../components/Newsletter/GoogleLoginSuccessEmail_MK';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }  

  const { email, provider, userName, language } = req.body;  
  
  try {
    const emailHtml = ReactDOMServer.renderToStaticMarkup(
      provider === 'google'
        ? language === 'mk'
          ? <GoogleLoginSuccessEmail_MK userName={userName} />
          : <GoogleLoginSuccessEmail userName={userName} />
        : language === 'mk'
          ? <LoginSuccessEmail_MK userName={userName} />
          : <LoginSuccessEmail userName={userName} />
    );   

    await resend.emails.send({
      from: 'login@kikamakeupandbeautyacademy.com',
      to: email,
      subject: language === 'mk' ? 'Успешна најава во Kika Makeup and Beauty Academy!' : 'Successful Login to Kika Makeup and Beauty Academy!',
      html: emailHtml,
    });

    res.status(200).json({ message: 'Login success email sent!' });
  } catch (error) {
    console.error('Error sending login success email:', error);
    res.status(500).json({ error: error.message });
  }
}
