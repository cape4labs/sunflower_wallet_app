import { useCallback, useMemo } from 'react';

import {
  useBtcBalanceQuery,
  useStacksBalancesQuery,
  useTokenPricesQuery,
} from '../../../shared/hooks/useTokenQueries';
import { Token } from '../../../shared/types/Token';
import { TOKEN_REGISTRY } from '../../../shared/types/tokenRegistry';
import { parseStacksTokens } from '../../../shared/utils/parseStacksTokens';
import { PricesData } from '../types/wallet';
import calculatePriceDiff from '../utils/calculatePriceDiff';

export default function useWalletTokens(
  priceHistory: PricesData | null,
  stxAddress?: string | null,
  btcAddress?: string | null,
) {
  const {
    data: stacksData,
    isLoading: isLoadingStacks,
    error: errorStacks,
    refetch: refetchStacks,
  } = useStacksBalancesQuery(stxAddress);

  const {
    data: btcBalance,
    isLoading: isLoadingBtc,
    error: errorBtc,
    refetch: refetchBtc,
  } = useBtcBalanceQuery(btcAddress);

  // Derive price IDs ** not working for fungible tokens **
  const parsedTokens = useMemo(() => {
    console.log(stacksData?.fungible_tokens);
    return stxAddress && stacksData?.fungible_tokens
      ? parseStacksTokens(stacksData.fungible_tokens)
      : [];
  }, [stxAddress, stacksData]);

  // Derive price IDs for all tokens to fetch their prices
  const priceIds = useMemo(
    () => [
      TOKEN_REGISTRY.STX.coinGeckoId!,
      'bitcoin',
      ...parsedTokens.map(t => t?.coingeckoId).filter((id): id is string => !!id),
    ],
    [parsedTokens],
  );

  const {
    data: prices,
    isLoading: isLoadingPrices,
    error: errorPrices,
    refetch: refetchPrices,
  } = useTokenPricesQuery(priceIds);

  // Aggregates data from multiple sources (Stacks, BTC, CoinGecko)
  // into a single list of tokens with prices and USD values.
  const tokens: Token[] = useMemo(() => {
    const result: Token[] = [];

    // Combine Stacks data (STX + SIP-010) with prices
    if (stacksData && prices) {
      const stxRaw = Number(stacksData.stx.balance);
      const stxBalance = (stxRaw / 1e6).toFixed(6);
      const stxPrice = prices.blockstack?.usd ?? 0;
      const stxUsd = Number(stxBalance) * stxPrice;

      result.push({
        name: 'Stacks',
        symbol: 'STX',
        balance: stxBalance,
        cost: stxPrice.toString(),
        balanceUsd: stxUsd.toFixed(2),
        diff: calculatePriceDiff(priceHistory?.stx).data,
        coingeckoId: 'blockstack',
      });

      // Map Fungible Tokens (SIP-010)
      for (const t of parsedTokens) {
        if (!t) continue; // Safety check for TypeScript
        const price = prices[t.coingeckoId!]?.usd ?? 0;
        const usd = Number(t.balance) * price;

        result.push({
          name: t.name,
          symbol: t.symbol,
          balance: t.balance,
          cost: price.toString(),
          balanceUsd: usd.toFixed(2),
          key: t.key,
          isDeFi: t.isDeFi,
          coingeckoId: t.coingeckoId,
        });
      }
    }

    // Add Bitcoin balance derived from blockstream.info + bitcoin coingecko price
    if (btcBalance && prices) {
      const btcPrice = prices.bitcoin?.usd ?? 0;
      const usd = Number(btcBalance) * btcPrice;

      result.push({
        name: 'Bitcoin',
        symbol: 'BTC',
        balance: btcBalance,
        cost: btcPrice.toString(),
        balanceUsd: usd.toFixed(2),
        diff: calculatePriceDiff(priceHistory?.btc).data,
        coingeckoId: 'bitcoin',
      });
    }

    return result;
  }, [stacksData, btcBalance, prices, parsedTokens, priceHistory]);

  // Combined portfolio balance in USD
  const walletBalance = useMemo(() => {
    return tokens.reduce((acc, token) => acc + Number(token.balanceUsd), 0).toFixed(2);
  }, [tokens]);

  /**
   * Manually triggers a reload of all balance/price data.
   * Wrapped in useCallback to ensure it remains stable when passed to other hooks (like useFocusEffect).
   */
  const fetchTokensCosts = useCallback(() => {
    refetchStacks();
    refetchBtc();
    refetchPrices();
  }, [refetchStacks, refetchBtc, refetchPrices]);

  const isLoading = isLoadingStacks || isLoadingBtc || isLoadingPrices;
  const error = errorStacks?.message || errorBtc?.message || errorPrices?.message || null;

  return {
    tokens,
    walletBalance,
    tokenError: error,
    tokenLoading: isLoading,
    fetchTokensCosts,
  };
}
