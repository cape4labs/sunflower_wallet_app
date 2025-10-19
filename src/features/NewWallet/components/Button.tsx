import { Pressable, Text, View } from 'react-native';

type ButtonType = {
  onPress: () => void;
  text: string;
  customStyle?: string;
  accent?: boolean;
};

// A general button used in this feature
export function Button({ onPress, text, customStyle, accent = false }: ButtonType) {
  return (
    <Pressable
      onPress={onPress}
      className={`justify-center items-center py-3 px-16 border-[6px] border-custom_border rounded-2xl relative overflow-hidden ${
        accent ? 'bg-custom_accent' : 'bg-custom_complement'
      } ${customStyle ?? ''}`}
    >
      <Text className={`text-lg ${accent ? 'text-black' : 'text-white'} z-10`}>{text}</Text>
    </Pressable>
  );
}