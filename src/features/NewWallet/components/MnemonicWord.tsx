import { View } from 'react-native';
import TextWithFont from '../../../shared/components/TextWithFont';

type MnemonicWordType = {
  idx: number;
  word: string;
};

// A component used for displaying words that are part of a mnemonic
export function MnemonicWord({ idx, word }: MnemonicWordType) {
  return (
    <View className="flex-row w-full px-2 p-4 my-1 bg-custom_border justify-center rounded-lg">
      <TextWithFont customStyle="flex-1 p-2 text-white rounded-md text-lg">
        {idx}. {word}
      </TextWithFont>
    </View>
  );
}
