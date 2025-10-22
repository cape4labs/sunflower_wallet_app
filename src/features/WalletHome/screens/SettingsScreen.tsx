import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import Wrapper from '../../../shared/components/Wrapper';
import { Text } from 'react-native';
type SettingsScreenProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'SettingsScreen'
>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenProp>();
  console.log(navigation);

  return (
    <Wrapper>
      <Text>Setting</Text>
    </Wrapper>
  );
}
