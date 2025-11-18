import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import Wrapper from '../../../shared/components/Wrapper';
import { Token } from '../../../shared/types/Token';
import { View, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import { Button } from '../../../shared/components/Button';
import Coin from '../../../shared/components/Coin';
import TextWithFont from '../../../shared/components/TextWithFont';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';

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
  const styles = useWalletScreenStyles().sendScreen;

  if (!token || !walletName) {
    return (
      <Wrapper>
        <View className="flex-col flex-1 p-4">
          <TextWithFont customStyle="text-white text-xl mb-4">
            No token or wallet data selected
          </TextWithFont>
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
      <View className={`flex-col w-full h-full`}>
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft color={'#FF5500'} size={parseInt(styles.arrowSize)} />
          </Pressable>
          <TextWithFont customStyle={`${styles.titleSize} text-white`}>Send</TextWithFont>
          <View />
        </View>

        <View
          className={`${styles.coinsMargin} bg-custom_complement rounded-xl rounded-b-none border-custom_border ${styles.coinCard}`}
        >
          <Coin token={token} />
        </View>

        <View
          className={`bg-custom_complement rounded-lg rounded-t-none border-custom_border border-t-0 mb-3 ${styles.coinCard}`}
        >
          <View className="flex-row justify-between w-full">
            <TextInput
              className={`text-white flex-1 ${styles.amountInput}`}
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
              <TextWithFont customStyle={`text-white ${styles.maxButton}`}>MAX</TextWithFont>
            </Pressable>
          </View>
          <TextWithFont customStyle={`text-gray-400 ${styles.usdText}`}>${usdAmount}</TextWithFont>
        </View>

        <View
          className={`bg-custom_complement rounded-xl mb-5 w-full border-custom_border ${styles.coinCard}`}
        >
          <TextInput
            className={`text-gray-400 w-full ${styles.recipientInput}`}
            placeholder="Enter recipient"
            placeholderTextColor="#9ca3af"
            value={recipient}
            onChangeText={setRecipient}
          />
        </View>

        {sendError ? (
          <TextWithFont customStyle={`text-red-500 mt-4 text-center ${styles.errorText}`}>
            {sendError}
          </TextWithFont>
        ) : (
          <></>
        )}
        <Button text="Send" onPress={handleSend} accent />
      </View>
    </Wrapper>
  );
}
