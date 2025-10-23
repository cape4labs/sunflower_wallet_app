import { View, Text, FlatList, Image } from 'react-native';

interface Token {
  name: string;
  symbol: string;
  balance: string;
  balanceUsd: string;
  cost: string;
}

interface TokenListProps {
  tokens: Token[];
  isLoading: boolean;
  error: string | null;
}

const formatNumber = (value: string): string => {
  const num = Number(value); 
  const precision = num < 1 ? 3 : 2; 
  const fixed = num.toFixed(precision); 
  const parts = fixed.split('.'); 
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
};

export function TokenList({ tokens, error }: TokenListProps) {
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
    <View className="flex-col h-full bg-custom_complement px-4 border-[6px] border-custom_border rounded-2xl">
      <FlatList
        data={tokens}
        keyExtractor={item => item.symbol}
        renderItem={({ item }) => (
          <View className="flex-row justify-between mt-3">
            <View className="flex-row justify-center items-center">
              <View>
                <Image source={getIcon(item.symbol)} />
              </View>
              <View className="ml-2">
                <View className="flex-row justify-center items-center">
                  <Text className="text-white text-xl">{item.name}</Text>
                  <Text className="text-green-500 ml-1">+1.27%</Text>
                </View>
                <View>
                  <Text className="text-gray-400">${formatNumber(item.balanceUsd)}</Text>
                </View>
              </View>
            </View>
            <View className="flex-col items-end">
              <Text className="text-white text-xl">
                {item.balance} {item.symbol}
              </Text>
              <Text className="text-gray-400">${formatNumber(item.cost)}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text className="text-white">No tokens available</Text>}
      />
    </View>
  );
}