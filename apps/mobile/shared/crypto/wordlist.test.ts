import { wordlistUsedForMnemonicValidation } from './wordlist';

it('english wordlist used for mnemonic validation must be 2048 words long', () => {
  expect(wordlistUsedForMnemonicValidation.length).toBe(2048);
});
