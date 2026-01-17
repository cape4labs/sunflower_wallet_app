import { TOKEN_REGISTRY } from "../types/tokenRegistry";

// Parsing all tokens that includes at TOKEN_REGISTRY
export function parseStacksTokens(fungibleTokens: Record<string, any>) {
    return Object.entries(fungibleTokens)
        .map(([key, value]) => {
            const config = TOKEN_REGISTRY[key];
            if (!config) return null;

            const raw = Number(value.balance);
            if (raw <= 0) return null; // Delete all 0 values

            const balance = (raw / 10 ** config.decimals).toFixed(config.decimals);

            return {
                key,
                name: config.name,
                symbol: config.symbol,
                balance,
                coingeckoId: config.coingeckoId,
                isDeFi: config.isDeFi,
            };
        })
        .filter((item): item is NonNullable<typeof item> => !!item);
}