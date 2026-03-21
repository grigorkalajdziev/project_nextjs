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

  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }  

  try {
    const scheduleRef = ref(database, "schedules/broadcast");
    const snap = await get(scheduleRef);

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

    // ✅ Render email HTML
    const html = ReactDOMServer.renderToStaticMarkup(<SubscribeResendEmail_MK />);

    // ✅ Step 1 — Create broadcast
    const { data: broadcastData, error: createError } = await resend.broadcasts.create({
      audienceId: process.env.RESEND_SEGMENT_ID,
      from: "newsletter@kikamakeupandbeautyacademy.com",
      subject: schedule.subject,
      html,
    });

    if (createError) {
      console.error("Create broadcast error:", createError);
      throw new Error(createError.message);
    }

    console.log("Broadcast created:", broadcastData.id);

    // ✅ Step 2 — Send broadcast
    const { data: sendData, error: sendError } = await resend.broadcasts.send(
      broadcastData.id
    );

    if (sendError) {
      console.error("Send broadcast error:", sendError);
      // ✅ Clean up draft if send fails
      await resend.broadcasts.remove(broadcastData.id);
      throw new Error(sendError.message);
    }

    console.log("Broadcast sent:", sendData);

    // ✅ Calculate next send date using configured sendTime
    const [hours, minutes] = schedule.sendTime.split(":").map(Number);
    const nextDate = new Date(now);
    if (schedule.period === "daily")   nextDate.setDate(nextDate.getDate() + 1);
    if (schedule.period === "weekly")  nextDate.setDate(nextDate.getDate() + 7);
    if (schedule.period === "monthly") nextDate.setMonth(nextDate.getMonth() + 1);
    if (schedule.period === "3months") nextDate.setMonth(nextDate.getMonth() + 3);
    nextDate.setHours(hours, minutes, 0, 0);

    // ✅ Update Firebase
    await update(scheduleRef, {
      lastSentAt: now.toISOString(),
      nextSendAt: nextDate.toISOString(),
      lastBroadcastId: broadcastData.id,
    });

    return res.status(200).json({
      success: true,
      broadcastId: broadcastData.id,
      nextSendAt: nextDate.toISOString(),
    });

  } catch (err) {
    console.error("Cron error:", err);
    return res.status(500).json({ error: err.message });
  }
}