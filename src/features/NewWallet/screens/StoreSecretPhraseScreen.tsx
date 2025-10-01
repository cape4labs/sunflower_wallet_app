import { View } from 'react-native';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';

export function StoreSecretPhraseScreen() {
  const navigation = useNavigation();
  return (
    <View className="">
      <Button onPress={() => navigation.goBack()} text={'Go back'} />
      <Button onPress={() => navigation.navigate('NameWalletScreen')} text={'Next'} />
    </View>
  );
}
