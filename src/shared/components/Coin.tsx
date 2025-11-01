import { View, Image } from 'react-native';
import formatNumber from '../../shared/utils/formatNumber';
import { Token } from '../../features/WalletHome/screens/MainWalletScreen';
import TextWithFont from './TextWithFont';


const getIcon = (symbol: string) => {
  switch (symbol.toUpperCase()) {
    case 'BTC':
      return require('../../../assets/icons/bitcoin.png');
    case 'STX':
      return require('../../../assets/icons/stacks.png');
    default:
      return null;
  }
};

type CoinProp = {
  token: Token;
  inMainScreen?: boolean;
};

export default function Coin({ token, inMainScreen }: CoinProp) {
  return (
    <View className="flex-row justify-between items-center w-full">
      <View className="flex-row justify-center items-center">
        <View>
          <Image source={getIcon(token.symbol)} />
        </View>
        <View className="ml-2 items-start">
          <View className="flex-row justify-center items-center">
            <TextWithFont customStyle="text-white text-xl">{token.name}</TextWithFont>
            {inMainScreen ? <TextWithFont customStyle="text-green-500 ml-1">+1.27%</TextWithFont> : <></>}
          </View>
          <View>
            <TextWithFont customStyle="text-gray-400 font-normal">${formatNumber(token.balanceUsd)}</TextWithFont>
          </View>
        </View>
      </View>
      <View className="flex-col items-end">
        <TextWithFont customStyle="text-white text-xl">
          {formatNumber(token.balance)} {token.symbol}
        </TextWithFont>
        <TextWithFont customStyle="text-gray-400">${formatNumber(token.cost)}</TextWithFont>
      </View>
    </View>
  );
}
