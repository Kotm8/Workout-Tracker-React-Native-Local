import { Colors } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const colorScheme = 'light'
export default function SpinningPlusButton({
  size = 56,
  onPress,
  style,
}: {
  size?: number;
  onPress?: () => void;
  style?: any;
}) {
  const rotation = useSharedValue(0);

  const handlePress = () => {
    // spin 360 degrees on each press
    rotation.value = 0;
    rotation.value = withTiming(360, { duration: 300 });
    onPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotation.value}deg`,
      },
    ],
  }));

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        styles.button,
        style,
      ]}
    >
      <Animated.Text style={[styles.plus, animatedStyle]}>+</Animated.Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors[colorScheme ?? 'light'].tint,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  plus: {
    color: "#fff",
    fontSize: 32,
    lineHeight: 32,
    textAlign: "center",
  },
});
