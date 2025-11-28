import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import './polyfill';
import App from './src/App';

AppRegistry.registerComponent(appName, () => App);
