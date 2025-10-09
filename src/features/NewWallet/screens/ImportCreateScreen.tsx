import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/Button';
import { Wrapper } from '../components/Wrapper';

export function ImportCreateScreen() {
  const navigation = useNavigation();
  //TODO add steps (it's step 1)
  return (
    <Wrapper>
      <View className="flex-1 justify-end">
        <View className="items-center justify-end">
          <Button onPress={() => navigation.navigate('ImportWalletScreen')} text="Import Wallet" />
          <Button
            onPress={() => navigation.navigate('CreateWalletScreen')}
            text="Create Wallet"
            accent={true}
            customStyle={'mt-2'}
          />
        </View>
      </View>
    </Wrapper>
  );
}
