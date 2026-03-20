import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();  

  try {
    const { data, error } = await resend.contacts.list();

    if (error) return res.status(400).json({ error });

    const contacts = data?.data || [];

    const now = new Date();

    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = new Date(now - 90 * 24 * 60 * 60 * 1000);

    return res.status(200).json({
      total: contacts.filter(c => !c.unsubscribed).length,
      totalAll: contacts.length,
      unsubscribed: contacts.filter(c => c.unsubscribed).length,
      lastWeek: contacts.filter(c =>
        !c.unsubscribed && new Date(c.created_at) >= oneWeekAgo
      ).length,
      lastMonth: contacts.filter(c =>
        !c.unsubscribed && new Date(c.created_at) >= oneMonthAgo
      ).length,
      lastThreeMonths: contacts.filter(c =>
        !c.unsubscribed && new Date(c.created_at) >= threeMonthsAgo
      ).length,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch subscribers" });
  }
}