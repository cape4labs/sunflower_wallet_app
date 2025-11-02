import { View } from 'react-native';
import TextWithFont from '../../../shared/components/TextWithFont';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';

type MnemonicWordType = {
  idx: number;
  word: string;
};

// A component used for displaying words that are part of a mnemonic
export function MnemonicWord({ idx, word }: MnemonicWordType) {
  const styles = useWalletScreenStyles().mnemonicWord;

  return (
    <View className={`flex-row w-full justify-center rounded-lg bg-custom_border ${styles.container}`}>
      <TextWithFont customStyle={`flex-1 p-2 text-white rounded-md ${styles.text}`}>
        {idx}. {word}
      </TextWithFont>
    </View>
  );
}