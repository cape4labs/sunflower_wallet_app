import { View, Pressable, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, DatabaseIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { RootNavigatorTypeParamListType } from '../../../navigation/types';
import TextWithFont from '../../../shared/components/TextWithFont';
import StackingDaoCard from '../components/stake/StakingDAO';
import BitflowPoolCard from '../components/pool/BitflowPool';
import BTCzCard from '../components/borrow/BTCz';

type MainBTCfiScreenProp = NativeStackNavigationProp<RootNavigatorTypeParamListType, 'MainBTCfiScreen'>;
type RouteParams = { walletName: string };

const TABS = ['Stake', 'Pools', 'Borrow', 'Vote'];

const STAKING_PROTOCOLS = [
  {
    id: 'stacking-dao',
    name: 'Stacking DAO',
    icon: 'Layers',
    apy: '~8.81%',
    description: 'Liquid Staking for STX'
  },
];

const POOLS_PROTOCOLS = [
  {
    id: 'bitflow',
    name: 'Bitflow pool',
    icon: 'Layers',
    apy: 'Dynamic',
    description: 'STX-stSTX'
  }
];

const BORROW_PROTOCOLS = [
  {
    id: 'zest',
    name: 'BTCz Protocol',
    icon: 'Database',
    apy: 'Dynamic',
    description: 'Bitcoin Lending'
  }
];

export default function MainBTCfiScreen() {
  const navigation = useNavigation<MainBTCfiScreenProp>();
  const route = useRoute();
  const { walletName } = route.params as RouteParams;
  const [activeTab, setActiveTab] = useState('Stake');
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const handleProtocolSelect = (id: string) => {
    setSelectedProtocol(id);
  }

  const handleBackToProtocols = () => {
    setSelectedProtocol(null);
  }

  const getProtocolsForTab = () => {
    switch (activeTab) {
      case 'Stake': return STAKING_PROTOCOLS;
      case 'Pools': return POOLS_PROTOCOLS;
      case 'Borrow': return BORROW_PROTOCOLS;
      default: return [];
    }
  }

  const renderProtocolDetail = () => {
    switch (selectedProtocol) {
      case 'stacking-dao': return <StackingDaoCard walletName={walletName} />;
      case 'bitflow': return <BitflowPoolCard walletName={walletName} />;
      case 'zest': return <BTCzCard walletName={walletName} />
      default: return null;
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-custom_background px-4">
      <View className="flex-row items-center justify-between py-4">
        <Pressable onPress={() => navigation.goBack()} className="p-2">
          <ChevronLeft color="white" size={24} />
        </Pressable>
        <TextWithFont customStyle="text-2xl text-white">BTCfi</TextWithFont>
        <Pressable>
        </Pressable>
      </View>

      <View className="flex-row mt-4 bg-custom_border overflow-hidden border-2 border-r-0 border-custom_border">
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => { setActiveTab(tab); setSelectedProtocol(null); }}
            className={`flex-1 py-3 items-center justify-center ${activeTab === tab ? 'bg-custom_accent' : 'bg-custom_complement'} border-r-2 border-custom_border`}
          >
            <TextWithFont
              customStyle={`${activeTab === tab ? 'text-black' : 'text-white'}`}
            >
              {tab}
            </TextWithFont>
          </Pressable>
        ))}
      </View>

      <ScrollView className="mt-4">
        {!selectedProtocol ? (
          <View className="gap-4">
            {getProtocolsForTab().map((protocol) => (
              <Pressable
                key={protocol.id}
                onPress={() => handleProtocolSelect(protocol.id)}
                className="bg-custom_complement p-4 rounded-xl border border-custom_border flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 bg-custom_background rounded-full items-center justify-center">
                    <DatabaseIcon strokeWidth={2} color={"#fff"} />
                  </View>
                  <View>
                    <TextWithFont customStyle="text-white text-lg font-bold">{protocol.name}</TextWithFont>
                    <TextWithFont customStyle="text-white text-xs">{protocol.description}</TextWithFont>
                  </View>
                </View>
                <View className="items-end">
                  <TextWithFont customStyle="text-green-400 font-bold">{protocol.apy}</TextWithFont>
                  <TextWithFont customStyle="text-gray-500 text-xs">APY</TextWithFont>
                </View>
              </Pressable>
            ))}
            {getProtocolsForTab().length === 0 && (
              <View className="p-4 items-center">
                <TextWithFont customStyle="text-white">No protocols available</TextWithFont>
              </View>
            )}
          </View>
        ) : (
          <View>
            <Pressable onPress={handleBackToProtocols} className="flex-row items-center mb-4">
              <ChevronLeft color="#FF5500" size={20} />
              <TextWithFont customStyle="text-custom_accent ml-1">Back to protocols</TextWithFont>
            </Pressable>
            {renderProtocolDetail()}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
