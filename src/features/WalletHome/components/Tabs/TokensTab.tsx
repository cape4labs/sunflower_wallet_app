import { TokenList } from '../../../../shared/components/TokenList';
import { Token } from '../../../../shared/types/Token';

export default function TokensTab(tokens: Token[], tokenLoading: boolean, tokenError: string) {
   return <TokenList tokens={tokens} isLoading={tokenLoading} error={tokenError} customStyle={'h-full'} />
};
