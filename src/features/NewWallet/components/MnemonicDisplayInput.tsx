import { ReactNode } from 'react';
import { View } from 'react-native';

import { MnemonicInput } from './MnemonicInput';

type MnemonicDisplayType = {
  mnemonic: string[];
  setMnemonic: (words: string[]) => void;
};

export default function MnemonicDisplayInput({ mnemonic, setMnemonic }: MnemonicDisplayType) {
  // Two columns
  const half = mnemonic.length / 2;

  if (half !== mnemonic.length - half) {
    throw new Error('Critical error: half != mnemonicLength - half');
  }

  const handleChange = (text: string, idx: number) => {
    const updated = [...mnemonic];
    updated[idx] = text;
    setMnemonic(updated);
  };

  return (
    <View className="flex-row h-auto bg-custom_complement border-2 rounded-lg my-3 md:rounded-xl md:my-5">
      <Column>
        {Array.from({ length: half }, (_, i) => (
          <MnemonicInput
            key={`left-${i}`}
            idx={i + 1}
            onChange={text => handleChange(text, i)}
            value={mnemonic[i] || ''}
          />
        ))}
      </Column>
      <Column>
        {Array.from({ length: half }, (_, i) => (
          <MnemonicInput
            key={`right-${i}`}
            idx={i + 1 + half}
            onChange={text => handleChange(text, i + half)}
            value={mnemonic[i + half] || ''}
          />
        ))}
      </Column>
    </View>
  );
}

const Column = ({ children }: { children: ReactNode }) => {
  return <View className="flex-1 flex-col justify-between m-1 md:m-2">{children}</View>;
};
