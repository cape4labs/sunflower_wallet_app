import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import { RootNavigatorTypeParamListType } from './types';
import LogoScreen from '../features/NewWallet/screens/LogoScreen.tsx';
import ImportCreateScreen from '../features/NewWallet/screens/ImportCreateScreen.tsx';
import NameWalletScreen from '../features/NewWallet/screens/NameWalletScreen.tsx';
import SuccessScreen from '../features/NewWallet/screens/SuccessScreen.tsx';
import CreateWalletScreen from '../features/NewWallet/screens/CreateWalletScreen.tsx';
import ImportWalletScreen from '../features/NewWallet/screens/ImportWalletScreen.tsx';
import ChooseLengthScreen from '../features/NewWallet/screens/ChooseLengthScreen.tsx';
import { WalletTabs } from '../features/WalletHome/navigation/WalletBottomNavigation.tsx';
import ChooseCoinScreen from '../features/SendCoin/screens/ChooseCoinScreen.tsx';
import SendScreen from '../features/SendCoin/screens/SendScreen.tsx';
import SendInfoScreen from '../features/SendCoin/screens/SendInfoScreen.tsx';

const RootNavigator = createNativeStackNavigator<RootNavigatorTypeParamListType>({
  initialRouteName: 'LogoScreen',
  screens: {
    ImportCreateScreen: ImportCreateScreen,
    LogoScreen: LogoScreen,
    NameWalletScreen: NameWalletScreen,
    CreateWalletScreen: CreateWalletScreen,
    SuccessScreen: SuccessScreen,
    ImportWalletScreen: ImportWalletScreen,
    ChooseLengthScreen: ChooseLengthScreen,
    WalletTabs: {
      screen: WalletTabs,
      options: { headerShown: false },
    },
    ChooseCoinScreen: ChooseCoinScreen,
    SendScreen: SendScreen,
    SendInfoScreen: SendInfoScreen,
  },
  screenOptions: {
    headerShown: false,
    contentStyle: {
      backgroundColor: '#292928',
    },
  },
});

export const Navigation = createStaticNavigation(RootNavigator);
