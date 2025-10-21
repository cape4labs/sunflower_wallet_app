import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { Wrapper } from '../../../../shared/components/Wrapper';
import { Text } from 'react-native';

type InfoScreenProp = NativeStackNavigationProp<RootNavigatorTypeParamListType, 'InfoScreen'>;

export default function InfoScreen() {
  const navigation = useNavigation<InfoScreenProp>();

  console.log(navigation);
  return (
    <Wrapper>
      <Text>Info</Text>
    </Wrapper>
  );
}
