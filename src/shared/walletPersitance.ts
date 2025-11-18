import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateWallet, getRootNode, deriveStxPrivateKey } from '@stacks/wallet-sdk';
import { privateKeyToPublic, publicKeyToAddress } from '@stacks/transactions';
import { publicKeyToBtcAddress } from '@stacks/encryption';

const WALLET_LIST_KEY = 'walletList';

export interface WalletData {
  publicKey: any;
  stxAddress: string;
  btcAddress: string;
}

// Delete wallet from keychain
export async function clearWallet(walletName: string): Promise<void> {
  try {
    await Keychain.resetGenericPassword({ service: `SunflowerWallet_${walletName}_mnemonic` });
    await Keychain.resetGenericPassword({ service: `SunflowerWallet_${walletName}_privateKey` });
    await AsyncStorage.removeItem(`walletPublicData_${walletName}`);
    await removeWalletName(walletName);
    console.log(`Wallet cleared for ${walletName}`);
  } catch (error) {
    console.error(`Error clearing wallet for ${walletName}:`, error);
    throw error;
  }
}

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

export async function clearAllWallets(): Promise<void> {
  try {
    const walletList = await getWalletList();

    for (const walletName of walletList) {
      await clearWallet(walletName);
    }

    await AsyncStorage.removeItem(WALLET_LIST_KEY);
    console.log('All wallets and their data have been cleared successfully');
  } catch (error) {
    console.error('Error clearing all wallets:', error);
    throw error;
  }
}

export async function createAndSaveWallet(
  mnemonic: string,
  walletName: string,
) {
  try {
    const wallet = await generateWallet({ secretKey: mnemonic, password: '' });
    const root = getRootNode(wallet);
    const stxPrivateKey = deriveStxPrivateKey({ rootNode: root, index: 0 });
    const publicKey = privateKeyToPublic(stxPrivateKey);
    const stxAddress = publicKeyToAddress(publicKey);
    const btcAddress = publicKeyToBtcAddress(publicKey);

    const mnemonicService = `SunflowerWallet_${walletName}_mnemonic`;
    await Keychain.setGenericPassword('mnemonic', mnemonic, {
      service: mnemonicService,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
    });

    const privateKeyService = `SunflowerWallet_${walletName}_privateKey`;
    await Keychain.setGenericPassword('stxPrivateKey', stxPrivateKey, {
      service: privateKeyService,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
    });

    // Save public data to async storage
    const publicData = { publicKey, stxAddress, btcAddress };
    await AsyncStorage.setItem(`walletPublicData_${walletName}`, JSON.stringify(publicData));

    console.log(`Wallet created and saved successfully for ${walletName}`);
    await addWalletName(walletName);
  } catch (error) {
    console.error(`Error creating wallet for ${walletName}:`, error);
    throw error;
  }
}

export type WalletPrivateDataType = {
  mnemonic: string;
  stxPrivateKey: string;
}

export async function getPrivateWalletData(walletName: string): Promise<WalletPrivateDataType | null> {
  try {
    const mnemonicService = `SunflowerWallet_${walletName}_mnemonic`;
    const mnemonicCreds = await Keychain.getGenericPassword({ service: mnemonicService });
    const mnemonic = mnemonicCreds ? mnemonicCreds.password : null;

    const privateKeyService = `SunflowerWallet_${walletName}_privateKey`;
    const privateKeyCreds = await Keychain.getGenericPassword({ service: privateKeyService });
    const stxPrivateKey = privateKeyCreds ? privateKeyCreds.password : null;

    if (!mnemonic || !stxPrivateKey) return null;
    return {
      mnemonic,
      stxPrivateKey,
    }
  } catch (error) {
    console.error(`Error retrieving private wallet data for ${walletName}:`, error);
    return null;
  }
}

export async function getWalletData(walletName: string): Promise<WalletData | null> {
  try {
    const publicJson = await AsyncStorage.getItem(`walletPublicData_${walletName}`);
    const publicData = publicJson ? JSON.parse(publicJson) : null;

    if (!publicData) {
      // If public data is missing - regenerate it
      const privateData = await getPrivateWalletData(walletName);
      if (!privateData) throw new Error(`Could not retrieve private data for ${walletName}`);
      const { mnemonic, stxPrivateKey } = privateData;
      console.warn(`Public data missing for ${walletName}, regenerating...`);
      const wallet = await generateWallet({ secretKey: mnemonic, password: '' });
      const root = getRootNode(wallet);
      const derivedPrivateKey = deriveStxPrivateKey({ rootNode: root, index: 0 });
      if (derivedPrivateKey !== stxPrivateKey) throw new Error('Private key mismatch');
      const publicKey = privateKeyToPublic(stxPrivateKey);
      const stxAddress = publicKeyToAddress(publicKey);
      const btcAddress = publicKeyToBtcAddress(publicKey);
      const newPublicData = { publicKey, stxAddress, btcAddress };
      await AsyncStorage.setItem(`walletPublicData_${walletName}`, JSON.stringify(newPublicData));
      return newPublicData;
    }

    return { ...publicData };
  } catch (error) {
    console.error(`Error retrieving wallet data for ${walletName}:`, error);
    return null;
  }
}
