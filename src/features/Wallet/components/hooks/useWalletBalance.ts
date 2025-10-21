import { useState, useEffect } from 'react';

const API_BASE = 'https://api.hiro.so/extended/v1/address';

export function useWalletBalance(address: string | null) {
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) {
        setBalance(null);
        return;
      }

      setIsLoading(true);
      const url = `${API_BASE}/${address}/balances?unanchored=true`;
      console.log('Getting balance for:', address);

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error, status: ${response.status}`);
        }

        const data = await response.json();
        const stxBalance = parseInt(data.stx.balance, 10) / 1e6;
        setBalance(stxBalance.toFixed(6));
        console.log('Balance:', stxBalance);
      } catch (err) {
        const errorMessage = 'Error getting balance: ' + (err as Error).message;
        setError(errorMessage);
        setBalance('0');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [address]);

  return { balance, error, isLoading };
}
