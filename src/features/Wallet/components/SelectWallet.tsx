import { Text, Pressable } from 'react-native';

interface SelectWalletProps {
  selectedWallet: string | null;
  walletList: string[];
  onPress: () => void;
}

export function SelectWallet({ selectedWallet, onPress }: SelectWalletProps) {
  return (
    <Pressable className="bg-orange-500 rounded-full py-2 px-4 mb-4 self-center" onPress={onPress}>
      <Text className="text-white text-center text-lg">{selectedWallet || 'Select Wallet'} ▼</Text>
    </Pressable>
  );
}
