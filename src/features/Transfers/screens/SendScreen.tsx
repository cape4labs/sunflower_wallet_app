import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import Wrapper from '../../../shared/components/Wrapper';
import { Token } from '../../WalletHome/screens/MainWalletScreen';
import { View, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import { Button } from '../../NewWallet/components/__tests__/Button';
import Coin from '../../../shared/components/Coin';
import TextWithFont from '../../../shared/components/TextWithFont';


type SendScreenProp = NativeStackNavigationProp<RootNavigatorTypeParamListType, 'SendScreen'>;

type RouteParams = {
  token: Token;
  walletName: string;
};

export default function SendScreen() {
  const navigation = useNavigation<SendScreenProp>();
  const route = useRoute();
  const { token, walletName } = (route.params || {}) as RouteParams;
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);

  if (!token || !walletName) {
    return (
      <Wrapper>
        <View className="flex-col flex-1 p-4">
          <TextWithFont customStyle="text-white text-xl mb-4">No token or wallet data selected</TextWithFont>
          <Pressable onPress={() => navigation.goBack()} className="p-2 bg-gray-700 rounded-lg">
            <TextWithFont customStyle="text-white text-center">Back</TextWithFont>
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
      setSendError('Please enter amount and recipient address');
      return;
    }
    if (Number(amount) > Number(token.balance)) {
      setSendError('Insufficient balance');
      return;
    }
    if (!walletName) {
      setSendError('Wallet name not loaded');
      return;
    }

    navigation.navigate('SendInfoScreen', { token, amount, recipient, walletName });
  };

  return (
    <Wrapper>
      <View className="flex-col w-full h-full">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft color={'#FF5500'} size={'30px'} />
          </Pressable>
          <TextWithFont customStyle="text-white text-2xl">Send</TextWithFont>
          <TextWithFont></TextWithFont>
        </View>
        <View className="mt-10 bg-custom_complement p-5 border-4 border-custom_border rounded-xl rounded-b-none">
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
              <TextWithFont customStyle="text-white">MAX</TextWithFont>
            </Pressable>
          </View>
          <TextWithFont customStyle="text-gray-400">${usdAmount}</TextWithFont>
        </View>
        <View className="relative bg-custom_complement p-2 border-4 mb-5 w-full rounded-xl border-custom_border">
          <TextInput
            className="text-lg text-gray-400 w-full"
            placeholder="Enter recipient"
            placeholderTextColor="#9ca3af"
            value={recipient}
            onChangeText={setRecipient}
          />
        </View>
        {sendError ? (
          <TextWithFont customStyle="text-red-500 mt-4 text-center">{sendError}</TextWithFont>
        ) : (
          <Button text="Send" onPress={handleSend} accent />
        )}
      </View>
    </Wrapper>
  );
}
