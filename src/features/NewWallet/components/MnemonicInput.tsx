import { View, TextInput } from 'react-native';
import TextWithFont from '../../../shared/components/TextWithFont';

type MnemonicWordType = {
  idx: number;
  onChange: (text: string) => void;
  value: string;
};

// A component used for inputins words that are part of a mnemonic
export function MnemonicInput({ idx, onChange, value }: MnemonicWordType) {
  return (
    <View className="flex-row w-full px-2 my-1 p-2 bg-custom_border items-center rounded-lg">
      <TextWithFont customStyle="text-white">{idx}.</TextWithFont>
      <TextInput
        className="flex-1 h-full text-white rounded-md text-lg"
        onChangeText={onChange}
        autoCapitalize="none"
        value={value}
      />
    </View>
  );
}
