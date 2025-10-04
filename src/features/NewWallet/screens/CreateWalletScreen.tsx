import { Text, View, Pressable } from 'react-native';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { generateMnemonic } from '../../../../shared/crypto/src/keychain';
import { useEffect, useState } from 'react';
import { MnemonicDisplay } from '../components/MnemonicDisplay';
import { CopyToClipboard as copyToClipboard } from '../../../utils/copyToClipboard';
import { Toggle } from '../components/Toggle';

export function CreateWalletScreen() {
  // TODO hide mnemonic
  const navigation = useNavigation();
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const isHidden = false;

  useEffect(() => {
    const tmpMnemonic = generateMnemonic();
    setMnemonic(tmpMnemonic);
  }, []);

  return (
    <View className="items-center">
      <Text className="text-2xl text-white">Store your secret phrase</Text>
      <Text className="text-white text-center mt-2">This is your secret phare, make</Text>
      <Text className="text-white text-center">sure you store it safely</Text>
      <MnemonicDisplay mnemonic={mnemonic} />
      {isHidden && <Button onPress={() => navigation.goBack()} text={'Go back'} accent={false} />}
      {!isHidden && (
        <View className="items-center">
          <View className="flex-row gap-2">
            <View className="flex-row items-center">
              <Toggle />
              <View className="flex-col">
                <Text className="text-white">I saved my secret</Text>
                <Text className="text-white"> recovery phrase</Text>
              </View>
            </View>
            <Pressable onPress={() => copyToClipboard(mnemonic)} className="">
              <Text className="text-white text-xl">Copy</Text>
            </Pressable>
          </View>
          <View className="flex-row h-14">
            <Button onPress={() => navigation.goBack()} text={'Back'} customStyle={'w-[45%]'} />
            <Button
              onPress={() => navigation.navigate('NameWalletScreen')}
              accent={true}
              text={'Next'}
              customStyle={'w-[45%] bg-white'}
            />
          </View>
        </View>
      )}
    </View>
  );
}
