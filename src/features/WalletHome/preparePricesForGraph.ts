import type { Token } from "../../shared/types/Token";
import type { PricesData } from "./types/wallet";

type preparePricesForGraphReturn = {
  data: { value: number }[] | null;
  error: string | null;
}

export default function preparePricesForGraph(tokens: Token[] | null, prices: PricesData): preparePricesForGraphReturn {
  if (tokens == null || tokens.length < 2) {
    return {
      data: null,
      error: 'Tokens are required',
    };
  }

  if (prices == null) {
    return {
      data: null,
      error: "Prices are required",
    }
  }

  // Assume that we support only 2 tokens
  const stxAmount = Number(tokens[0].balance); 
  const btcAmount = Number(tokens[1].balance); 

  // We don't use !stxAmount here because it treats 0 same as missing
  if (stxAmount == null || btcAmount == null) {
    return {
      data: null,
      error: 'stxAmount and btcAmount required',
    };
  }

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
    if (range != 0) {
      return {
        value: (v - min) / range * 100
      }
    } else {
      return {
        value: 0
      }
    }
  })

  return {
    data: processed,
    error: null,
  }
}

