import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useSteps } from "@/context/StepContext";
import BarChart from "@/components/BarChart";

type Period = "Day" | "Week" | "Month";

const PERIODS: Period[] = ["Day", "Week", "Month"];

const HOUR_DATA = Array.from({ length: 12 }, (_, i) => ({
  label: `${(i * 2) % 12 || 12}${i < 6 ? "a" : "p"}`,
  value: Math.floor(Math.random() * 800 + 100),
}));

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { weeklyData, monthlyData } = useSteps();
  const [period, setPeriod] = useState<Period>("Week");

  const chartData =
    period === "Day"
      ? HOUR_DATA
      : period === "Week"
      ? weeklyData.map((d) => ({ label: d.date, value: d.steps }))
      : monthlyData
          .filter((_, i) => i % 3 === 0)
          .map((d) => ({ label: d.date, value: d.steps }));

  const totalSteps =
    period === "Day"
      ? HOUR_DATA.reduce((a, b) => a + b.value, 0)
      : period === "Week"
      ? weeklyData.reduce((a, b) => a + b.steps, 0)
      : monthlyData.reduce((a, b) => a + b.steps, 0);

  const avgSteps = Math.round(
    totalSteps / (period === "Day" ? 12 : period === "Week" ? 7 : 30)
  );

  const totalCal =
    period === "Week"
      ? weeklyData.reduce((a, b) => a + b.calories, 0)
      : period === "Month"
      ? monthlyData.reduce((a, b) => a + b.calories, 0)
      : Math.round(totalSteps * 0.05);

  const totalDist =
    period === "Week"
      ? weeklyData.reduce((a, b) => a + b.distance, 0).toFixed(1)
      : period === "Month"
      ? monthlyData.reduce((a, b) => a + b.distance, 0).toFixed(1)
      : (totalSteps * 0.0008).toFixed(1);

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
        <Text style={styles.screenTitle}>Analytics</Text>

        {/* Period Selector */}
        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <Pressable
              key={p}
              style={[styles.periodBtn, period === p && styles.periodActive]}
              onPress={() => setPeriod(p)}
            >
              <Text
                style={[
                  styles.periodText,
                  period === p && styles.periodTextActive,
                ]}
              >
                {p}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Main Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Step History</Text>
          <Text style={styles.chartSub}>
            Total: {totalSteps.toLocaleString()} steps
          </Text>
          <View style={{ marginTop: 16 }}>
            <BarChart
              data={chartData}
              color="#2563EB"
              height={130}
            />
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <SummaryCard
            icon="footsteps-outline"
            color="#2563EB"
            label="Avg Steps"
            value={avgSteps.toLocaleString()}
            unit="/day"
          />
          <SummaryCard
            icon="flame-outline"
            color="#EF4444"
            label="Total Calories"
            value={totalCal.toLocaleString()}
            unit="kcal"
          />
          <SummaryCard
            icon="map-outline"
            color="#22C55E"
            label="Total Distance"
            value={`${totalDist}`}
            unit="km"
          />
          <SummaryCard
            icon="trending-up-outline"
            color="#F59E0B"
            label="Best Day"
            value={Math.max(...chartData.map((d) => d.value)).toLocaleString()}
            unit="steps"
          />
        </View>

        {/* History List */}
        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Daily Breakdown</Text>
          {(period === "Week" ? weeklyData : weeklyData).map((d, i) => (
            <View key={d.date} style={styles.historyRow}>
              <View style={styles.historyLeft}>
                <View
                  style={[
                    styles.historyDot,
                    { backgroundColor: i === 4 ? "#2563EB" : "#DBEAFE" },
                  ]}
                />
                <Text style={styles.historyDay}>{d.date}</Text>
              </View>
              <View style={styles.historyBar}>
                <View
                  style={[
                    styles.historyFill,
                    { width: `${Math.min((d.steps / 12000) * 100, 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.historySteps}>
                {d.steps.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function SummaryCard({
  icon,
  color,
  label,
  value,
  unit,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <View style={sStyles.card}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={sStyles.value}>{value}</Text>
      <Text style={sStyles.unit}>{unit}</Text>
      <Text style={sStyles.label}>{label}</Text>
    </View>
  );
}

const sStyles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    fontFamily: "Inter_700Bold",
    marginTop: 8,
  },
  unit: { fontSize: 12, color: "#64748B", fontFamily: "Inter_400Regular" },
  label: {
    fontSize: 13,
    color: "#64748B",
    fontFamily: "Inter_500Medium",
    marginTop: 4,
  },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 14 },

  screenTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },

  periodRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  periodActive: { backgroundColor: "#FFFFFF" },
  periodText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_600SemiBold",
  },
  periodTextActive: { color: "#1D4ED8" },

  chartCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    fontFamily: "Inter_700Bold",
  },
  chartSub: {
    fontSize: 13,
    color: "#64748B",
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },

  historyCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    padding: 18,
    gap: 12,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: 52,
  },
  historyDot: { width: 8, height: 8, borderRadius: 4 },
  historyDay: {
    fontSize: 13,
    color: "#64748B",
    fontFamily: "Inter_500Medium",
  },
  historyBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#DBEAFE",
    borderRadius: 4,
    overflow: "hidden",
  },
  historyFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 4,
  },
  historySteps: {
    fontSize: 13,
    color: "#0F172A",
    fontFamily: "Inter_600SemiBold",
    width: 52,
    textAlign: "right",
  },
});
