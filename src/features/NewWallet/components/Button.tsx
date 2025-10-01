import { Pressable, Text } from 'react-native';

type ButtonType = {
  onPress: () => void;
  text: string;
};

export function Button({ onPress, text }: ButtonType) {
  return (
    <Pressable onPress={onPress} className="bg-black w-full h-32 text-2x1 m-auto">
      <Text className="text-white">{text}</Text>
    </Pressable>
  );
}
