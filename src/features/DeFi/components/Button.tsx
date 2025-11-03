import { Pressable } from 'react-native';
import TextWithFont from '../../../shared/components/TextWithFont';

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
      className={`justify-center items-center w-[90%] h-14 border-4 border-custom_border rounded-lg ${accent ? 'bg-custom_accent' : 'bg-custom_complement'} ${customStyle ?? ''}`}
    >
      <TextWithFont customStyle={`text-lg ${accent ? 'text-black' : 'text-white'}`}>
        {text}
      </TextWithFont>
    </Pressable>
  );
}
