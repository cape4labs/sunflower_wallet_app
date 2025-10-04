import { generateMnemonic as scureGenerateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

export function generateMnemonic() {
  return scureGenerateMnemonic(wordlist, 256);
}
