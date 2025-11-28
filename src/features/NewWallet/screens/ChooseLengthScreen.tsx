import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, View } from 'react-native';

import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { Button } from '../../../shared/components/Button';
import TextWithFont from '../../../shared/components/TextWithFont';
import Wrapper from '../../../shared/components/Wrapper';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';
import { StepIndicator } from '../components/StepIndicator';

type ChooseLengthScreenNavigationProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'ChooseLengthScreen'
>;

export default function ChooseLengthScreen() {
  const navigation = useNavigation<ChooseLengthScreenNavigationProp>();
  const styles = useWalletScreenStyles().newWalletScreens;

  return (
    <Wrapper>
      <View className="flex-col">
        <TextWithFont customStyle={`${styles.titleSize} text-white text-center font-bold`}>
          Choose the length for
        </TextWithFont>
        <TextWithFont customStyle={`${styles.titleSize} text-white text-center font-bold`}>
          the seed phrase
        </TextWithFont>
      </View>
      <View className="flex-col flex-1 w-full mt-10">
        <Button
          onPress={() =>
            navigation.navigate('ImportWalletScreen', {
              mnemonicLength: 12,
            })
          }
          text="12 words"
          customStyle={styles.buttonMargin}
        />
        <Button
          onPress={() =>
            navigation.navigate('ImportWalletScreen', {
              mnemonicLength: 24,
            })
          }
          text="24 words"
          customStyle={styles.buttonMargin}
        />
        <View className={`flex-row justify-center items-center ${styles.infoGap} mt-5`}>
          <Image source={require('../../../../assets/icons/info.png')} className="w-10 h-10" />
          <TextWithFont customStyle={`text-white font-light ${styles.infoText}`}>
            {'Select the appropriate number of \nwords that were in your seed phrase.'}
          </TextWithFont>
        </View>
      </View>
      <View className="my-5 w-full bg-custom_border rounded-2xl">
        <Button onPress={() => navigation.goBack()} text={'Back'} customStyle={'w-full p-2'} />
      </View>
      <StepIndicator totalSteps={5} currentStep={3} />
    </Wrapper>
  );
}
