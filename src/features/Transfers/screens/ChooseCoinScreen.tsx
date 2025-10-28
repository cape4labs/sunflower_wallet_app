import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import Wrapper from '../../../shared/components/Wrapper';
import { TokenList } from '../../../shared/components/TokenList';
import { Token } from '../../WalletHome/screens/MainWalletScreen';
import { View, Text, Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useWalletData } from '../../../shared/hooks/useWalletData';

type ChooseCoinScreenProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'ChooseCoinScreen'
>;

type RouteParams = {
  tokens?: Token[];
  walletName: string;
};

export default function ChooseCoinScreen() {
  const navigation = useNavigation<ChooseCoinScreenProp>();
  const route = useRoute();
  const { tokens: initialTokens, walletName } = (route.params || {}) as RouteParams;
  const [tokens, setTokens] = useState<Token[] | undefined>(initialTokens);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const { walletData, isLoadingWalletData, errorWalletData } = useWalletData(walletName);

  console.log(walletBalance);

  const fetchTokensCosts = async (stxAddress: string, btcAddress: string) => {
    if (!stxAddress && !btcAddress) {
      setTokens([]);
      setTokenError('No wallet addresses provided');
      setTokenLoading(false);
      return;
    }

    setTokenLoading(true);
    setTokenError(null);

    try {
      let stxBalance = '0.00';
      let btcBalance = '0.00';

      if (stxAddress) {
        const stxResponse = await fetch(
          `https://api.hiro.so/extended/v1/address/${stxAddress}/balances?unanchored=true`,
          { headers: { Accept: 'application/json' } },
        );
        if (!stxResponse.ok) throw new Error(`HTTP error for STX! status: ${stxResponse.status}`);
        const stxData = await stxResponse.json();
        const balanceRaw = stxData.stx?.balance;
        if (balanceRaw) {
          const parsed = balanceRaw.startsWith('0x')
            ? parseInt(balanceRaw, 16)
            : Number(balanceRaw);
          stxBalance = (parsed / 1e6).toFixed(2);
        }
      }

      if (btcAddress) {
        const btcResponse = await fetch(`https://blockstream.info/api/address/${btcAddress}`);
        if (!btcResponse.ok) throw new Error(`HTTP error for BTC! status: ${btcResponse.status}`);
        const btcData = await btcResponse.json();
        const totalSatoshi = btcData.chain_stats.funded_txo_sum - btcData.chain_stats.spent_txo_sum;
        btcBalance = (totalSatoshi / 1e8).toFixed(2);
      }

      const priceResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=blockstack,bitcoin&vs_currencies=usd',
      );
      if (!priceResponse.ok)
        throw new Error(`HTTP error for prices! status: ${priceResponse.status}`);
      const prices = await priceResponse.json();
      const stxPrice = prices.blockstack?.usd || 0;
      const btcPrice = prices.bitcoin?.usd || 0;

      const newTokens = [
        {
          name: 'Stacks',
          symbol: 'STX',
          balanceUsd: (Number(stxBalance) * stxPrice).toFixed(2),
          balance: stxBalance,
          cost: stxPrice.toString(),
        },
        {
          name: 'Bitcoin',
          symbol: 'BTC',
          balanceUsd: (Number(btcBalance) * btcPrice).toFixed(2),
          balance: btcBalance,
          cost: btcPrice.toString(),
        },
      ];

      setTokens(newTokens);
      setTokenError(null);
      setTokenLoading(false);

      const totalBalance = newTokens
        .reduce((sum, token) => sum + Number(token.balanceUsd), 0)
        .toFixed(2);
      setWalletBalance(totalBalance);
    } catch (err) {
      setTokenError(
        `Error fetching balances: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
      setTokenLoading(false);
      setWalletBalance('0.00');
    }
  };

  useEffect(() => {
    if (walletData && walletData.stxAddress && walletData.btcAddress) {
      fetchTokensCosts(walletData.stxAddress, walletData.btcAddress);
    }
  }, [walletData]);

  const handleTokenSelect = (token: Token) => {
    if (!walletName) {
      console.log('No wallet name available');
      return;
    }
    navigation.navigate('SendScreen', { token, walletName });
  };

  if (!tokens || tokens.length === 0) {
    return (
      <Wrapper>
        <View className="flex-col flex-1 p-4">
          <Text className="text-white text-xl mb-4">No tokens available</Text>
          <Pressable onPress={() => navigation.goBack()} className="p-2 bg-gray-700 rounded-lg">
            <Text className="text-white text-center">Back</Text>
          </Pressable>
        </View>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <View className="flex-col w-full h-full">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft color={'#FF5500'} size={'30px'} />
          </Pressable>
          <Text className="text-white text-2xl">Choose crypto</Text>
          <Text />
        </View>
        {isLoadingWalletData ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white">Loading wallet data...</Text>
          </View>
        ) : errorWalletData ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-500">{errorWalletData}</Text>
            <Pressable
              onPress={() => navigation.goBack()}
              className="mt-4 p-2 bg-gray-700 rounded-lg"
            >
              <Text className="text-white text-center">Back</Text>
            </Pressable>
          </View>
        ) : (
          <TokenList
            tokens={tokens}
            isLoading={tokenLoading}
            error={tokenError}
            onTokenPress={handleTokenSelect}
            inMainScreen={false}
            customStyle={'h-auto p-5 mt-10'}
          />
        )}
      </View>
    </Wrapper>
  );
}
