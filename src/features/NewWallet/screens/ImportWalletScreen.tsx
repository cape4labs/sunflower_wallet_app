import { View, Image, Pressable } from 'react-native';
import { Button } from '../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import ScrollableWrapper from '../../../shared/components/ScrollableWrapper';
import { StepIndicator } from '../components/StepIndicator';
import { MnemonicDisplayInput } from '../components/MnemonicDisplayInput';
import PasteMnemonic from '../../../shared/utils/pasteFromClipboard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import TextWithFont from '../../../shared/components/TextWithFont';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';

type ImportWalletScreenNavigationProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'ImportWalletScreen'
>;

type RouteParams = {
  mnemonicLength: number | null;
};

export default function ImportWalletScreen() {
  const navigation = useNavigation<ImportWalletScreenNavigationProp>();
  const route = useRoute();
  const { mnemonicLength } = route.params as RouteParams;
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const styles = useWalletScreenStyles().newWalletScreens;

  // Check if all fields are filled in
  const isAllFilled =
    mnemonic.length === mnemonicLength && mnemonic.every(word => word.trim().length > 0);

  useEffect(() => {
    console.log('Mnemonic updated:', mnemonic, 'All filled:', isAllFilled);
  }, [mnemonic, mnemonicLength, isAllFilled]);

  const handleNext = async () => {
    console.log('User mnemonic words', mnemonic);
    if (isAllFilled) {
      try {
        const fullMnemonic = mnemonic.join(' ');
        navigation.navigate('NameWalletScreen', { mnemonic: fullMnemonic });
      } catch (error) {
        console.error('Failed to save mnemonic:', error);
      }
    } else {
      console.log('Please, enter all words');
    }
  };

  const handlePaste = async () => {
    await PasteMnemonic({ mnemonicLength, setMnemonic });
  };

  return (
    <ScrollableWrapper>
      <View className="flex-col flex-1 mt-5 items-center">
        <View>
          <TextWithFont customStyle={`${styles.titleSize} text-white text-center font-bold`}>
            Write your seed phrase
          </TextWithFont>
          <TextWithFont customStyle={`text-white text-center mt-2 ${styles.subtitleSize}`}>
            Make sure no one can see your screen
          </TextWithFont>
        </View>

        <MnemonicDisplayInput
          mnemonicLength={mnemonicLength}
          onChange={setMnemonic}
          initialWords={mnemonic}
        />

        <View className="">
          <Pressable onPress={handlePaste} className="flex-row gap-1 items-center">
            <Image source={require('../../../../assets/icons/copy.png')} />
            <TextWithFont customStyle="font-bold text-white">Paste</TextWithFont>
          </Pressable>
        </View>

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
