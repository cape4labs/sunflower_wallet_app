import { Text, View } from 'react-native';

type MnemonicWordType = {
  idx: number;
  word: string;
};

// A component used for displaying words that are part of a mnemonic
export function MnemonicWord({ idx, word }: MnemonicWordType) {
  return (
    <View className="grow-1">
      {/*TODO adjust height and weight*/}
      <View className="flex-row items-center h-20 min-w-64">
        <View className="w-12 justify-center items-center">
          <Text>{idx}.</Text>
        </View>
        <View className="justify-center items-start">
          <Text>{word}</Text>
        </View>
      </View>
    </View>
  );
}
