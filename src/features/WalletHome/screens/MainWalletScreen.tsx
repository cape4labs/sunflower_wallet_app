import { useNavigation, useRoute } from '@react-navigation/native';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Wrapper from '../../../shared/components/Wrapper';
import { View, Pressable, Image, Text, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { getWalletList, getWalletData, WalletData } from '../../../shared/walletPersitance';
import { SelectWallet } from '../components/SelectWallet';
import UserGraph from '../components/UserGraph';
import { Button, TextButton } from '../components/Button';
import { CopyToClipboard } from '../../../shared/utils/copyToClipboard';
import { TokenList } from '../../../shared/components/TokenList';

type MainWalletScreenProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'WalletTabs',
  'MainWallet'
>;

type RouteParams = {
  walletName?: string;
};

export interface Token {
  name: string;
  symbol: string;
  cost: string;
  balanceUsd: string;
  balance: string;
}

export default function MainWalletScreen() {
  const navigation = useNavigation<MainWalletScreenProp>();
  const route = useRoute();
  const { walletName: initialWalletName } = (route.params || {}) as RouteParams;
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [walletList, setWalletList] = useState<string[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);

  console.log(error);
  // Cuz i'm tired of synchronizing states :/
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
          cost: stxPrice,
        },
        {
          name: 'Bitcoin',
          symbol: 'BTC',
          balanceUsd: (Number(btcBalance) * btcPrice).toFixed(2),
          balance: btcBalance,
          cost: btcPrice,
        },
      ];

      setTokens(newTokens);
      setTokenError(null);
      setTokenLoading(false);

      // Calculate total wallet balance in USD
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
    const loadWallets = async () => {
      setIsLoading(true);
      try {
        const list = await getWalletList();
        setWalletList(list);

        if (initialWalletName) {
          setSelectedWallet(initialWalletName);
          const selectedWalletData = await getWalletData(initialWalletName);
          if (selectedWalletData) {
            setWalletData(selectedWalletData);
            await fetchTokensCosts(selectedWalletData.stxAddress, selectedWalletData.btcAddress);
          } else {
            setError('Wallet data not found');
          }
        } else if (list.length > 0 && !selectedWallet) {
          setSelectedWallet(list[0]);
          const selectedWalletData = await getWalletData(list[0]);
          if (selectedWalletData) {
            setWalletData(selectedWalletData);
            await fetchTokensCosts(selectedWalletData.stxAddress, selectedWalletData.btcAddress);
          }
        }
      } catch (err) {
        setError('Failed to load wallet list: ' + (err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    loadWallets();
  }, [initialWalletName, setSelectedWallet, setWalletData, selectedWallet]);

  const handleSelectWallet = async (newWalletName: string) => {
    if (selectedWallet !== newWalletName) {
      setSelectedWallet(newWalletName);
      setIsLoading(true);
      setError(null);

      try {
        const userWalletData = await getWalletData(newWalletName);
        if (userWalletData) {
          setWalletData(userWalletData);
          await fetchTokensCosts(userWalletData.stxAddress, userWalletData.btcAddress);
        } else {
          setWalletData(null);
          setError('Wallet data not found');
          setWalletBalance(null);
        }
      } catch (err) {
        const errorMessage = 'Error fetching wallet data: ' + (err as Error).message;
        setError(errorMessage);
        setWalletData(null);
        setWalletBalance(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSend = (tokens: Token[]) => {
    if (tokens.length === 0) {
      setError('No tokens available to send');
      return;
    }
    navigation.navigate('ChooseCoinScreen', { tokens });
  };

  const shortenAddress = (address: string | undefined) => {
    if (!address) return 'Loading...';
    return `${address.slice(0, 5)}...${address.slice(-3)}`;
  };

  return (
    <Wrapper>
      <View className="flex-col flex-1">
        <View className="flex-row justify-around items-center gap-10">
          <Pressable
            onPress={() =>
              walletData && fetchTokensCosts(walletData.stxAddress, walletData.btcAddress)
            }
          >
            <Image source={require('../../../../assets/icons/refresh.png')} />
          </Pressable>
          <View className="mb-0 rounded-t-xl bg-custom_border">
            <SelectWallet
              selectedWallet={selectedWallet}
              walletList={walletList}
              onSelect={handleSelectWallet}
            />
          </View>
          <View />
        </View>
        <View className="w-full p-2 bg-custom_border relative mt-0 rounded-lg">
          <UserGraph />
          <View className="flex-row mt-1">
            <Button
              onPress={() => handleSend(tokens)}
              text="Send"
              customStyle="w-1/2"
              iconName="Send"
            />
            <Button text="Receive" customStyle="w-1/2" accent={true} iconName="Upload" />
          </View>
          <View className="absolute p-6 left-5 flex-col w-full items-center justify-center">
            <Text className="text-4xl text-white font-bold z-1 items-center justify-center">
              ${walletBalance || '0.00'}
            </Text>
            <Pressable
              onPress={() => CopyToClipboard(walletData?.stxAddress || null)}
              className="flex-row gap-2 justify-center items-center"
            >
              <Text className="text-sm text-yellow-50 z-20 items-center justify-center">
                {shortenAddress(walletData?.stxAddress)}
              </Text>
              <Image source={require('../../../../assets/icons/Copy.png')} />
            </Pressable>
          </View>
        </View>
        <View className="flex-row mt-4">
          <TextButton text="Tokens" customStyle="w-1/3" accent />
          <TextButton text="Actions" customStyle="w-1/3" />
          <TextButton text="NFT" customStyle="w-1/3" />
        </View>
        <View className="mt-4">
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <TokenList
              tokens={tokens}
              isLoading={tokenLoading}
              error={tokenError}
              customStyle={'h-full'}
            />
          )}
        </View>
      </View>
    </Wrapper>
  );
}
