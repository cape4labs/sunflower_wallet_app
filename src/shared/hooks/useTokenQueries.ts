import { useQuery } from '@tanstack/react-query';
import { fetchStacksBalances } from '../services/stacksBalances';
import { fetchBtcBalance } from '../services/btcBalance';
import { fetchTokenPrices } from '../services/tokenPrices';

/**
 * React Query hooks for fetching and caching blockchain data.
 * React Query automatically handles:
 * 1. Caching: Results are stored and reused across the app.
 * 2. Deduplication: Multiple components calling the same hook with the same key 
 *    will only trigger ONE network request.
 * 3. Background Refreshing: Data is updated automatically when it becomes stale.
 */

// Unique keys for the cache. Changing the key (e.g. different address) 
// triggers a new fetch and creates a new cache entry.
export const STACKS_BALANCES_QUERY_KEY = 'stacksBalances';
export const BTC_BALANCE_QUERY_KEY = 'btcBalance';
export const TOKEN_PRICES_QUERY_KEY = 'tokenPrices';

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
