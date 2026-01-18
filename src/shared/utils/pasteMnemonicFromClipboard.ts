import { validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

import { pasteTextFromClipboard } from './clipboard';

export default async function pasteMnemonicFromClipboard(
  expectedMnemonicLength: number,
  setMnemonic: (words: string[]) => void,
): Promise<void> {
  const clipboardText = await pasteTextFromClipboard();
  if (!clipboardText) {
    // TODO: show a warning to user that there's no text in the clipboard
    return;
  }

  const sanitizedClipboardText = clipboardText.trim();
  const words = separateByWhitespace(sanitizedClipboardText);

  try {
    checkMnemonic(words, expectedMnemonicLength);
    setMnemonic(words);
  } catch (e) {
    // TODO: show an error to user instead of logging it
    console.error(e);
  }
}

export function checkMnemonic(potentialMnemonic: string[], expectedMnemonicLength: number): void {
  if (expectedMnemonicLength != 12 && expectedMnemonicLength != 24) {
    throw new Error('expected mnemonic length can\'t be other than 12 or 24');
  }

  // Check if amount of words separated by whitespaces matches
  // the expected mnemonic length
  if (potentialMnemonic.length !== expectedMnemonicLength) {
    throw new Error('mnemonic doesn\'t match expected length');
  }

  const concatenatedPotentialMnemonic = potentialMnemonic.join(' ');
  if (concatenatedPotentialMnemonic.toLowerCase() != concatenatedPotentialMnemonic) {
    throw new Error('mnemonic words can\'t be in upper register');
  }

  // Validate if mnemonic contains only allowed words
  if (!validateMnemonic(concatenatedPotentialMnemonic, wordlist)) {
    throw new Error('mnemonic utilizes unpermitted words');
  }
}

function separateByWhitespace(text: string): string[] {
  return text.split(/\s+/);
}
