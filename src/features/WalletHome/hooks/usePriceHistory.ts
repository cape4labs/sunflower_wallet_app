import { useQuery } from "@tanstack/react-query";
import type { QueryFunctionContext, UseQueryResult } from "@tanstack/react-query";
import { Token } from "../../../shared/types/Token";

type usePriceHistoryProps = {
  tokens: Token[] | null | undefined;
}

type usePriceHistoryReturn = {
  data: { value: number }[] | null;
  isLoading: boolean;
  error: string | null;
}

type CoinGeckoResponse = {
  prices: [number, number][];
}

// https://api.coingecko.com/api/v3/coins/list for full list of coins
const STX_ENDPOINT = 'https://api.coingecko.com/api/v3/coins/blockstack/market_chart?vs_currency=usd&days=7'
const BTC_ENDPOINT = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7'

export default function usePriceHistory({ tokens }: usePriceHistoryProps): usePriceHistoryReturn {
  const stxQuery: UseQueryResult<CoinGeckoResponse, Error> = useQuery({queryKey: ['priceHistory', 'stx'], queryFn: fetchPriceHistory});
  const btcQuery: UseQueryResult<CoinGeckoResponse, Error>= useQuery({queryKey: ['priceHistory', 'btc'], queryFn: fetchPriceHistory});
  const isLoading = stxQuery.isLoading || btcQuery.isLoading;
  const error = stxQuery.error?.message ?? btcQuery.error?.message ?? null;

  if (!tokens || tokens.length < 2) {
    return {
      data: null,
      isLoading,
      error: 'Tokens are required',
    };
  }

  // Assume that we support only 2 tokens
  const stxAmount = Number(tokens[0].balance); 
  const btcAmount = Number(tokens[1].balance); 

  // We don't use !stxAmount here because it treats 0 same as missing
  if (stxAmount == null || btcAmount == null) {
    return {
      data: null,
      isLoading: isLoading,
      error: 'stxAmount and btcAmount required',
    };
  }

  if (stxQuery.isError || btcQuery.isError) {
    return { data: null, isLoading, error: stxQuery.error?.message ?? btcQuery.error?.message ?? 'Unknown' };
  }

  // Just in case
  if (!stxQuery.data || !btcQuery.data) {
    return { data: null, isLoading, error };
  }

  const stxPrices = stxQuery.data.prices;
  const btcPrices = btcQuery.data.prices;

  // Align price arrays
  const shortest = Math.min(stxPrices.length, btcPrices.length);
  const combined: number[] = [];

  for (let i = 0; i < shortest; i++) {
    const stxPrice = Number(stxPrices[i][1]);
    const btcPrice = Number(btcPrices[i][1]);
    combined[i] = stxPrice * stxAmount + btcPrice * btcAmount;
  }

  // Normalize values for using in the graph
  const min = Math.min(...combined);
  const range = Math.max(...combined) - min;
  const normalized = combined.map((v: number) => {
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
    data: normalized,
    isLoading: isLoading,
    error: error
  }
}

async function fetchPriceHistory({queryKey}: QueryFunctionContext) {
  const [, coin] = queryKey as [string, string];
  const endpoint = coin === "stx" ? STX_ENDPOINT : BTC_ENDPOINT;
  const res = await fetch(endpoint);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fetch failed ${res.status} ${res.statusText} - ${text}`);
  }
  const json = (await res.json()) as CoinGeckoResponse;
  if (!json.prices || !Array.isArray(json.prices)) {
    throw new Error('Unexpected response from CoinGecko');
  }
  return json;
}

