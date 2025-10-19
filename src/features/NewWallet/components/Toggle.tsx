import { useState } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export function Toggle({ onToggle }: { onToggle?: (isActivated: boolean) => void }) {
  const [isActivated, setIsActivated] = useState(false);
  const translateX = useSharedValue(0);

  const handlePress = () => {
    const newState = !isActivated;
    setIsActivated(newState);
    translateX.value = withTiming(newState ? 40 : 0, {
      duration: 250,
      easing: Easing.ease,
    });
    if (onToggle) {
      onToggle(newState);
    }
  };

  // Animate toogle by x axis
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Pressable
      onPress={handlePress}
      className={`border-2 rounded-full w-20 h-9 flex-row items-center ${
        isActivated
          ? 'bg-custom_accent border-custom_border'
          : 'bg-custom_border border-custom_accent'
      }`}
    >
      <Animated.View
        className={`h-6 w-6 rounded-full mx-1 ${isActivated ? 'bg-custom_border' : 'bg-custom_accent'}`}
        style={animatedStyle}
      />
    </Pressable>
  );
}
