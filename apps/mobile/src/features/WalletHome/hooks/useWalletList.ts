import { useEffect, useState } from 'react';

import { getWalletList } from '../../../shared/walletPersitance';

export default function useWalletList(
  selectedWallet: string | null,
  setSelectedWallet: (w: string) => void,
) {
  const [walletList, setWalletList] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const list = await getWalletList();
        setWalletList(list);

        if (!selectedWallet && list.length > 0) {
          setSelectedWallet(list[0]);
        }
      } catch (err) {
        setError('Failed to load wallet list: ' + (err as Error).message);
      }
    };
    loadWallets();
  }, []);

  return { walletList, error };
}
