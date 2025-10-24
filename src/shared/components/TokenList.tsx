import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { Token } from '../../features/WalletHome/screens/MainWalletScreen';

interface TokenListProps {
  tokens: Token[];
  isLoading: boolean;
  error: string | null;
  onTokenPress?: (token: Token) => void;
  inMainScreen?: boolean;
  customStyle: string;
}

export const formatNumber = (value: string): string => {
  const num = Number(value);
  const precision = num < 1 ? 3 : 2;
  const fixed = num.toFixed(precision);
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
};

export function TokenList({
  tokens,
  isLoading,
  error,
  onTokenPress,
  inMainScreen = true,
  customStyle,
}: TokenListProps) {
  if (isLoading) {
    return <Text className="text-white">Loading...</Text>;
  }

  if (error) {
    return <Text className="text-red-500">{error}</Text>;
  }

  const getIcon = (symbol: string) => {
    switch (symbol.toUpperCase()) {
      case 'BTC':
        return require('../../../assets/icons/bitcoin.png');
      case 'STX':
        return require('../../../assets/icons/stacks.png');
      default:
        return null;
    }
  };

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
            <View className="flex-row justify-center items-center">
              <View>
                <Image source={getIcon(item.symbol)} />
              </View>
              <View className="ml-2">
                <View className="flex-row justify-center items-center">
                  <Text className="text-white text-xl">{item.name}</Text>
                  {inMainScreen ? <Text className="text-green-500 ml-1">+1.27%</Text> : <></>}
                </View>
                <View>
                  <Text className="text-gray-400">${formatNumber(item.balanceUsd)}</Text>
                </View>
              </View>
            </View>
            <View className="flex-col items-end">
              <Text className="text-white text-xl">
                {formatNumber(item.balance)} {item.symbol}
              </Text>
              <Text className="text-gray-400">${formatNumber(item.cost)}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<Text className="text-white">No tokens available</Text>}
      />
    </View>
  );
}
