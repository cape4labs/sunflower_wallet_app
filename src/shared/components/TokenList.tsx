import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { Token } from '../../features/WalletHome/screens/MainWalletScreen';
import Coin from './Coin';

interface TokenListProps {
  tokens: Token[];
  isLoading: boolean;
  error: string | null;
  onTokenPress?: (token: Token) => void;
  inMainScreen?: boolean;
  customStyle: string;
}

export function TokenList({
  tokens,
  isLoading,
  error,
  onTokenPress,
  inMainScreen = true,
  customStyle,
}: TokenListProps) {
  if (isLoading) {
    return <ActivityIndicator size="large" color="#fff" className="mt-5" />;
  }

  if (error) {
    return <Text className="text-red-500">{error}</Text>;
  }

  return (
    <View
      className={`flex-col w-full bg-custom_complement p-4 border-[6px] border-custom_border rounded-2xl ${customStyle}`}
    >
      <FlatList
        data={tokens}
        keyExtractor={item => item.symbol}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onTokenPress && onTokenPress(item)}
            className="flex-row justify-between m-2"
          >
            <Coin token={item} inMainScreen={inMainScreen} />
          </Pressable>
        )}
        ListEmptyComponent={<Text className="text-white">No tokens available</Text>}
      />
    </View>
  );
}
