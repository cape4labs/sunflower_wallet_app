import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Image, View } from 'react-native';

import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { Button } from '../../../shared/components/Button';
import Wrapper from '../../../shared/components/Wrapper';
import { getWalletList } from '../../../shared/walletPersitance';

type LogoScreenNavigationProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'LogoScreen'
>;

export default function LogoScreen() {
  const navigation = useNavigation<LogoScreenNavigationProp>();

  useEffect(() => {
    const checkWallets = async () => {
      const wallets = await getWalletList();
      if (wallets.length > 0) {
        const firstWalletName = wallets[0];
        if (firstWalletName) {
          navigation.navigate('WalletTabs', {
            screen: 'MainWalletScreen',
            params: { walletName: firstWalletName },
          });
        }
      }
    };
    checkWallets();
  }, [navigation]);

  const handleNext = () => {
    navigation.navigate('ImportCreateScreen');
  };

  return (
    <Wrapper>
      <View className="flex-1 justify-center items-center">
        <Image source={require('../../../../assets/icons/logo.png')} />
      </View>
      <Button onPress={handleNext} text={'Next'} />
    </Wrapper>
  );
}
