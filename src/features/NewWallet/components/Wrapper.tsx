import { View } from 'react-native';

type WrapperType = {
  children: React.ReactNode;
};

export function Wrapper({ children }: WrapperType) {
  return (
    <View className="border-2 border-red-500 h-5/6 w-5/6 m-auto justify-center flex-col">
      {children}
    </View>
  );
}
