import { Pressable, Text } from 'react-native';
import { Send, Upload } from 'lucide-react-native';

type ButtonType = {
  onPress?: () => void;
  text: string;
  customStyle?: string;
  accent?: boolean;
  disable?: boolean;
  iconName: 'Send' | 'Upload'; 
};

type TextButtonType = {
  onPress?: () => void;
  text: string;
  customStyle?: string;
  accent?: boolean;
};

export function Button({
  onPress,
  text,
  customStyle,
  accent = false,
  disable = false,
  iconName,
}: ButtonType) {
  const IconComponent = iconName === 'Send' ? Send : Upload;

  return (
    <Pressable
      onPress={onPress}
      className={`justify-center items-center py-3 px-12 border-2 flex-row gap-3 border-custom_border rounded-2xl relative overflow-hidden ${
        accent ? 'bg-custom_accent' : 'bg-custom_complement'
      } ${customStyle ?? ''}`}
      disabled={disable}
    >
      <Text className={`text-lg ${accent ? 'text-black' : 'text-white'} z-10`}>{text}</Text>
      <IconComponent
        color={accent ? 'black' : 'white'}
        size={20}
        strokeWidth={1.5}
      />
    </Pressable>
  );
}

export function TextButton({ onPress, text, customStyle, accent = false }: TextButtonType) {
  return (
    <Pressable
      onPress={onPress}
      className={`justify-center items-center py-3 px-8 border-b-2 flex-row overflow-hidden ${
        accent ? 'border-white' : 'border-gray-500'
      } ${customStyle ?? ''}`}
    >
      <Text className={`text-xl ${accent ? 'text-custom_accent' : 'text-white'} z-10`}>
        {text}
      </Text>
    </Pressable>
  );
}