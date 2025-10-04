import { View } from 'react-native';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import {MnemonicWord } from '../components/MnemonicWord';

export function CreateWalletScreen() {
  const navigation = useNavigation();

  // Mock mnemonic
  const mnemonic = "word word word word word word word word word word word word";

  const mnemonicSplit = mnemonic.split(' ');

  return (
    <View>
      <View className="flex-col flex-wrap gap-2 h-2/3">
          {mnemonicSplit.map((word, idx) => (
            <MnemonicWord key={word + idx} idx={idx + 1} word={word} />
          ))}
      </View>
      <Button onPress={() => Clipboard.setString(mnemonic)} text={'Copy'} />
      <Button onPress={() => navigation.goBack()} text={'Go back'} />
      <Button onPress={() => navigation.navigate('NameWalletScreen')} text={'Next'} />
    </View>
  );
}
