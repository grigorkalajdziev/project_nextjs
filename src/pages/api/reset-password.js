// pages/api/custom-reset-password.js
import { render } from "@react-email/render";
import PasswordResetEmail from "../../components/Newsletter/PasswordResetEmail";
import { Resend } from "resend";
import { sign } from 'jsonwebtoken';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  
  try {    
    const token = sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });    
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/other/reset-password?token=${token}`;
    
    // Render the email HTML using the PasswordResetEmail component
    const emailHtml = await render(<PasswordResetEmail resetUrl={resetUrl} />);
    
    // Send the email using Resend
    await resend.emails.send({
      from: "no-reply@kikamakeupandbeautyacademy.com",
      to: email,
      subject: "Password Reset Request",
      html: emailHtml,
    });
    
    res.status(200).json({ message: "Password reset email sent successfully!" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({ error: error.message });
  }
}
