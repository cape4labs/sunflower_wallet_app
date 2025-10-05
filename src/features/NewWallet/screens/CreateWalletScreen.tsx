import { Text, View, Pressable, Image } from 'react-native';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { generateMnemonic } from '../../../../shared/crypto/src/keychain';
import { useEffect, useState } from 'react';
import { MnemonicDisplay } from '../components/MnemonicDisplay';
import { CopyToClipboard as copyToClipboard } from '../../../utils/copyToClipboard';
import { Toggle } from '../components/Toggle';
import { Wrapper } from '../components/Wrapper';

export function CreateWalletScreen() {
  // TODO hide mnemonic
  // TODO add steps (it's step 2)
  const navigation = useNavigation();
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const isHidden = false;

  useEffect(() => {
    const tmpMnemonic = generateMnemonic();
    setMnemonic(tmpMnemonic);
  }, []);

  return (
    <Wrapper>
      <View className="flex-col justify-end items-center">
        <View>
          <Text className="text-2xl text-white text-center">Store your secret phrase</Text>
          <Text className="text-white text-center mt-2">This is your secret phare, make</Text>
          <Text className="text-white text-center">sure you store it safely</Text>
        </View>
        <MnemonicDisplay mnemonic={mnemonic} />
        {isHidden && <Button onPress={() => navigation.goBack()} text={'Go back'} accent={false} />}
        {!isHidden && (
          <View className="items-center">
            <View className="flex-row justify-start align-middle">
              <View className="flex-row items-center">
                <Toggle />
                <View className="flex-col">
                  <Text className="text-white">I saved my secret</Text>
                  <Text className="text-white"> recovery phrase</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-10">
                <Pressable onPress={() => copyToClipboard(mnemonic)} className="">
                  <Image
                    source={require('../../../../assets/icons/copy_icon.svg')}
                    className="h-1 w-1"
                  />
                  <Text className="text-white text-xl">Copy</Text>
                </Pressable>
              </View>
            </View>
            <View className="flex-row my-5 bg-custom_border p-1 rounded-xl">
              <Button onPress={() => navigation.goBack()} text={'Back'} />
              <Button
                onPress={() => navigation.navigate('NameWalletScreen')}
                accent={true}
                text={'Next'}
                customStyle={'bg-white'}
              />
            </View>
          </View>
        )}
      </View>
    </Wrapper>
  );
}
