import { Token } from '../features/WalletHome/screens/MainWalletScreen';

export type RootNavigatorTypeParamListType = {
  LogoScreen: undefined;
  ImportCreateScreen: undefined;
  NameWalletScreen: undefined;
  CreateWalletScreen: undefined;
  SuccessScreen: undefined;
  ImportWalletScreen: undefined;
  ChooseLengthScreen: undefined;
  WalletTabs: {
    screen: 'MainWallet' | 'History' | 'Settings';
    params: {
      walletName?: string;
    };
  };
  ChooseCoinScreen: { tokens: Token[] };
  SendScreen: { token: Token };
};
