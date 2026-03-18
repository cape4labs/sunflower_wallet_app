import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type WrapperType = {
  children: React.ReactNode;
};

// For scrollable pages
export default function ScrollableWrapper({ children }: WrapperType) {
  return (
    <ScrollView>
      <SafeAreaView className="flex-1 items-center justify-center m-8">{children}</SafeAreaView>
    </ScrollView>
  );
}
