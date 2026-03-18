import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainBTCfiScreen from '../features/DeFi/screens/MainBTCfiScreen.tsx';
import ChooseLengthScreen from '../features/NewWallet/screens/ChooseLengthScreen.tsx';
import { CreateWalletScreen } from '../features/NewWallet/screens/CreateWalletScreen.tsx';
import ImportCreateScreen from '../features/NewWallet/screens/ImportCreateScreen.tsx';
import ImportWalletScreen from '../features/NewWallet/screens/ImportWalletScreen.tsx';
import LogoScreen from '../features/NewWallet/screens/LogoScreen.tsx';
import NameWalletScreen from '../features/NewWallet/screens/NameWalletScreen.tsx';
import SuccessScreen from '../features/NewWallet/screens/SuccessScreen.tsx';
import ChooseCoinScreen from '../features/Transfers/screens/ChooseCoinScreen.tsx';
import ReceiveScreen from '../features/Transfers/screens/ReceiveScreen.tsx';
import SendInfoScreen from '../features/Transfers/screens/SendInfoScreen.tsx';
import SendScreen from '../features/Transfers/screens/SendScreen.tsx';
import { WalletTabs } from '../features/WalletHome/navigation/WalletBottomNavigation.tsx';
import WalletAnalyticsScreen from '../features/WalletHome/screens/WalletAnalyticsScreen.tsx';
import { RootNavigatorTypeParamListType } from './types';

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
    ChooseCoinScreen: ChooseCoinScreen,
    WalletTabs: {
      screen: WalletTabs,
      options: { headerShown: false },
    },
    SendScreen: SendScreen,
    SendInfoScreen: SendInfoScreen,
    ReceiveScreen: ReceiveScreen,
    WalletAnalyticsScreen: WalletAnalyticsScreen,
    MainBTCfiScreen: MainBTCfiScreen,
  },
  screenOptions: {
    headerShown: false,
    contentStyle: {
      backgroundColor: '#292928',
    },
  },
});

export const Navigation = createStaticNavigation(RootNavigator);
