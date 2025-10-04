import { useState } from 'react';
import { Pressable, View } from 'react-native';

export function Toggle() {
  const [isActivated, setIsActivated] = useState(false);

  return (
    <Pressable
      onPress={() => setIsActivated(!isActivated)}
      className={`border-2 border-custom_accen rounded-full w-16 h-7 flex-row items-center ${isActivated ? 'justify-end bg-custom_accent border-custom_border' : 'justify-start border-custom_accent bg-custom_border'}`}
    >
      <View className={`h-4 w-4 rounded-full mx-1 ${isActivated ? 'bg-custom_border' : 'bg-custom_accent'}`} />
    </Pressable>
  );
}
