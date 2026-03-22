import { database } from "./register";
import { ref, set, get, update } from "firebase/database";

export default async function handler(req, res) {
  
  const adminSecret = req.headers["x-admin-secret"];
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  if (req.method === "GET") {
    try {
      const snap = await get(ref(database, "schedules/broadcast"));
      return res.status(200).json(snap.exists() ? snap.val() : null);
    } catch (err) {
      console.error("GET error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
 
  if (req.method === "POST") {
    try {
      const { subject, period, sendTime } = req.body;

      if (!subject || !period || !sendTime) {
        return res.status(400).json({ error: "subject, period and sendTime are required" });
      }

      const now = new Date();
      const [hours, minutes] = sendTime.split(":").map(Number);

      const firstSend = new Date(now);
      firstSend.setUTCHours(hours, minutes, 0, 0);

      if (firstSend <= now) {
        if (period === "daily")   firstSend.setUTCDate(firstSend.getUTCDate() + 1);
        if (period === "weekly")  firstSend.setUTCDate(firstSend.getUTCDate() + 7);
        if (period === "monthly") firstSend.setUTCMonth(firstSend.getUTCMonth() + 1);
        if (period === "3months") firstSend.setUTCMonth(firstSend.getUTCMonth() + 3);
      }
      
      const existingSnap = await get(ref(database, "schedules/broadcast"));
      const existing = existingSnap.exists() ? existingSnap.val() : {};

      await set(ref(database, "schedules/broadcast"), {
        active: true,
        period,
        subject,
        sendTime,
        nextSendAt: firstSend.toISOString(),
        lastSentAt: existing.lastSentAt || null, 
        createdAt: existing.createdAt || now.toISOString(), 
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