import { Pressable } from 'react-native';
import TextWithFont from './TextWithFont';
import { useWalletScreenStyles } from '../hooks/useWalletScreenStyle';

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
  const styles = useWalletScreenStyles().buttonNewWallet;

  return (
    <Pressable
      onPress={onPress}
      className={`justify-center items-center relative overflow-hidden border-custom_border ${styles.container} ${accent ? 'bg-custom_accent' : 'bg-custom_complement'
        } ${customStyle ?? ''}`}
      disabled={disabled}
    >
      <TextWithFont customStyle={`${styles.text} ${accent ? 'text-black' : 'text-white'} z-10`}>
        {text}
      </TextWithFont>
    </Pressable>
  );
}
