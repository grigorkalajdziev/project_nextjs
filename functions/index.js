const functions = require("firebase-functions");
const cors = require("cors");
const nodemailer = require("nodemailer");

const corsHandler = cors({origin: "https://www.kikamakeupandbeautyacademy.com"});

exports.sendContactEmail = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "https://www.kikamakeupandbeautyacademy.com");
      res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      return res.status(204).send("");
    }

    console.log("Received request body:", req.body);

    const {name, email, message} = req.body;

    if (!name || !email || !message) {
      res.set("Access-Control-Allow-Origin", "https://www.kikamakeupandbeautyacademy.com");
      return res.status(400).send("Missing fields: name, email, or message.");
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: email,
        to: "grigorkalajdziev@gmail.com",
        subject: "New Contact Form Message",
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      };

      console.log("Mail options:", mailOptions);

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.response);

      res.set("Access-Control-Allow-Origin", "https://www.kikamakeupandbeautyacademy.com");
      return res.status(200).send("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      res.set("Access-Control-Allow-Origin", "https://www.kikamakeupandbeautyacademy.com");
      return res.status(500).send("Error sending email.");
    }
  });
});
