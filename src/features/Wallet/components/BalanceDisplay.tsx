import { View, Text } from 'react-native';

interface BalanceDisplayProps {
  balance: string | number;
  address: string | null;
}

export function BalanceDisplay({ balance, address }: BalanceDisplayProps) {
  return (
    <View className="bg-gray-700 p-4 rounded-lg mb-4">
      <Text className="text-white text-2xl text-center">${balance || '0.00'}</Text>
      <Text className="text-gray-400 text-center text-sm">
        {address?.substring(0, 6) || 'Loading...'}...
      </Text>
    </View>
  );
}
