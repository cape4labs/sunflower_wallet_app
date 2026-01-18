import { View } from 'react-native';

import getIconComponent from '../../../shared/components/GetIcon';
import TextWithFont from '../../../shared/components/TextWithFont';

type MiniTabButtonProps = {
  title: string;
  value: string;
  iconName: string;
  withToggle?: boolean;
};

export default function MiniTabButton({
  title,
  value,
  withToggle = false,
  iconName,
}: MiniTabButtonProps) {
  const IconComponent = getIconComponent(iconName);

  return (
    <View className="flex-row items-center p-1">
      <View className="items-center flex justify-center">
        <View className="w-3 h-1 border-t-1 border-white" />
        <View className="items-center relative flex justify-center">
          <View className="w-8 h-8 rounded-full border border-gray-600 bg-[#1a1a1a] items-center justify-center z-10">
            <IconComponent size={16} color="#fff" strokeWidth={0.8} />
          </View>
        </View>
      </View>

      <View className="flex-1 ml-4">
        <TextWithFont customStyle="text-white text-base">{title}</TextWithFont>
        {value ? (
          <TextWithFont customStyle="text-gray-500 text-sm mt-1">{value}</TextWithFont>
        ) : null}
      </View>

      {/*TODO*/}
      {withToggle ? <></> : <></>}
    </View>
  );
}
