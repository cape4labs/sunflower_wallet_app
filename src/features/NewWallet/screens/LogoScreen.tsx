import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/Button';

export function LogoScreen() {
  const navigation = useNavigation();

  return (
    <View className="">
      <Text className="m-auto">Sunflower wallet</Text>
      <Text className="m-auto">Your BTCfi tool</Text>

      <Button onPress={() => navigation.navigate('ImportCreateScreen')} text={'Next'} />
    </View>
  );
}
