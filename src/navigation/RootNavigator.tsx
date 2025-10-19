import { createStaticNavigation } from '@react-navigation/native';
import { NewWalletNavigator } from '../features/NewWallet/navigation/NewWalletNavigator.tsx';
import { WalletNavigator } from '../features/Wallet/navigation/WalletNavigator.tsx';

export const RootNavigator = createStaticNavigation(NewWalletNavigator);
