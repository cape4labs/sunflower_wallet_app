import { View } from 'react-native';
import TextWithFont from '../../../shared/components/TextWithFont';
import getIconComponent from '../../../shared/components/GetIcon';

type MiniTabButtonProps = {
  title: string;
  value: string;
  isFirst?: boolean;
  isLast?: boolean;
  iconName: string;
};


export default function MiniTabButton({
  title,
  value,
  isFirst,
  isLast,
  iconName,
}: MiniTabButtonProps) {
    const IconComponent = getIconComponent(iconName);
  

  return (
    <View className="flex-row items-start ">
      <View className="items-center relative">
        {!isFirst && (
          <View className="absolute top-0 bottom-1/2 left-1/2 w-0.5 -translate-x-1/2 bg-white" />
        )}

        <View className="w-8 h-8 rounded-full border border-gray-600 bg-[#1a1a1a] items-center justify-center z-10">
          <IconComponent size={16} color="#fff" />
        </View>

        {!isLast && (
          <View className="absolute top-1/2 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-gray-600" />
        )}
      </View>

      <View className="flex-1 ml-4">
        <TextWithFont customStyle="text-white text-base">{title}</TextWithFont>
        {value ? (
          <TextWithFont customStyle="text-gray-500 text-sm mt-1">{value}</TextWithFont>
        ) : null}
      </View>
    </View>
  );
}