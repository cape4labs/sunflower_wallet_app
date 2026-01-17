import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';

import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { Button } from '../../../shared/components/Button';
import ScrollableWrapper from '../../../shared/components/ScrollableWrapper';
import TextWithFont from '../../../shared/components/TextWithFont';
import pasteMnemonicFromClipboard from '../../../shared/utils/pasteMnemonicFromClipboard';
import MnemonicDisplayInput from '../components/MnemonicDisplayInput';
import { StepIndicator } from '../components/StepIndicator';

type ImportWalletScreenNavigationProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'ImportWalletScreen'
>;

type RouteParams = {
  mnemonicLength: number;
};

export default function ImportWalletScreen() {
  const navigation = useNavigation<ImportWalletScreenNavigationProp>();

  const route = useRoute();
  const { mnemonicLength } = route.params as RouteParams;

  const [mnemonic, setMnemonic] = useState<string[]>(
    Array.from({ length: mnemonicLength }, () => ''),
  );

  // Check if all fields are filled in
  const isAllFilled =
    mnemonic.length === mnemonicLength && mnemonic.every(word => word.trim().length > 0);

  const handleNext = async () => {
    if (isAllFilled) {
      try {
        // TODO remove this
        const fullMnemonic = mnemonic.join(' ');
        navigation.navigate('NameWalletScreen', {
          mnemonic: fullMnemonic,
        });
      } catch (error) {
        console.error('Failed to save mnemonic:', error);
      }
    } else {
      console.log('Please, enter all words');
    }
  };

  const handlePaste = async () => {
    await pasteMnemonicFromClipboard(mnemonicLength, setMnemonic);
  };

  return (
    <ScrollableWrapper>
      <View className="flex-col flex-1 mt-5 items-center">
        <View>
          <TextWithFont customStyle="text-xl text-2xl text-white text-center font-bold">
            Write your seed phrase
          </TextWithFont>
          <TextWithFont customStyle="text-white text-center mt-2 text-sm md:text-lg">
            Make sure no one can see your screen
          </TextWithFont>
        </View>

        <MnemonicDisplayInput mnemonic={mnemonic} setMnemonic={setMnemonic} />

        <Pressable onPress={handlePaste} className="flex-row gap-1 items-center">
          <Image source={require('../../../../assets/icons/copy.png')} />
          <TextWithFont customStyle="font-bold text-white">Paste</TextWithFont>
        </Pressable>

        <View className="flex-row my-5 bg-custom_border p-1 rounded-xl w-full">
          <Button onPress={() => navigation.goBack()} text={'Back'} customStyle={'w-1/2'} />
          <Button
            onPress={handleNext}
            accent={true}
            text={'Next'}
            customStyle={`bg-${isAllFilled ? 'custom_accent' : 'white'} w-1/2`}
          />
        </View>
      </View>
      <StepIndicator totalSteps={5} currentStep={3} />
    </ScrollableWrapper>
  );
}
