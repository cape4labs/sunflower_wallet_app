import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import Wrapper from '../../../shared/components/Wrapper';
import { Token } from '../../WalletHome/screens/MainWalletScreen';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import { useState } from 'react';
import { ArrowLeft, ArrowDown } from 'lucide-react-native';
import { formatNumber } from '../../../shared/components/TokenList';

type SendScreenProp = NativeStackNavigationProp<RootNavigatorTypeParamListType, 'SendScreen'>;

type RouteParams = {
  token: Token;
};

export default function SendScreen() {
  const navigation = useNavigation<SendScreenProp>();
  const route = useRoute();
  const { token } = (route.params || {}) as RouteParams;
  // const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const getIcon = (symbol: string) => {
    switch (symbol.toUpperCase()) {
      case 'BTC':
        return require('../../../../assets/icons/bitcoin.png');
      case 'STX':
        return require('../../../../assets/icons/stacks.png');
      default:
        return null;
    }
  };

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

  // const handleSend = () => {
  //   console.log(`Sending ${amount} ${token.symbol} to ${recipient}`);
  //   navigation.goBack();
  // };

  return (
    <Wrapper>
      <View className="flex-col flex-1 p-4 w-full h-full">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft color={'#FF5500'} size={'30px'} />
          </Pressable>
          <Text className="text-white text-2xl">Send</Text>
          <Text />
        </View>
        <View className="mt-5">
            <View className="flex-row justify-between bg-custom_complement p-5 border-4 border-l-0 border-r-8 rounded-b-none border-custom_border rounded-xl">
                <View className="flex-row justify-center items-center">
                    <View>
                        <Image source={getIcon(token.symbol)} />
                    </View>
                    <View className="ml-2">
                        <View className="flex-row justify-center items-center">
                            <Text className="text-white text-xl">{token.name}</Text>
                        </View>
                        <View>
                            <Text className="text-gray-400">${formatNumber(token.balanceUsd)}</Text>
                        </View>
                    </View>
                </View>
                <View className="flex-col items-end">
                    <Text className="text-white text-xl">
                        {formatNumber(token.balance)} {token.symbol}
                    </Text>
                    <Text className="text-gray-400">${formatNumber(token.cost)}</Text>
                </View>
            </View>
        </View>
        <View className="relative bg-custom_complement  p-5 rounded-lg rounded-t-none border-4 border-l-0 border-r-8 border-t-0 mb-3 border-custom_border border-6px">
            <View className='flex-row justify-between w-max-full'>
                <TextInput
                    className="text-3xl text-white w-4/5"
                    placeholder="0"
                    placeholderTextColor="#fff"
                    value={recipient}
                    keyboardType = 'numeric'
                    onChangeText={setRecipient}
                />
                <Pressable>
                    <Text className='text-white'>MAX</Text>
                </Pressable>
            </View>
            <Text className='text-gray-400'>$0</Text>
        </View>
        <View className="relative bg-custom_complement p-2 border-4 w-full rounded-xl border-custom_border ">
            <View className='absolute rounded-full items-center justify-center bg-custom_complement w-14 h-14 border-2 border-custom_border left-1/3 -top-full'>
                <ArrowDown 
                size={'30px'}
                />
            </View>
            <TextInput
                className="text-lg text-gray-400"
                placeholder="Enter recepient"
                placeholderTextColor="#9ca3af"
                value={recipient}
                onChangeText={setRecipient}
            />
        </View>
      </View>
    </Wrapper>
  );
}
