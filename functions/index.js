const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({origin: true});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "grigorkalajdziev@gmail.com",
    pass: "fxhhwlovliqlkgsl",
  },
});

exports.sendContactEmail = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({error: "Only POST requests allowed!"});
    }

    const {name, email, subject, message} = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({error: "All fields are required!"});
    }

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "grigorkalajdziev@gmail.com",
      subject: subject,
      text: `From: ${name} <${email}>\n\nMessage:\n${message}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({
        status: "success", message: "Email sent successfully!"});
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({error: "Failed to send email."});
    }
  });
});
