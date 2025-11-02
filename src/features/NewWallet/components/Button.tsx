import { Pressable } from 'react-native';
import TextWithFont from '../../../shared/components/TextWithFont';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';

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
  const styles = useWalletScreenStyles().buttonNewWallet;

  return (
    <Pressable
      onPress={onPress}
      className={`justify-center items-center relative overflow-hidden ${styles.container} ${
        accent ? 'bg-custom_accent' : 'bg-custom_complement'
      } ${customStyle ?? ''}`}
      disabled={disable}
    >
      <TextWithFont customStyle={`${styles.text} ${accent ? 'text-black' : 'text-white'} z-10`}>
        {text}
      </TextWithFont>
    </Pressable>
  );
}
