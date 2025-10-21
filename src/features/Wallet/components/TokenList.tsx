import { View, Text, ActivityIndicator, FlatList, Image } from 'react-native';

interface Token {
  name: string;
  symbol: string;
  balance: string;
}

interface TokenListProps {
  tokens: Token[];
  isLoading: boolean;
  error: string | null;
}

export function TokenList({ tokens, isLoading, error }: TokenListProps) {
  if (isLoading) {
    return <ActivityIndicator size="large" color="#fff" />;
  }

  if (error) {
    return <Text className="text-red-500">{error}</Text>;
  }

  const getIcon = (symbol: string) => {
    switch (symbol.toUpperCase()) {
      case 'BTC':
        return require('../../../../assets/icons/bitcoin.png');
      case 'STX':
        return require('../../../../assets/icons/stacks.png');
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
                  <Text className="text-gray-400">${item.balance}</Text>
                </View>
              </View>
            </View>
            <View className="flex-col items-end">
              <Text className="text-white text-xl">
                {item.balance} {item.symbol}
              </Text>
              <Text className="text-gray-400">${item.balance}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text className="text-white">No tokens available</Text>}
      />
    </View>
  );
}
