import { database, ref, push } from "../api/register";

// Cache IP so we don't fetch it on every single log call
let cachedIp = "";

async function getClientIp() {
  if (cachedIp) return cachedIp;
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    cachedIp = data.ip || "";
    return cachedIp;
  } catch {
    return "";
  }
}

export async function logActivity({ username, userId, action, details = "", ip = "" }) {
  try {
    // Auto-fetch IP if not provided
    const resolvedIp = ip || await getClientIp();

    await push(ref(database, "activityLogs"), {
      username,
      userId,
      action,
      details,
      ip: resolvedIp,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("logActivity error:", error);
  }
}

export default function LogActivityUtil() { return null; }