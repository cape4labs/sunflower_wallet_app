import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogoScreen } from '../screens/LogoScreen.tsx';
import { ImportCreateScreen } from '../screens/ImportCreateScreen.tsx';
import { NameWalletScreen } from '../screens/NameWalletScreen.tsx';
import { SuccessScreen } from '../screens/SuccessScreen.tsx';
import { StoreSecretPhraseScreen } from '../screens/StoreSecretPhraseScreen.tsx';
import { WriteSecretPhraseScreen } from '../screens/WriteSecretPhraseScreen.tsx';

export const NewWalletNavigator = createNativeStackNavigator({
  initialRouteName: 'LogoScreen',
  screens: {
    ImportCreateScreen: ImportCreateScreen,
    LogoScreen: LogoScreen,
    NameWalletScreen: NameWalletScreen,
    StoreSecretPhraseScreen: StoreSecretPhraseScreen,
    SuccessScreen: SuccessScreen,
    WriteSecretPhraseScreen: WriteSecretPhraseScreen,
  },
});
