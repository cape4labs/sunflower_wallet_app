import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
  walletName: string | null;
  setWalletName: (name: string | null) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletName, setWalletName] = useState<string | null>(null);

  return (
    <WalletContext.Provider value={{ walletName, setWalletName }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
}
