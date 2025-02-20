import { Resend } from 'resend';
import RegistrationEmail from '../../components/Newsletter/RegistrationEmail';
import React from 'react';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    try {
      const emailHtml = await render(<RegistrationEmail />);      

      await resend.emails.send({
        from: 'register@kikamakeupandbeautyacademy.com',
        to: email,
        subject: 'Welcome to Kika Makeup and Beauty Academy!',
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
