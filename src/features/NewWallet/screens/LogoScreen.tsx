import { View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/Button';
import { Wrapper } from '../components/Wrapper';
import { StepIndicator } from '../components/StepIndicator';

export function LogoScreen() {
  const navigation = useNavigation();

  return (
    <Wrapper>
      <View className="flex-1 justify-center items-center">
        <Image
          source={require('../../../../assets/icons/logo.png')}
        />
      </View>

      <Button
        onPress={() => navigation.navigate('ImportCreateScreen')}
        text={'Next'}
      />
    </Wrapper>
  );
}
