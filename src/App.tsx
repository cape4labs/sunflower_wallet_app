import '../global.css';
import { Navigation } from './navigation/RootNavigator';
import { WalletProvider } from './providers/WalletContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
