import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogoScreen } from '../screens/LogoScreen.tsx';

export const NewWalletNavigator = createNativeStackNavigator({
  InitialRouteName: 'LogoScreen',
  screens: {
    LogoScreen: LogoScreen,
  },
});
