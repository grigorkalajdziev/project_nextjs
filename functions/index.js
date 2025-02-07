const functions = require("firebase-functions");
const cors = require("cors")({origin: true});
const nodemailer = require("nodemailer");

exports.sendContactEmail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    // Add debugger here to inspect request body
    console.log("Received request body:", req.body);

    const {name, email, message} = req.body;

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

    // Add debugger before sending the email
    console.log("Transporter setup:", transporter);
    console.log("Mail options:", mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error); // Debug in case of error
        return res.status(500).send("Error sending email");
      }
      res.status(200).send("Email sent successfully!");
    });
  });
});
