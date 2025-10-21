import { View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Button } from '../components/Button';
import { Wrapper } from '../../../../shared/components/Wrapper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { getWalletList } from '../../../../shared/crypto/mnemonic';

type LogoScreenNavigationProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'LogoScreen'
>;

export function LogoScreen() {
  const navigation = useNavigation<LogoScreenNavigationProp>();

  useEffect(() => {
    const checkWallets = async () => {
      const wallets = await getWalletList();
      if (wallets.length > 0) {
        const firstWalletName = wallets[0];
        if (firstWalletName) {
          navigation.navigate('MainWalletScreen', { walletName: firstWalletName });
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
