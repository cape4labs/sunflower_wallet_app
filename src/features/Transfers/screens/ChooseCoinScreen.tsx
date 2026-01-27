import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, View } from 'react-native';

import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import TextWithFont from '../../../shared/components/TextWithFont';
import { TokenList } from '../../../shared/components/TokenList';
import Wrapper from '../../../shared/components/Wrapper';
import { useWalletData } from '../../../shared/hooks/useWalletData';
import { Token } from '../../../shared/types/Token';
import useWalletTokens from '../../WalletHome/hooks/useWalletTokens';

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
  const { walletData, isLoadingWalletData, errorWalletData } = useWalletData(walletName);

  const l1Tokens = useMemo(() => {
    return initialTokens?.filter(t => !t.isDeFi) || [];
  }, [initialTokens]);

  const { tokens, tokenLoading, tokenError } = useWalletTokens(
    null,
    walletData?.stxAddress,
    walletData?.btcAddress,
  );

  const displayTokens = useMemo(
    () => (l1Tokens.length > 0 ? l1Tokens : tokens.filter(t => !t.isDeFi)),
    [l1Tokens, tokens],
  );

  const handleTokenSelect = (token: Token) => {
    if (!walletName) {
      console.log('No wallet name available');
      return;
    }
    navigation.navigate('SendScreen', { token, walletName });
  };

  if (!displayTokens || displayTokens.length === 0) {
    if (tokenLoading) {
      return (
        <Wrapper>
          <View className="flex-1 justify-center items-center">
            <TextWithFont customStyle="text-white">Loading tokens...</TextWithFont>
          </View>
        </Wrapper>
      );
    }
    return (
      <Wrapper>
        <View className="flex-col flex-1 p-4">
          <TextWithFont customStyle="text-white text-xl mb-4">No tokens available</TextWithFont>
          <Pressable onPress={() => navigation.goBack()} className="p-2 bg-gray-700 rounded-lg">
            <TextWithFont customStyle="text-white text-center">Back</TextWithFont>
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
            <ArrowLeft color={'#FF5500'} className="w-[25px] h-[25px] md:w-[30px] md:h-[30px]" />
          </Pressable>
          <TextWithFont customStyle={`text-white text-xl md:text-3xl`}>Choose crypto</TextWithFont>
          <TextWithFont customStyle="" />
        </View>
        {isLoadingWalletData ? (
          <View className="flex-1 justify-center items-center">
            <TextWithFont customStyle="text-white">Loading wallet data...</TextWithFont>
          </View>
        ) : errorWalletData ? (
          <View className="flex-1 justify-center items-center">
            <TextWithFont customStyle="text-red-500">{errorWalletData}</TextWithFont>
            <Pressable
              onPress={() => navigation.goBack()}
              className="mt-4 p-2 bg-gray-700 rounded-lg"
            >
              <TextWithFont customStyle="text-white text-center">Back</TextWithFont>
            </Pressable>
          </View>
        ) : (
          <TokenList
            tokens={displayTokens}
            isLoading={tokenLoading}
            error={tokenError}
            onTokenPress={handleTokenSelect}
            inMainScreen={false}
            customStyle={`h-auto mt-6 md:mt-10`}
          />
        )}
      </View>
    </Wrapper>
  );
}
