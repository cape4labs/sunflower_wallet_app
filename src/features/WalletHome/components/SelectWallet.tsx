import { Text, Pressable, Modal, FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';

interface SelectWalletProps {
  selectedWallet: string | null;
  walletList: string[];
  onSelect: (walletName: string) => void;
}

export function SelectWallet({ selectedWallet, walletList, onSelect }: SelectWalletProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorTypeParamListType>>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePress = () => {
    setIsModalVisible(true);
  };

  const handleSelectWallet = (walletName: string) => {
    onSelect(walletName);
    setIsModalVisible(false);
  };

  const handleCreateWallet = () => {
    setIsModalVisible(false);
    navigation.navigate('ImportCreateScreen');
  };

  const renderWalletItem = ({ item }: { item: string }) => (
    <Pressable className="p-4 bg-gray-700 rounded-lg mb-2" onPress={() => handleSelectWallet(item)}>
      <Text className="text-white text-center text-lg">{item}</Text>
    </Pressable>
  );

  return (
    <>
      <Pressable
        className="bg-custom_accent rounded-xl py-2 px-4 mb-4 self-center border-[6px] border-custom_border"
        onPress={handlePress}
      >
        <Text className="text-black font-bold text-center text-lg w-[150px]">
          {selectedWallet || 'Select Wallet'}
        </Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-gray-800 p-4 rounded-lg w-3/4">
            <FlatList
              data={walletList}
              renderItem={renderWalletItem}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
            />
            <Pressable
              className="bg-custom_accent p-2 rounded-lg mt-4"
              onPress={handleCreateWallet}
            >
              <Text className="text-white text-center text-lg">Create New Wallet</Text>
            </Pressable>
            <Pressable
              className="bg-gray-600 p-2 rounded-lg mt-2"
              onPress={() => setIsModalVisible(false)}
            >
              <Text className="text-white text-center text-lg">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
