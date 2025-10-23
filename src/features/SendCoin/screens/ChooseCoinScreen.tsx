import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import Wrapper from '../../../shared/components/Wrapper';
import { TokenList } from '../../../shared/components/TokenList';
import { Token } from '../../WalletHome/screens/MainWalletScreen';
import { View, Text, Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
type ChooseCoinScreenProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'ChooseCoinScreen'
>;

type RouteParams = {
  tokens?: Token[];
};

export default function ChooseCoinScreen() {
  const navigation = useNavigation<ChooseCoinScreenProp>();
  const route = useRoute();
  const { tokens } = (route.params || {}) as RouteParams;

  const handleTokenSelect = (token: Token) => {
    navigation.navigate('SendScreen', { token });
  };

  if (!tokens || tokens.length === 0) {
    return (
      <Wrapper>
        <View className="flex-col flex-1 p-4">
          <Text className="text-white text-xl mb-4">No tokens available</Text>
          <Pressable
            onPress={() => navigation.goBack()}
            className="p-2 bg-gray-700 rounded-lg"
          >
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
            <ArrowLeft
              color={'#FF5500'}
              size={'30px'}
            />
          </Pressable>
          <Text className="text-white text-2xl">Choose crypto</Text>
          <Text></Text>
        </View>
        <TokenList
          tokens={tokens}
          isLoading={false}
          error={null}
          onTokenPress={handleTokenSelect}
          inMainScreen={false}
          customStyle={'h-auto p-5 mt-10'}
        />
      </View>
    </Wrapper>
  );
}