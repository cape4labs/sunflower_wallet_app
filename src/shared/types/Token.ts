export interface Token {
  name: string;
  symbol: string;
  cost: string;
  balanceUsd: string;
  balance: string;
  diff?: string | null;
  key?: string; // Full contract identifier
  isDeFi?: boolean;
  coingeckoId?: string;
}
