import { View } from 'react-native';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { generateMnemonic } from '../../../../shared/crypto2/src/keychain';
import { useEffect, useState } from 'react';
import { MnemonicDisplay } from '../components/MnemonicDisplay';
import { CopyToClipboard as copyToClipboard } from '../../../utils/copyToClipboard';

export function CreateWalletScreen() {
  // TODO hide mnemonic
  const navigation = useNavigation();
  const [mnemonic, setMnemonic] = useState<string | null>(null);

  useEffect(() => {
    const tmpMnemonic = generateMnemonic();
    setMnemonic(tmpMnemonic);
  }, []);

  return (
    <View>
      <MnemonicDisplay mnemonic={mnemonic} />
      <Button onPress={() => copyToClipboard(mnemonic)} text={'Copy'} />
      <Button onPress={() => navigation.goBack()} text={'Go back'} />
      <Button onPress={() => navigation.navigate('NameWalletScreen')} text={'Next'} />
    </View>
  );
}
