import { useNavigation } from '@react-navigation/native';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Wrapper } from '../../../../shared/components/Wrapper';
import { View, Pressable, Image, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { getWalletData, WalletData } from '../../../../shared/crypto/mnemonic';
import { SelectWallet } from '../components/SelectWallet';
import { getWalletList } from '../../../../shared/crypto/mnemonic';
import UserGraph from '../components/UserGraph';
import { Button, TextButton } from '../components/Button';
import { CopyToClipboard } from '../../../../shared/utils/copyToClipboard';
import { TokenList } from '../components/TokenList';
import { useTokenBalances } from '../components/hooks/useTokenBalances';

type MainWalletScreenProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'MainWalletScreen'
>;

// type RouteParams = {
//   walletName: string;
// };

export function MainWalletScreen() {
  const navigation = useNavigation<MainWalletScreenProp>();
  console.log(navigation);
  // const route = useRoute();
  const [walletData, setWalletData] = useState<WalletData | undefined>(undefined);
  // const { walletName } = route.params as RouteParams;
  const [walletList, setWalletList] = useState<string[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log(error, isLoading);

  const {
    tokens: tokenBalances,
    error: tokenError,
    isLoading: tokenLoading,
  } = useTokenBalances({
    stxAddress: walletData?.stxAddress || null,
    btcAddress: walletData?.btcAddress || null,
  });

  // TODO: think how to get wallet data if user already had an account or it's new user
  useEffect(() => {
    const loadWallets = async () => {
      setIsLoading(true);
      try {
        const list = await getWalletList();
        setWalletList(list);
        if (list.length > 0 && !selectedWallet) {
          setSelectedWallet(list[0]);
        }
      } catch (err) {
        setError('Failed to load wallet list: ' + (err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    loadWallets();
  }, [selectedWallet]);

  const handleSelectWallet = async (walletName: string) => {
    setSelectedWallet(walletName);
    setIsLoading(true);
    setError(null);

    try {
      const userWalletData = await getWalletData(walletName);
      if (userWalletData) {
        setWalletData(userWalletData);
      } else {
        setWalletData(undefined);
        setError('Wallet data not found');
        setWalletBalance(null);
      }
    } catch (err) {
      const errorMessage = 'Error fetching wallet data: ' + (err as Error).message;
      setError(errorMessage);
      setWalletBalance(null);
      setWalletData(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const shortenAddress = (address: string | undefined) => {
    if (!address) return 'Loading...';
    return `${address.slice(0, 5)}...${address.slice(-3)}`;
  };

  return (
    <Wrapper>
      <View className="flex-col flex-1">
        {/* User wallets or create wallet also need to be reworked */}
        <View className="flex-row justify-around items-center gap-10">
          <Pressable>
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
        {/* User graph and text */}
        {/* TODO: think, how to center absolute balance and address  */}
        <View className="w-full p-2 bg-custom_border relative mt-0 rounded-lg">
          <UserGraph />
          <View className="flex-row mt-1">
            <Button text="Send" customStyle="w-1/2" imageSource="send.png" />
            <Button text="Recieve" customStyle="w-1/2" accent={true} imageSource="recieve.png" />
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

        {/* Implement switching around window */}
        <View className="flex-row mt-4">
          <TextButton text="Tokens" customStyle="w-1/3" accent />
          <TextButton text="Actions" customStyle="w-1/3" />
          <TextButton text="NFT" customStyle="w-1/3" />
        </View>

        <View className="mt-4">
          <TokenList tokens={tokenBalances} isLoading={tokenLoading} error={tokenError} />
        </View>
      </View>
    </Wrapper>
  );
}
