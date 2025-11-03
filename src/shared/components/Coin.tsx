import { View, Image } from 'react-native';
import formatNumber from '../../shared/utils/formatNumber';
import { Token } from '../types/Token';
import TextWithFont from './TextWithFont';
import { useWalletScreenStyles } from '../hooks/useWalletScreenStyle';

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
  const styles = useWalletScreenStyles().coin;

  return (
    <View className={`flex-row justify-between items-center w-full ${styles.container}`}>
      <View className="flex-row items-center">
        <Image source={getIcon(token.symbol)} className={styles.iconSize} />
        <View className="ml-2">
          <View className="flex-row items-center">
            <TextWithFont customStyle={`text-white ${styles.nameText}`}>{token.name}</TextWithFont>
            {inMainScreen && <TextWithFont customStyle="text-green-500 ml-1">+1.27%</TextWithFont>}
          </View>
          <TextWithFont customStyle={`text-gray-400 ${styles.usdText}`}>
            ${formatNumber(token.balanceUsd)}
          </TextWithFont>
        </View>
      </View>
      <View className="items-end">
        <TextWithFont customStyle={`text-white ${styles.balanceText}`}>
          {formatNumber(token.balance)} {token.symbol}
        </TextWithFont>
        <TextWithFont customStyle={`text-gray-400 ${styles.costText}`}>
          ${formatNumber(token.cost)}
        </TextWithFont>
      </View>
    </View>
  );
}
