import { useEffect, useState } from 'react';

import {
  WalletData,
  WalletPrivateDataType,
  getPrivateWalletData,
  getWalletData,
} from '../walletPersitance';

export function useWalletData(walletName: string | null) {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoadingWalletData, setIsLoadingWalletData] = useState(false);
  const [errorWalletData, setErrorWalletData] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!walletName) {
        setErrorWalletData('Wallet name is not provided');
        setIsLoadingWalletData(false);
        return;
      }

      setIsLoadingWalletData(true);
      setErrorWalletData(null);

      try {
        const data = await getWalletData(walletName);
        if (data) {
          setWalletData(data);
        } else {
          throw new Error('Wallet data not found');
        }
      } catch (err) {
        const errorMessage = 'Error loading wallet data: ' + (err as Error).message;
        console.error(errorMessage);
        setErrorWalletData(errorMessage);
        setWalletData(null);
      } finally {
        setIsLoadingWalletData(false);
      }
    };

    loadData();
  }, [walletName]);

  return { walletData, isLoadingWalletData, errorWalletData };
}

export function useWalletPrivateData(walletName: string | null) {
  const [data, setData] = useState<WalletPrivateDataType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!walletName) {
        setError('Wallet name is not provided');
        return;
      }

      try {
        const tempData = await getPrivateWalletData(walletName);
        if (tempData) {
          setData(tempData);
        } else {
          throw new Error('Wallet private data not found');
        }
      } catch (error) {
        setError((error as Error).message);
        setData(null);
      }
    };
    loadData();
  }, [walletName]);

  return { privateData: data, privateDataError: error };
}
