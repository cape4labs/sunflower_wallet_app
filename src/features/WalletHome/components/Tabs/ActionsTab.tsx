import { View } from 'react-native';

// import { Button } from '../../components/Button';
import TextWithFont from '../../../../shared/components/TextWithFont';

type ActionsTabType = {
  actionsHeight: string;
};

export default function ActionsTab({ actionsHeight }: ActionsTabType) {
  return (
    // <View className={`flex-col items-center bg-custom_border p-1 rounded-xl ${actionsHeight}`}>
    //   <View className="flex-row h-1/2">
    //     <Button text="Swap" customStyle="w-1/2" iconName="RefreshCw" />
    //     <Button text="Bridge" customStyle="w-1/2" iconName="ArrowRightLeft" />
    //   </View>
    //   <View className="flex-row h-1/2">
    //     <Button text="BTCfi" customStyle="w-1/2" iconName="DatabaseIcon" accent />
    //     <Button text="Buy" customStyle="w-1/2" iconName="PlusCircle" />
    //   </View>
    // </View>
    <View className="mt-4">
      <TextWithFont customStyle="text-white text-center ">
        Actions Content Will Be Here Soon
      </TextWithFont>
    </View>
  );
}
