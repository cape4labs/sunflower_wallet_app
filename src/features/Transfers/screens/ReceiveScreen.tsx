import Wrapper from '../../../shared/components/Wrapper';
import { Pressable, Text, Image, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { getWalletData } from '../../../shared/walletPersitance';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from '../../../shared/utils/copyToClipboard';
import { useRoute } from '@react-navigation/native';

type RouteParams = {
  walletName: string;
};

export default function ReceiveScreen() {
  const route = useRoute();
  const { walletName } = route.params as RouteParams;
  const [asset, setAsset] = useState('stx');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Is reloading');
    async () => {
      try {
        const walletData = await getWalletData(walletName);
        if (!walletData) {
          // This should never happen
          setError('Wallet data not found');
          return;
        }

        if (asset === 'stx') {
          setAddress(walletData.stxAddress);
        } else {
          setAddress(walletData.btcAddress);
        }
      } catch (err) {
        const errorMessage = 'Error fetching wallet data: ' + (err as Error).message;
        setError(errorMessage);
      }
    };
  }, [asset, walletName]);

  return (
    <Wrapper>
      <View>{address ? <QRCode value={address} /> : <Text>Loading...</Text>}</View>
      <View className="mt-2 flex flex-row w-full h-12 rounded-lg bg-custom_complement justify-between">
        <Pressable
          onPress={() => {
            asset === 'stx' ? setAsset('btc') : setAsset('stx');
          }}
          className="bg-custom_border rounded-lg"
        >
          <Text>{asset.toUpperCase()}</Text>
        </Pressable>
        <Text>{address}</Text>
        <Pressable onPress={CopyToClipboard(address)} className="h-full">
          <Image source={require('../../../../assets/icons/copy.png')} />
        </Pressable>
      </View>
      {error && <View className="text-red-300 mt-2">{error}</View>}
    </Wrapper>
  );
}
