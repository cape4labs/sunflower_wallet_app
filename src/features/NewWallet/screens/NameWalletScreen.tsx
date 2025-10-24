import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { Button } from '../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import Wrapper from '../../../shared/components/Wrapper';
import { StepIndicator } from '../components/StepIndicator';
import { createAndSaveWallet } from '../../../shared/walletPersitance';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
          <Text className="text-2xl text-white text-center font-bold mt-5">
            Pick a name for your wallet
          </Text>
          <Text className="text-white text-center mt-2">For example: Main Wallet</Text>
          <View className="w-full border-custom_border bg-custom_complement items-center border-[6px] flex-row justify-between rounded-2xl mt-10 px-5">
            <Text className="text-white">{'>>'}</Text>
            <TextInput
              className="flex-1 h-full text-white px-2 my-1 text-xl"
              placeholder="wallet_name"
              placeholderTextColor="white"
              value={walletName}
              onChangeText={input => setWalletName(input)}
              editable={!isLoading}
            />
          </View>
          {isLoading && (
            <View className="mt-5 flex-row items-center">
              <ActivityIndicator size="large" color="#ffffff" />
              <Text className="text-white ml-2">Creating wallet...</Text>
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
              accent={true}
              text={isLoading ? 'Creating...' : 'Next'}
              disable={isLoading}
              customStyle={
                walletName.trim().length > 0 && !isLoading
                  ? 'bg-custom_accent w-full mt-2'
                  : 'bg-white w-full mt-2'
              }
            />
          </View>
        </View>
      </View>
      <StepIndicator totalSteps={5} currentStep={4} />
    </Wrapper>
  );
}
