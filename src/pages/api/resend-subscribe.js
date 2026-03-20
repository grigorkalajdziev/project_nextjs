import { Resend } from "resend";
import ReactDOMServer from "react-dom/server";
import SubscribeResendEmail from "../../components/Newsletter/SubscribeResendEmail";
import SubscribeResendEmail_MK from "../../components/Newsletter/SubscribeResendEmail_MK";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send();

  const { email, currentLanguage = "en" } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const emailsToProcess = Array.isArray(email) ? email : [email];
  const results = [];

  try {
    for (const targetEmail of emailsToProcess) {      
      const { data: contact, error: contactError } = await resend.contacts.create({
        email: targetEmail,
        unsubscribed: false,
        segments: [
          { id: process.env.RESEND_SEGMENT_ID }
        ]  
      });
      
      if (contactError && contactError.name !== "validation_error") {
        console.error(`Error for ${targetEmail}:`, contactError);
        results.push({ email: targetEmail, status: "failed", error: contactError.message });
        continue;
      }
    
      const emailHtml = ReactDOMServer.renderToStaticMarkup(
        currentLanguage === "mk" ? <SubscribeResendEmail_MK email={targetEmail}/> : <SubscribeResendEmail email={targetEmail}/>
      );

      const { data: emailData, error: sendError } = await resend.emails.send({
            from: "newsletter@kikamakeupandbeautyacademy.com",
            to: targetEmail,
            subject: currentLanguage === "mk" 
              ? "Добредојдовте во Кика Makeup и Beauty Academy!" 
              : "Welcome to Kika Makeup and Beauty Academy!",
            html: emailHtml,

            headers: {
              "List-Unsubscribe": `<https://www.kikamakeupandbeautyacademy.com/unsubscribe?email=${encodeURIComponent(targetEmail)}>`
            }
          });

      results.push({ email: targetEmail, status: sendError ? "email_failed" : "success" });
    }

    res.status(200).json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}