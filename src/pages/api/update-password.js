import admin from "firebase-admin";
import { verify } from "jsonwebtoken";

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  .replace(/^"|"$/g, "") 
  .replace(/\\n/g, "\n");

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required" });
  }
  
  try {
    // Verify the token to extract user data (uid and email)
    const tokenData = verify(token, process.env.JWT_SECRET);
    if (!tokenData.uid) {
      return res.status(400).json({ error: "Invalid token" });
    }
    const uid = tokenData.uid;   
    
    await admin.auth().updateUser(uid, { password: newPassword });    
    
    const db = admin.database();
    const userRef = db.ref(`users/${uid}`);
    
    await userRef.update({ password: newPassword });
    
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {    
    return res.status(500).json({ error: error.message });
  }
}
