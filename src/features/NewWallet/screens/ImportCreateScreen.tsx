import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/Button.tsx';

export function ImportCreateScreen() {
  const navigation = useNavigation();

  return (
    <View>
      <Button onPress={() => navigation.navigate('ImportWalletScreen')} text="Import a wallet" />
      <Button onPress={() => navigation.navigate('CreateWalletScreen')} text="Create a wallet" />
    </View>
  );
}
