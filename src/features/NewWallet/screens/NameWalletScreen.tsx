import { View, Text, TextInput } from 'react-native';
import { Button } from '../components/Button.tsx';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Wrapper } from '../components/Wrapper.tsx';

export function NameWalletScreen() {
  const navigation = useNavigation();
  const [walletName, setWalletName] = useState('');
  // TODO add steps (it's step 3)
  return (
    <Wrapper>
      <View>
        <Text>Pick a name for your walelt</Text>
        <Text>For example: Main Wallet</Text>
        <TextInput
          className="w-full h-24 bg-emerald-200"
          placeholder=">> wallet_name"
          onChangeText={input => setWalletName(input)}
        />
        <Text>You typed {walletName}</Text>
        <Button onPress={() => navigation.goBack()} text="Go back" />
        <Button onPress={() => navigation.navigate('SuccessScreen')} text="Next" />
      </View>
    </Wrapper>
  );
}
