import { Pressable, Text } from 'react-native';

type ButtonType = {
  onPress: () => void;
  text: string;
};

// A general button used in this feature
export function Button({ onPress, text }: ButtonType) {
  return (
    <Pressable
      onPress={onPress}
      className="justify-center items-center bg-black w-full h-24 text-xl m-auto"
    >
      <Text className="text-white">{text}</Text>
    </Pressable>
  );
}
