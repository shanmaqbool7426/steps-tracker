import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

interface Bar {
  label: string;
  value: number;
}

interface Props {
  data: Bar[];
  maxValue?: number;
  color?: string;
  highlightIndex?: number;
  height?: number;
}

function AnimatedBar({
  value,
  maxValue,
  height,
  color,
  highlight,
  index,
}: {
  value: number;
  maxValue: number;
  height: number;
  color: string;
  highlight: boolean;
  index: number;
}) {
  const anim = useSharedValue(0);

  useEffect(() => {
    anim.value = withDelay(
      index * 60,
      withTiming(value / maxValue, {
        duration: 700,
        easing: Easing.out(Easing.quad),
      })
    );
  }, [value, maxValue]);

  const style = useAnimatedStyle(() => ({
    height: anim.value * height,
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        style,
        {
          backgroundColor: highlight ? color : `${color}55`,
          borderRadius: 6,
        },
      ]}
    />
  );
}

export default function BarChart({
  data,
  maxValue,
  color = "#2563EB",
  highlightIndex,
  height = 100,
}: Props) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.container}>
      <View style={[styles.bars, { height }]}>
        {data.map((d, i) => (
          <View key={d.label} style={styles.barCol}>
            <AnimatedBar
              value={d.value}
              maxValue={max}
              height={height}
              color={color}
              highlight={highlightIndex === undefined || highlightIndex === i}
              index={i}
            />
          </View>
        ))}
      </View>
      <View style={styles.labels}>
        {data.map((d) => (
          <Text key={d.label} style={styles.label}>
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  bar: {
    width: "100%",
  },
  labels: {
    flexDirection: "row",
    marginTop: 6,
  },
  label: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    color: "#64748B",
    fontFamily: "Inter_500Medium",
  },
});
