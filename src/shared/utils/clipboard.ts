import Clipboard from '@react-native-clipboard/clipboard';
import { validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

export const copyToClipboard = (data: string | null) => {
  if (!data) {
    return null;
  }
  Clipboard.setString(data);
};

type PasteMnemonicProps = {
  mnemonicLength: number | null;
  setMnemonic: (words: string[]) => void;
};

export async function pasteMnemonicFromClipboard({
  mnemonicLength,
  setMnemonic,
}: PasteMnemonicProps) {
  try {
    const clipboardText = await Clipboard.getString();
    if (!clipboardText) {
      console.error('Clipboard is empty');
      return;
    }

    const words = clipboardText.trim().split(/\s+/);
    if (mnemonicLength === null || words.length !== mnemonicLength) {
      console.error(`Mnemonic must contain ${mnemonicLength} words`);
      return;
    }

    const fullMnemonic = words.join(' ');
    if (!validateMnemonic(fullMnemonic, wordlist)) {
      console.error('Invalid mnemonic phrase');
      return;
    }

    setMnemonic(words);
  } catch (error) {
    console.error('Paste error', error);
  }
}
