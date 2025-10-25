import { useNavigation, useRoute } from '@react-navigation/native';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Wrapper from '../../../shared/components/Wrapper';
import { View, Pressable, Image, Text, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { getWalletList } from '../../../shared/walletPersitance';
import { SelectWallet } from '../components/SelectWallet';
import UserGraph from '../components/UserGraph';
import { Button, TextButton } from '../components/Button';
import { CopyToClipboard } from '../../../shared/utils/copyToClipboard';
import { TokenList } from '../../../shared/components/TokenList';
import { useWalletData } from '../../../shared/hooks/useWalletData';
import shortenAddress from '../../../shared/utils/shortAddress';

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
  const [walletList, setWalletList] = useState<string[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(initialWalletName || null);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Tokens' | 'Actions' | 'NFT'>('Tokens'); 

  const { walletData, isLoadingWalletData, errorWalletData } = useWalletData(selectedWallet);

  console.log(errorWalletData);

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
    const loadWallets = async () => {
      try {
        const list = await getWalletList();
        setWalletList(list);

        if (!selectedWallet && list.length > 0) {
          setSelectedWallet(list[0]);
        }
      } catch (err) {
        setError('Failed to load wallet list: ' + (err as Error).message);
      }
    };
    loadWallets();
  });

  useEffect(() => {
    if (walletData && walletData.stxAddress && walletData.btcAddress) {
      fetchTokensCosts(walletData.stxAddress, walletData.btcAddress);
    }
  }, [walletData]);

  const handleSelectWallet = async (newWalletName: string) => {
    console.log('Selected wallet:', newWalletName);
    setSelectedWallet(newWalletName);
  };

  const handleSend = (tokensForChoose: Token[]) => {
    if (tokensForChoose.length === 0) {
      setError('No tokens available to send');
      return;
    }
    if (!selectedWallet) {
      setError('No wallet name provided!');
      return;
    }
    navigation.navigate('ChooseCoinScreen', {
      tokens: tokensForChoose,
      walletName: selectedWallet
    });
  };

  const TokensView = () => (
    <TokenList tokens={tokens} isLoading={tokenLoading} error={tokenError} customStyle={'h-full'} />
  );

  const ActionsView = () => (
    <View className="mt-4 flex-col h-[65%] items-center bg-custom_border p-1 rounded-xl">
      <View className="flex-row h-1/2">
        <Button text="Swap" customStyle="w-1/2" iconName="RefreshCw" />
        <Button text="Bridge" customStyle="w-1/2" iconName="RefreshCw" />
      </View>
      <View className="flex-row h-1/2">
        <Button text="BTCfi" customStyle="w-1/2" iconName="DatabaseIcon" accent />
        <Button text="Buy" customStyle="w-1/2" iconName="PlusCircle" />
      </View>
    </View>
  );

  const NFTView = () => (
    <View className="mt-4">
      <Text className="text-white text-center">NFT Content Here</Text>
    </View>
  );

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
              <Image source={require('../../../../assets/icons/copy.png')} />
            </Pressable>
          </View>
        </View>
        <View className="flex-row mt-4">
          <TextButton
            text="Tokens"
            customStyle="w-1/3"
            accent={activeTab === 'Tokens'}
            onPress={() => setActiveTab('Tokens')}
          />
          <TextButton
            text="Actions"
            customStyle="w-1/3"
            accent={activeTab === 'Actions'}
            onPress={() => setActiveTab('Actions')}
          />
          <TextButton
            text="NFT"
            customStyle="w-1/3"
            accent={activeTab === 'NFT'}
            onPress={() => setActiveTab('NFT')}
          />
        </View>
        <View className="mt-4 ">
          {isLoadingWalletData ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : error ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-red-500">{error}</Text>
            </View>
          ) : activeTab === 'Tokens' ? (
            <TokensView />
          ) : activeTab === 'Actions' ? (
            <ActionsView />
          ) : (
            <NFTView />
          )}
        </View>
      </View>
    </Wrapper>
  );
}
