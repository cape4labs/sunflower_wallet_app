import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Image, Pressable, View } from 'react-native';

import { generateMnemonic } from '../../../../shared/crypto/mnemonic';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { Button } from '../../../shared/components/Button';
import TextWithFont from '../../../shared/components/TextWithFont';
import Wrapper from '../../../shared/components/Wrapper';
import { copyTextToClipboard } from '../../../shared/utils/clipboard';
import { MnemonicDisplay } from '../components/MnemonicDisplay';
import { StepIndicator } from '../components/StepIndicator';

type CreateWalletScreenNavigationProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'CreateWalletScreen'
>;

export function CreateWalletScreen() {
  const navigation = useNavigation<CreateWalletScreenNavigationProp>();
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [isHidden, setIsHidden] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleNext = () => {
    if (!isHidden && isSaved && mnemonic) {
      navigation.navigate('NameWalletScreen', { mnemonic });
    }
  };

  useEffect(() => {
    const tmpMnemonic = generateMnemonic();
    setMnemonic(tmpMnemonic);
  }, []);

  return (
    <Wrapper>
      <View className="flex-col items-center">
        <View>
          <TextWithFont
            customStyle={`text-xl md:text-3xl font-bold text-white text-center`}
          >
            Store your secret phrase
          </TextWithFont>
          <TextWithFont
            customStyle={`text-white text-sm md:text-base text-center m-1 md:m-2`}
          >
            This is your secret phrase, make
          </TextWithFont>
          <TextWithFont customStyle={`text-white text-sm md:text-base text-center`}>
            sure you store it safely
          </TextWithFont>
        </View>
        {isHidden ? (
          <Pressable
            onPress={() => {
              setIsHidden(false);
            }}
            className="flex-1 mt-10"
          >
            <Image
              source={require('../../../../assets/icons/blur.png')}
              className={`md:h-auto`}
            />
          </Pressable>
        ) : (
          <MnemonicDisplay mnemonic={mnemonic} className={isHidden ? '' : ''} />
        )}
        {!isHidden && (
          <View className="flex-1">
            <View className={`flex-row justify-between items-center gap-3 md:gap-5`}>
              <View className="flex-row items-center gap-5">
                <Toggle isToggled={isSaved} setIsToggled={setIsSaved} />
                <View className="flex-col">
                  <TextWithFont customStyle="text-white text-sm">I saved my secret</TextWithFont>
                  <TextWithFont customStyle="text-white text-sm"> recovery phrase</TextWithFont>
                </View>
              </View>
              <View className="flex-row">
                <Pressable
                  onPress={() => copyTextToClipboard(mnemonic)}
                  className="flex-row gap-1 items-center"
                >
                  <Image
                    source={require('../../../../assets/icons/copy.png')}
                    className={`w-3 h-3 md:w-4 md:h-4`}
                  />
                  <TextWithFont customStyle={`text-white text-base md:text-lg`}>Copy</TextWithFont>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        {isHidden && <Button onPress={() => navigation.goBack()} text={'Go back'} accent={false} />}
        {!isHidden && (
          <View
            className={`flex-row bg-custom_border rounded-xl justify-center md:p-1 md:my-5`}
          >
            <Button onPress={() => navigation.goBack()} text={'Back'} customStyle={'w-[50%]'} />
            <Button
              onPress={handleNext}
              accent={true}
              text={'Next'}
              customStyle={`w-[50%] ${isSaved ? 'bg-custom_accent' : 'bg-white '}`}
            />
          </View>
        )}
      </View>
      <StepIndicator totalSteps={5} currentStep={3} />
    </Wrapper>
  );
}

type ToggleType = {
  isToggled: boolean;
  setIsToggled: (v: boolean) => void;
};

export function Toggle({ isToggled, setIsToggled }: ToggleType) {
  return (
    <Pressable
      onPress={() => setIsToggled(!isToggled)}
      className={`rounded-full flex-row items-center border-2 w-16 h-7 md:w-20 md:h-9 ${isToggled
        ? 'bg-custom_accent border-custom_border justify-end'
        : 'bg-custom_border border-custom_accent justify-start'
        }`}
    >
      <View
        className={`rounded-full mx-1 h-5 w-5 md:h-6 md:w-6 ${isToggled ? 'bg-custom_border' : 'bg-custom_accent'}`}
      />
    </Pressable>
  );
}
