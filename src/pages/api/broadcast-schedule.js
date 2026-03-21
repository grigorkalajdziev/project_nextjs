import { database } from "./register";
import { ref, set, get, update } from "firebase/database";

export default async function handler(req, res) {
  // ✅ Authorization check
  const adminSecret = req.headers["x-admin-secret"];
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // GET — fetch current schedule
  if (req.method === "GET") {
    try {
      const snap = await get(ref(database, "schedules/broadcast"));
      return res.status(200).json(snap.exists() ? snap.val() : null);
    } catch (err) {
      console.error("GET error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // POST — create or update schedule
  if (req.method === "POST") {
    try {
      const { subject, period, sendTime } = req.body;

      if (!subject || !period || !sendTime) {
        return res.status(400).json({ error: "subject, period and sendTime are required" });
      }

      const now = new Date();
      const [hours, minutes] = sendTime.split(":").map(Number);

      const firstSend = new Date(now);
      firstSend.setHours(hours, minutes, 0, 0);

      if (firstSend <= now) {
        if (period === "daily")   firstSend.setDate(firstSend.getDate() + 1);
        if (period === "weekly")  firstSend.setDate(firstSend.getDate() + 7);
        if (period === "monthly") firstSend.setMonth(firstSend.getMonth() + 1);
        if (period === "3months") firstSend.setMonth(firstSend.getMonth() + 3);
      }

      await set(ref(database, "schedules/broadcast"), {
        active: true,
        period,
        subject,
        sendTime,
        nextSendAt: firstSend.toISOString(),
        lastSentAt: null,
        createdAt: now.toISOString(),
      });

      return res.status(200).json({
        success: true,
        nextSendAt: firstSend.toISOString(),
      });

    } catch (err) {
      console.error("POST error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // PATCH — toggle active/paused or override nextSendAt
  if (req.method === "PATCH") {
    try {
      const { active, nextSendAt } = req.body;

      const updateData = {};
      if (active !== undefined) updateData.active = active;
      if (nextSendAt !== undefined) updateData.nextSendAt = nextSendAt;

      await update(ref(database, "schedules/broadcast"), updateData);
      return res.status(200).json({ success: true, ...updateData });

    } catch (err) {
      console.error("PATCH error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).end();
}