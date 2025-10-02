import { Resend } from 'resend';
import RegistrationEmail from '../../components/Newsletter/RegistrationEmail';
import RegistrationEmail_MK from '../../components/Newsletter/RegistrationEmail_MK';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, language, coupon } = req.body;   

    try {
      const emailHtml = ReactDOMServer.renderToStaticMarkup(
        language === 'mk' ? <RegistrationEmail_MK coupon={coupon} /> : <RegistrationEmail coupon={coupon}/>
      ); 

      await resend.emails.send({
        from: 'register@kikamakeupandbeautyacademy.com',
        to: email,
        subject: language === 'mk' ? 'Добредојдовте во Kika Makeup and Beauty Academy!' : 'Welcome to Kika Makeup and Beauty Academy!',
        html: emailHtml,
      });

      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
