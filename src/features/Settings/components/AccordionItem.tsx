import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Animated, Pressable, View } from 'react-native';

import getIconComponent from '../../../shared/components/GetIcon';
import TextWithFont from '../../../shared/components/TextWithFont';

type Props = {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  children?: React.ReactNode;
  isOpen?: boolean;
  onToggle: () => void;
  direction?: 'rigth' | 'left' | 'up';
  animatedHeight: Animated.Value;
  onLayoutHeight: (height: number) => void;
  isFirst?: boolean;
};

export default function AccordionItem({
  title,
  subtitle,
  iconName,
  children,
  isOpen = false,
  onToggle,
  direction = 'rigth',
  animatedHeight,
  onLayoutHeight,
}: Props) {
  const IconComponent = getIconComponent(iconName);

  const ArrowIcon = direction === 'rigth' ? ChevronRight : ChevronLeft;

  const measureContent = () => {
    const height = 300;
    if (height > 0) {
      onLayoutHeight(height);
      if (isOpen) {
        Animated.timing(animatedHeight, {
          toValue: height,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  return (
    <View className="my-3">
      {direction === 'up' ? (
        <Animated.View
          style={{
            height: animatedHeight,
            overflow: 'hidden',
          }}
        >
          <View onLayout={measureContent} className="flex-1 justify-end">
            {children}
          </View>
        </Animated.View>
      ) : (
        <></>
      )}

      <Pressable onPress={onToggle} className="flex-row items-center justify-between py-3">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="bg-[#202020] rounded-full h-14 w-14 items-center justify-center border border-gray-400">
            <IconComponent size={30} color="#fff" strokeWidth={1} />
          </View>
          <View className="flex-1">
            <TextWithFont customStyle="text-xl text-white">{title}</TextWithFont>
            <TextWithFont customStyle="text-sm text-gray-400">{subtitle}</TextWithFont>
          </View>
        </View>

        <View
          style={{
            transform: [
              {
                rotate: isOpen ? (direction === 'up' ? '90deg' : '-90deg') : '0deg',
              },
            ],
          }}
        >
          <ArrowIcon color="#fff" size={24} />
        </View>
      </Pressable>

      {direction === 'left' ? (
        <Animated.View
          style={{
            height: animatedHeight,
            overflow: 'hidden',
          }}
        >
          <View onLayout={measureContent} className="">
            {children}
          </View>
        </Animated.View>
      ) : (
        <></>
      )}
    </View>
  );
}
