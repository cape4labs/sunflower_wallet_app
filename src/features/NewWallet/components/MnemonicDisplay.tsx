import { View } from 'react-native';
import { MnemonicWord } from '../components/MnemonicWord';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';

type MnemonicDisplayType = {
  mnemonic: string | null;
  className: string;
};

export function MnemonicDisplay({ mnemonic, className }: MnemonicDisplayType) {
  const styles = useWalletScreenStyles().mnemonic;
  if (!mnemonic) return null;

  const words = mnemonic.split(' ');
  const half = Math.ceil(words.length / 2);
  const leftColumn = words.slice(0, half);
  const rightColumn = words.slice(half);

  return (
    <View className={`flex-row h-auto bg-custom_complement ${styles.container} ${className}`}>
      <View className={`flex-1 flex-col justify-between ${styles.columnMargin}`}>
        {leftColumn.map((word, idx) => (
          <MnemonicWord key={word + idx} idx={idx + 1} word={word} />
        ))}
      </View>
      <View className={`flex-1 flex-col justify-between ${styles.columnMargin}`}>
        {rightColumn.map((word, idx) => (
          <MnemonicWord key={word + idx + half} idx={idx + 1 + half} word={word} />
        ))}
      </View>
    </View>
  );
}
