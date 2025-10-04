import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogoScreen } from '../screens/LogoScreen.tsx';
import { ImportCreateScreen } from '../screens/ImportCreateScreen.tsx';
import { NameWalletScreen } from '../screens/NameWalletScreen.tsx';
import { SuccessScreen } from '../screens/SuccessScreen.tsx';
import { CreateWalletScreen } from '../screens/CreateWalletScreen.tsx';
import { ImportWalletScreen } from '../screens/ImportWalletScreen.tsx';

export const NewWalletNavigator = createNativeStackNavigator({
  initialRouteName: 'LogoScreen',
  screens: {
    ImportCreateScreen: ImportCreateScreen,
    LogoScreen: LogoScreen,
    NameWalletScreen: NameWalletScreen,
    CreateWalletScreen: CreateWalletScreen,
    SuccessScreen: SuccessScreen,
    ImportWalletScreen: ImportWalletScreen,
  },
  screenOptions: {
    headerShown: false,
    contentStyle: {
      backgroundColor: '#292928',
    },
  },
});
