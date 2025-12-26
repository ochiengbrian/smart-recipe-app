import { loadJSON, saveJSON } from "./storage";

function nowMs() {
  return Date.now();
}

// Expires at next local midnight (user’s device timezone)
export function msUntilNextMidnight() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0); // next midnight local time
  return next.getTime() - now.getTime();
}

export function getTodayKey() {
  // YYYY-MM-DD (local)
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function readCache(key) {
  const cached = loadJSON(key, null);
  if (!cached) return null;

  const { expiresAt, data } = cached;
  if (!expiresAt || nowMs() > expiresAt) return null;

  return data;
}

export function writeCache(key, data, ttlMs) {
  saveJSON(key, {
    expiresAt: nowMs() + ttlMs,
    data,
  });
}
