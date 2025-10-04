import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/Button';

export function LogoScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-between items-center">
      <View className="h-1/3 items-center justify-center gap-2">
        <Text className="text-white text-2xl">Sunflower wallet</Text>
        <Text className="text-white">Your BTCfi tool</Text>
      </View>

      <Button
        onPress={() => navigation.navigate('ImportCreateScreen')}
        text={'Next'}
        customStyle="mb-12"
      />
    </View>
  );
}
