import { Text, View, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { getMnemonic, getWalletList } from '../../../../shared/crypto/mnemonic';
import { Wrapper } from '../components/Wrapper';
import { generateWallet } from '@stacks/wallet-sdk';
import { StacksMainnet } from '@stacks/network';
import { fetchAccountBalance } from '@stacks/blockchain-api-client';

export function MainWalletScreen() {
  const [walletList, setWalletList] = useState<string[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

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

    if (retrievedMnemonic) {
      try {
        // Дериваем адрес из мнемоники
        const wallet = await generateWallet({
          secretKey: retrievedMnemonic,
          password: '', // Пароль не требуется, если мнемоника уже восстановлена
        });
        const stxAddress = wallet.accounts[0].address; // Адрес первого аккаунта
        setAddress(stxAddress);

        // Получаем баланс с блокчейна
        const network = new StacksMainnet();
        const balanceData = await fetchAccountBalance({ principal: stxAddress, network });
        setBalance((balanceData.stx.balance / 1e6).toString()); // Конвертируем из микростаков в STX
      } catch (error) {
        console.error('Error fetching wallet info:', error);
        setAddress('Ошибка получения адреса');
        setBalance('0');
      }
    }
  };

  return (
    <Wrapper>
      <View className="flex-col items-center w-full">
        <Text className="text-2xl text-white text-center font-bold">Your wallet </Text>
        {walletList.length === 0 ? (
          <Text className="text-white text-center mt-5">No added wallets. Create a new one.</Text>
        ) : (
          walletList.map((walletName) => (
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