import { View, Image } from 'react-native';

export function BottomNavigation() {
  return (
    <View className="flex-row justify-around w-full bg-custom_complement">
      <Image source={require('../../../../assets/icons/home.png')} />
      <Image source={require('../../../../assets/icons/history.png')} />
      <Image source={require('../../../../assets/icons/settings.png')} />
    </View>
  );
}
