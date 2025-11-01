import { Pressable } from 'react-native';
import TextWithFont from '../../../shared/components/TextWithFont';

type ButtonType = {
  onPress: () => void;
  text: string;
  customStyle?: string;
  accent?: boolean;
  disable?: boolean;
};

// A general button used in this feature
export function Button({
  onPress,
  text,
  customStyle,
  accent = false,
  disable = false,
}: ButtonType) {
  return (
    <Pressable
      onPress={onPress}
      className={`justify-center items-center py-3 px-14 border-[6px] border-custom_border rounded-2xl relative overflow-hidden ${
        accent ? 'bg-custom_accent' : 'bg-custom_complement'
      } ${customStyle ?? ''}`}
      disabled={disable ? true : false}
    >
      <TextWithFont customStyle={`text-lg ${accent ? 'text-black' : 'text-white'} z-10`}>{text}</TextWithFont>
    </Pressable>
  );
}
