const {onRequest} = require("firebase-functions/v2/https");
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const logger = require("firebase-functions/logger");

exports.sendContactEmail = onRequest(async (req, res) => {
  logger.info("Received contact form request", {structuredData: true});
  const {name, email, subject, message} = req.body;

  // Check if any required fields are missing
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      error: "Missing fields: name, email, subject, or message.",
    });
  }

  try {
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: functions.config().gmail.user,
        pass: functions.config().gmail.password,
      },
    });

    // Create the mail options, including the subject
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "grigorkalajdziev@gmail.com",
      subject: subject,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    logger.info("Email sent successfully.");
    return res.status(200).json({
      status: "success",
      message: "Email sent successfully!",
    });
  } catch (error) {
    logger.error("Error sending email:", error);
    return res.status(500).json({
      error: "Error sending email. Please try again later.",
    });
  }
});
