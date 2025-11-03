import { View, TextInput } from 'react-native';
import TextWithFont from '../../../shared/components/TextWithFont';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';

type MnemonicWordType = {
  idx: number;
  onChange: (text: string) => void;
  value: string;
};

// A component used for inputins words that are part of a mnemonic
export function MnemonicInput({ idx, onChange, value }: MnemonicWordType) {
  const styles = useWalletScreenStyles().mnemonicInput;

  return (
    <View
      className={`flex-row w-full items-center rounded-lg bg-custom_border ${styles.container}`}
    >
      <TextWithFont customStyle="text-white">{idx}.</TextWithFont>
      <TextInput
        className={`flex-1 h-full text-white rounded-md ${styles.input}`}
        onChangeText={onChange}
        autoCapitalize="none"
        value={value}
      />
    </View>
  );
}
