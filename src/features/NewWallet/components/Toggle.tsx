import { Pressable, View } from 'react-native';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';

type ToggleType = {
  isToggled: boolean;
  setIsToggled: (v: boolean) => void;
};

export default function Toggle({ isToggled, setIsToggled }: ToggleType) {
  const styles = useWalletScreenStyles().toggle;

  return (
    <Pressable
      onPress={() => setIsToggled(!isToggled)}
      className={`rounded-full flex-row items-center ${styles.container} ${styles.border} ${
        isToggled
          ? 'bg-custom_accent border-custom_border justify-end'
          : 'bg-custom_border border-custom_accent justify-start'
      }`}
    >
      <View
        className={`rounded-full mx-1 ${styles.thumb} ${isToggled ? 'bg-custom_border' : 'bg-custom_accent'}`}
      />
    </Pressable>
  );
}
