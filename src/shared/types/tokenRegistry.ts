export type TokenConfig = {
  key: string;
  name: string;
  symbol: string;
  decimals: number;
  coinGeckoId?: string;
  isDeFi?: boolean;
};

export const TOKEN_REGISTRY: Record<string, TokenConfig> = {
  STX: {
    key: 'STX',
    name: 'Stacks',
    symbol: 'STX',
    decimals: 6,
    coinGeckoId: 'blockstack',
  },

  'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststx-token::ststx': {
    key: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststx-token::ststx',
    name: 'Stacked STX',
    symbol: 'stSTX',
    decimals: 6,
    coinGeckoId: 'ststx',
    isDeFi: true,
  },
  'SPN5AKG35QZSK2M8GAMR4AFX45659RJHDW353HSG.usdh-token-v1::usdh': {
    key: 'SPN5AKG35QZSK2M8GAMR4AFX45659RJHDW353HSG.usdh-token-v1::usdh',
    name: 'USDh',
    symbol: 'USDh',
    decimals: 6,
    coinGeckoId: 'usdh',
  },
  'SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc::aeUSDC': {
    key: 'SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc::aeUSDC',
    name: 'aeUSDC',
    symbol: 'aeUSDC',
    decimals: 6,
    coinGeckoId: 'aeUSDC',
  },
  'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token::sbtc-token': {
    key: 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token::sbtc-token',
    name: 'sBTC',
    symbol: 'sBTC',
    decimals: 6,
    coinGeckoId: 'sBTC',
  },
  'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-alex::alex': {
    key: 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-alex::alex',
    name: 'ALEX Token',
    symbol: 'ALEX',
    decimals: 8,
    coinGeckoId: 'alexgo',
  },
  'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-wstx::wstx': {
    key: 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-wstx::wstx',
    name: 'Wrapped STX v1',
    symbol: 'wSTX',
    decimals: 8,
    coinGeckoId: 'blockstack',
  },
  'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.age000-governance-token::alex': {
    key: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.age000-governance-token::alex',
    name: 'ALEX Governance Token',
    symbol: 'ALEX',
    decimals: 8,
    coinGeckoId: 'alexgo',
  },
  'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx::wstx': {
    key: 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx::wstx',
    name: 'Velar Wrapped STX',
    symbol: 'wSTX',
    decimals: 6,
    coinGeckoId: 'blockstack',
  },
  'SM1793C4R5PZ4NS4VQ4WMP7SKKYVH8JZEWSZ9HCCR.stableswap-pool-stx-ststx-v-1-4::pool-token': {
    key: 'SM1793C4R5PZ4NS4VQ4WMP7SKKYVH8JZEWSZ9HCCR.stableswap-pool-stx-ststx-v-1-4::pool-token',
    name: 'Bitflow STX-stSTX LP',
    symbol: 'STX-stSTX-LP',
    decimals: 6,
    isDeFi: true,
  },
  'SP2VCQYTC9SYVQ37Y3G6T08C6TYPPCQ086K3P6MB.btcz-token::btcz': {
    key: 'SP2VCQYTC9SYVQ37Y3G6T08C6TYPPCQ086K3P6MB.btcz-token::btcz',
    name: 'BTCz Token',
    symbol: 'BTCz',
    decimals: 8,
    isDeFi: true,
  },
};
