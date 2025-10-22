import { Text, View, Pressable, Image } from 'react-native';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { generateMnemonic } from '../../../../shared/crypto/mnemonic';
import { useEffect, useState } from 'react';
import { MnemonicDisplay } from '../components/MnemonicDisplay';
import { CopyToClipboard as copyToClipboard } from '../../../shared/utils/copyToClipboard';
import { Toggle } from '../components/Toggle';
import Wrapper from '../../../shared/components/Wrapper';
import { StepIndicator } from '../components/StepIndicator';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type CreateWalletScreenNavigationProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'CreateWalletScreen'
>;

export default function CreateWalletScreen() {
  const navigation = useNavigation<CreateWalletScreenNavigationProp>();
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [isHidden, setIsHidden] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggle = () => {
    if (isSaved) {
      setIsSaved(false);
    } else {
      setIsSaved(true);
    }
  };

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
    <Wrapper>
      <View className="flex-col items-center">
        <View className="">
          <Text className="text-2xl font-bold text-white text-center">
            Store your secret phrase
          </Text>
          <Text className="text-white text-xl text-center mt-2">
            This is your secret phares, make
          </Text>
          <Text className="text-white text-xl text-center">sure you store it safely</Text>
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
                <Toggle onToggle={handleToggle} />
                <View className="flex-col">
                  <Text className="text-white">I saved my secret</Text>
                  <Text className="text-white"> recovery phrase</Text>
                </View>
              </View>
              <View className="flex-row">
                <Pressable
                  onPress={() => copyToClipboard(mnemonic)}
                  className="flex-row gap-1 items-center"
                >
                  <Image
                    source={require('../../../../assets/icons/Copy.png')}
                    className="h-4 w-4"
                  />
                  <Text className="text-white text-xl">Copy</Text>
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
    </Wrapper>
  );
}
