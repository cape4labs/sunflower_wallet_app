import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/Button';

export function ImportCreateScreen() {
  const navigation = useNavigation();
  //TODO add steps (it's step 1)
  return (
    <View className="flex-1 justify-center">
      <View className="items-center justify-end h-[80%]">
        <Button onPress={() => navigation.navigate('ImportWalletScreen')} text="Import Wallet" />
        <Button
          onPress={() => navigation.navigate('CreateWalletScreen')}
          text="Create Wallet"
          accent={true}
          customStyle={'mt-2'}
        />
      </View>
    </View>
  );
}
