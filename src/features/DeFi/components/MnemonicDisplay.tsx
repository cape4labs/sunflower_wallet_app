import { View } from 'react-native';

import { MnemonicWord } from '../components/MnemonicWord';

type MnemonicDisplayType = {
  mnemonic: string | null;
};

export function MnemonicDisplay({ mnemonic }: MnemonicDisplayType) {
  if (!mnemonic) return null;

  const words = mnemonic.split(' ');
  const half = Math.ceil(words.length / 2);

  const leftColumn = words.slice(0, half);
  const rightColumn = words.slice(half);

  return (
    <View className="flex-row w-[90%] h-3/5 border-4 border-custom_border rounded-5 bg-custom_complement my-5">
      <View className="flex-1 flex-col justify-between p-2">
        {leftColumn.map((word, idx) => (
          <MnemonicWord key={word + idx} idx={idx + 1} word={word} />
        ))}
      </View>

      <View className="flex-1 flex-col justify-between p-2">
        {rightColumn.map((word, idx) => (
          <MnemonicWord key={word + idx + half} idx={idx + 1 + half} word={word} />
        ))}
      </View>
    </View>
  );
}
