import type { CastingNotification } from "../types/notifications";

export function filterNotifications(
  notifications: CastingNotification[],
  query: string
): CastingNotification[] {
  const q = query.trim().toLowerCase();
  if (!q) return notifications;

  return notifications.filter(
    (n) =>
      n.roleName.toLowerCase().includes(q) ||
      n.productionTitle.toLowerCase().includes(q) ||
      (n.castingDirector?.toLowerCase().includes(q) ?? false)
  );
}
