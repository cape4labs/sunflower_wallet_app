import { Pressable, View } from 'react-native';

type ToggleType = {
  isToggled: boolean;
  setIsToggled: (v: boolean) => void;
};

export default function Toggle({ isToggled, setIsToggled }: ToggleType) {
  return (
    <Pressable
      onPress={() => setIsToggled(!isToggled)}
      className={`border-2 rounded-full w-20 h-9 flex-row items-center ${
        isToggled
          ? 'bg-custom_accent border-custom_border justify-end'
          : 'bg-custom_border border-custom_accent justify-start'
      }`}
    >
      <View
        className={`h-6 w-6 rounded-full mx-1 ${isToggled ? 'bg-custom_border' : 'bg-custom_accent'}`}
      />
    </Pressable>
  );
}
