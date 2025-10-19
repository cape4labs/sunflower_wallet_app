import { Text, View, TextInput } from 'react-native';

type MnemonicWordType = {
  idx: number;
  onChange: (text: string) => void;
  value: string;
};

// A component used for displaying words that are part of a mnemonic
export function MnemonicInput({ idx, onChange, value }: MnemonicWordType) {
  return (
    <View className="flex-row w-full px-2 my-1 p-2 bg-custom_border items-center rounded-lg">
        <Text className='text-white'>{idx}.</Text>
        <TextInput 
        className="flex-1 h-full text-white rounded-md text-lg"
        onChangeText={onChange}
        autoCapitalize="none"
        value={value}
        />
    </View>
  );
}
