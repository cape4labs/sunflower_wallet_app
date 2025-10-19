import { generateMnemonic as scureGenerateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 128 = 12 words; 256 = 24 words;
const MNEMONIC_STRENGTH = 128;
const WALLET_LIST_KEY = 'walletList'; // Ключ для списка имен

export function generateMnemonic() {
  return scureGenerateMnemonic(wordlist, MNEMONIC_STRENGTH);
}

export async function saveMnemonic(mnemonic: string, walletName: string): Promise<void> {
  try {
    const service = `SunflowerWallet_${walletName}`;
    await Keychain.setGenericPassword('mnemonic', mnemonic, {
      service,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
    });
    console.log(`Mnemonic saved successfully for ${walletName}`);
    await addWalletName(walletName); // Добавляем имя в список
  } catch (error) {
    console.error(`Error saving mnemonic for ${walletName}:`, error);
    throw error;
  }
}

export async function getMnemonic(walletName: string): Promise<string | null> {
  try {
    const service = `SunflowerWallet_${walletName}`;
    const credentials = await Keychain.getGenericPassword({ service });
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error(`Error retrieving mnemonic for ${walletName}:`, error);
    return null;
  }
}

export async function clearMnemonic(walletName: string): Promise<void> {
  try {
    const service = `SunflowerWallet_${walletName}`;
    await Keychain.resetGenericPassword({ service });
    console.log(`Mnemonic cleared for ${walletName}`);
    await removeWalletName(walletName); // Удаляем имя из списка
  } catch (error) {
    console.error(`Error clearing mnemonic for ${walletName}:`, error);
    throw error;
  }
}

// Функции для списка имен кошельков в AsyncStorage
export async function addWalletName(walletName: string): Promise<void> {
  try {
    let walletList = await getWalletList();
    if (!walletList.includes(walletName)) {
      walletList = [...walletList, walletName];
      await AsyncStorage.setItem(WALLET_LIST_KEY, JSON.stringify(walletList));
      console.log(`Wallet name added: ${walletName}`);
    }
  } catch (error) {
    console.error('Error adding wallet name:', error);
  }
}

export async function removeWalletName(walletName: string): Promise<void> {
  try {
    let walletList = await getWalletList();
    walletList = walletList.filter(name => name !== walletName);
    await AsyncStorage.setItem(WALLET_LIST_KEY, JSON.stringify(walletList));
    console.log(`Wallet name removed: ${walletName}`);
  } catch (error) {
    console.error('Error removing wallet name:', error);
  }
}

export async function getWalletList(): Promise<string[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(WALLET_LIST_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting wallet list:', error);
    return [];
  }
}
