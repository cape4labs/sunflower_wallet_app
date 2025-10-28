import { View, Image, Text } from 'react-native';
import formatNumber from '../../shared/utils/formatNumber';
import { Token } from '../../features/WalletHome/screens/MainWalletScreen';

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
    <View className="flex-row justify-between items-center    w-full">
      <View className="flex-row justify-center items-center">
        <View>
          <Image source={getIcon(token.symbol)} />
        </View>
        <View className="ml-2">
          <View className="flex-row justify-center items-center">
            <Text className="text-white text-xl">{token.name}</Text>
            {inMainScreen ? <Text className="text-green-500 ml-1">+1.27%</Text> : <></>}
          </View>
          <View>
            <Text className="text-gray-400">${formatNumber(token.balanceUsd)}</Text>
          </View>
        </View>
      </View>
      <View className="flex-col items-end">
        <Text className="text-white text-xl">
          {formatNumber(token.balance)} {token.symbol}
        </Text>
        <Text className="text-gray-400">${formatNumber(token.cost)}</Text>
      </View>
    </View>
  );
}
