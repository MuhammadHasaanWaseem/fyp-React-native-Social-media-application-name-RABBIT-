import { StyleSheet } from "react-native";

const bg = "#0B0B12";
const border = "rgba(255,255,255,0.08)";
const muted = "rgba(255,255,255,0.55)";
const accent = "rgba(255,255,255,0.92)";

export const activityStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: bg },
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    color: accent,
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  subtitle: { color: muted, fontSize: 13, marginTop: 4 },
  divider: { backgroundColor: border, height: 1, marginHorizontal: 16 },
  tabScroll: { paddingVertical: 10, paddingHorizontal: 12, gap: 8 },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: border,
    backgroundColor: "transparent",
  },
  tabChipActive: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.2)",
  },
  tabLabel: { color: muted, fontSize: 13, fontWeight: "500" },
  tabLabelActive: { color: accent, fontWeight: "600" },
});
