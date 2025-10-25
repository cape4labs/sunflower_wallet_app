import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import Wrapper from '../../../shared/components/Wrapper';
import { Token } from '../../WalletHome/screens/MainWalletScreen';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { ArrowLeft, ArrowDown } from 'lucide-react-native';
import { WalletData } from '../../../shared/walletPersitance';
import { Button } from '../../NewWallet/components/Button';
import Coin from '../../../shared/components/Coin';

type SendScreenProp = NativeStackNavigationProp<RootNavigatorTypeParamListType, 'SendScreen'>;

type RouteParams = {
  token: Token;
  walletData: WalletData;
};

export default function SendScreen() {
  const navigation = useNavigation<SendScreenProp>();
  const route = useRoute();
  const { token, walletData } = (route.params || {}) as RouteParams;
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log(setIsLoading);

  if (!token || !walletData) {
    return (
      <Wrapper>
        <View className="flex-col flex-1 p-4">
          <Text className="text-white text-xl mb-4">No token or wallet data selected</Text>
          <Pressable onPress={() => navigation.goBack()} className="p-2 bg-gray-700 rounded-lg">
            <Text className="text-white text-center">Back</Text>
          </Pressable>
        </View>
      </Wrapper>
    );
  }

  const usdAmount =
    isNaN(Number(amount)) || amount === '' ? '0' : (Number(amount) * Number(token.cost)).toFixed(2);

  const handleSend = () => {
    console.log('SENDING');
    if (!amount || !recipient) {
      setError('Please enter amount and recipient address');
      return;
    }
    if (Number(amount) > Number(token.balance)) {
      setError('Insufficient balance');
      return;
    }
    navigation.navigate('SendInfoScreen', { token, amount, recipient, walletData });
  };

  return (
    <Wrapper>
      <View className="flex-col p-4 w-full h-full">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft color={'#FF5500'} size={'30px'} />
          </Pressable>
          <Text className="text-white text-2xl">Send</Text>
          <Text />
        </View>
        <View className="mt-5 bg-custom_complement p-5 border-4 border-custom_border rounded-xl rounded-b-none">
          <Coin token={token} />
        </View>
        <View className="relative bg-custom_complement p-5 rounded-lg rounded-t-none border-4 border-t-0 mb-3 border-custom_border">
          <View className="flex-row justify-between w-full">
            <TextInput
              className="text-3xl text-white flex-1"
              placeholder="0"
              placeholderTextColor="#fff"
              keyboardType="numeric"
              value={amount}
              onChangeText={text => {
                if (!isNaN(Number(text)) && Number(text) <= Number(token.balance)) {
                  setAmount(text);
                }
              }}
            />
            <Pressable onPress={() => setAmount(token.balance)}>
              <Text className="text-white">MAX</Text>
            </Pressable>
          </View>
          <Text className="text-gray-400">${usdAmount}</Text>
        </View>
        <View className="relative bg-custom_complement p-2 border-4 mb-5 w-full rounded-xl border-custom_border">
          <View className="absolute top-[-70%] left-1/2 transform -translate-x-1/2">
            <View className="flex-row items-center justify-center bg-custom_complement p-3 rounded-full border-2 border-custom_border">
              <ArrowDown color="#fff" size={24} />
            </View>
          </View>
          <TextInput
            className="text-lg text-gray-400 w-full"
            placeholder="Enter recipient"
            placeholderTextColor="#9ca3af"
            value={recipient}
            onChangeText={setRecipient}
          />
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" className="mt-4" />
        ) : error ? (
          <Text className="text-red-500 mt-text-center ">{error}</Text>
        ) : (
          <Button text="send" onPress={handleSend} accent />
        )}
      </View>
    </Wrapper>
  );
}
