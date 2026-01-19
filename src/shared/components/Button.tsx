import { Pressable } from 'react-native';

import getIconComponent from './GetIcon';
import TextWithFont from './TextWithFont';

type iconNameType =
  | 'Send'
  | 'Upload'
  | 'Settings'
  | 'RefreshCw'
  | 'DatabaseIcon'
  | 'PlusCircle'
  | 'ArrowRightLeft';

type ButtonType = {
  onPress: () => void;
  text: string;
  customStyle?: string;
  accent?: boolean;
  disabled?: boolean;
  sectionButton?: boolean;
  iconName?: iconNameType;
};

export function Button({
  onPress,
  text,
  customStyle,
  accent = false,
  disabled = false,
  sectionButton = false,
  iconName,
}: ButtonType) {
  let Icon = null;

  if (iconName) {
    Icon = getIconComponent(iconName);
  }

  return (
    <Pressable
      onPress={onPress}
      className={`justify-center flex flex-row gap-3 items-center
                  relative overflow-hidden py-2 px-5
                    md:py-3 md:px-14 border-b-2
                  ${
                    sectionButton
                      ? `${accent ? 'border-white' : 'border-gray-500'}`
                      : `border-2 rounded-xl md:rounded-2xl border-custom_border ${accent ? 'bg-custom_accent' : 'bg-custom_complement'}`
                  }
                  ${customStyle}
                `}
      disabled={disabled}
    >
      <TextWithFont
        customStyle={`text-base md:text-lg z-10
                      ${sectionButton ? (accent ? 'text-custom_accent' : 'text-white') : accent ? 'text-black' : 'text-white'}
                    `}
      >
        {text}
      </TextWithFont>
      {Icon ? (
        <Icon
          className={'sm:h-[12px] md:h-[24px]'}
          strokeWidth={2}
          color={accent ? 'black' : 'white'}
        />
      ) : null}
    </Pressable>
  );
}
