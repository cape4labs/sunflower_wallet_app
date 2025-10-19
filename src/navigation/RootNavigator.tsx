import { createStaticNavigation } from '@react-navigation/native';
import { NewWalletNavigator } from '../features/NewWallet/navigation/NewWalletNavigator.tsx';

export const RootNavigator = createStaticNavigation(NewWalletNavigator);
