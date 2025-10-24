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
  stxAddress?: string;
  btcAddress?: string;
}) {
  const [state, setState] = useState<TokenBalancesState>({
    tokens: [],
    error: null,
    isLoading: false,
  });

  useEffect(() => {
    const fetchTokenBalances = async () => {
      const { stxAddress, btcAddress } = walletData;

      if (!stxAddress && !btcAddress) {
        setState(prev => ({ ...prev, tokens: [], error: 'No addresses provided' }));
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        let stxBalance = '0.00';
        let btcBalance = '0.00';

        if (stxAddress) {
          const stxResponse = await fetch(
            `https://api.hiro.so/extended/v1/address/${stxAddress}/balances?unanchored=true`,
            {
              headers: {
                Accept: 'application/json',
              },
            },
          );

          if (!stxResponse.ok) {
            throw new Error(`HTTP error for STX! status: ${stxResponse.status}`);
          }

          const stxData = await stxResponse.json();
          stxBalance = stxData.stx?.balance
            ? (Number('0x' + stxData.stx.balance) / 1e6).toFixed(2)
            : '0.00';
        }

        // I think that isn't work, but need check
        if (btcAddress) {
          const btcResponse = await fetch(`https://blockstream.info/api/address/${btcAddress}`);

          if (!btcResponse.ok) {
            throw new Error(`HTTP error for BTC! status: ${btcResponse.status}`);
          }

          const btcData = await btcResponse.json();
          const totalSatoshi =
            btcData.chain_stats.funded_txo_sum - btcData.chain_stats.spent_txo_sum;
          btcBalance = (totalSatoshi / 1e8).toFixed(2);
        }

        setState(prev => ({
          ...prev,
          tokens: [
            { name: 'Stacks', symbol: 'STX', balance: stxBalance },
            { name: 'Bitcoin', symbol: 'BTC', balance: btcBalance },
          ],
          isLoading: false,
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: `Error fetching token balances: ${err instanceof Error ? err.message : 'Unknown error'}`,
          isLoading: false,
        }));
      }
    };

    fetchTokenBalances();
  }, [walletData, walletData.stxAddress, walletData.btcAddress]);

  return state;
}
