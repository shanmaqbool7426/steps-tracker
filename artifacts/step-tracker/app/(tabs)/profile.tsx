import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSteps } from "@/context/StepContext";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { userProfile, weeklyData, streak, xp, level } = useSteps();

  const bmi = (userProfile.weight / Math.pow(userProfile.height / 100, 2)).toFixed(1);
  const bmiCategory =
    parseFloat(bmi) < 18.5
      ? "Underweight"
      : parseFloat(bmi) < 25
      ? "Normal"
      : parseFloat(bmi) < 30
      ? "Overweight"
      : "Obese";

  const totalSteps = weeklyData.reduce((a, b) => a + b.steps, 0);
  const totalDist = weeklyData.reduce((a, b) => a + b.distance, 0).toFixed(1);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#1D4ED8", "#3B82F6", "#EBF4FF"]}
        locations={[0, 0.35, 1]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: topPad + 12,
            paddingBottom: Platform.OS === "web" ? 100 : 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userProfile.name.split(" ").map((n) => n[0]).join("")}
              </Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lv.{level}</Text>
            </View>
          </View>
          <Text style={styles.name}>{userProfile.name}</Text>
          <Text style={styles.since}>Member since {userProfile.memberSince}</Text>
          <View style={styles.profileStats}>
            <View style={styles.pStat}>
              <Text style={styles.pStatVal}>{totalSteps.toLocaleString()}</Text>
              <Text style={styles.pStatLabel}>This Week</Text>
            </View>
            <View style={styles.pDivider} />
            <View style={styles.pStat}>
              <Text style={styles.pStatVal}>{streak}</Text>
              <Text style={styles.pStatLabel}>Day Streak</Text>
            </View>
            <View style={styles.pDivider} />
            <View style={styles.pStat}>
              <Text style={styles.pStatVal}>{totalDist} km</Text>
              <Text style={styles.pStatLabel}>Distance</Text>
            </View>
          </View>
        </View>

        {/* Body Stats */}
        <View style={styles.bodyCard}>
          <Text style={styles.sectionTitle}>Body Stats</Text>
          <View style={styles.bodyGrid}>
            <BodyStat label="Height" value={`${userProfile.height}`} unit="cm" icon="resize-outline" />
            <BodyStat label="Weight" value={`${userProfile.weight}`} unit="kg" icon="barbell-outline" />
            <BodyStat label="Age" value={`${userProfile.age}`} unit="yrs" icon="person-outline" />
            <View style={[styles.bodyStatCard, styles.bmiCard]}>
              <View style={styles.bmiInner}>
                <Ionicons name="analytics-outline" size={20} color="#2563EB" />
                <Text style={styles.bmiValue}>{bmi}</Text>
                <Text style={styles.bmiUnit}>BMI</Text>
              </View>
              <View
                style={[
                  styles.bmiTag,
                  {
                    backgroundColor:
                      bmiCategory === "Normal"
                        ? "#DCFCE7"
                        : bmiCategory === "Overweight"
                        ? "#FEF3C7"
                        : "#FEE2E2",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.bmiTagText,
                    {
                      color:
                        bmiCategory === "Normal"
                          ? "#16A34A"
                          : bmiCategory === "Overweight"
                          ? "#D97706"
                          : "#DC2626",
                    },
                  ]}
                >
                  {bmiCategory}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Premium Card */}
        <View style={styles.premiumCard}>
          <LinearGradient
            colors={["#1E3A8A", "#1D4ED8"]}
            style={StyleSheet.absoluteFill}
            borderRadius={22}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.premiumHeader}>
            <Ionicons name="star" size={24} color="#F59E0B" />
            <Text style={styles.premiumTitle}>StepX Premium</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>PRO</Text>
            </View>
          </View>
          <Text style={styles.premiumSub}>
            Unlock AI insights, advanced analytics, and cloud sync.
          </Text>
          <View style={styles.premiumFeatures}>
            {["AI Health Coach", "Detailed Reports", "Cloud Sync", "No Ads"].map((f) => (
              <View key={f} style={styles.premiumFeature}>
                <Ionicons name="checkmark-circle" size={16} color="#60A5FA" />
                <Text style={styles.premiumFeatureText}>{f}</Text>
              </View>
            ))}
          </View>
          <Pressable
            style={({ pressed }) => [styles.upgradeBtn, pressed && { opacity: 0.85 }]}
          >
            <LinearGradient
              colors={["#F59E0B", "#D97706"]}
              style={styles.upgradeBtnGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.upgradeBtnText}>Upgrade — $4.99/mo</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {[
            { icon: "notifications-outline" as const, label: "Notifications" },
            { icon: "flag-outline" as const, label: "Daily Goal" },
            { icon: "color-palette-outline" as const, label: "Theme" },
            { icon: "share-outline" as const, label: "Share Progress" },
            { icon: "help-circle-outline" as const, label: "Help & Support" },
          ].map((item, i, arr) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.settingRow,
                pressed && { backgroundColor: "#EFF6FF" },
                i < arr.length - 1 && styles.settingBorder,
              ]}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconWrap}>
                  <Ionicons name={item.icon} size={18} color="#2563EB" />
                </View>
                <Text style={styles.settingLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function BodyStat({
  label,
  value,
  unit,
  icon,
}: {
  label: string;
  value: string;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.bodyStatCard}>
      <Ionicons name={icon} size={20} color="#2563EB" />
      <Text style={styles.bodyVal}>{value}</Text>
      <Text style={styles.bodyUnit}>{unit}</Text>
      <Text style={styles.bodyLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 14 },

  profileCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 5,
  },
  avatarWrap: { position: "relative", marginBottom: 12 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1D4ED8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(37,99,235,0.3)",
  },
  avatarText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
  levelBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#F59E0B",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  levelText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    fontFamily: "Inter_700Bold",
  },
  since: {
    fontSize: 13,
    color: "#64748B",
    fontFamily: "Inter_400Regular",
    marginTop: 2,
    marginBottom: 16,
  },
  profileStats: { flexDirection: "row", gap: 20 },
  pStat: { alignItems: "center" },
  pStatVal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    fontFamily: "Inter_700Bold",
  },
  pStatLabel: { fontSize: 12, color: "#64748B", fontFamily: "Inter_400Regular" },
  pDivider: { width: 1, height: 32, backgroundColor: "#E2E8F0" },

  bodyCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    fontFamily: "Inter_700Bold",
  },
  bodyGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "space-between" },
  bodyStatCard: {
    width: "47%",
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 14,
    gap: 4,
    alignItems: "flex-start",
  },
  bmiCard: { flexDirection: "column" },
  bmiInner: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  bodyVal: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    fontFamily: "Inter_700Bold",
  },
  bodyUnit: { fontSize: 12, color: "#64748B", fontFamily: "Inter_400Regular" },
  bodyLabel: { fontSize: 13, color: "#64748B", fontFamily: "Inter_500Medium" },
  bmiValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    fontFamily: "Inter_700Bold",
  },
  bmiUnit: { fontSize: 12, color: "#64748B", fontFamily: "Inter_400Regular" },
  bmiTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 4 },
  bmiTagText: { fontSize: 12, fontWeight: "600", fontFamily: "Inter_600SemiBold" },

  premiumCard: {
    borderRadius: 22,
    padding: 20,
    overflow: "hidden",
    gap: 12,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  premiumHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  premiumTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    flex: 1,
  },
  premiumBadge: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  premiumBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
  premiumSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  premiumFeatures: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  premiumFeature: { flexDirection: "row", alignItems: "center", gap: 5 },
  premiumFeatureText: { fontSize: 13, color: "#FFFFFF", fontFamily: "Inter_500Medium" },
  upgradeBtn: { borderRadius: 14, overflow: "hidden", marginTop: 4 },
  upgradeBtnGrad: { paddingVertical: 14, alignItems: "center", borderRadius: 14 },
  upgradeBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },

  settingsCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    gap: 4,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 4,
  },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  settingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: { fontSize: 15, color: "#0F172A", fontFamily: "Inter_500Medium" },
  settingBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
});
