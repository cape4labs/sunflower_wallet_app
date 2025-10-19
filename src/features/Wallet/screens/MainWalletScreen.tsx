import { Text, View, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { getMnemonic, getWalletList } from '../../../../shared/crypto/keychain';
import { Wrapper } from '../components/Wrapper';

export function MainWalletScreen() {
  const [walletList, setWalletList] = useState<string[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);

  useEffect(() => {
    const loadWallets = async () => {
      const list = await getWalletList();
      setWalletList(list);
    };
    loadWallets();
  }, []);

  const handleSelectWallet = async (walletName: string) => {
    const retrievedMnemonic = await getMnemonic(walletName);
    setSelectedWallet(walletName);
    setMnemonic(retrievedMnemonic);
  };

  return (
    <Wrapper>
      <View className="flex-col items-center w-full">
        <Text className="text-2xl text-white text-center font-bold">Your wallet </Text>
        {walletList.length === 0 ? (
          <Text className="text-white text-center mt-5">No added wallets. Create a new one.</Text>
        ) : (
          walletList.map(walletName => (
            <Pressable
              key={walletName}
              onPress={() => handleSelectWallet(walletName)}
              className="w-full bg-custom_complement p-4 rounded-xl mt-4"
            >
              <Text className="text-white text-xl">{walletName}</Text>
            </Pressable>
          ))
        )}
        {selectedWallet && mnemonic && (
          <View className="mt-10 w-full">
            <Text className="text-2xl text-white text-center">Wallet: {selectedWallet}</Text>
            <Text className="text-white text-center mt-5">Mnemonic: {mnemonic}</Text>
          </View>
        )}
      </View>
    </Wrapper>
  );
}
