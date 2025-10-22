import { SafeAreaView } from 'react-native-safe-area-context';

type WrapperType = {
  children: React.ReactNode;
};

// For none scrollable pages
export default function Wrapper({ children }: WrapperType) {
  return <SafeAreaView className="flex-1 items-center justify-center m-8">{children}</SafeAreaView>;
}
