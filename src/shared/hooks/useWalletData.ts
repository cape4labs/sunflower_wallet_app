import { useState, useEffect } from 'react';
import { getWalletData, WalletData } from '../walletPersitance';

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