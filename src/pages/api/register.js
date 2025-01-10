import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;

export default async function handler(req, res) {
  try {
    if (!client) {
      client = await MongoClient.connect(uri, {       
        tls: true,
        tlsAllowInvalidCertificates: false,
        serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      });
    }

    const db = client.db("kikamakeup");
    const existingUser = await db.collection("users").findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const users = await db.collection("users").insertOne(req.body);

    // Send success response with redirect path
    res.status(200).json({ 
      message: "User Registered", 
      users,
      redirect: '/other/my-account'
    });

  } catch (error) {   
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}