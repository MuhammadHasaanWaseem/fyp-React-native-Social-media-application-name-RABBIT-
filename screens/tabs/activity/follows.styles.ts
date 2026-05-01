import { StyleSheet } from "react-native";

const bg = "#0B0B12";
const line = "rgba(255,255,255,0.06)";
const muted = "rgba(255,255,255,0.5)";
const text = "rgba(255,255,255,0.92)";

export const followsStyles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: bg },
  center: { flex: 1, backgroundColor: bg, justifyContent: "center", alignItems: "center", padding: 24 },
  list: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 120 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: line,
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 12 },
  name: { color: text, fontSize: 16, fontWeight: "600" },
  meta: { color: muted, fontSize: 13, marginTop: 2 },
  btnPrimary: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  btnPrimaryText: { color: "#0B0B12", fontSize: 13, fontWeight: "600" },
  btnGhost: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "transparent",
  },
  btnGhostText: { color: text, fontSize: 13, fontWeight: "500" },
  emptyTitle: { color: muted, fontSize: 15, textAlign: "center" },
  emptyHint: { color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 8, textAlign: "center" },
});
