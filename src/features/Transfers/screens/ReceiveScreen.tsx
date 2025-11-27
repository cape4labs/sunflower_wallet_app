import Wrapper from '../../../shared/components/Wrapper';
import { Pressable, View, Animated, Dimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { getWalletData } from '../../../shared/walletPersitance';
import { useEffect, useState, useRef } from 'react';
import { copyToClipboard } from '../../../shared/utils/clipboard';
import { useNavigation, useRoute } from '@react-navigation/native';
import TextWithFont from '../../../shared/components/TextWithFont';
import { ArrowLeft, ChevronDown, ChevronLeft, Copy } from 'lucide-react-native';
import Coin from '../../../shared/components/Coin';
import { Token } from '../../../shared/types/Token';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';

type RouteParams = {
  walletName: string;
  tokens: Token[];
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.4;

export default function ReceiveScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { walletName, tokens } = route.params as RouteParams;
  const styles = useWalletScreenStyles().receiveScreen;
  const [openAsset, setOpenAsset] = useState<'stx' | 'btc' | null>(null);
  const [addresses, setAddresses] = useState({ stx: '', btc: '' });
  const [error, setError] = useState('');

  const stxToken = tokens.find(t => t.symbol.toUpperCase() === 'STX');
  const btcToken = tokens.find(t => t.symbol.toUpperCase() === 'BTC');

  const heightAnimSTX = useRef(new Animated.Value(0)).current;
  const heightAnimBTC = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const walletData = await getWalletData(walletName);
        if (walletData) {
          setAddresses({
            stx: walletData.stxAddress,
            btc: walletData.btcAddress,
          });
        }
      } catch (err) {
        setError('Error loading addresses');
      }
    };
    fetchAddresses();
  }, [walletName]);

  const toggleAsset = (asset: 'stx' | 'btc') => {
    const isOpening = openAsset !== asset;

    if (openAsset && openAsset !== asset) {
      Animated.timing(openAsset === 'stx' ? heightAnimSTX : heightAnimBTC, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }

    setOpenAsset(isOpening ? asset : null);

    const targetHeight = isOpening ? EXPANDED_HEIGHT : 0;
    const anim = asset === 'stx' ? heightAnimSTX : heightAnimBTC;

    Animated.timing(anim, {
      toValue: targetHeight,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const renderAssetBlock = (token: Token | undefined, asset: 'stx' | 'btc', address: string) => {
    if (!token) return null;

    const isOpen = openAsset === asset;
    const heightAnim = asset === 'stx' ? heightAnimSTX : heightAnimBTC;
    const ArrowIcon = isOpen ? ChevronLeft : ChevronDown;
    const arrowColor = isOpen ? '#FF5500' : '#FFFFFF';

    return (
      <View key={asset} className="m-4">
        <Pressable
          onPress={() => toggleAsset(asset)}
          className="flex-row justify-between items-center"
        >
          <Coin token={token} />
          <ArrowIcon color={arrowColor} size={24} className="" />
        </Pressable>

        <Animated.View style={{ height: heightAnim, overflow: 'hidden' }} className="p-4">
          {isOpen && (
            <View className="px-4 pb-6 pt-2">
              <View className="items-center mb-5 bg-white p-5 rounded-xl self-center">
                <QRCode value={address} size={parseInt(styles.qrSize)} />
              </View>

              <View className="items-center mb-3">
                <TextWithFont customStyle="text-gray-400 text-sm">
                  Public address:{' '}
                  <TextWithFont customStyle="text-white font-medium">
                    {asset === 'stx' ? 'Stacks' : 'Native Segwit'}
                  </TextWithFont>
                </TextWithFont>
              </View>

              <View className="flex-row items-center justify-between">
                <TextWithFont customStyle="text-white text-sm flex-1 mr-3">{address}</TextWithFont>
                <Pressable onPress={() => copyToClipboard(address)} className=''>
                  <Copy size={styles.copyIconSize} color={'#fff'} />
                </Pressable>
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    );
  };

  return (
    <Wrapper>
      <View className={`flex-col w-full h-full`}>
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft color={'#FF5500'} size={parseInt(styles.arrowSize)} />
          </Pressable>
          <TextWithFont customStyle={`text-white ${styles.titleSize}`}>Receive</TextWithFont>
          <View />
        </View>

        <View className="flex-1 mt-10">
          {renderAssetBlock(btcToken, 'btc', addresses.btc)}
          <View className={`w-full h-1 border-t-2 border-white ${styles.dividerMargin}`} />
          {renderAssetBlock(stxToken, 'stx', addresses.stx)}
        </View>
      </View>
    </Wrapper>
  );
}
