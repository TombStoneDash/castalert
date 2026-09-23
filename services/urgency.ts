export type UrgencyLabel = "URGENT" | "Soon" | "Closed" | "";

const DAY_MS = 1000 * 60 * 60 * 24;

/**
 * Label a casting deadline relative to `now`. Pure — no platform imports.
 */
export function getUrgencyLabel(
  deadline: string,
  now: number = Date.now()
): UrgencyLabel {
  const deadlineMs = new Date(deadline).getTime();
  if (Number.isNaN(deadlineMs)) return "";
  if (deadlineMs < now) return "Closed";

  const daysLeft = Math.ceil((deadlineMs - now) / DAY_MS);
  return daysLeft <= 1 ? "URGENT" : daysLeft <= 3 ? "Soon" : "";
}
