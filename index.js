/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import './polyfill';
import { Crypto } from '@peculiar/webcrypto';
import 'react-native-get-random-values';

// Fix `Error: crypto.getRandomValues must be defined react-native`
// which is not available in React Native and used by @scure/bip39
// https://www.npmjs.com/package/react-native-get-random-values

Object.assign(global.crypto, new Crypto());

AppRegistry.registerComponent(appName, () => App);
