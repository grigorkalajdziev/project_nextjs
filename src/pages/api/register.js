import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI;
let client;

export default async function handler(req, res) {
  try {
    if (!uri) {
      return res.status(500).json({ message: "MONGODB_URI is not defined" });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!client) {
      client = new MongoClient(uri, {
        tls: true, // Ensure TLS is enabled
        tlsAllowInvalidCertificates: false, // Prevent invalid certificates
        minDHSize: 2048, // Ensure secure TLS connections
        serverSelectionTimeoutMS: 5000,
      });

      await client.connect();
    }

    const db = client.db("kikamakeup");

    const existingUser = await db.collection("users").findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
    const newUser = {
      email: req.body.email,
      password: hashedPassword,
    };

    const result = await db.collection("users").insertOne(newUser);

    res.status(200).json({ 
      message: "User Registered", 
      userId: result.insertedId,
      redirect: '/other/my-account'
    });

  } catch (error) {
    console.error("Error in handler:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
