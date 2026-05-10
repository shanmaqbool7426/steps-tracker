import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { useSteps } from "@/context/StepContext";

const { width } = Dimensions.get("window");

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function SessionScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { sessionActive, sessionSteps, sessionSeconds, startSession, stopSession } = useSteps();

  const pulse = useSharedValue(1);
  const ripple1 = useSharedValue(0);
  const ripple2 = useSharedValue(0);
  const btnRotate = useSharedValue(0);

  useEffect(() => {
    if (sessionActive) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      ripple1.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
      ripple2.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
    } else {
      cancelAnimation(pulse);
      cancelAnimation(ripple1);
      cancelAnimation(ripple2);
      pulse.value = withTiming(1, { duration: 300 });
      ripple1.value = 0;
      ripple2.value = 0;
    }
  }, [sessionActive]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const rippleStyle1 = useAnimatedStyle(() => ({
    opacity: (1 - ripple1.value) * 0.4,
    transform: [{ scale: 1 + ripple1.value * 0.8 }],
  }));

  const rippleStyle2 = useAnimatedStyle(() => ({
    opacity: (1 - ripple2.value) * 0.25,
    transform: [{ scale: 1 + ripple2.value * 1.2 }],
  }));

  const pace =
    sessionSeconds > 0 && sessionSteps > 0
      ? ((sessionSteps * 0.0008) / (sessionSeconds / 3600)).toFixed(1)
      : "0.0";

  const distance = (sessionSteps * 0.0008).toFixed(2);
  const cals = Math.round(sessionSteps * 0.05);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (sessionActive) stopSession();
    else startSession();
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#0F172A", "#1E3A8A", "#1D4ED8"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.content, { paddingTop: topPad + 12 }]}>
        {/* Title */}
        <Text style={styles.title}>Walking Session</Text>

        {/* Status */}
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, sessionActive && styles.statusDotActive]} />
          <Text style={styles.statusText}>
            {sessionActive ? "Session Active" : "Ready to start"}
          </Text>
        </View>

        {/* Timer */}
        <View style={styles.timerWrap}>
          <Text style={styles.timer}>{formatTime(sessionSeconds)}</Text>
          <Text style={styles.timerLabel}>Duration</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <SessionStat icon="footsteps-outline" value={sessionSteps.toLocaleString()} label="Steps" color="#60A5FA" />
          <SessionStat icon="map-outline" value={`${distance} km`} label="Distance" color="#34D399" />
          <SessionStat icon="speedometer-outline" value={`${pace}`} label="km/h" color="#F59E0B" />
          <SessionStat icon="flame-outline" value={`${cals}`} label="Cal" color="#F87171" />
        </View>

        {/* Pulse button */}
        <View style={styles.btnArea}>
          <Animated.View style={[styles.ripple2, rippleStyle2]} />
          <Animated.View style={[styles.ripple1, rippleStyle1]} />
          <Animated.View style={pulseStyle}>
            <Pressable
              style={({ pressed }) => [
                styles.bigBtn,
                pressed && { opacity: 0.85 },
              ]}
              onPress={handleToggle}
            >
              <LinearGradient
                colors={
                  sessionActive ? ["#EF4444", "#DC2626"] : ["#60A5FA", "#1D4ED8"]
                }
                style={styles.bigBtnGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons
                  name={sessionActive ? "stop" : "play"}
                  size={42}
                  color="#FFFFFF"
                />
              </LinearGradient>
            </Pressable>
          </Animated.View>
          <Text style={styles.btnLabel}>
            {sessionActive ? "Tap to stop" : "Tap to start"}
          </Text>
        </View>

        {/* Animated route dots */}
        {sessionActive && (
          <View style={styles.routeWrap}>
            <Text style={styles.routeLabel}>Live Route</Text>
            <View style={styles.routeCanvas}>
              {Array.from({ length: 14 }).map((_, i) => (
                <RouteNode key={i} index={i} active={i < Math.floor(sessionSeconds / 4)} />
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

function SessionStat({
  icon,
  value,
  label,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <View style={sStyles.stat}>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={sStyles.val}>{value}</Text>
      <Text style={sStyles.lab}>{label}</Text>
    </View>
  );
}

function RouteNode({ index, active }: { index: number; active: boolean }) {
  const anim = useSharedValue(0);
  useEffect(() => {
    if (active) {
      anim.value = withTiming(1, { duration: 400 });
    }
  }, [active]);
  const style = useAnimatedStyle(() => ({
    opacity: anim.value,
    transform: [{ scale: anim.value }],
  }));
  const x = (index % 7) * 44 + 10;
  const y = Math.floor(index / 7) * 28 + (index % 2 === 0 ? 0 : 14);
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: x,
          top: y,
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: active ? "#60A5FA" : "rgba(255,255,255,0.15)",
        },
        style,
      ]}
    />
  );
}

const sStyles = StyleSheet.create({
  stat: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    paddingVertical: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  val: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    marginTop: 4,
  },
  lab: { fontSize: 11, color: "rgba(255,255,255,0.55)", fontFamily: "Inter_400Regular" },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, gap: 20, alignItems: "center" },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    alignSelf: "flex-start",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#475569",
  },
  statusDotActive: { backgroundColor: "#22C55E" },
  statusText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Inter_500Medium",
  },

  timerWrap: { alignItems: "center" },
  timer: {
    fontSize: 60,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    letterSpacing: -2,
  },
  timerLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    fontFamily: "Inter_400Regular",
    marginTop: -4,
  },

  statsRow: { flexDirection: "row", gap: 8, width: "100%" },

  btnArea: { alignItems: "center", gap: 16, position: "relative" },
  ripple1: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#3B82F6",
  },
  ripple2: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#60A5FA",
  },
  bigBtn: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: "hidden",
  },
  bigBtnGrad: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Inter_400Regular",
    marginTop: 8,
  },

  routeWrap: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  routeLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    fontFamily: "Inter_500Medium",
    marginBottom: 10,
  },
  routeCanvas: { height: 56, width: "100%", position: "relative" },
});
