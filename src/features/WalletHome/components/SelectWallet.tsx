import { Pressable, Modal, FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import TextWithFont from '../../../shared/components/TextWithFont';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';


interface SelectWalletProps {
  selectedWallet: string | null;
  walletList: string[];
  onSelect: (newWalletName: string) => void;
}

export function SelectWallet({ selectedWallet, walletList, onSelect }: SelectWalletProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorTypeParamListType>>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const styles = useWalletScreenStyles().selectWallet;

  const handlePress = () => {
    console.log('opened');
    console.log(walletList)
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
    <Pressable className="p-4 bg-gray-700 rounded-lg mb-2" onPress={() => handleSelectWallet(item)}>
      <TextWithFont customStyle="text-white text-center text-sm">{item}</TextWithFont>
    </Pressable>
  );

  return (
    <>
      <Pressable
        className={`bg-custom_accent rounded-xl ${styles.trigger} self-center border-custom_border`}
        onPress={handlePress}
        pointerEvents="box-only"
      >
        <TextWithFont customStyle={`text-black font-bold text-center ${styles.triggerText}`}>
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
          <View className={`bg-gray-800 rounded-lg ${styles.modal}`}>
            <FlatList
              data={walletList}
              renderItem={renderWalletItem}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={true}
            />
            <Pressable
              className={`bg-custom_accent rounded-lg ${styles.actionButton}`}
              onPress={handleCreateWallet}
            >
              <TextWithFont customStyle={`text-white text-center ${styles.actionText}`}>Create New Wallet</TextWithFont>
            </Pressable>
            <Pressable
              className="bg-gray-600 rounded-lg mt-2 p-2"
              onPress={() => setIsModalVisible(false)}
            >
              <TextWithFont customStyle="text-white text-center text-lg">Close</TextWithFont>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}