import '../global.css';
import { Navigation } from './navigation/RootNavigator';
import { WalletProvider } from './providers/WalletContext';

function App() {
  return (
    <WalletProvider>
      <Navigation />
    </WalletProvider>
  );
}

export default App;
