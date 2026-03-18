import { AllowedKeyEntropyBits, randomSeedPhrase } from '@stacks/wallet-sdk';

// 128 = 12 words; 256 = 24 words;
export function generateMnemonic(keyEntropy: AllowedKeyEntropyBits = 128) {
  return randomSeedPhrase(keyEntropy);
}
