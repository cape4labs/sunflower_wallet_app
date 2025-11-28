import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '../global.css';
import { Navigation } from './navigation/RootNavigator';
import { WalletProvider } from './providers/WalletContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Navigation />
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
