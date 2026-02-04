import { TOKEN_REGISTRY } from '../types/tokenRegistry';
import { Token } from '../types/Token';

export const TokenPriceUtils = {
    formatRawBalance(rawBalance: string | number, decimals: number): string {
        const raw = Number(rawBalance);
        return (raw / Math.pow(10, decimals)).toFixed(decimals > 6 ? 8 : 6);
    },

    calculateUsdValue(balance: string | number, price: number | undefined): string {
        return (Number(balance) * (price || 0)).toFixed(2);
    },

    createTokenData(params: {
        configKey: string;
        rawBalance: string | number;
        prices: any;
        historyDiff?: string | null;
    }): Token {
        const config = TOKEN_REGISTRY[params.configKey];

        if (!config) {
            return {
                name: 'Unknown',
                symbol: params.configKey,
                balance: '0',
                cost: '0',
                balanceUsd: '0',
            };
        }

        const price = params.prices[config.coinGeckoId!]?.usd ?? 0;
        const balance = this.formatRawBalance(params.rawBalance, config.decimals);

        return {
            name: config.name,
            symbol: config.symbol,
            cost: price.toString(),
            balance,
            balanceUsd: this.calculateUsdValue(balance, price),
            diff: params.historyDiff,
            key: config.key,
            isDeFi: config.isDeFi,
            coingeckoId: config.coinGeckoId,
        };
    },

    createBtcData(balance: string, price: number, diff?: string | null): Token {
        return {
            name: 'Bitcoin',
            symbol: 'BTC',
            balance,
            cost: price.toString(),
            balanceUsd: this.calculateUsdValue(balance, price),
            diff,
            coingeckoId: 'bitcoin',
        };
    },

    formatAmountAndSymbol(rawAmount: string | number, symbol: string, decimals: number = 6): string {
        const formatted = this.formatRawBalance(rawAmount, decimals);
        return `${formatted} ${symbol}`;
    }
};
