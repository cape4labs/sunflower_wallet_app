import { Pressable, Text, Image } from 'react-native';

type ButtonType = {
  onPress?: () => void;
  text: string;
  customStyle?: string;
  accent?: boolean;
  disable?: boolean;
  imageSource: string;
};

type TextButtonType = {
  onPress?: () => void;
  text: string;
  customStyle?: string;
  accent?: boolean;
};

// A general button used in this feature
export function Button({
  onPress,
  text,
  customStyle,
  accent = false,
  disable = false,
  imageSource,
}: ButtonType) {
  let imageSourcePath;
  switch (imageSource) {
    case 'send.png':
      imageSourcePath = require('../../../../assets/icons/send.png');
      break;
    case 'receive.png':
      imageSourcePath = require('../../../../assets/icons/receive.png');
      break;
  }

  // If you want to add some btns, add path to icon into switch/case

  return (
    <Pressable
      onPress={onPress}
      className={`justify-center items-center py-3 px-12 border-2 flex-row gap-3 border-custom_border rounded-2xl relative overflow-hidden ${
        accent ? 'bg-custom_accent' : 'bg-custom_complement'
      } ${customStyle ?? ''}`}
      disabled={disable ? true : false}
    >
      <Text className={`text-lg ${accent ? 'text-black' : 'text-white'} z-10`}>{text}</Text>
      <Image source={imageSourcePath} />
    </Pressable>
  );
}

export function TextButton({ onPress, text, customStyle, accent = false }: TextButtonType) {
  return (
    <Pressable
      onPress={onPress}
      className={`justify-center items-center py-3 px-8 border-b-2 flex-row overflow-hidden ${accent ? 'border-white' : 'border-gray-500'} ${customStyle ?? ''}`}
    >
      <Text className={`text-xl ${accent ? 'text-custom_accent' : 'text-white'} z-10`}>{text}</Text>
    </Pressable>
  );
}
