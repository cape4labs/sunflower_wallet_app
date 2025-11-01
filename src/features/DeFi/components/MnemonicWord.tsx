import { View } from 'react-native';
import TextWithFont from '../../../shared/components/TextWithFont';

type MnemonicWordType = {
  idx: number;
  word: string;
};

// A component used for displaying words that are part of a mnemonic
export function MnemonicWord({ idx, word }: MnemonicWordType) {
  return (
    <View className="flex-1 p-2 m-1 bg-custom_border items-center justify-center rounded-lg">
      <TextWithFont customStyle="text-white ">
        {idx}. {word}
      </TextWithFont>
    </View>
  );
}
