import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';

import useStakeDaoAPY from './useStakeDaoAPY';

type Children = { children: React.ReactNode };

const createWrapper = () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: Children) => (
    <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
  );

  return wrapper;
};

// TODO: it is unclear if APY must be handled the way it is done
it.todo('stack dao apy');
