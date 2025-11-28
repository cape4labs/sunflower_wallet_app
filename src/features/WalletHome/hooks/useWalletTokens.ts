import { useState } from 'react';

import { Token } from '../../../shared/types/Token';
import { PricesData } from '../types/wallet';
import calculatePriceDiff from '../utils/calculatePriceDiff';

export default function useWalletTokens(priceHistory: PricesData) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);

  const fetchTokensCosts = async (stxAddress: string, btcAddress: string) => {
    if (!stxAddress && !btcAddress) {
      setTokens([]);
      setTokenError('No wallet addresses provided');
      setTokenLoading(false);
      return;
    }

    setTokenLoading(true);
    setTokenError(null);

    try {
      let stxBalance = '0.000000';
      let btcBalance = '0.000000';

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
          stxBalance = (parsed / 1e6).toFixed(6);
        }
      }

      if (btcAddress) {
        const btcResponse = await fetch(`https://blockstream.info/api/address/${btcAddress}`);
        if (!btcResponse.ok) throw new Error(`HTTP error for BTC! status: ${btcResponse.status}`);
        const btcData = await btcResponse.json();
        const totalSatoshi = btcData.chain_stats.funded_txo_sum - btcData.chain_stats.spent_txo_sum;
        btcBalance = (totalSatoshi / 1e8).toFixed(6);
      }

      const priceResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=blockstack,bitcoin&vs_currencies=usd',
      );
      if (!priceResponse.ok)
        throw new Error(`HTTP error for prices! status: ${priceResponse.status}`);
      const prices = await priceResponse.json();
      const stxPrice = prices.blockstack?.usd || 0;
      const btcPrice = prices.bitcoin?.usd || 0;

      const newTokens = [
        {
          name: 'Stacks',
          symbol: 'STX',
          balanceUsd: (Number(stxBalance) * stxPrice).toFixed(2),
          balance: stxBalance,
          cost: stxPrice.toString(),
          diff: calculatePriceDiff(priceHistory?.stx).data,
        },
        {
          name: 'Bitcoin',
          symbol: 'BTC',
          balanceUsd: (Number(btcBalance) * btcPrice).toFixed(2),
          balance: btcBalance,
          cost: btcPrice.toString(),
          diff: calculatePriceDiff(priceHistory?.btc).data,
        },
      ];

      setTokens(newTokens);
      setTokenError(null);
      setTokenLoading(false);

      const totalBalance = newTokens
        .reduce((sum, token) => sum + Number(token.balanceUsd), 0)
        .toFixed(2);
      setWalletBalance(totalBalance);
    } catch (err) {
      setTokenError(
        `Error fetching balances: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
      setTokenLoading(false);
      setWalletBalance('0.00');
    }
  };
  return {
    tokens,
    walletBalance,
    tokenError,
    tokenLoading,
    fetchTokensCosts,
  };
}
