import { View } from 'react-native';

import TextWithFont from '../../../shared/components/TextWithFont';

type MnemonicDisplayType = {
  mnemonic: string | null;
  className: string;
};

export function MnemonicDisplay({ mnemonic, className }: MnemonicDisplayType) {
  if (!mnemonic) return null;

  const words = mnemonic.split(' ');
  const half = Math.ceil(words.length / 2);
  const leftColumn = words.slice(0, half);
  const rightColumn = words.slice(half);

  return (
    <View
      className={`flex-row h-auto bg-custom_complement border-2 rounded-lg my-3 md:rounded-xl md:my-5  ${className}`}
    >
      <View className="flex-1 flex-col justify-between m-1 md:m-2">
        {leftColumn.map((word, idx) => (
          <MnemonicWord key={word + idx} idx={idx + 1} word={word} />
        ))}
      </View>
      <View className="flex-1 flex-col justify-between m-1 md:m-2">
        {rightColumn.map((word, idx) => (
          <MnemonicWord key={word + idx + half} idx={idx + 1 + half} word={word} />
        ))}
      </View>
    </View>
  );
}

type MnemonicWordType = {
  idx: number;
  word: string;
};

// A component used for displaying words that are part of a mnemonic
export function MnemonicWord({ idx, word }: MnemonicWordType) {
  return (
    <View className="flex-row w-full justify-center rounded-lg bg-custom_border px-1 p-2 my-0.5 md:px-2 md:p-2 md:my-1">
      <TextWithFont customStyle="flex-1 p-2 text-white rounded-md text-base md:text-lg">
        {idx}. {word}
      </TextWithFont>
    </View>
  );
}
