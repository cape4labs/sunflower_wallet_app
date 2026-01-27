import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { FlatList, Modal, Pressable, View } from 'react-native';

import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import TextWithFont from '../../../shared/components/TextWithFont';

interface SelectWalletProps {
  selectedWallet: string | null;
  walletList: string[];
  onSelect: (newWalletName: string) => void;
}

export function SelectWallet({ selectedWallet, walletList, onSelect }: SelectWalletProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorTypeParamListType>>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePress = () => {
    console.log('opened');
    console.log(walletList);
    setIsModalVisible(true);
  };

  const handleSelectWallet = (newWalletName: string) => {
    onSelect(newWalletName);
    setIsModalVisible(false);
  };

  const handleCreateWallet = () => {
    setIsModalVisible(false);
    navigation.navigate('ImportCreateScreen');
  };

  const renderWalletItem = ({ item }: { item: string }) => (
    <Pressable
      className="bg-gray-700 rounded-lg mb-2 p-3 md:p-4"
      onPress={() => handleSelectWallet(item)}
    >
      <TextWithFont customStyle="text-white text-center text-sm md:text-base">{item}</TextWithFont>
    </Pressable>
  );

  return (
    <>
      <Pressable
        className={`bg-custom_accent rounded-xl self-center border-custom_border py-1.5 px-3 mb-3 w-[130px] border-[4px] md:py-2 md:px-4 md:mb-4 md:w-[160px]`}
        onPress={handlePress}
        pointerEvents="box-only"
      >
        <TextWithFont customStyle={`text-black font-bold text-center text-sm md:text-base`}>
          {selectedWallet || 'Select Wallet'}
        </TextWithFont>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/70">
          <View className={`bg-gray-800 rounded-lg p-3 w-11/12 h-full md:p-4 md:w-3/4`}>
            <FlatList
              data={walletList}
              renderItem={renderWalletItem}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={true}
            />
            <Pressable
              className={`bg-custom_accent rounded-lg p-1.5 mt-3 md:p-2 md:mt-4`}
              onPress={handleCreateWallet}
            >
              <TextWithFont customStyle={`text-white text-center text-sm md:text-base`}>
                Create New Wallet
              </TextWithFont>
            </Pressable>
            <Pressable
              className="bg-gray-600 rounded-lg mt-2 p-2"
              onPress={() => setIsModalVisible(false)}
            >
              <TextWithFont customStyle="text-white text-center text-base md:text-lg">Close</TextWithFont>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
