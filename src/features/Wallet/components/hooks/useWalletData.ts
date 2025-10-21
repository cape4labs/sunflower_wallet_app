import { useState, useEffect } from 'react';
import { getWalletData, WalletData } from '../../../../../shared/crypto/mnemonic';

export function useWalletData(walletName: string) {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!walletName) return;
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
        setError(errorMessage);
        setWalletData(null);
      }
    };
    loadData();
  }, [walletName]);

  return { ...walletData, error };
}
