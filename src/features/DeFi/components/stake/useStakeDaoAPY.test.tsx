import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';

import * as module from './useStakeDaoAPY';

const createWrapper = (retry?: boolean) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: retry,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
  );
};

// A test case just to ensure that nothing breaks in the future
//
// TODO: fix the ungraceful shutdown due to one of the used functions
it('normal case', async () => {
  const { result } = renderHook(() => module.default(), {
    wrapper: createWrapper(false),
  });
  expect(result.current).toBe('Loading');
});
