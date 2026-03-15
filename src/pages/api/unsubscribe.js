import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send("Missing email");
  }

  try {
    await resend.contacts.update({
      email,
      unsubscribed: true,
    });

    res.status(200).json({ success: true })

  } catch (error) {
    console.error(error);
    res.status(500).send("Error unsubscribing.");
  }
}