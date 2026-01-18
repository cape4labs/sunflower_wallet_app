import type { Token } from '../../../shared/types/Token';
import type { PricesData } from '../types/wallet';

type preparePricesForGraphReturn = {
  data?: { value: number }[];
  error?: string;
};

export default function preparePricesForGraph(
  prices?: PricesData,
  tokens?: Token[],
): preparePricesForGraphReturn {
  if (!tokens) {
    return {
      error: 'Tokens are required',
    };
  }

  if (!prices) {
    return {
      error: 'Prices are required',
    };
  }

  const stxToken = tokens.find(t => t.symbol === 'STX');
  const btcToken = tokens.find(t => t.symbol === 'BTC');

  const stxAmount = stxToken ? Number(stxToken.balance) : 0;
  const btcAmount = btcToken ? Number(btcToken.balance) : 0;

  // Align price arrays
  const shortest = Math.min(prices.stx.length, prices.btc.length);
  const combined: number[] = [];

  for (let i = 0; i < shortest; i++) {
    const stxPrice = Number(prices.stx[i][1]);
    const btcPrice = Number(prices.btc[i][1]);
    combined[i] = stxPrice * stxAmount + btcPrice * btcAmount;
  }

  // Process values for using in the graph
  const min = Math.min(...combined);
  const range = Math.max(...combined) - min;
  const processed = combined.map((v: number) => {
    if (range !== 0) {
      return {
        value: ((v - min) / range) * 100,
      };
    } else {
      return {
        value: 0,
      };
    }
  });

  return {
    data: processed,
  };
}
