import { Token } from '../features/WalletHome/screens/MainWalletScreen';
import { WalletData } from '../shared/walletPersitance';

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
  ChooseCoinScreen: { tokens: Token[]; walletData: WalletData };
  SendScreen: { token: Token; walletData: WalletData };
  SendInfoScreen: { token: Token; amount: string; recipient: string; walletData: WalletData };
};
