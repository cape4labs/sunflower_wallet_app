import { View } from 'react-native';
import { MnemonicInput } from './MnemonicInput';
import { useEffect, useState } from 'react';

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
  const leftColumn = words.slice(0, half);
  const rightColumn = words.slice(half);

  const handleChange = (text: string, idx: number) => {
    const updated = [...words];
    updated[idx] = text;
    setWords(updated);
  };

  return (
    <View className="flex-row h-auto border-[6px] border-custom_border rounded-xl bg-custom_complement my-5">
      <View className="flex-1 flex-col justify-between m-2">
        {leftColumn.map((_, idx) => (
          <MnemonicInput
            key={`left-${idx}`}
            idx={idx + 1}
            onChange={text => handleChange(text, idx)}
            value={words[idx] || ''}
          />
        ))}
      </View>
      <View className="flex-1 flex-col justify-between m-2">
        {rightColumn.map((_, idx) => (
          <MnemonicInput
            key={`right-${idx}`}
            idx={idx + 1 + half}
            onChange={text => handleChange(text, idx + half)}
            value={words[idx + half] || ''}
          />
        ))}
      </View>
    </View>
  );
}
