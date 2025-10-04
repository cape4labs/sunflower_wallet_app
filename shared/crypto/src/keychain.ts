import { generateMnemonic as scureGenerateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

// 128 = 12 words; 256 = 24 words;
const MNEMONIC_STRENGTH = 128;

export function generateMnemonic() {
  return scureGenerateMnemonic(wordlist, MNEMONIC_STRENGTH);
}
