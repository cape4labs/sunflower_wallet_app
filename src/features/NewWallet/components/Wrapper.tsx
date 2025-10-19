import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type WrapperType = {
  children: React.ReactNode;
};

// For none scrollable pages
export function Wrapper({ children }: WrapperType) {
  return <SafeAreaView className="flex-1 items-center justify-center m-8">{children}</SafeAreaView>;
}

// For scrollable pages
export function ScrollableWrapper({ children }: WrapperType) {
  return (
    <ScrollView>
      <SafeAreaView className="flex-1 items-center justify-center m-8">{children}</SafeAreaView>
    </ScrollView>
  );
}
