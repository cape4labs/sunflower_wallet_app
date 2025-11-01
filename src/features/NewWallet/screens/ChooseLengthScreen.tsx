import { View, Image } from 'react-native';
import Wrapper from '../../../shared/components/Wrapper';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { StepIndicator } from '../components/StepIndicator';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TextWithFont from '../../../shared/components/TextWithFont';

type ChooseLengthScreenNavigationProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'ChooseLengthScreen'
>;

export default function ChooseLengthScreen() {
  const navigation = useNavigation<ChooseLengthScreenNavigationProp>();

  return (
    <Wrapper>
      <View className="flex-col">
        <TextWithFont customStyle="text-2xl text-white text-center font-bold">Choose the length for</TextWithFont>
        <TextWithFont customStyle="text-2xl font-bold text-white text-center">the seed phrase</TextWithFont>
      </View>
      <View className="flex-col flex-1 w-full mt-10">
        <Button
          onPress={() => navigation.navigate('ImportWalletScreen', { mnemonicLength: 12 })}
          text="12 words"
          customStyle="m-2 inner-shadow"
        />
        <Button
          onPress={() => navigation.navigate('ImportWalletScreen', { mnemonicLength: 24 })}
          text="24 words"
          customStyle="m-2 inner-shadow"
        />
        <View className="flex-row justify-center items-center gap-3 mt-5">
          <Image source={require('../../../../assets/icons/info.png')} className="w-10 h-10" />
          <TextWithFont customStyle="text-white font-light">{'Select the appropriate number of \nwords that were in your seed phrase.'}</TextWithFont>
        </View>
      </View>
      <View className="my-5 w-full bg-custom_border rounded-2xl">
        <Button onPress={() => navigation.goBack()} text={'Back'} customStyle={'w-full p-2'} />
      </View>
      <StepIndicator totalSteps={5} currentStep={3} />
    </Wrapper>
  );
}
