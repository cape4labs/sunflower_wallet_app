import { useQuery } from '@tanstack/react-query';
import type { QueryFunctionContext, UseQueryResult } from '@tanstack/react-query';

import type { PricesData } from '../types/wallet';

type usePriceHistoryReturn = {
  data: PricesData;
  isLoading: boolean;
  error: string | null;
};

type CoinGeckoResponse = {
  prices: [number, number][];
};

// https://api.coingecko.com/api/v3/coins/list for full list of coins
const STX_ENDPOINT =
  'https://api.coingecko.com/api/v3/coins/blockstack/market_chart?vs_currency=usd&days=7';
const BTC_ENDPOINT =
  'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7';

export default function usePriceHistory(): usePriceHistoryReturn {
  const stxQuery: UseQueryResult<CoinGeckoResponse, Error> = useQuery({
    queryKey: ['priceHistory', 'stx'],
    queryFn: fetchPriceHistory,
  });
  const btcQuery: UseQueryResult<CoinGeckoResponse, Error> = useQuery({
    queryKey: ['priceHistory', 'btc'],
    queryFn: fetchPriceHistory,
  });
  const isLoading = stxQuery.isLoading || btcQuery.isLoading;
  const error = stxQuery.error?.message ?? btcQuery.error?.message ?? null;

  if (stxQuery.isError || btcQuery.isError) {
    return {
      data: null,
      isLoading,
      error: stxQuery.error?.message ?? btcQuery.error?.message ?? 'Unknown',
    };
  }

  // Just in case
  if (!stxQuery.data || !btcQuery.data) {
    return { data: null, isLoading, error };
  }

  return {
    data: { stx: stxQuery.data.prices, btc: btcQuery.data.prices },
    isLoading: isLoading,
    error: error,
  };
}

async function fetchPriceHistory({ queryKey }: QueryFunctionContext) {
  const [, coin] = queryKey as [string, string];
  const endpoint = coin === 'stx' ? STX_ENDPOINT : BTC_ENDPOINT;
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
