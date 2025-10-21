import { View, Text, FlatList } from 'react-native';

interface Token {
  name: string;
  change: string;
  amount: string;
  value: string;
}

interface TokenListProps {
  tokens: Token[];
}

const renderTokenItem = ({ item }: { item: Token }) => (
  <View className="flex-row justify-between items-center p-4 bg-gray-800 rounded-lg mb-2">
    <View>
      <Text className="text-white text-lg">{item.name}</Text>
      <Text className="text-green-500 text-sm">{item.change}</Text>
    </View>
    <View className="items-end">
      <Text className="text-white text-lg">{item.amount}</Text>
      <Text className="text-white text-sm">{item.value}</Text>
    </View>
  </View>
);

export function TokenList({ tokens }: TokenListProps) {
  return (
    <View className="bg-gray-700 p-4 rounded-lg">
      <Text className="text-white text-xl mb-2">Tokens</Text>
      <FlatList
        data={tokens}
        renderItem={renderTokenItem}
        keyExtractor={item => item.name}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
