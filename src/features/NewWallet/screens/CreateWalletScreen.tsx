import { View, Pressable, Image } from 'react-native';
import { Button } from '../components/__tests__/Button';
import { useNavigation } from '@react-navigation/native';
import { generateMnemonic } from '../../../../shared/crypto/mnemonic';
import { useEffect, useState } from 'react';
import { MnemonicDisplay } from '../components/MnemonicDisplay';
import { CopyToClipboard as copyToClipboard } from '../../../shared/utils/copyToClipboard';
import Toggle from '../components/Toggle';
import Wrapper from '../../../shared/components/Wrapper';
import { StepIndicator } from '../components/StepIndicator';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TextWithFont from '../../../shared/components/TextWithFont';
import { ScrollableWrapper } from '../../WalletHome/components/Wrapper';


type CreateWalletScreenNavigationProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'CreateWalletScreen'
>;

export default function CreateWalletScreen() {
  const navigation = useNavigation<CreateWalletScreenNavigationProp>();
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [isHidden, setIsHidden] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleNext = async () => {
    if (!isHidden && isSaved && mnemonic) {
      navigation.navigate('NameWalletScreen', { mnemonic });
    } else {
      console.log('Please, save your secret phareses first');
    }
  };

  useEffect(() => {
    const tmpMnemonic = generateMnemonic();
    setMnemonic(tmpMnemonic);
  }, []);

  return (
    <ScrollableWrapper>
      <View className="flex-col items-center">
        <View className="">
          <TextWithFont customStyle="text-2xl font-bold text-white text-center">
            Store your secret phrase
          </TextWithFont>
          <TextWithFont customStyle="text-white text-xl text-center mt-2">
            This is your secret phares, make
          </TextWithFont>
          <TextWithFont customStyle="text-white text-xl text-center">sure you store it safely</TextWithFont>
        </View>
        {isHidden ? (
          <Pressable
            onPress={() => {
              setIsHidden(false);
            }}
            className="flex-1 mt-10"
          >
            <Image source={require('../../../../assets/icons/blur.png')} />
          </Pressable>
        ) : (
          <MnemonicDisplay mnemonic={mnemonic} className={isHidden ? '' : ''} />
        )}
        {!isHidden && (
          <View className="flex-1">
            <View className="flex-row justify-start gap-10 align-middle">
              <View className="flex-row items-center gap-5">
                <Toggle isToggled={isSaved} setIsToggled={setIsSaved} />
                <View className="flex-col">
                  <TextWithFont customStyle="text-white">I saved my secret</TextWithFont>
                  <TextWithFont customStyle="text-white"> recovery phrase</TextWithFont>
                </View>
              </View>
              <View className="flex-row">
                <Pressable
                  onPress={() => copyToClipboard(mnemonic)}
                  className="flex-row gap-1 items-center"
                >
                  <Image
                    source={require('../../../../assets/icons/copy.png')}
                    className="h-4 w-4"
                  />
                  <TextWithFont customStyle="text-white text-xl">Copy</TextWithFont>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        {isHidden && <Button onPress={() => navigation.goBack()} text={'Go back'} accent={false} />}
        {!isHidden && (
          <View className="flex-row my-5 bg-custom_border p-1 rounded-xl justify-center">
            <Button onPress={() => navigation.goBack()} text={'Back'} customStyle={'w-[50%]'} />
            <Button
              onPress={handleNext}
              accent={true}
              text={'Next'}
              customStyle={`w-[50%] ${isSaved ? 'bg-custom_accent' : 'bg-white '}`}
            />
          </View>
        )}

        <StepIndicator totalSteps={5} currentStep={3} />
      </View>
    </ScrollableWrapper>
  );
}
