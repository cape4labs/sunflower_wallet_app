import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import Wrapper from '../../../shared/components/Wrapper';
import { View, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { ArrowLeft, CircleUser } from 'lucide-react-native';
import { makeSTXTokenTransfer, broadcastTransaction } from '@stacks/transactions';
import { Button } from '../../../shared/components/Button';
import Coin from '../../../shared/components/Coin';
import { useWalletData } from '../../../shared/hooks/useWalletData';
import TextWithFont from '../../../shared/components/TextWithFont';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';
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

  const styles = useWalletScreenStyles().sendInfoScreen;

  useEffect(() => {
    const estimateGas = async () => {
      if (!walletData?.stxPrivateKey) return;
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
  }, [amount, walletData?.stxPrivateKey]);

  const handleSend = async () => {
    if (!gasFee || !walletData?.stxPrivateKey) return;

    setTxState('sending');
    setError(null);

    try {
      const transaction = await makeSTXTokenTransfer({
        recipient,
        amount: amountInMicroSTX,
        senderKey: walletData.stxPrivateKey,
        network: 'mainnet',
        memo: 'Sunflower Wallet',
        fee: gasFee,
      });

      setTxState('broadcasted');
      const broadcastResponse = await broadcastTransaction({ transaction, network: 'mainnet' });

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
      <View className={`flex-col w-full h-full`}>
        <View className="flex-row items-center justify-between mb-10">
          <Pressable onPress={goBack}>
            <ArrowLeft color={'#FF5500'} size={styles.arrowSize} />
          </Pressable>
          <TextWithFont customStyle={`${styles.titleSize} text-white`}>Send Token</TextWithFont>
          <View />
        </View>

        <View className={styles.sectionMargin}>
          <TextWithFont customStyle="text-white mb-3 font-normal">You'll send</TextWithFont>
          <Coin token={transactionToken} inMainScreen={false} />
          <TextWithFont customStyle="text-white text-lg mt-4 font-normal">To:</TextWithFont>
          <View className="mt-4 flex-row items-center justify-start w-[80%]">
            <CircleUser size={parseInt(styles.recipientAvatar)} />
            <TextWithFont customStyle={`text-white pl-4 ${styles.recipientName}`}>
              {recipient}
            </TextWithFont>
          </View>
        </View>

        <View className={`w-full border-t-2 border-white ${styles.dividerMargin}`} />

        {txState === 'estimating' && (
          <View className="items-center py-4">
            <ActivityIndicator size="small" color="#FF5500" />
            <TextWithFont customStyle={`text-gray-400 mt-2 ${styles.loadingText}`}>
              Gas estimating...
            </TextWithFont>
          </View>
        )}

        {txState === 'ready' && gasFee && (
          <View>
            <TextWithFont customStyle={`text-white ${styles.gasLabel}`}>Gas:</TextWithFont>
            <TextWithFont customStyle={`text-white font-normal m-4 ${styles.gasValue}`}>
              {(Number(gasFee) / 1_000_000).toFixed(6)} STX
            </TextWithFont>
            <TextWithFont customStyle={`text-white ${styles.totalLabel} mt-1`}>
              Total spend:
            </TextWithFont>
            <TextWithFont customStyle={`text-white font-normal m-4 ${styles.totalValue}`}>
              {totalCost} STX
            </TextWithFont>
            <Button text="Send" onPress={handleSend} accent customStyle="mt-4" />
          </View>
        )}

        {(txState === 'sending' || txState === 'broadcasted') && (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color="#FF5500" />
            <TextWithFont customStyle={`text-white text-lg mt-4 ${styles.loadingText}`}>
              {txState === 'sending' ? 'Creating transaction...' : 'Sending on chain...'}
            </TextWithFont>
            <TextWithFont customStyle={`text-gray-400 text-sm mt-2 ${styles.loadingText}`}>
              It will take about 30 seconds
            </TextWithFont>
          </View>
        )}

        {txState === 'confirmed' && txid && (
          <View className="flex-1 items-center justify-center py-10">
            <TextWithFont customStyle={`text-green-400 ${styles.successText} mb-2`}>
              Success!
            </TextWithFont>
            <TextWithFont customStyle={`text-gray-400 ${styles.txidText}`}>
              TXID: {txid.slice(0, 8)}...{txid.slice(-6)}
            </TextWithFont>
            <TextWithFont customStyle={`text-gray-400 ${styles.redirectText} mt-4`}>
              Redirecting to the main screen...
            </TextWithFont>
          </View>
        )}

        {txState === 'failed' && error && (
          <View className="flex-1 items-center justify-center py-10">
            <TextWithFont customStyle={`text-red-400 ${styles.errorText} mb-4`}>Error</TextWithFont>
            <TextWithFont
              customStyle={`text-gray-400 text-sm text-center px-4 ${styles.errorText}`}
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
