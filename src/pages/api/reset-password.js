import admin from "firebase-admin";
import { render } from "@react-email/render";
import PasswordResetEmail from "../../components/Newsletter/PasswordResetEmail";
import { Resend } from "resend";
import { sign } from "jsonwebtoken";

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  .replace(/^"|"$/g, "") // Remove leading and trailing quotes, if any
  .replace(/\\n/g, "\n");

// Initialize Admin SDK if not already initialized
if (!admin.apps.length) {  
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,        
      privateKey,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

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
    const userRecord = await admin.auth().getUserByEmail(email);   
    
    if (!userRecord) {      
      return res.status(404).json({ error: "User not found" });
    }
    
    const { uid } = userRecord;    
    
    const token = sign({ email, uid }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/other/reset-password?token=${token}`;    
   
    const emailHtml = await render(<PasswordResetEmail resetUrl={resetUrl} />);    
    
    await resend.emails.send({
      from: "no-reply@kikamakeupandbeautyacademy.com",
      to: email,
      subject: "Password Reset Request",
      html: emailHtml,
    });   
    
    return res.status(200).json({ message: "Password reset email sent successfully!" });
  } catch (error) {    
    return res.status(500).json({ error: error.message });
  }
}
