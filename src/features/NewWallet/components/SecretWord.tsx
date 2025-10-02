import { Text, View } from 'react-native';

type SecretPhraseWord = {
  idx: number;
  word: string;
};

export function SecretWord({ idx, word }: SecretPhraseWord) {
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
