import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { broadcastTransaction, makeSTXTokenTransfer } from '@stacks/transactions';
import { ArrowLeft, CircleUser } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';

import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { Button } from '../../../shared/components/Button';
import Coin from '../../../shared/components/Coin';
import TextWithFont from '../../../shared/components/TextWithFont';
import Wrapper from '../../../shared/components/Wrapper';
import { useWalletData, useWalletPrivateData } from '../../../shared/hooks/useWalletData';
import { Token } from '../../../shared/types/Token';

type SendInfoScreenProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'SendInfoScreen'
>;

type RouteParams = {
  token: Token;
  amount: string;
  recipient: string;
  walletName: string;
};

type TransactionState =
  | 'idle'
  | 'estimating'
  | 'ready'
  | 'sending'
  | 'broadcasted'
  | 'confirmed'
  | 'failed';

export default function SendInfoScreen() {
  const navigation = useNavigation<SendInfoScreenProp>();
  const route = useRoute();
  const { token, amount, recipient, walletName } = (route.params || {}) as RouteParams;
  const { walletData } = useWalletData(walletName);
  const { privateData, privateDataError } = useWalletPrivateData(walletName);

  const [txState, setTxState] = useState<TransactionState>('estimating');
  const [gasFee, setGasFee] = useState<bigint | null>(null);
  const [totalCost, setTotalCost] = useState<string>('0');
  const [error, setError] = useState<string | null>(null);
  const [txid, setTxid] = useState<string | null>(null);

  const amountInMicroSTX = BigInt(Math.floor(Number(amount) * 1000000));

  const transactionToken: Token = {
    ...token,
    balance: amount,
    balanceUsd: (Number(amount) * Number(token.cost)).toFixed(2),
  };

  useEffect(() => {
    const estimateGas = async () => {
      if (!privateData?.stxPrivateKey) return;
      setTxState('estimating');
      try {
        const response = await fetch('https://api.hiro.so/v2/fees/transfer');
        if (!response.ok) throw new Error('Failed to fetch fee');

        const feeRate = BigInt(await response.text());
        const estimatedFee = feeRate * 200n;

        setGasFee(estimatedFee);
        const total = Number(amountInMicroSTX + estimatedFee) / 1_000_000;
        setTotalCost(total.toFixed(6));
        setTxState('ready');
      } catch (err) {
        setError('Cannot estimate gas');
        setTxState('idle');
      }
    };
    estimateGas();
  }, [amount, privateData?.stxPrivateKey]);

  const handleSend = async () => {
    if (!gasFee || !privateData?.stxPrivateKey) return;

    setTxState('sending');
    setError(null);

    try {
      const transaction = await makeSTXTokenTransfer({
        recipient,
        amount: amountInMicroSTX,
        senderKey: privateData.stxPrivateKey,
        network: 'mainnet',
        memo: 'Sunflower Wallet',
        fee: gasFee,
      });

      setTxState('broadcasted');
      const broadcastResponse = await broadcastTransaction({
        transaction,
        network: 'mainnet',
      });

      if (!broadcastResponse.txid) throw new Error('No txid returned');

      setTxid(broadcastResponse.txid);
      setTxState('confirmed');

      setTimeout(() => {
        navigation.navigate('WalletTabs', {
          screen: 'MainWalletScreen',
          params: { walletName },
        });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
      setTxState('failed');
    }
  };

  const goBack = () => {
    if (txState === 'sending' || txState === 'broadcasted') {
      Alert.alert(
        'Transaction is sending',
        'Are you sure, that you want to leave? Transaction will be proccessing at the background',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Back', onPress: () => navigation.goBack() },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  if (!token || !walletName) {
    return (
      <Wrapper>
        <View className="flex-1 p-4 justify-center">
          <TextWithFont customStyle="text-white text-xl mb-4">No data</TextWithFont>
          <Button text="Back" onPress={goBack} />
        </View>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <View className={'flex-col w-full h-full'}>
        <View className="flex-row items-center justify-between mb-10">
          <Pressable onPress={goBack}>
            <ArrowLeft color={'#FF5500'} className="w-[25px] h-[25px] md:w-[30px] md:h-[30px]" />
          </Pressable>
          <TextWithFont customStyle={`text-xl md:text-3xl text-white`}>Send Token</TextWithFont>
          <View />
        </View>

        <View className="m-1 md:m-2">
          <TextWithFont customStyle="text-white mb-3 font-normal text-sm md:text-base">
            You'll send
          </TextWithFont>
          <Coin token={transactionToken} inMainScreen={false} />
          <TextWithFont customStyle="text-white text-lg md:text-2xl mt-4 font-normal">To:</TextWithFont>
          <View className="mt-4 flex-row items-center justify-start w-[80%]">
            <CircleUser className="w-[30px] h-[30px] md:w-[35px] md:h-[35px]" />
            <TextWithFont customStyle={`text-white pl-4 text-base md:text-lg`}>
              {recipient}
            </TextWithFont>
          </View>
        </View>

        <View className={`w-full border-t-2 border-white m-3 md:m-4`} />

        {txState === 'estimating' && (
          <View className="items-center py-4">
            <ActivityIndicator size="small" color="#FF5500" />
            <TextWithFont customStyle={`text-gray-400 mt-2 text-xs md:text-sm`}>
              Gas estimating...
            </TextWithFont>
          </View>
        )}

        {txState === 'ready' && gasFee && (
          <View>
            <TextWithFont customStyle={`text-white text-base md:text-lg`}>Gas:</TextWithFont>
            <TextWithFont customStyle={`text-white font-normal m-4 text-sm md:text-base`}>
              {(Number(gasFee) / 1_000_000).toFixed(6)} STX
            </TextWithFont>
            <TextWithFont customStyle={`text-white text-base md:text-lg mt-1`}>
              Total spend:
            </TextWithFont>
            <TextWithFont customStyle={`text-white font-normal m-4 text-sm md:text-base`}>
              {totalCost} STX
            </TextWithFont>
            <Button text="Send" onPress={handleSend} accent customStyle="mt-4" />
          </View>
        )}

        {(txState === 'sending' || txState === 'broadcasted') && (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color="#FF5500" />
            <TextWithFont customStyle={`text-white text-lg md:text-xl mt-4`}>
              {txState === 'sending' ? 'Creating transaction...' : 'Sending on chain...'}
            </TextWithFont>
            <TextWithFont customStyle={`text-gray-400 text-sm md:text-base mt-2`}>
              It will take about 30 seconds
            </TextWithFont>
          </View>
        )}

        {txState === 'confirmed' && txid && (
          <View className="flex-1 items-center justify-center py-10">
            <TextWithFont customStyle={`text-green-400 text-xl md:text-3xl mb-2`}>
              Success!
            </TextWithFont>
            <TextWithFont customStyle={`text-gray-400 text-xs md:text-sm`}>
              TXID: {txid.slice(0, 8)}...{txid.slice(-6)}
            </TextWithFont>
            <TextWithFont customStyle={`text-gray-400 text-xs md:text-sm mt-4`}>
              Redirecting to the main screen...
            </TextWithFont>
          </View>
        )}

        {txState === 'failed' && error && (
          <View className="flex-1 items-center justify-center py-10">
            <TextWithFont customStyle={`text-red-400 text-lg md:text-2xl mb-4`}>Error</TextWithFont>
            <TextWithFont
              customStyle={`text-gray-400 text-sm md:text-base text-center px-4`}
            >
              {error}
            </TextWithFont>
            <Button text="Retry" onPress={handleSend} customStyle="mt-6" />
            <Button text="Back" onPress={goBack} customStyle="mt-2" />
          </View>
        )}
      </View>
    </Wrapper>
  );
}
