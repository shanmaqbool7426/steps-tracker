import React, { useRef } from "react";
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
import * as Haptics from "expo-haptics";

import { useSteps } from "@/context/StepContext";
import { useColors } from "@/hooks/useColors";
import CircularProgress from "@/components/CircularProgress";
import StatCard from "@/components/StatCard";
import BarChart from "@/components/BarChart";

const MOTIVATIONAL = [
  "Keep moving — every step counts!",
  "You're crushing it today!",
  "Stay consistent, stay healthy.",
  "Movement is medicine.",
];
const quote = MOTIVATIONAL[new Date().getDay() % MOTIVATIONAL.length];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const {
    todaySteps,
    todayGoal,
    calories,
    distance,
    activeMinutes,
    weeklyData,
    streak,
  } = useSteps();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleAddSteps = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const todayIndex = 4;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#1D4ED8", "#3B82F6", "#EBF4FF"]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 12, paddingBottom: Platform.OS === "web" ? 100 : 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.username}>Alex Johnson</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={14} color="#F59E0B" />
              <Text style={styles.streakText}>{streak} day streak</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AJ</Text>
            </View>
          </View>
        </View>

        {/* Ring Card */}
        <View style={styles.ringCard}>
          <View style={styles.ringRow}>
            <CircularProgress steps={todaySteps} goal={todayGoal} size={210} />
            <View style={styles.ringMeta}>
              <View style={styles.metaItem}>
                <Text style={styles.metaValue}>{todayGoal.toLocaleString()}</Text>
                <Text style={styles.metaLabel}>Daily Goal</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.metaItem}>
                <Text style={styles.metaValue}>
                  {Math.max(0, todayGoal - todaySteps).toLocaleString()}
                </Text>
                <Text style={styles.metaLabel}>Steps Left</Text>
              </View>
            </View>
          </View>

          {/* Motivational */}
          <View style={styles.motiveBanner}>
            <Ionicons name="sparkles" size={14} color="#2563EB" />
            <Text style={styles.motiveText}>{quote}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard
            icon="flame-outline"
            iconColor="#EF4444"
            iconBg="rgba(239,68,68,0.1)"
            value={`${calories}`}
            label="Calories"
          />
          <StatCard
            icon="walk-outline"
            iconColor="#2563EB"
            iconBg="rgba(37,99,235,0.1)"
            value={`${distance} km`}
            label="Distance"
          />
          <StatCard
            icon="time-outline"
            iconColor="#22C55E"
            iconBg="rgba(34,197,94,0.1)"
            value={`${activeMinutes}m`}
            label="Active"
          />
        </View>

        {/* Weekly Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Weekly Steps</Text>
            <Text style={styles.chartAvg}>
              Avg{" "}
              {Math.round(
                weeklyData.reduce((a, b) => a + b.steps, 0) / weeklyData.length
              ).toLocaleString()}
            </Text>
          </View>
          <BarChart
            data={weeklyData.map((d) => ({ label: d.date, value: d.steps }))}
            color="#2563EB"
            highlightIndex={todayIndex}
            height={90}
          />
          <View style={styles.chartFooter}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#2563EB" }]} />
              <Text style={styles.legendText}>Today</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "rgba(37,99,235,0.33)" }]} />
              <Text style={styles.legendText}>Other days</Text>
            </View>
          </View>
        </View>

        {/* Quick Add */}
        <View style={styles.quickRow}>
          {[500, 1000, 2000].map((n) => (
            <Pressable
              key={n}
              style={({ pressed }) => [
                styles.quickBtn,
                pressed && { opacity: 0.75, transform: [{ scale: 0.97 }] },
              ]}
              onPress={handleAddSteps}
            >
              <LinearGradient
                colors={["#1D4ED8", "#3B82F6"]}
                style={styles.quickGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="add" size={14} color="#fff" />
                <Text style={styles.quickText}>+{n}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 14 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    fontFamily: "Inter_400Regular",
  },
  username: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },

  ringCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  ringRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ringMeta: { flex: 1, alignItems: "center", gap: 16, paddingLeft: 12 },
  metaItem: { alignItems: "center" },
  metaValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    fontFamily: "Inter_700Bold",
  },
  metaLabel: {
    fontSize: 12,
    color: "#64748B",
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  divider: { width: 40, height: 1, backgroundColor: "#DBEAFE" },

  motiveBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
  },
  motiveText: {
    fontSize: 13,
    color: "#1D4ED8",
    fontFamily: "Inter_500Medium",
    flex: 1,
  },

  statsRow: { flexDirection: "row", gap: 10 },

  chartCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    fontFamily: "Inter_700Bold",
  },
  chartAvg: { fontSize: 13, color: "#64748B", fontFamily: "Inter_500Medium" },
  chartFooter: {
    flexDirection: "row",
    gap: 16,
    marginTop: 10,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: "#64748B", fontFamily: "Inter_400Regular" },

  quickRow: { flexDirection: "row", gap: 10 },
  quickBtn: { flex: 1, borderRadius: 14, overflow: "hidden" },
  quickGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 4,
  },
  quickText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
});
