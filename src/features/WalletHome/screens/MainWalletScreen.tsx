import { View, Pressable, ActivityIndicator, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RefreshCcw } from 'lucide-react-native';

import Wrapper from '../../../shared/components/Wrapper';
import TextWithFont from '../../../shared/components/TextWithFont';
import { SelectWallet } from '../components/SelectWallet';
import { Button, TextButton } from '../components/Button';
import { TokenList } from '../../../shared/components/TokenList';
import PriceGraph from '../components/PriceGraph';
import NftTab from '../components/Tabs/NftTab';
import ActionsTab from '../components/Tabs/ActionsTab';

import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';
import { useWalletContext } from '../../../providers/WalletContext';
import { useWalletData } from '../../../shared/hooks/useWalletData';
import useWalletTokens from '../hooks/useWalletTokens';
import useWalletList from '../hooks/useWalletList';
import { CopyToClipboard } from '../../../shared/utils/copyToClipboard';
import shortenAddress from '../../../shared/utils/shortAddress';
import type { Token } from '../../../shared/types/Token';
import type { RootNavigatorTypeParamListType } from '../../../navigation/types';
import usePriceHistory from '../hooks/usePriceHistory';
import preparePricesForGraph from '../preparePricesForGraph';

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
  );
  const priceHistoryForGraph = preparePricesForGraph(tokens, priceHistory.data);
  const [activeTab, setActiveTab] = useState<'Tokens' | 'Actions' | 'NFT'>('Tokens');

  const globalStyles = useWalletScreenStyles().global;
  const screenStyles = useWalletScreenStyles().mainWalletScreen;

  useEffect(() => {
    if (walletData?.stxAddress && walletData?.btcAddress) {
      fetchTokensCosts(walletData.stxAddress, walletData.btcAddress);
    }
  }, [walletData]);

  useEffect(() => {
    if (selectedWallet) setWalletName(selectedWallet);
  }, [selectedWallet]);

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
              walletData && fetchTokensCosts(walletData.stxAddress, walletData.btcAddress)
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
          className={`w-full ${screenStyles.containerPadding} bg-custom_border relative rounded-lg`}
        >
          <PriceGraph lineData={priceHistoryForGraph.data} />
          <View className={`flex-row ${screenStyles.sendReceiveButtonGap}`}>
            <Button
              text="Send"
              onPress={() => handleSend(tokens)}
              customStyle="w-1/2"
              iconName="Send"
            />
            <Button
              text="Receive"
              onPress={() =>
                selectedWallet &&
                navigation.navigate('ReceiveScreen', { walletName: selectedWallet, tokens })
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
              onPress={() => CopyToClipboard(walletData?.stxAddress || null)}
              className="flex-row gap-2 justify-center items-center"
            >
              <TextWithFont customStyle={`${screenStyles.addressText} text-yellow-50`}>
                {shortenAddress(walletData?.stxAddress)}
              </TextWithFont>
              <Image
                source={require('../../../../assets/icons/copy.png')}
                className={screenStyles.addressCopyIcon}
              />
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
              tokens={tokens}
              isLoading={tokenLoading}
              error={tokenError}
              customStyle="h-full"
            />
          ) : activeTab === 'Actions' ? (
            <ActionsTab actionsHeight={screenStyles.actionsHeight} />
          ) : (
            <NftTab />
          )}
        </View>
      </View>
    </Wrapper>
  );
}
