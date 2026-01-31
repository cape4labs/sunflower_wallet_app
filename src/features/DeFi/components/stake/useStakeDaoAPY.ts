import { UseQueryResult, useQuery } from '@tanstack/react-query';

// TODO: convert it to a general-purpose function;
// to do this, the MainBTCfiScreen must be rewritten
// as well as its components
export default function useStakeDaoAPY(): string {
  const refetchIntervalMilliseconds = 30_000;
  const staleTimeMilliseconds = 20_000;

  const result: UseQueryResult<string> = useQuery({
    queryKey: ['apy'],
    queryFn: fetchApy,
    refetchInterval: refetchIntervalMilliseconds,
    staleTime: staleTimeMilliseconds,
  });

  if (result.data) {
    return result.data;
  }
  return 'Loading';
}

const APY_URL = 'https://app.stackingdao.com/.netlify/functions/apy?v=2';

type ApyResponseType = { ststx: string; ststxbtc: string; stx: string };

export async function fetchApy(): Promise<string> {
  const result = await fetch(APY_URL);
  const data: ApyResponseType = await result.json();
  return data.ststx;
}
