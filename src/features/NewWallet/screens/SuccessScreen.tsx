import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Image, View } from 'react-native';

import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import TextWithFont from '../../../shared/components/TextWithFont';
import Wrapper from '../../../shared/components/Wrapper';
import { StepIndicator } from '../components/StepIndicator';

type RouteParams = {
  walletName?: string;
};

type SuccessScreenNavigationProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'SuccessScreen'
>;

export default function SuccessScreen() {
  const route = useRoute();
  const { walletName } = route.params as RouteParams;
  const navigation = useNavigation<SuccessScreenNavigationProp>();

  useEffect(() => {
    const navigateWithWalletData = async () => {
      if (!walletName) return;

      const timer = setTimeout(() => {
        navigation.navigate('WalletTabs', {
          screen: 'MainWalletScreen',
          params: { walletName: walletName },
        });
      }, 2000);

      return () => clearTimeout(timer);
    };

    navigateWithWalletData();
  }, [navigation, walletName]);

  return (
    <Wrapper>
      <View className="flex-1">
        <TextWithFont
          customStyle={`text-xl md:text-3xl text-white text-center font-bold mt-5`}
        >
          Success!
        </TextWithFont>
        <TextWithFont customStyle={`text-white text-center mt-2 text-sm md:text-base`}>
          Welcome to the: {walletName}
        </TextWithFont>
      </View>
      <View className="flex-1 justify-center items-center">
        <Image source={require('../../../../assets/icons/success.png')} />
      </View>
      <StepIndicator totalSteps={5} currentStep={5} />
    </Wrapper>
  );
}
