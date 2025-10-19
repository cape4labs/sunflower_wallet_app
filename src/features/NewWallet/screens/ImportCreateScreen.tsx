import { View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/Button';
import { Wrapper } from '../components/Wrapper';
import { StepIndicator } from '../components/StepIndicator';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ImportCreateScreenNavigationProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'ImportCreateScreen'
>;

export function ImportCreateScreen() {
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
        <StepIndicator totalSteps={5} currentStep={2} />
      </View>
    </Wrapper>
  );
}
