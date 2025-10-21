import { useNavigation } from '@react-navigation/native';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type MainWalletScreenProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'MainWalletScreen'
>;

export function MainWalletScreen() {
  const navigate = useNavigation<MainWalletScreenProp>;
  console.log(navigate);
  return;
}
