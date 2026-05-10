import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  steps: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
}

export default function CircularProgress({
  steps,
  goal,
  size = 220,
  strokeWidth = 18,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  useEffect(() => {
    const pct = Math.min(steps / goal, 1);
    progress.value = withTiming(pct, {
      duration: 1400,
      easing: Easing.out(Easing.cubic),
    });
  }, [steps, goal]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const pct = Math.min(Math.round((steps / goal) * 100), 100);

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#60A5FA" stopOpacity="1" />
            <Stop offset="100%" stopColor="#1D4ED8" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(37,99,235,0.12)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGrad)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.steps}>{steps.toLocaleString()}</Text>
        <Text style={styles.label}>steps</Text>
        <Text style={styles.pct}>{pct}% of goal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
  },
  steps: {
    fontSize: 44,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -1,
    fontFamily: "Inter_700Bold",
  },
  label: {
    fontSize: 14,
    color: "#64748B",
    fontFamily: "Inter_500Medium",
    marginTop: -2,
  },
  pct: {
    fontSize: 12,
    color: "#2563EB",
    fontFamily: "Inter_600SemiBold",
    marginTop: 4,
  },
});
