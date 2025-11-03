import { Pressable } from 'react-native';
import { Send, Upload, Settings, RefreshCw, DatabaseIcon, PlusCircle } from 'lucide-react-native';
import TextWithFont from '../../../shared/components/TextWithFont';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';

type ButtonType = {
  onPress?: () => void;
  text: string;
  customStyle?: string;
  accent?: boolean;
  disable?: boolean;
  iconName: 'Send' | 'Upload' | 'Settings' | 'RefreshCw' | 'DatabaseIcon' | 'PlusCircle';
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
  const getIconComponent = () => {
    switch (iconName) {
      case 'Send':
        return Send;
      case 'Upload':
        return Upload;
      case 'Settings':
        return Settings;
      case 'RefreshCw':
        return RefreshCw;
      case 'DatabaseIcon':
        return DatabaseIcon;
      case 'PlusCircle':
        return PlusCircle;
      default:
        return Send;
    }
  };

  const IconComponent = getIconComponent();
  const styles = useWalletScreenStyles().button;

  return (
    <Pressable
      onPress={onPress}
      className={`justify-center items-center ${styles.container} flex-row  border-custom_border relative overflow-hidden ${
        accent ? 'bg-custom_accent' : 'bg-custom_complement'
      } ${customStyle ?? ''}`}
      disabled={disable}
    >
      <TextWithFont customStyle={`${accent ? 'text-black' : 'text-white'} ${styles.text} z-10`}>
        {text}
      </TextWithFont>
      <IconComponent
        color={accent ? 'black' : 'white'}
        size={parseInt(styles.icon)}
        strokeWidth={2}
      />
    </Pressable>
  );
}

export function TextButton({ onPress, text, customStyle, accent = false }: TextButtonType) {
  const styles = useWalletScreenStyles();

  return (
    <Pressable
      onPress={onPress}
      className={`justify-center items-center ${styles.textButton.container} flex-row overflow-hidden ${
        accent ? 'border-white' : 'border-gray-500'
      } ${customStyle ?? ''}`}
    >
      <TextWithFont
        customStyle={`${styles.textButton.text} ${accent ? 'text-custom_accent' : 'text-white'} z-10`}
      >
        {text}
      </TextWithFont>
    </Pressable>
  );
}
