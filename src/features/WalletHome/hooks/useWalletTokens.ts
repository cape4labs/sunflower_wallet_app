import { useCallback, useMemo } from 'react';

import {
  useBtcBalanceQuery,
  useStacksBalancesQuery,
  useTokenPricesQuery,
} from '../../../shared/hooks/useTokenQueries';
import { Token } from '../../../shared/types/Token';
import { TOKEN_REGISTRY } from '../../../shared/types/tokenRegistry';
import { parseStacksTokens } from '../../../shared/utils/parseStacksTokens';
import { TokenPriceUtils } from '../../../shared/utils/tokenPriceUtils';
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
      // 1. Stacks (STX)
      result.push(
        TokenPriceUtils.createTokenData({
          configKey: 'STX',
          rawBalance: stacksData.stx.balance,
          prices,
          historyDiff: calculatePriceDiff(priceHistory?.stx).data,
        })
      );

      // 2. Fungible Tokens (SIP-010)
      for (const t of parsedTokens) {
        if (!t) continue;
        result.push(
          TokenPriceUtils.createTokenData({
            configKey: t.key,
            rawBalance: stacksData.fungible_tokens[t.key].balance,
            prices,
          })
        );
      }
    }

    // 3. Bitcoin
    if (btcBalance && prices) {
      result.push(
        TokenPriceUtils.createBtcData(
          btcBalance,
          prices.bitcoin?.usd ?? 0,
          calculatePriceDiff(priceHistory?.btc).data
        )
      );
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
