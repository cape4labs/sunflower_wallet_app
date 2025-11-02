import { View, Pressable, Image } from 'react-native';
import { Button } from '../components/Button';
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
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';


type CreateWalletScreenNavigationProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'CreateWalletScreen'
>;

export default function CreateWalletScreen() {
  const navigation = useNavigation<CreateWalletScreenNavigationProp>();
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [isHidden, setIsHidden] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const styles = useWalletScreenStyles();
  const newWalletScreens = styles.newWalletScreens;
  const create = styles.createWallet;

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
        <View>
          <TextWithFont customStyle={`${newWalletScreens.titleSize} font-bold text-white text-center`}>
            Store your secret phrase
          </TextWithFont>
          <TextWithFont customStyle={`text-white ${newWalletScreens.subtitleSize} text-center ${create.titleGap}`}>
            This is your secret phrase, make
          </TextWithFont>
          <TextWithFont customStyle={`text-white ${newWalletScreens.subtitleSize} text-center`}>
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
            <Image source={require('../../../../assets/icons/blur.png')} className={create.blurImageSize}/>
          </Pressable>
        ) : (
          <MnemonicDisplay mnemonic={mnemonic} className={isHidden ? '' : ''} />
        )}
        {!isHidden && (
          <View className="flex-1">
            <View className={`flex-row justify-between items-center ${create.toggleGap}`}>
              <View className="flex-row items-center gap-5">
                <Toggle isToggled={isSaved} setIsToggled={setIsSaved} />
                <View className="flex-col">
                  <TextWithFont customStyle="text-white text-sm">I saved my secret</TextWithFont>
                  <TextWithFont customStyle="text-white text-sm"> recovery phrase</TextWithFont>
                </View>
              </View>
              <View className="flex-row">
                <Pressable
                  onPress={() => copyToClipboard(mnemonic)}
                  className="flex-row gap-1 items-center"
                >
                  <Image
                    source={require('../../../../assets/icons/copy.png')}
                    className={create.copyIconSize}
                  />
                  <TextWithFont customStyle={`text-white ${create.copyText}`} >Copy</TextWithFont>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        {isHidden && <Button onPress={() => navigation.goBack()} text={'Go back'} accent={false} />}
        {!isHidden && (
          <View className={`flex-row bg-custom_border rounded-xl justify-center ${create.bottomButtons}`}>            
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
