import { Book } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import getIconComponent from './GetIcon';
import TextWithFont from './TextWithFont';

type ButtonType = {
  onPress: () => void;
  text: string;
  customStyle?: string;
  accent?: boolean;
  disabled?: boolean;
  iconName?:
    | 'Send'
    | 'Upload'
    | 'Settings'
    | 'RefreshCw'
    | 'DatabaseIcon'
    | 'PlusCircle'
    | 'ArrowRightLeft';
};

export function Button({
  onPress,
  text,
  customStyle,
  accent = false,
  disabled = false,
  iconName,
}: ButtonType) {
  let isIcon = false;

  if (iconName) {
    isIcon = true;
    var Icon: CallableFunction = () => getIconComponent(iconName);
  } else {
    var Icon: CallableFunction = () => null;
  }

  return (
    <Pressable
      onPress={onPress}
      className={`justify-center items-center relative overflow-hidden border-custom_border py-2 px-5 border-2 rounded-xl md:py-3 md:px-14 md:rounded-2xl ${
        accent ? 'bg-custom_accent' : 'bg-custom_complement'
      } ${customStyle ?? ''}`}
      disabled={disabled}
    >
      <TextWithFont
        customStyle={`text-base md:text-lg ${accent ? 'text-black' : 'text-white'} z-10`}
      >
        {text}
      </TextWithFont>
      {isIcon ??
        Icon({
          className: 'sm:h-[12px] md:h-[24px]',
          strokeWidth: 2,
          color: accent ? 'black' : 'white',
        })}
    </Pressable>
  );
}
