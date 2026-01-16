import { Pressable } from 'react-native';

import TextWithFont from './TextWithFont';

type ButtonType = {
  onPress: () => void;
  text: string;
  customStyle?: string;
  accent?: boolean;
  disabled?: boolean;
};

// A general button used in this feature
export function Button({
  onPress,
  text,
  customStyle,
  accent = false,
  disabled = false,
}: ButtonType) {
  return (
    <Pressable
      onPress={onPress}
      className={`justify-center items-center relative overflow-hidden border-custom_border py-2 px-10 border-2 rounded-xl md:py-3 md:px-14 md:rounded-2xl ${
        accent ? 'bg-custom_accent' : 'bg-custom_complement'
      } ${customStyle ?? ''}`}
      disabled={disabled}
    >
      <TextWithFont
        customStyle={`text-base md:text-lg ${accent ? 'text-black' : 'text-white'} z-10`}
      >
        {text}
      </TextWithFont>
    </Pressable>
  );
}
