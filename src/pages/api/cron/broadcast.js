import { database } from "../register";
import { ref, get, update } from "firebase/database";
import { Resend } from "resend";
import ReactDOMServer from "react-dom/server";
import SubscribeResendEmail_MK from "../../../components/Newsletter/SubscribeResendEmail_MK";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).end();
  }

  // ✅ Authorization check
  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const scheduleRef = ref(database, "schedules/broadcast");
    const snap = await get(scheduleRef);
    console.log("Schedule exists:", snap.exists());
    console.log("Schedule:", snap.val());

    if (!snap.exists()) {
      return res.status(200).json({ message: "No schedule configured" });
    }

    const schedule = snap.val();

    if (!schedule.active) {
      return res.status(200).json({ message: "Schedule is paused" });
    }

    const now = new Date();
    const nextSendAt = new Date(schedule.nextSendAt);

    if (now < nextSendAt) {
      return res.status(200).json({
        message: "Not time yet",
        nextSendAt: schedule.nextSendAt,
      });
    }

    // Fetch all active contacts
    const { data: contactData, error: contactError } = await resend.contacts.list();
    console.log("Contacts fetched:", contactData?.data?.length);

    if (contactError) throw new Error(contactError.message);

    const emails = (contactData?.data || [])
      .filter(c => !c.unsubscribed)
      .map(c => c.email);

    console.log("Active emails:", emails.length);

    if (emails.length === 0) {
      return res.status(200).json({ message: "No active subscribers" });
    }

    // Render email HTML
    const html = ReactDOMServer.renderToStaticMarkup(<SubscribeResendEmail_MK />);

    // Send in batches of 50
    const batchSize = 50;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      console.log(`Sending batch ${i / batchSize + 1}:`, batch);

      const { error: sendError } = await resend.emails.send({
        from: "newsletter@kikamakeupandbeautyacademy.com",
        to: batch,
        subject: schedule.subject,
        html,
      });

      if (sendError) {
        failCount += batch.length;
        console.error("Batch send error:", sendError);
      } else {
        successCount += batch.length;
        console.log(`Batch sent successfully to ${batch.length} emails`);
      }
    }

    // ✅ Calculate next send date using configured sendTime
    const [hours, minutes] = schedule.sendTime.split(":").map(Number);
    const nextDate = new Date(now);
    if (schedule.period === "daily")   nextDate.setDate(nextDate.getDate() + 1);
    if (schedule.period === "weekly")  nextDate.setDate(nextDate.getDate() + 7);
    if (schedule.period === "monthly") nextDate.setMonth(nextDate.getMonth() + 1);
    if (schedule.period === "3months") nextDate.setMonth(nextDate.getMonth() + 3);
    // ✅ Always set to exact configured time
    nextDate.setHours(hours, minutes, 0, 0);

    // Update Firebase with last sent + next send
    await update(scheduleRef, {
      lastSentAt: now.toISOString(),
      nextSendAt: nextDate.toISOString(),
    });

    console.log("Done! successCount:", successCount, "failCount:", failCount);

    return res.status(200).json({
      success: true,
      successCount,
      failCount,
      nextSendAt: nextDate.toISOString(),
    });

  } catch (err) {
    console.error("Cron error:", err);
    return res.status(500).json({ error: err.message });
  }
}