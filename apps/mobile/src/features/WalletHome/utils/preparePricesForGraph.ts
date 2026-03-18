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
  if (!tokens || !prices) {
    return { error: 'Tokens and prices are required' };
  }

  const shortest = Math.min(...Object.values(prices).map(p => p.length));
  if (shortest === 0) return { data: [] };

  const combined: number[] = new Array(shortest).fill(0);

  tokens.forEach(token => {
    const symbol = token.symbol.toLowerCase();
    const history = (prices as any)[symbol];

    if (history && history.length >= shortest) {
      const amount = Number(token.balance);
      for (let i = 0; i < shortest; i++) {
        combined[i] += Number(history[i][1]) * amount;
      }
    } else if (token.isDeFi && token.symbol === 'stSTX' && prices.stx) {
      const amount = Number(token.balance);
      for (let i = 0; i < shortest; i++) {
        combined[i] += Number(prices.stx[i][1]) * amount;
      }
    }
  });

  if (combined.every(v => v === 0)) {
    return { data: [] };
  }

  const min = Math.min(...combined);
  const max = Math.max(...combined);
  const range = max - min;

  const processed = combined.map((v: number) => ({
    value: range !== 0 ? ((v - min) / range) * 100 : 50,
  }));

  return { data: processed };
}
