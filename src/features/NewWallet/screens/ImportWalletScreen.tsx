import { Text, View, Image, Pressable } from 'react-native';
import { Button } from '../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react'; // Добавили useEffect
import { ScrollableWrapper } from '../components/Wrapper';
import { StepIndicator } from '../components/StepIndicator';
import { MnemonicDisplayInput } from '../components/MnemonicDisplayInput';
import PasteMnemonic from '../../../../shared/utils/pasteFromClipboard';
import { saveMnemonic } from '../../../../shared/crypto/keychain';

type RouteParams = {
  mnemonicLength: number | null,
};

export function ImportWalletScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { mnemonicLength } = route.params as RouteParams;
  const [mnemonic, setMnemonic] = useState<string[]>([]);

  //Check is all fields are filled in
  const isAllFilled = mnemonic.length === mnemonicLength && mnemonic.every(word => word.trim().length > 0);

  useEffect(() => {
    console.log('Mnemonic updated:', mnemonic, 'All filled:', isAllFilled);
  }, [mnemonic, mnemonicLength]); 

  const handleNext = async () => {
    console.log("User mnemonic words", mnemonic);
    if (isAllFilled) {
      try {
        const fullMnemonic = mnemonic.join(' ');
        // Сохраняем мнемонику (имя зададим на следующем экране)
        navigation.navigate('NameWalletScreen', { mnemonic: fullMnemonic });
      } catch (error) {
        console.error('Failed to save mnemonic:', error);
      }
    } else {
      console.log('Пожалуйста, введите все слова');
    }
  };

  const handlePaste = async () => {
    await PasteMnemonic({ mnemonicLength, setMnemonic });
  };

  return (
    <ScrollableWrapper>
      <View className="flex-col flex-1 mt-5 items-center">
        <View className=''>
          <Text className="text-2xl text-white text-center font-bold">Write your seed phrase</Text>
          <Text className="text-white text-center mt-2">Make sure no one can </Text>
          <Text className="text-white text-center">see your screen</Text>
        </View>

        <MnemonicDisplayInput
          mnemonicLength={mnemonicLength} 
          onChange={setMnemonic}
          initialWords={mnemonic}
        />

        <View className=''>
          <Pressable onPress={handlePaste} className="flex-row gap-1 items-center">
            <Image
              source={require('../../../../assets/icons/Copy.png')}
            />
            <Text className='font-bold text-white'>Paste</Text>
          </Pressable>
        </View>

        <View className="flex-row my-5 bg-custom_border p-1 rounded-xl w-full">
          <Button onPress={() => navigation.goBack()} text={'Back'} customStyle={'w-1/2'}/>
          <Button
            onPress={handleNext}
            accent={true}
            text={'Next'}
            customStyle={`bg-${isAllFilled ? 'custom_accent' : 'white'} w-1/2`} 
          />
        </View>
      </View>
      <StepIndicator totalSteps={5} currentStep={3}/>
    </ScrollableWrapper>
  );
}