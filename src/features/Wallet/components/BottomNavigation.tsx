import { View, Text } from 'react-native';

export function BottomNavigation() {
  return (
    <View className="flex-row justify-around p-2 bg-gray-800 mt-auto">
      <Text className="text-gray-400">Home</Text>
      <Text className="text-gray-400">Docs</Text>
      <Text className="text-gray-400">Settings</Text>
    </View>
  );
}
