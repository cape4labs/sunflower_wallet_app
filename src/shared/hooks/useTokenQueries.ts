import { useQuery } from '@tanstack/react-query';

import { fetchBtcBalance } from '../services/btcBalance';
import { fetchStacksBalances } from '../services/stacksBalances';
import { fetchTokenPrices } from '../services/tokenPrices';

// Unique keys for the cache. Changing the key (e.g. different address)
// triggers a new fetch and creates a new cache entry.
const STACKS_BALANCES_QUERY_KEY = 'stacksBalances';
const BTC_BALANCE_QUERY_KEY = 'btcBalance';
const TOKEN_PRICES_QUERY_KEY = 'tokenPrices';

/**
 * Fetches Stacks (STX) and Fungible Token (SIP-010) balances.
 */
export function useStacksBalancesQuery(address: string | undefined | null) {
  return useQuery({
    // The key includes the address so each wallet has its own cache.
    queryKey: [STACKS_BALANCES_QUERY_KEY, address],
    queryFn: () => fetchStacksBalances(address!),
    // Only run the query if we actually have an address.
    enabled: !!address,
    // Data is considered fresh for 1 minute.
    staleTime: 1000 * 60,
  });
}

/**
 * Fetches Bitcoin (BTC) balance.
 */
export function useBtcBalanceQuery(address: string | undefined | null) {
  return useQuery({
    queryKey: [BTC_BALANCE_QUERY_KEY, address],
    queryFn: () => fetchBtcBalance(address!),
    enabled: !!address,
    staleTime: 1000 * 60,
  });
}

/**
 * Fetches current market prices from CoinGecko.
 */
export function useTokenPricesQuery(ids: string[]) {
  return useQuery({
    // Sorted IDs ensure the same set of tokens always hits the same cache key.
    queryKey: [TOKEN_PRICES_QUERY_KEY, ids.sort()],
    queryFn: () => fetchTokenPrices(ids),
    enabled: ids.length > 0,
    // Prices change less frequently, fresh for 5 minutes.
    staleTime: 1000 * 60 * 5,
  });
}
