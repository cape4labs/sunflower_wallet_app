import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Copy, RefreshCcw } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import type { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { useWalletContext } from '../../../providers/WalletContext';
import { Button } from '../../../shared/components/Button';
import TextWithFont from '../../../shared/components/TextWithFont';
import { TokenList } from '../../../shared/components/TokenList';
import Wrapper from '../../../shared/components/Wrapper';
import { useWalletData } from '../../../shared/hooks/useWalletData';
import type { Token } from '../../../shared/types/Token';
import { copyTextToClipboard } from '../../../shared/utils/clipboard';
import shortenAddress from '../../../shared/utils/shortAddress';
import PriceGraph from '../components/PriceGraph';
import { SelectWallet } from '../components/SelectWallet';
import ActionsTab from '../components/tabs/ActionsTab';
import NftTab from '../components/tabs/NftTab';
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

type CategoryButtonsType = 'Tokens' | 'Actions' | 'NFT';

export default function MainWalletScreen() {
  const navigation = useNavigation<MainWalletScreenProp>();
  const route = useRoute();
  const { walletName: initialWalletName } = route.params as RouteParams;
  const priceHistory = usePriceHistory();

  const { walletName, setWalletName } = useWalletContext();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(
    initialWalletName || walletName || null,
  );

  const [activeTab, setActiveTab] = useState<CategoryButtonsType>('Tokens');

  const { walletList, error } = useWalletList(selectedWallet, setSelectedWallet);
  const { walletData, isLoadingWalletData } = useWalletData(selectedWallet);

  const { tokens, tokenError, tokenLoading, walletBalance, fetchTokensCosts } = useWalletTokens(
    priceHistory.data || null,
    walletData?.stxAddress,
    walletData?.btcAddress,
  );

  const filteredTokens = useMemo(() => tokens.filter(t => !t.isDeFi), [tokens]);
  const priceHistoryForGraph = preparePricesForGraph(priceHistory.data, filteredTokens);

  useEffect(() => {
    if (selectedWallet) setWalletName(selectedWallet);
  }, [selectedWallet]);

  useFocusEffect(
    useCallback(() => {
      fetchTokensCosts();
    }, [fetchTokensCosts]),
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
        <View className="flex-row justify-around items-center">
          <Pressable onPress={() => fetchTokensCosts()}>
            <RefreshCcw size={25} color="#fff" strokeWidth={1.5} />
          </Pressable>
          <SelectWallet
            selectedWallet={selectedWallet}
            walletList={walletList}
            onSelect={setSelectedWallet}
          />
          <View />
        </View>

        <View className="w-full p-1 mt-0 bg-custom_border relative rounded-lg">
          <PriceGraph lineData={priceHistoryForGraph.data} />
          <View className="flex-row sm:gap-0.5 md:gap-1">
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
            <TextWithFont customStyle="text-3xl text-white font-bold">
              ${walletBalance || '0.00'}
            </TextWithFont>
            <Pressable
              onPress={() => copyTextToClipboard(walletData?.stxAddress || null)}
              className="flex-row gap-2 justify-center items-center"
            >
              <TextWithFont customStyle="sm:text-xs md:text-sm text-yellow-50">
                {shortenAddress(walletData?.stxAddress)}
              </TextWithFont>
              <Copy size={12} color={'#fff'} />
            </Pressable>
          </View>
        </View>

        <CategoryButtons
          activeTab={activeTab}
          setActiveTab={e => setActiveTab(e as CategoryButtonsType)}
        />

        <View className="sm:mt-2 md:mt-3">
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
            <ActionsTab actionsHeight="h-2/3" walletName={selectedWallet} />
          ) : (
            <NftTab />
          )}
        </View>
      </View>
    </Wrapper>
  );
}

function CategoryButtons({
  activeTab,
  setActiveTab,
}: {
  activeTab: CategoryButtonsType;
  setActiveTab: (x: CategoryButtonsType) => void;
}) {
  return (
    <>
      <View className="flex-row p-5">
        {['Tokens', 'Actions', 'NFT'].map(tab => (
          <Button
            key={tab}
            text={tab}
            customStyle="w-1/3"
            sectionButton={true}
            accent={activeTab == tab}
            onPress={() => setActiveTab(tab as CategoryButtonsType)}
          />
        ))}
      </View>
    </>
  );
}
