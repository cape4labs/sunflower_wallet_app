import { NavigationProp, useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

import { RootNavigatorTypeParamListType } from '../../../../navigation/types';
import { Button } from '../../../../shared/components/Button';

type ActionsTabType = {
  actionsHeight: string;
  walletName: string | null;
};

export default function ActionsTab({ actionsHeight, walletName }: ActionsTabType) {
  const navigation = useNavigation<NavigationProp<RootNavigatorTypeParamListType>>();

  return (
    <View className={`flex-col items-center bg-custom_border rounded-xl ${actionsHeight}`}>
      <View className="flex-row h-1/2">
        <Button text="Swap" customStyle="w-1/2" iconName="RefreshCw" />
        <Button text="Bridge" customStyle="w-1/2" iconName="ArrowRightLeft" />
      </View>
      <View className="flex-row h-1/2">
        <Button
          text="BTCfi"
          customStyle="w-1/2"
          iconName="DatabaseIcon"
          accent
          onPress={() => navigation.navigate('MainBTCfiScreen', { walletName: walletName || '' })}
        />
        <Button text="Buy" customStyle="w-1/2" iconName="PlusCircle" />
      </View>
    </View>
  );
}
