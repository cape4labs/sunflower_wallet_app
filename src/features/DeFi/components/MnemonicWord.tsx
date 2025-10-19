import { Text, View } from 'react-native';

type MnemonicWordType = {
  idx: number;
  word: string;
};

// A component used for displaying words that are part of a mnemonic
export function MnemonicWord({ idx, word }: MnemonicWordType) {
  return (
    <View className="flex-1 p-2 m-1 bg-custom_border items-center justify-center rounded-lg">
      {/*TODO adjust height and weight*/}
      <Text className="text-white ">
        {idx}. {word}
      </Text>
    </View>
  );
}
