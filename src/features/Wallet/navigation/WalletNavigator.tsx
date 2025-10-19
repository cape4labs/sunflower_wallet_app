import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainWalletScreen } from '../screens/MainWalletScreen';

export const WalletNavigator = createNativeStackNavigator({
  initialRouteName: 'MainScreen',
  screens: {
    MainWalletScreen: MainWalletScreen,
  },
  screenOptions: {
    headerShown: false,
    contentStyle: {
      backgroundColor: '#292928',
    },
  },
});
