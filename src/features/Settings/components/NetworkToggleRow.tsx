// components/NetworkToggleRow.tsx
import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, View } from 'react-native';
import TextWithFont from '../../../shared/components/TextWithFont';
import getIconComponent from '../../../shared/components/GetIcon';

interface NetworkToggleRowProps {
  title: string;
  value: string;
  iconName: string;
  isEnabled: boolean;
  isActive: boolean;
  onToggle: () => void;
}

const NetworkToggleRow = ({
  title,
  value,
  iconName,
  isEnabled,
  isActive,
  onToggle,
}: NetworkToggleRowProps) => {
  const animatedValue = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  // Синхронизация с пропсом isActive
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  const IconComponent = getIconComponent(iconName);

  const rotateLeft = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['-45deg', '0deg'],
  });

  const translateXLeft = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0],
  });

  const circleBg = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#666', '#ff6b6b'],
  });

  const circleShadow = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={isEnabled ? onToggle : undefined}
      className="flex-row items-center w-full py-2.5"
      disabled={!isEnabled}
    >
      {/* Левая часть */}
      <View className="flex-row items-center flex-1">
        <View className="w-8 h-8 rounded-full border border-gray-600 bg-[#1a1a1a] items-center justify-center mr-3">
          <IconComponent size={16} color="#fff" strokeWidth={0.8} />
        </View>

        <View className="flex-1">
          <TextWithFont customStyle="text-white text-base">{title}</TextWithFont>
          <TextWithFont customStyle="text-gray-500 text-sm mt-0.5">{value}</TextWithFont>
        </View>
      </View>

      {/* Правая часть — toggle */}
      <View className="w-1/2 h-9 relative">
        <View className="absolute inset-0 flex-row items-center justify-end">
            <View className='absolute inset-0 flex-row items-center justify-end'>
                <Animated.View
                    className="bg-white rounded-full"
                    style={{
                    height: 2,
                    width: '25%', 
                    transform: [
                        { rotate: rotateLeft },
                        { translateX: translateXLeft },
                    ],
                    transformOrigin: 'left center',
                    }}
                />
                <View
                    className="bg-white rounded-full"
                    style={{
                    height: 2,
                    width: '75%',
                    }}
                />
            </View>
                <Animated.View
                    className="absolute right-0 w-6 h-6 rounded-full border-2 border-white/50"
                    style={{
                    backgroundColor: circleBg,
                    shadowColor: '#ff6b6b',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: animatedValue,
                    shadowRadius: circleShadow,
                    elevation: circleShadow,
                    }}
                />
            </View>
        </View>
    </TouchableOpacity>
  );
};

export default NetworkToggleRow;