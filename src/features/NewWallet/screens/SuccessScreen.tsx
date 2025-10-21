import { useNavigation, useRoute } from '@react-navigation/native';
import { StepIndicator } from '../components/StepIndicator';
import { Wrapper } from '../../../../shared/components/Wrapper';
import { View, Text, Image } from 'react-native';
import { useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';

type RouteParams = {
  walletName?: string;
};

type SuccessScreenNavigationProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'SuccessScreen'
>;

export function SuccessScreen() {
  const route = useRoute();
  const { walletName } = route.params as RouteParams;
  const navigation = useNavigation<SuccessScreenNavigationProp>();

  useEffect(() => {
    const navigateWithWalletData = async () => {
      if (!walletName) return;

      const timer = setTimeout(() => {
        navigation.navigate('MainWalletScreen', { walletName });
      }, 2000);

      return () => clearTimeout(timer);
    };

    navigateWithWalletData();
  }, [navigation, walletName]);

  return (
    <Wrapper>
      <View className="flex-1">
        <Text className="text-2xl text-white text-center font-bold mt-5">Success!</Text>
        <Text className="text-white text-center mt-2">{`Welcome to the: ${walletName}`}</Text>
      </View>
      <View className="flex-1">
        <Image source={require('../../../../assets/icons/success.png')} />
      </View>
      <StepIndicator totalSteps={5} currentStep={5} />
    </Wrapper>
  );
}
