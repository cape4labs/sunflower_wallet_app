import { View, TextInput, ActivityIndicator } from 'react-native';
import { Button } from '../../../shared/components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import Wrapper from '../../../shared/components/Wrapper';
import { StepIndicator } from '../components/StepIndicator';
import { createAndSaveWallet } from '../../../shared/walletPersitance';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TextWithFont from '../../../shared/components/TextWithFont';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';

type RouteParams = {
  mnemonic?: string;
};

type NameWalletScreenNavigationProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'NameWalletScreen'
>;

export default function NameWalletScreen() {
  const navigation = useNavigation<NameWalletScreenNavigationProp>();
  const route = useRoute();
  const { mnemonic } = route.params as RouteParams;
  const [walletName, setWalletName] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Creating wallet state
  const styles = useWalletScreenStyles();
  const newWalletScreens = styles.newWalletScreens;
  const nameWallet = styles.nameWallet;

  useEffect(() => {
    if (!mnemonic) {
      console.log('No mnemonic passed to NameWalletScreen');
      navigation.goBack();
    }
  }, [mnemonic, navigation]);

  const handleNext = async () => {
    setIsLoading(true);

    if (walletName.trim().length > 0 && mnemonic) {
      try {
        await createAndSaveWallet(mnemonic, walletName);
        navigation.navigate('SuccessScreen', { walletName });
      } catch (error) {
        console.error('Failed to save mnemonic with name:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Please enter a wallet name');
    }
  };

  return (
    <Wrapper>
      <View className="flex-1 flex-col w-full">
        <View className="flex-col items-center w-full px-5">
          <TextWithFont
            customStyle={`${newWalletScreens.titleSize} text-white text-center font-bold mt-5`}
          >
            Pick a name for your wallet
          </TextWithFont>
          <TextWithFont
            customStyle={`text-white text-center mt-2 ${newWalletScreens.subtitleSize}`}
          >
            For example: Main Wallet
          </TextWithFont>

          <View
            className={`w-full bg-custom_complement items-center flex-row justify-between rounded-2xl mt-10 ${nameWallet.inputContainer}`}
          >
            <TextWithFont customStyle="text-white">{'>>'}</TextWithFont>
            <TextInput
              className={`flex-1 h-full text-white px-2 my-1 ${nameWallet.inputText}`}
              placeholder="wallet_name"
              placeholderTextColor="white"
              value={walletName}
              onChangeText={setWalletName}
              editable={!isLoading}
            />
          </View>

          {isLoading && (
            <View className={`flex-row items-center ${nameWallet.loadingGap}`}>
              <ActivityIndicator size="large" color="#ffffff" />
              <TextWithFont customStyle="text-white ml-2">Creating wallet...</TextWithFont>
            </View>
          )}
        </View>

        <View className="w-full mt-auto">
          <View className="flex-col px-5 pb-5">
            <Button
              onPress={() => navigation.goBack()}
              text="Back"
              customStyle="w-full"
              disable={isLoading}
            />
            <Button
              onPress={handleNext}
              accent
              text={isLoading ? 'Creating...' : 'Next'}
              disable={isLoading}
              customStyle={`w-full mt-2 ${walletName.trim().length > 0 && !isLoading ? 'bg-custom_accent' : 'bg-white'}`}
            />
          </View>
        </View>
      </View>
      <StepIndicator totalSteps={5} currentStep={4} />
    </Wrapper>
  );
}
