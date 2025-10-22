import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import Wrapper from '../../../shared/components/Wrapper';
import { Text } from 'react-native';

type HistoryScreenProp = NativeStackNavigationProp<RootNavigatorTypeParamListType, 
'WalletTabs',
'HistoryScreen'
>;

export default function HistoryScreen() {
  const navigation = useNavigation<HistoryScreenProp>();

  console.log(navigation);
  return (
    <Wrapper>
      <Text>Info</Text>
    </Wrapper>
  );
}
