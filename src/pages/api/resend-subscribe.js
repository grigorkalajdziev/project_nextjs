// pages/api/resend-subscribe.js
import { Resend } from 'resend';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SubscribeResendEmail from '../../components/Newsletter/SubscribeResendEmail';
import SubscribeResendEmail_MK from '../../components/Newsletter/SubscribeResendEmail_MK';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, currentLanguage = 'en' } = req.body;
  
  if (!email || email.indexOf('@') === -1) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    const emailHtml = ReactDOMServer.renderToStaticMarkup(
      currentLanguage === 'mk' ? <SubscribeResendEmail_MK /> : <SubscribeResendEmail />
    );

    const data = await resend.emails.send({
      from: 'newsletter@kikamakeupandbeautyacademy.com',
      to: email,
      subject: currentLanguage === 'mk' ? 'Добредојдовте во Кика Makeup и Beauty Academy!' : 'Welcome to Kika Makeup and Beauty Academy!',
      html: emailHtml,
      headers: {
        'List-Unsubscribe': '<mailto:unsubscribe@kikamakeupandbeautyacademy.com>, <https://www.kikamakeupandbeautyacademy.com/unsubscribe>'
      }
    });

    res.status(200).json({ message: 'Email sent successfully', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
