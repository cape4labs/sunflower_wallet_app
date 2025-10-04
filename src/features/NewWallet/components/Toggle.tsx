import { useState } from 'react';
import { Pressable, View } from 'react-native';

export function Toggle() {
  const [isActivated, setIsActivated] = useState(false);

  return (
    <Pressable
      onPress={() => setIsActivated(!isActivated)}
      className={`border-2 border-custom_accent bg-custom_border rounded-full w-14 h-6 flex-row items-center ${isActivated ? 'justify-start' : 'justify-end'}`}
    >
      <View className="h-5 w-5 rounded-full bg-custom_accent" />
    </Pressable>
  );
}
