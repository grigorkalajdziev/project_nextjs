// pages/api/resend-subscribe.js
import { Resend } from 'resend';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SubscribeResendEmail from '../../components/Newsletter/SubscribeResendEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email || email.indexOf('@') === -1) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    const emailHtml = ReactDOMServer.renderToStaticMarkup(<SubscribeResendEmail />);

    const data = await resend.emails.send({
      from: 'newsletters@kikamakeupandbeautyacademy.com',
      to: email,
      subject: 'Welcome to Kika Makeup and Beauty Academy!',
      html: emailHtml,
    });

    res.status(200).json({ message: 'Email sent successfully', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
