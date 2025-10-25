import { Token } from '../features/WalletHome/screens/MainWalletScreen';

export type RootNavigatorTypeParamListType = {
  LogoScreen: undefined;
  ImportCreateScreen: undefined;
  NameWalletScreen: {mnemonic: string};
  CreateWalletScreen: undefined;
  SuccessScreen: {walletName: string};
  ImportWalletScreen: {mnemonicLength: number};
  ChooseLengthScreen: undefined;
  WalletTabs: {
    screen: 'MainWallet' | 'History' | 'Settings';
    params: {
      walletName?: string;
    };
  };
  ChooseCoinScreen: { tokens: Token[]; walletName: string };
  SendScreen: { token: Token; walletName: string };
  SendInfoScreen: { token: Token; amount: string; recipient: string; walletName: string };
};
