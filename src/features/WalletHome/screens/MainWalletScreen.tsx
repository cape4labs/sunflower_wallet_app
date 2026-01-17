import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Copy, RefreshCcw } from 'lucide-react-native';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { ActivityIndicator, Image, Pressable, View } from 'react-native';

import type { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { useWalletContext } from '../../../providers/WalletContext';
import TextWithFont from '../../../shared/components/TextWithFont';
import { TokenList } from '../../../shared/components/TokenList';
import Wrapper from '../../../shared/components/Wrapper';
import { useWalletData } from '../../../shared/hooks/useWalletData';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';
import type { Token } from '../../../shared/types/Token';
import { copyToClipboard } from '../../../shared/utils/clipboard';
import shortenAddress from '../../../shared/utils/shortAddress';
import { Button, TextButton } from '../components/Button';
import PriceGraph from '../components/PriceGraph';
import { SelectWallet } from '../components/SelectWallet';
import ActionsTab from '../components/Tabs/ActionsTab';
import NftTab from '../components/Tabs/NftTab';
import usePriceHistory from '../hooks/usePriceHistory';
import useWalletList from '../hooks/useWalletList';
import useWalletTokens from '../hooks/useWalletTokens';
import preparePricesForGraph from '../utils/preparePricesForGraph';

type MainWalletScreenProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'WalletTabs',
  'MainWallet'
>;

type RouteParams = {
  walletName?: string;
};

export default function MainWalletScreen() {
  const navigation = useNavigation<MainWalletScreenProp>();
  const route = useRoute();
  const { walletName: initialWalletName } = route.params as RouteParams;
  const priceHistory = usePriceHistory();

  const { walletName, setWalletName } = useWalletContext();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(
    initialWalletName || walletName || null,
  );

  const { walletList, error } = useWalletList(selectedWallet, setSelectedWallet);
  const { walletData, isLoadingWalletData } = useWalletData(selectedWallet);

  const { tokens, tokenError, tokenLoading, walletBalance, fetchTokensCosts } = useWalletTokens(
    priceHistory.data,
    walletData?.stxAddress,
    walletData?.btcAddress
  );

  const filteredTokens = useMemo(() => tokens.filter(t => !t.isDeFi), [tokens]);
  const priceHistoryForGraph = preparePricesForGraph(filteredTokens, priceHistory.data);
  const [activeTab, setActiveTab] = useState<'Tokens' | 'Actions' | 'NFT'>('Tokens');

  const globalStyles = useWalletScreenStyles().global;
  const screenStyles = useWalletScreenStyles().mainWalletScreen;

  useEffect(() => {
    if (selectedWallet) setWalletName(selectedWallet);
  }, [selectedWallet]);

  useFocusEffect(
    useCallback(() => {
      fetchTokensCosts();
    }, [fetchTokensCosts])
  );

  const handleSend = (tokensForChoose: Token[]) => {
    if (!selectedWallet) return;
    navigation.navigate('ChooseCoinScreen', {
      tokens: tokensForChoose,
      walletName: selectedWallet,
    });
  };

  return (
    <Wrapper>
      <View className="flex-col flex-1 w-full">
        <View className={`flex-row justify-around items-center ${screenStyles.headerGap}`}>
          <Pressable
            onPress={() =>
              fetchTokensCosts()
            }
          >
            <RefreshCcw
              size={parseInt(globalStyles.refreshIconSize)}
              color="#fff"
              strokeWidth={1.5}
            />
          </Pressable>
          <SelectWallet
            selectedWallet={selectedWallet}
            walletList={walletList}
            onSelect={setSelectedWallet}
          />
          <View />
        </View>

        <View
          className={`w-full ${screenStyles.containerPadding} mt-0 bg-custom_border relative rounded-lg`}
        >
          <PriceGraph lineData={priceHistoryForGraph.data} />
          <View className={`flex-row ${screenStyles.sendReceiveButtonGap}`}>
            <Button
              text="Send"
              onPress={() => handleSend(filteredTokens)}
              customStyle="w-1/2"
              iconName="Send"
            />
            <Button
              text="Receive"
              onPress={() =>
                selectedWallet &&
                navigation.navigate('ReceiveScreen', {
                  walletName: selectedWallet,
                  tokens: filteredTokens,
                })
              }
              customStyle="w-1/2"
              accent
              iconName="Upload"
            />
          </View>

          <View className="absolute p-6 left-3 flex-col w-full items-center justify-center">
            <TextWithFont customStyle={`${screenStyles.balanceText} text-white font-bold`}>
              ${walletBalance || '0.00'}
            </TextWithFont>
            <Pressable
              onPress={() => copyToClipboard(walletData?.stxAddress || null)}
              className="flex-row gap-2 justify-center items-center"
            >
              <TextWithFont customStyle={`${screenStyles.addressText} text-yellow-50`}>
                {shortenAddress(walletData?.stxAddress)}
              </TextWithFont>
              <Copy size={screenStyles.addressCopyIcon} color={'#fff'} />
            </Pressable>
          </View>
        </View>

        <View className={`flex-row ${globalStyles.containerPadding}`}>
          {['Tokens', 'Actions', 'NFT'].map(tab => (
            <TextButton
              key={tab}
              text={tab}
              customStyle="w-1/3"
              accent={activeTab === tab}
              onPress={() => setActiveTab(tab as any)}
            />
          ))}
        </View>

        <View className={screenStyles.tabsMargin}>
          {isLoadingWalletData ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : error ? (
            <TextWithFont customStyle="text-red-500 text-center">{error}</TextWithFont>
          ) : activeTab === 'Tokens' ? (
            <TokenList
              tokens={filteredTokens}
              isLoading={tokenLoading}
              error={tokenError}
              customStyle="h-full"
            />
          ) : activeTab === 'Actions' ? (
            <ActionsTab actionsHeight={screenStyles.actionsHeight} walletName={selectedWallet} />
          ) : (
            <NftTab />
          )}
        </View>
      </View>
    </Wrapper>
  );
}
