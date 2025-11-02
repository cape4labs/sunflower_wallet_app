import { View } from 'react-native';
import { MnemonicInput } from './MnemonicInput';
import { useEffect, useState } from 'react';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';

type MnemonicDisplayType = {
  mnemonicLength: number | null;
  onChange: (words: string[]) => void;
  initialWords?: string[];
};

export function MnemonicDisplayInput({
  mnemonicLength,
  onChange,
  initialWords,
}: MnemonicDisplayType) {
  const styles = useWalletScreenStyles().mnemonic;

  // Init state
  const [words, setWords] = useState<string[]>(() => {
    console.log('Initializing words with:', initialWords);
    return initialWords && mnemonicLength && initialWords.length === mnemonicLength
      ? [...initialWords]
      : Array.from({ length: mnemonicLength || 0 }, () => '');
  });

  // Sync with initialWords for pasted words
  useEffect(() => {
    if (
      mnemonicLength &&
      initialWords &&
      initialWords.length === mnemonicLength &&
      JSON.stringify(initialWords) !== JSON.stringify(words)
    ) {
      console.log('Syncing words with initialWords:', initialWords);
      setWords([...initialWords]);
    }
  }, [initialWords, mnemonicLength, words]);

  // If words was changed
  useEffect(() => {
    console.log('Words updated in effect:', words);
    if (onChange && mnemonicLength) onChange(words);
  }, [words, onChange, mnemonicLength]);

  if (!mnemonicLength) return null;

  // Two columns
  const half = mnemonicLength / 2;

  const handleChange = (text: string, idx: number) => {
    const updated = [...words];
    updated[idx] = text;
    setWords(updated);
  };

  return (
    <View className={`flex-row h-auto bg-custom_complement ${styles.container}`}>
      <View className={`flex-1 flex-col justify-between ${styles.columnMargin}`}>
        {Array.from({ length: half }, (_, i) => (
          <MnemonicInput
            key={`left-${i}`}
            idx={i + 1}
            onChange={text => handleChange(text, i)}
            value={words[i] || ''}
          />
        ))}
      </View>
      <View className={`flex-1 flex-col justify-between ${styles.columnMargin}`}>
        {Array.from({ length: half }, (_, i) => (
          <MnemonicInput
            key={`right-${i}`}
            idx={i + 1 + half}
            onChange={text => handleChange(text, i + half)}
            value={words[i + half] || ''}
          />
        ))}
      </View>
    </View>
  );
}
