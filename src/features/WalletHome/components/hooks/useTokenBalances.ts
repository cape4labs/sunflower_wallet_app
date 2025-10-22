import { useState, useEffect } from 'react';

interface Token {
  name: string;
  symbol: string;
  balance: string;
}

interface TokenBalancesState {
  tokens: Token[];
  error: string | null;
  isLoading: boolean;
}

export function useTokenBalances(walletData: {
  stxAddress: string | null;
  btcAddress: string | null;
}) {
  const [state, setState] = useState<TokenBalancesState>({
    tokens: [],
    error: null,
    isLoading: false,
  });

  useEffect(() => {
    if (!walletData.stxAddress && !walletData.btcAddress) return;

    let intervalId: number | undefined;

    const fetchTokenBalances = async () => {
      const { stxAddress, btcAddress } = walletData;

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        let stxBalance = '0.00';
        let btcBalance = '0.00';

        if (stxAddress) {
          const stxResponse = await fetch(
            `https://api.hiro.so/extended/v1/address/${stxAddress}/balances?unanchored=true`,
            { headers: { Accept: 'application/json' } },
          );

          if (!stxResponse.ok) throw new Error(`HTTP error for STX! status: ${stxResponse.status}`);

          const stxData = await stxResponse.json();
          const balanceRaw = stxData.stx?.balance;
          if (balanceRaw) {
            const parsed = balanceRaw.startsWith('0x')
              ? parseInt(balanceRaw, 16)
              : Number(balanceRaw);
            stxBalance = (parsed / 1e6).toFixed(2);
          }
        }

        // Must check
        if (btcAddress) {
          const btcResponse = await fetch(`https://blockstream.info/api/address/${btcAddress}`);
          if (!btcResponse.ok) throw new Error(`HTTP error for BTC! status: ${btcResponse.status}`);

          const btcData = await btcResponse.json();
          const totalSatoshi =
            btcData.chain_stats.funded_txo_sum - btcData.chain_stats.spent_txo_sum;
          btcBalance = (totalSatoshi / 1e8).toFixed(2);
        }

        setState({
          tokens: [
            { name: 'Stacks', symbol: 'STX', balance: stxBalance },
            { name: 'Bitcoin', symbol: 'BTC', balance: btcBalance },
          ],
          error: null,
          isLoading: false,
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: `Error fetching balances: ${err instanceof Error ? err.message : 'Unknown error'}`,
          isLoading: false,
        }));
      }
    };

    fetchTokenBalances();

    intervalId = setInterval(fetchTokenBalances, 1 * 60 * 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [walletData, walletData.stxAddress, walletData.btcAddress]);

  return state;
}
