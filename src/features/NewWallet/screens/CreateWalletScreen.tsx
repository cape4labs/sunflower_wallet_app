import { View } from 'react-native';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import {SecretWord } from '../components/SecretWord';

export function CreateWalletScreen() {
  const navigation = useNavigation();

  // Mock secret phrase
  const secretPhrase = "word word word word word word word word word word word word";

  const secretPhraseSplit = secretPhrase.split(' ');

  return (
    <View>
      <View className="flex-col flex-wrap gap-2 h-2/3">
          {secretPhraseSplit.map((word, idx) => (
            <SecretWord key={word + idx} idx={idx + 1} word={word} />
          ))}
      </View>
      <Button onPress={() => Clipboard.setString(secretPhrase)} text={'Copy'} />
      <Button onPress={() => navigation.goBack()} text={'Go back'} />
      <Button onPress={() => navigation.navigate('NameWalletScreen')} text={'Next'} />
    </View>
  );
}
