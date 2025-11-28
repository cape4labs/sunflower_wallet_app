import { Token } from '../shared/types/Token';

export type RootNavigatorTypeParamListType = {
  LogoScreen: undefined;
  ImportCreateScreen: undefined;
  NameWalletScreen: { mnemonic: string };
  CreateWalletScreen: undefined;
  SuccessScreen: { walletName: string };
  ImportWalletScreen: { mnemonicLength: number };
  ChooseLengthScreen: undefined;
  WalletTabs: {
    screen: 'MainWalletScreen' | 'HistoryScreen' | 'SettingsScreen';
    params: {
      walletName?: string;
    };
  };
  ChooseCoinScreen: { tokens: Token[]; walletName: string };
  SendScreen: { token: Token; walletName: string };
  SendInfoScreen: {
    token: Token;
    amount: string;
    recipient: string;
    walletName: string;
  };
  ReceiveScreen: { walletName: string; tokens: Token[] };
};
