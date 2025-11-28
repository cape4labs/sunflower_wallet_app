import { TextInput, View } from 'react-native';

import TextWithFont from '../../../shared/components/TextWithFont';

type MnemonicWordType = {
  idx: number;
  onChange: (text: string) => void;
  value: string;
};

// A component used for inputins words that are part of a mnemonic
export function MnemonicInput({ idx, onChange, value }: MnemonicWordType) {
  return (
    <View
      className={
        'flex-row w-full items-center rounded-lg bg-custom_border px-1 p-1.5 my-0.5 md:px-2 md:p-2 md:my-1'
      }
    >
      <TextWithFont customStyle="text-white">{idx}.</TextWithFont>
      <TextInput
        className={'flex-1 h-full text-white rounded-md text-base md:text-lg'}
        onChangeText={onChange}
        autoCapitalize="none"
        value={value}
      />
    </View>
  );
}
