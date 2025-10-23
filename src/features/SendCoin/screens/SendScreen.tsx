import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import Wrapper from '../../../shared/components/Wrapper';
import { Token } from '../../WalletHome/screens/MainWalletScreen';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';

type SendScreenProp = NativeStackNavigationProp<RootNavigatorTypeParamListType, 'SendScreen'>;

type RouteParams = {
  token: Token;
};

export default function SendScreen() {
  const navigation = useNavigation<SendScreenProp>();
  const route = useRoute();
  const { token } = (route.params || {}) as RouteParams;
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  if (!token) {
    return (
      <Wrapper>
        <View className="flex-col flex-1 p-4">
          <Text className="text-white text-xl mb-4">No token selected</Text>
          <Pressable onPress={() => navigation.goBack()} className="p-2 bg-gray-700 rounded-lg">
            <Text className="text-white text-center">Back</Text>
          </Pressable>
        </View>
      </Wrapper>
    );
  }

  const handleSend = () => {
    console.log(`Sending ${amount} ${token.symbol} to ${recipient}`);
    navigation.goBack();
  };

  return (
    <Wrapper>
      <View className="flex-col flex-1 p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-2xl">Send {token.symbol}</Text>
          <Pressable onPress={() => navigation.goBack()} className="p-2 bg-gray-700 rounded-lg">
            <Text className="text-white">Back</Text>
          </Pressable>
        </View>
        <View className="mb-4">
          <Text className="text-white mb-2">
            Available: {token.balance} {token.symbol}
          </Text>
          <Text className="text-gray-400 mb-2">(${token.balanceUsd})</Text>
          <TextInput
            className="bg-gray-800 text-white p-2 rounded-lg"
            placeholder="Amount"
            placeholderTextColor="#8b8b8b"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>
        <View className="mb-4">
          <TextInput
            className="bg-gray-800 text-white p-2 rounded-lg"
            placeholder="Recipient Address"
            placeholderTextColor="#8b8b8b"
            value={recipient}
            onChangeText={setRecipient}
          />
        </View>
        <Pressable
          onPress={handleSend}
          className="p-3 bg-orange-500 rounded-lg"
          disabled={!amount || !recipient}
        >
          <Text className="text-white text-center text-lg">Send</Text>
        </Pressable>
      </View>
    </Wrapper>
  );
}
