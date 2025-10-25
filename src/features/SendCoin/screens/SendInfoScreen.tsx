import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import Wrapper from '../../../shared/components/Wrapper';
import { Token } from '../../WalletHome/screens/MainWalletScreen';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import {
  makeSTXTokenTransfer,
  broadcastTransaction,
} from '@stacks/transactions';
import { WalletData } from '../../../shared/walletPersitance';
import { Button } from '../../NewWallet/components/Button';
import Coin from '../../../shared/components/Coin';

type SendInfoScreenProp = NativeStackNavigationProp<RootNavigatorTypeParamListType, 'SendInfoScreen'>;

type RouteParams = {
  token: Token;
  amount: string;
  recipient: string;
  walletData: WalletData;
};

export default function SendInfoScreen() {
  const navigation = useNavigation<SendInfoScreenProp>();
  const route = useRoute();
  const { token, amount, recipient, walletData } = (route.params || {}) as RouteParams;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gasFee, setGasFee] = useState<bigint | null>(null);
  const [totalCost, setTotalCost] = useState<string>('0');

  
  const transactionToken: Token = {
    name: token.name,
    symbol: token.symbol,
    cost: token.cost, 
    balance: amount, 
    balanceUsd: (Number(amount) * Number(token.cost)).toFixed(2), 
  };

  const amountInMicroSTX = BigInt(Math.floor(Number(amount) * 1000000));

  useEffect(() => {
    const estimateGas = async () => {
      if (!walletData.stxPrivateKey) return;
      setIsLoading(true);
      try {
        const response = await fetch('https://api.hiro.so/v2/fees/transfer', {
          headers: { 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch fee rate');
        
        const feeRate = BigInt(await response.text());
        const transactionSizeBytes = 200n; 
        const estimatedFee = feeRate * transactionSizeBytes; 
        
        setGasFee(estimatedFee);

        const totalMicroSTX = amountInMicroSTX + estimatedFee;
        const totalSTX = Number(totalMicroSTX) / 1000000;
        setTotalCost(totalSTX.toFixed(2));
      } catch (err) {
        setError(`Error estimating gas: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };
    estimateGas();
  }, [amount, recipient, walletData.stxPrivateKey, amountInMicroSTX]);

  const handleSend = async () => {
    if (!amount || !recipient || !walletData.stxPrivateKey || !gasFee) {
      setError('Missing required data for transaction');
      return;
    }
    if (Number(amount) > Number(token.balance)) {
      setError('Insufficient balance');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const network = 'mainnet';
      const transaction = await makeSTXTokenTransfer({
        recipient,
        amount: amountInMicroSTX,
        senderKey: walletData.stxPrivateKey,
        network,
        memo: 'Sunflower Wallet',
        fee: gasFee,
      });

      const response = await broadcastTransaction({
        transaction,
        network,
      });

      if (!response.txid) {
        throw new Error('Transaction failed');
      }

      console.log('Transaction ID:', response.txid);
      navigation.navigate('WalletTabs', {
        screen: 'MainWallet',
        params: {},
      });    
    } catch (err) {
      setError(`Error sending transaction: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <View className="flex-col p-4 w-full h-full">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft color={'#FF5500'} size={'30px'} />
          </Pressable>
          <Text className="text-white text-2xl">Send Confirmation</Text>
          <Text />
        </View>
        
        <View className="mt-5 bg-custom_complement p-5 border-4 border-custom_border rounded-xl">
          <Coin 
            token={transactionToken} 
            inMainScreen={false}
          />
          <Text className="text-white text-lg mt-4">Recipient: {recipient}</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" className="mt-4" />
        ) : error ? (
          <Text className="text-red-500 mt-4 text-center">{error}</Text>
        ) : gasFee ? (
          <View className="mt-4 bg-custom_complement p-5 border-4 border-custom_border rounded-xl">
            <Text className="text-white text-lg m-2">Gas Fee: {(Number(gasFee) / 1000000).toFixed(6)} STX</Text>
            <Text className="text-white text-lg m-2">Total Cost: {totalCost} STX</Text>
            <Button
              text="Confirm Send"
              onPress={handleSend}
              accent
              customStyle={'mt-4'}
            />
          </View>
        ) : (
          <Text className="text-gray-400 mt-4">Estimating gas...</Text>
        )}
      </View>
    </Wrapper>
  );
}