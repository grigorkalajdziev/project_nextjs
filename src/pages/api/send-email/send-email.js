import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();

    const response = await resend.emails.send({
      from: "contact@kikamakeupandbeautyacademy.com",
      to: "grigorkalajdziev@gmail.com",
      subject: `New Contact Form Submission: ${subject || "No Subject"}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (response.error) throw new Error(response.error);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
