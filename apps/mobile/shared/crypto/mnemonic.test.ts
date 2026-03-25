import { generateMnemonic } from './mnemonic';
import { wordlistUsedForMnemonicValidation } from './wordlist';

describe('generate mnemonics', () => {
  it('entropy 128, length 12', () => {
    const entropy: 128 = 128;
    const length: 12 = 12;

    const mnemonic = generateMnemonic(entropy);
    mnemonicTestHelper(mnemonic, length);
  });

  it('entropy 256, length 24', () => {
    const entropy: 256 = 256;
    const length: 24 = 24;

    const mnemonic = generateMnemonic(entropy);
    mnemonicTestHelper(mnemonic, length);
  });
});

function mnemonicTestHelper(mnemonic: string, wordAmount: number): void {
  expect(typeof mnemonic).toBe('string');
  expect(typeof wordAmount).toBe('number');

  const splitMnemonic = mnemonic.split(' ');
  expect(splitMnemonic.length).toBe(wordAmount);

  expect(
    splitMnemonic.every(word => wordlistUsedForMnemonicValidation.includes(word)),
  ).toBeTruthy();
}
