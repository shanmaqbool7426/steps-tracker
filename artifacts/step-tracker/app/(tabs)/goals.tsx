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
import * as Haptics from "expo-haptics";

import { useSteps } from "@/context/StepContext";

export default function GoalsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { todaySteps, todayGoal, achievements, streak, xp, level } = useSteps();

  const progress = Math.min(todaySteps / todayGoal, 1);
  const xpForNext = level * 500;
  const xpProgress = (xp % 500) / 500;

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
        <Text style={styles.screenTitle}>Goals</Text>

        {/* XP Level Card */}
        <View style={styles.levelCard}>
          <LinearGradient
            colors={["#1D4ED8", "#1E40AF"]}
            style={StyleSheet.absoluteFill}
            borderRadius={22}
          />
          <View style={styles.levelHeader}>
            <View>
              <Text style={styles.levelLabel}>Level {level}</Text>
              <Text style={styles.levelSub}>Walker</Text>
            </View>
            <View style={styles.xpBadge}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.xpText}>{xp.toLocaleString()} XP</Text>
            </View>
          </View>
          <View style={styles.xpBarTrack}>
            <View
              style={[styles.xpBarFill, { width: `${xpProgress * 100}%` }]}
            />
          </View>
          <View style={styles.xpLabels}>
            <Text style={styles.xpLabelText}>{(xp % 500).toLocaleString()} XP</Text>
            <Text style={styles.xpLabelText}>
              {xpForNext.toLocaleString()} XP
            </Text>
          </View>
        </View>

        {/* Daily Goal Card */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>Daily Goal</Text>
            <Text style={styles.goalSteps}>
              {todaySteps.toLocaleString()} / {todayGoal.toLocaleString()}
            </Text>
          </View>
          <View style={styles.goalBarTrack}>
            <LinearGradient
              colors={["#60A5FA", "#1D4ED8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.goalBarFill, { width: `${progress * 100}%` }]}
            />
          </View>
          <Text style={styles.goalPct}>{Math.round(progress * 100)}% complete</Text>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakLeft}>
            <Ionicons name="flame" size={36} color="#F59E0B" />
            <View>
              <Text style={styles.streakNum}>{streak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>
          <View style={styles.streakDays}>
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <View
                key={i}
                style={[
                  styles.dayCircle,
                  i < streak % 7 && styles.dayActive,
                ]}
              >
                <Text
                  style={[styles.dayText, i < streak % 7 && styles.dayTextActive]}
                >
                  {d}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.badgesGrid}>
          {achievements.map((a) => (
            <Pressable
              key={a.id}
              style={({ pressed }) => [
                styles.badge,
                !a.unlocked && styles.badgeLocked,
                pressed && { transform: [{ scale: 0.96 }] },
              ]}
              onPress={() => {
                if (a.unlocked) {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                  );
                }
              }}
            >
              {a.unlocked && (
                <LinearGradient
                  colors={["#EFF6FF", "#DBEAFE"]}
                  style={StyleSheet.absoluteFill}
                  borderRadius={18}
                />
              )}
              <View
                style={[
                  styles.badgeIconWrap,
                  { backgroundColor: a.unlocked ? "rgba(37,99,235,0.12)" : "#F1F5F9" },
                ]}
              >
                <Ionicons
                  name={a.icon as keyof typeof Ionicons.glyphMap}
                  size={26}
                  color={a.unlocked ? "#2563EB" : "#94A3B8"}
                />
              </View>
              <Text style={[styles.badgeTitle, !a.unlocked && styles.badgeTitleLocked]}>
                {a.title}
              </Text>
              <Text style={styles.badgeDesc} numberOfLines={2}>
                {a.description}
              </Text>
              {a.unlocked ? (
                <View style={styles.xpPill}>
                  <Ionicons name="star" size={10} color="#F59E0B" />
                  <Text style={styles.xpPillText}>+{a.xpReward} XP</Text>
                </View>
              ) : (
                <View style={styles.lockPill}>
                  <Ionicons name="lock-closed" size={10} color="#94A3B8" />
                  <Text style={styles.lockPillText}>Locked</Text>
                </View>
              )}
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

  screenTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },

  levelCard: {
    borderRadius: 22,
    padding: 20,
    overflow: "hidden",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  levelLabel: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
  levelSub: { fontSize: 13, color: "rgba(255,255,255,0.65)", fontFamily: "Inter_400Regular" },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  xpText: { fontSize: 13, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  xpBarTrack: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  xpBarFill: {
    height: "100%",
    backgroundColor: "#F59E0B",
    borderRadius: 4,
  },
  xpLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  xpLabelText: { fontSize: 11, color: "rgba(255,255,255,0.65)", fontFamily: "Inter_400Regular" },

  goalCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    fontFamily: "Inter_700Bold",
  },
  goalSteps: { fontSize: 14, color: "#64748B", fontFamily: "Inter_500Medium" },
  goalBarTrack: {
    height: 12,
    backgroundColor: "#DBEAFE",
    borderRadius: 6,
    overflow: "hidden",
  },
  goalBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  goalPct: {
    fontSize: 12,
    color: "#2563EB",
    fontFamily: "Inter_600SemiBold",
    marginTop: 6,
    textAlign: "right",
  },

  streakCard: {
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
  streakLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  streakNum: {
    fontSize: 36,
    fontWeight: "800",
    color: "#F59E0B",
    fontFamily: "Inter_700Bold",
  },
  streakLabel: { fontSize: 14, color: "#64748B", fontFamily: "Inter_500Medium" },
  streakDays: { flexDirection: "row", gap: 8 },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  dayActive: { backgroundColor: "#2563EB" },
  dayText: { fontSize: 12, fontWeight: "600", color: "#94A3B8", fontFamily: "Inter_600SemiBold" },
  dayTextActive: { color: "#FFFFFF" },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    marginTop: 4,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  badge: {
    width: "47%",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 18,
    padding: 14,
    overflow: "hidden",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 6,
  },
  badgeLocked: { backgroundColor: "rgba(248,250,252,0.85)" },
  badgeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    fontFamily: "Inter_700Bold",
  },
  badgeTitleLocked: { color: "#94A3B8" },
  badgeDesc: {
    fontSize: 11,
    color: "#64748B",
    fontFamily: "Inter_400Regular",
    lineHeight: 15,
  },
  xpPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  xpPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#D97706",
    fontFamily: "Inter_700Bold",
  },
  lockPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  lockPillText: {
    fontSize: 11,
    color: "#94A3B8",
    fontFamily: "Inter_500Medium",
  },
});
