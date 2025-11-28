import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, View } from 'react-native';

import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { Button } from '../../../shared/components/Button';
import Wrapper from '../../../shared/components/Wrapper';
import { StepIndicator } from '../components/StepIndicator';

type ImportCreateScreenNavigationProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'ImportCreateScreen'
>;

export default function ImportCreateScreen() {
  const navigation = useNavigation<ImportCreateScreenNavigationProp>();
  return (
    <Wrapper>
      <View className="flex-1 justify-center align-middle items-center">
        <Image source={require('../../../../assets/icons/logo.png')} />
      </View>
      <View className="flex-1 justify-end w-full">
        <View className="justify-end">
          <Button onPress={() => navigation.navigate('ChooseLengthScreen')} text="Import Wallet" />
          <Button
            onPress={() => navigation.navigate('CreateWalletScreen')}
            text="Create Wallet"
            accent={true}
            customStyle={'mt-2'}
          />
        </View>
      </View>
      <StepIndicator totalSteps={5} currentStep={2} />
    </Wrapper>
  );
}
