import { View } from 'react-native';
import { MnemonicWord } from '../components/MnemonicWord';

type MnemonicDisplayType = {
  mnemonic: string | null;
};

export function MnemonicDisplay({ mnemonic }: MnemonicDisplayType) {
  if (!mnemonic) {
    return null;
  }
  const mnemonicSplit = mnemonic.split(' ');

  return (
    <View className="flex-col flex-wrap w-[90%] h-2/3 border-4 border-custom_border rounded-5 bg-custom_complement">
      {mnemonicSplit.map((word, idx) => (
        <MnemonicWord key={word + idx} idx={idx + 1} word={word} />
      ))}
    </View>
  );
}
