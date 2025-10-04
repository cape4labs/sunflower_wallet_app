import { Text, View } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

export function ImportWalletScreen() {
  // const navigation = useNavigation();
  return (
    <View className="flex-col justify-end items-center w-[80%]">
      <View className="flex-col ">
        <Text className="text-white text-2xl">Choose the length for </Text>
        <Text className="text-white text-2xl">the seed phrase</Text>
      </View>
    </View>
  );
}
