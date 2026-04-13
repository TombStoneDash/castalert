import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import {
  loadNotificationHistory,
  saveNotificationHistory,
  groupNotifications,
} from "@/services/push";
import type { CastingNotification, NotificationGroup } from "@/types/notifications";

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<CastingNotification[]>([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadNotificationHistory().then(setNotifications);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const history = await loadNotificationHistory();
    setNotifications(history);
    setRefreshing(false);
  }, []);

  function toggleRead(id: string) {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === id ? { ...n, read: !n.read } : n
      );
      saveNotificationHistory(updated);
      return updated;
    });
  }

  function toggleSaved(id: string) {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === id ? { ...n, saved: !n.saved } : n
      );
      saveNotificationHistory(updated);
      return updated;
    });
  }

  function toggleGroup(key: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const filtered = notifications.filter(
    (n) =>
      !search ||
      n.roleName.toLowerCase().includes(search.toLowerCase()) ||
      n.productionTitle.toLowerCase().includes(search.toLowerCase()) ||
      n.castingDirector?.toLowerCase().includes(search.toLowerCase())
  );

  const groups = groupNotifications(filtered);

  function renderGroup(group: NotificationGroup) {
    const isExpanded = expandedGroups.has(group.key) || group.notifications.length <= 3;
    const displayItems = isExpanded ? group.notifications : group.notifications.slice(0, 3);

    return (
      <View key={group.key} style={styles.group}>
        <TouchableOpacity
          onPress={() => toggleGroup(group.key)}
          style={styles.groupHeader}
        >
          <Text style={styles.groupLabel}>{group.label}</Text>
          <Text style={styles.groupCount}>
            {group.notifications.length} alert{group.notifications.length !== 1 ? "s" : ""}
          </Text>
        </TouchableOpacity>

        {displayItems.map((n) => (
          <TouchableOpacity
            key={n.id}
            style={[styles.card, n.read && styles.cardRead]}
            onPress={() => toggleRead(n.id)}
            onLongPress={() => toggleSaved(n.id)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.productionType}>{n.productionType}</Text>
              {n.saved && <Text style={styles.savedBadge}>Saved</Text>}
              {!n.read && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.roleName}>{n.roleName}</Text>
            <Text style={styles.production}>{n.productionTitle}</Text>
            <View style={styles.meta}>
              <Text style={styles.metaText}>{n.roleType}</Text>
              <Text style={styles.metaDot}>&middot;</Text>
              <Text style={styles.metaText}>{n.unionStatus}</Text>
              <Text style={styles.metaDot}>&middot;</Text>
              <Text style={styles.deadline}>
                Due {new Date(n.deadline).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {!isExpanded && group.notifications.length > 3 && (
          <TouchableOpacity
            style={styles.showMore}
            onPress={() => toggleGroup(group.key)}
          >
            <Text style={styles.showMoreText}>
              Show {group.notifications.length - 3} more
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      <TextInput
        style={styles.search}
        placeholder="Search castings..."
        placeholderTextColor="#ffffff30"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={groups}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => renderGroup(item)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2E8B57" />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No notifications yet.</Text>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0f1a", paddingTop: 60 },
  title: { color: "#F8F9FA", fontSize: 28, fontWeight: "bold", fontFamily: "monospace", paddingHorizontal: 20, marginBottom: 16 },
  search: { backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginHorizontal: 20, marginBottom: 16, color: "#fff", fontFamily: "monospace", fontSize: 14 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  group: { marginBottom: 24 },
  groupHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  groupLabel: { color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 },
  groupCount: { color: "rgba(255,255,255,0.2)", fontFamily: "monospace", fontSize: 10 },
  card: { backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 8 },
  cardRead: { opacity: 0.6 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  productionType: { color: "#2E8B57", fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 },
  savedBadge: { color: "#F59E0B", fontFamily: "monospace", fontSize: 9, backgroundColor: "rgba(245,158,11,0.1)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: "hidden" },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#2E8B57", marginLeft: "auto" },
  roleName: { color: "#F8F9FA", fontFamily: "monospace", fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  production: { color: "rgba(255,255,255,0.6)", fontFamily: "monospace", fontSize: 13, marginBottom: 8 },
  meta: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { color: "rgba(255,255,255,0.3)", fontFamily: "monospace", fontSize: 11 },
  metaDot: { color: "rgba(255,255,255,0.15)", fontSize: 11 },
  deadline: { color: "rgba(255,255,255,0.3)", fontFamily: "monospace", fontSize: 11 },
  showMore: { paddingVertical: 8, alignItems: "center" },
  showMoreText: { color: "#2E8B57", fontFamily: "monospace", fontSize: 12 },
  empty: { color: "rgba(255,255,255,0.2)", fontFamily: "monospace", fontSize: 14, textAlign: "center", marginTop: 60 },
});
