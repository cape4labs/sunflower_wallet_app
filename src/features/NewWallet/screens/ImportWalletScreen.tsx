import { Text, View } from 'react-native';
import { Wrapper } from '../components/Wrapper';

export function ImportWalletScreen() {
  return (
    <Wrapper>
      <View className="flex-col justify-end items-center w-[80%]">
        <View className="flex-col ">
          <Text className="text-white text-2xl">Choose the length for </Text>
          <Text className="text-white text-2xl">the seed phrase</Text>
        </View>
      </View>
    </Wrapper>
  );
}
