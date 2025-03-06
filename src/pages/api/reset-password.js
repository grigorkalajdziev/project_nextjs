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
  console.log("Initializing Firebase Admin SDK...");
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,        
      privateKey,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
} else {
  console.log("Firebase Admin SDK already initialized.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  console.log("Received request with method:", req.method);
  if (req.method !== "POST") {
    console.log("Method not allowed:", req.method);
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  
  const { email } = req.body;
  console.log("Email received from request body:", email);
  if (!email) {
    console.log("No email provided in request body.");
    return res.status(400).json({ error: "Email is required" });
  }
  
  try {
    console.log("Fetching user record for email:", email);
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log("User record found with UID:", userRecord.uid);
    
    if (!userRecord) {
      console.log("User not found for email:", email);
      return res.status(404).json({ error: "User not found" });
    }
    
    const { uid } = userRecord;
    
    console.log("Generating token for UID:", uid);
    const token = sign({ email, uid }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Token generated (first 20 chars):", token.substring(0, 20) + "...");
   
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/other/reset-password?token=${token}`;
    console.log("Constructed reset URL:", resetUrl);
    
    console.log("Rendering email HTML using PasswordResetEmail component...");
    const emailHtml = await render(<PasswordResetEmail resetUrl={resetUrl} />);
    console.log("Rendered email HTML length:", emailHtml.length);
    
    console.log("Sending email via Resend...");
    await resend.emails.send({
      from: "no-reply@kikamakeupandbeautyacademy.com",
      to: email,
      subject: "Password Reset Request",
      html: emailHtml,
    });
    
    console.log("Password reset email sent successfully.");
    return res.status(200).json({ message: "Password reset email sent successfully!" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return res.status(500).json({ error: error.message });
  }
}
