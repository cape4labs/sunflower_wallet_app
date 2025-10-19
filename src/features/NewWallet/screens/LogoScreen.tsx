import { View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/Button';
import { Wrapper } from '../components/Wrapper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';

type LogoScreenNavigationProp = NativeStackNavigationProp<
  RootNavigatorTypeParamListType,
  'LogoScreen'
>;

export function LogoScreen() {
  const navigation = useNavigation<LogoScreenNavigationProp>();

  return (
    <Wrapper>
      <View className="flex-1 justify-center items-center">
        <Image source={require('../../../../assets/icons/logo.png')} />
      </View>

      <Button onPress={() => navigation.navigate('ImportCreateScreen')} text={'Next'} />
    </Wrapper>
  );
}
