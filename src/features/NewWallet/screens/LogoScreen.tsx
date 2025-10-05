import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/Button';
import { Wrapper } from '../components/Wrapper';

export function LogoScreen() {
  const navigation = useNavigation();

  return (
    <Wrapper>
      <View className="flex-1 justify-between items-center">
        <View className="items-center justify-center gap-2">
          <Text className="text-white text-2xl">Sunflower wallet</Text>
          <Text className="text-white">Your BTCfi tool</Text>
        </View>

        <Button
          onPress={() => navigation.navigate('ImportCreateScreen')}
          text={'Next'}
          customStyle="mb-12"
        />
      </View>
    </Wrapper>
  );
}
