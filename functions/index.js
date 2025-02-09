const functions = require("firebase-functions");
const cors = require("cors");
const nodemailer = require("nodemailer");

// CORS configuration (Allow all origins, or specify your domain)
const corsHandler = cors({origin: true});

// Main Function
exports.sendContactEmail = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === "OPTIONS") {
      // Handle preflight requests
      return res.status(204).send("");
    }

    console.log("Received request body:", req.body);

    const {name, email, message} = req.body;

    if (!name || !email || !message) {
      return res.status(400).send("Missing fields: name, email, or message.");
    }

    try {
      // Nodemailer transport setup
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      });

      // Email options
      const mailOptions = {
        from: email,
        to: "grigorkalajdziev@gmail.com",
        subject: "New Contact Form Message",
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      };

      console.log("Mail options:", mailOptions);

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.response);
      return res.status(200).send("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email.");
    }
  });
});
