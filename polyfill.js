// Fix `Error: crypto.getRandomValues must be defined react-native`
// which is not available in React Native and used by @scure/bip39
// https://www.npmjs.com/package/react-native-get-random-values
import 'react-native-get-random-values';

// Speed up crypto operations
// https://www.npmjs.com/package/react-native-quick-crypto?activeTab=readme
import { install } from 'react-native-quick-crypto';
install();

// https://github.com/maksimlya/react-native-fast-encoder/
import TextEncoder from 'react-native-fast-encoder';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextEncoder;

import { Buffer } from 'buffer/';
import process from 'process';
global.process = process;
global.Buffer = Buffer;
