import { Buffer } from 'buffer/';
import process from 'process';

// Fix `Error: crypto.getRandomValues must be defined react-native`
// which is not available in React Native and used by @scure/bip39
// https://www.npmjs.com/package/react-native-get-random-values
import 'react-native-get-random-values';

import { TextDecoder, TextEncoder } from 'text-encoding';

// Speed up crypto operations
// https://www.npmjs.com/package/react-native-quick-crypto?activeTab=readme
import { install } from 'react-native-quick-crypto';
install();

global.process = process;
global.Buffer = Buffer;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
