import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  CastingNotification,
  NotificationPreferences,
  DEFAULT_PREFERENCES,
} from "@/types/notifications";

// Configure notification handler — show even when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register for push notifications and return the Expo push token.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn("Push notifications require a physical device");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  // iOS-specific notification categories for rich notifications
  if (Platform.OS === "ios") {
    await Notifications.setNotificationCategoryAsync("casting_alert", [
      {
        identifier: "VIEW_DETAILS",
        buttonTitle: "View Details",
        options: { opensAppToForeground: true },
      },
      {
        identifier: "SAVE_FOR_LATER",
        buttonTitle: "Save for Later",
        options: { opensAppToForeground: false },
      },
    ]);
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  return token.data;
}

/**
 * Build a rich notification payload for a casting breakdown.
 */
export function buildCastingNotification(casting: CastingNotification): Notifications.NotificationContentInput {
  const deadlineDate = new Date(casting.deadline);
  const daysLeft = Math.ceil(
    (deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const urgency = daysLeft <= 1 ? "URGENT" : daysLeft <= 3 ? "Soon" : "";

  return {
    title: `${urgency ? `[${urgency}] ` : ""}${casting.roleName}`,
    subtitle: casting.productionTitle,
    body: `${casting.productionType} · ${casting.roleType} · ${casting.unionStatus} · Deadline: ${deadlineDate.toLocaleDateString()}`,
    data: { castingId: casting.id, type: "casting_alert" },
    categoryIdentifier: "casting_alert",
    badge: 1,
  };
}

/**
 * Check if a notification matches the user's preference filters.
 */
export function matchesPreferences(
  casting: CastingNotification,
  prefs: NotificationPreferences
): boolean {
  if (!prefs.roleTypes.includes(casting.roleType)) return false;
  if (!prefs.productionTypes.includes(casting.productionType)) return false;

  if (casting.unionStatus === "SAG-AFTRA" && !prefs.unionStatus.includes("SAG-AFTRA")) return false;
  if (casting.unionStatus === "Non-Union" && !prefs.unionStatus.includes("Non-Union")) return false;

  if (prefs.quietHoursEnabled) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    const { quietHoursStart, quietHoursEnd } = prefs;
    if (quietHoursStart > quietHoursEnd) {
      // Spans midnight (e.g., 22:00 - 07:00)
      if (currentTime >= quietHoursStart || currentTime < quietHoursEnd) return false;
    } else {
      if (currentTime >= quietHoursStart && currentTime < quietHoursEnd) return false;
    }
  }

  return true;
}

/**
 * Smart grouping: group notifications by casting director or production.
 */
export function groupNotifications(
  notifications: CastingNotification[]
): { key: string; label: string; notifications: CastingNotification[]; collapsed: boolean }[] {
  const groups = new Map<string, CastingNotification[]>();

  for (const n of notifications) {
    const key = n.castingDirector || n.productionTitle;
    const existing = groups.get(key) || [];
    existing.push(n);
    groups.set(key, existing);
  }

  return Array.from(groups.entries())
    .map(([key, items]) => ({
      key,
      label: key,
      notifications: items.sort(
        (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
      ),
      collapsed: items.length > 3,
    }))
    .sort((a, b) => {
      const aLatest = new Date(a.notifications[0].receivedAt).getTime();
      const bLatest = new Date(b.notifications[0].receivedAt).getTime();
      return bLatest - aLatest;
    });
}

// Storage keys
const PREFS_KEY = "castalert_notification_prefs";
const HISTORY_KEY = "castalert_notification_history";

export async function savePreferences(prefs: NotificationPreferences): Promise<void> {
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export async function loadPreferences(): Promise<NotificationPreferences | null> {
  const raw = await AsyncStorage.getItem(PREFS_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveNotificationHistory(notifications: CastingNotification[]): Promise<void> {
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(notifications));
}

export async function loadNotificationHistory(): Promise<CastingNotification[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}
