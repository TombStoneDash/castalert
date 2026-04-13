import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  loadPreferences,
  savePreferences,
} from "@/services/push";
import {
  DEFAULT_PREFERENCES,
  type NotificationPreferences,
  type RoleType,
  type ProductionType,
  type UnionStatus,
} from "@/types/notifications";

const ROLE_TYPES: RoleType[] = ["Lead", "Supporting", "Background", "Voice", "Stunt", "Stand-In"];
const PRODUCTION_TYPES: ProductionType[] = ["Film", "TV", "Commercial", "Theater", "Voice", "Music Video", "New Media"];
const UNION_OPTIONS: UnionStatus[] = ["SAG-AFTRA", "Non-Union", "Both"];

function ToggleChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function NotificationPreferencesScreen() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadPreferences().then((p) => {
      if (p) setPrefs(p);
    });
  }, []);

  function toggleArrayItem<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  }

  function updatePrefs(partial: Partial<NotificationPreferences>) {
    setPrefs((prev) => ({ ...prev, ...partial }));
    setSaved(false);
  }

  async function handleSave() {
    await savePreferences(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Notification Preferences</Text>
      <Text style={styles.subtitle}>
        Filter which casting alerts you receive.
      </Text>

      {/* Role Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Role Types</Text>
        <View style={styles.chipRow}>
          {ROLE_TYPES.map((role) => (
            <ToggleChip
              key={role}
              label={role}
              active={prefs.roleTypes.includes(role)}
              onPress={() =>
                updatePrefs({ roleTypes: toggleArrayItem(prefs.roleTypes, role) })
              }
            />
          ))}
        </View>
      </View>

      {/* Production Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Production Types</Text>
        <View style={styles.chipRow}>
          {PRODUCTION_TYPES.map((type) => (
            <ToggleChip
              key={type}
              label={type}
              active={prefs.productionTypes.includes(type)}
              onPress={() =>
                updatePrefs({
                  productionTypes: toggleArrayItem(prefs.productionTypes, type),
                })
              }
            />
          ))}
        </View>
      </View>

      {/* Union Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Union Status</Text>
        <View style={styles.chipRow}>
          {UNION_OPTIONS.map((status) => (
            <ToggleChip
              key={status}
              label={status}
              active={prefs.unionStatus.includes(status)}
              onPress={() =>
                updatePrefs({
                  unionStatus: toggleArrayItem(prefs.unionStatus, status),
                })
              }
            />
          ))}
        </View>
      </View>

      {/* Quiet Hours */}
      <View style={styles.section}>
        <View style={styles.quietRow}>
          <View>
            <Text style={styles.sectionTitle}>Quiet Hours</Text>
            <Text style={styles.quietDesc}>
              {prefs.quietHoursStart} – {prefs.quietHoursEnd}
            </Text>
          </View>
          <Switch
            value={prefs.quietHoursEnabled}
            onValueChange={(v) => updatePrefs({ quietHoursEnabled: v })}
            trackColor={{ false: "rgba(255,255,255,0.1)", true: "#2E8B57" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Save */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>{saved ? "Saved" : "Save Preferences"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0f1a" },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  title: { color: "#F8F9FA", fontSize: 28, fontWeight: "bold", fontFamily: "monospace", marginBottom: 8 },
  subtitle: { color: "rgba(255,255,255,0.4)", fontFamily: "monospace", fontSize: 13, marginBottom: 32 },
  section: { marginBottom: 32 },
  sectionTitle: { color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.02)" },
  chipActive: { borderColor: "#2E8B57", backgroundColor: "rgba(46,139,87,0.1)" },
  chipText: { color: "rgba(255,255,255,0.3)", fontFamily: "monospace", fontSize: 12 },
  chipTextActive: { color: "#2E8B57" },
  quietRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  quietDesc: { color: "rgba(255,255,255,0.3)", fontFamily: "monospace", fontSize: 12, marginTop: 4 },
  saveButton: { backgroundColor: "#2E8B57", paddingVertical: 14, borderRadius: 10, alignItems: "center", marginTop: 16 },
  saveText: { color: "#fff", fontFamily: "monospace", fontSize: 14, fontWeight: "bold" },
});
