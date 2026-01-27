
import { useState } from 'react';
import { Image, View } from 'react-native';

import formatNumber from '../../shared/utils/formatNumber';
import { Token } from '../types/Token';
import TextWithFont from './TextWithFont';

// TODO remove it
function getLocalIcon(symbol: string) {
  switch (symbol.toLowerCase()) {
    case 'btc':
      return require('../../../assets/icons/bitcoin.png');
    case 'stx':
      return require('../../../assets/icons/stacks.png');
    case 'btcz':
      return require('../../../assets/icons/btcz.png');
    case 'ststx':
      return require('../../../assets/icons/ststx.png');
    case 'alex':
      return require('../../../assets/icons/alex.png');
    case 'sbtc':
      return require('../../../assets/icons/sbtc.png');
    default:
      return null;
  }
}

type CoinProp = {
  token: Token;
  inMainScreen?: boolean;
};

export default function Coin({ token, inMainScreen }: CoinProp) {
  const [iconError, setIconError] = useState(false);

  const localIcon = getLocalIcon(token.symbol);

  const renderIcon = () => {
    if (localIcon) {
      return (
        <Image
          source={localIcon}
          className="w-6 h-6 md:w-8 md:h-8"
          onError={() => setIconError(true)}
        />
      );
    }

    // Fallback: Nice colored placeholder with first letter
    const firstLetter = token.symbol.charAt(0).toUpperCase();
    const colors = ['#FF5500', '#00FFAA', '#AA00FF', '#00AAFF', '#FFAA00'];
    const colorIndex = token.symbol.length % colors.length;

    return (
      <View
        className="w-6 h-6 md:w-8 md:h-8 rounded-full items-center justify-center"
        style={{ backgroundColor: colors[colorIndex] }}
      >
        <TextWithFont customStyle="text-white font-bold text-xs">{firstLetter}</TextWithFont>
      </View>
    );
  };

  return (
    <View className={`flex-row justify-between items-center w-full gap-2 md:gap-3`}>
      <View className="flex-row items-center">
        {renderIcon()}
        <View className="ml-2">
          <View className="flex-row items-center">
            <TextWithFont customStyle={`text-white text-lg md:text-2xl`}>{token.name}</TextWithFont>
            {inMainScreen &&
              (token.diff == null ? (
                <TextWithFont customStyle={'text-white-500 ml-1'} />
              ) : (
                <TextWithFont
                  customStyle={`text-${token.diff.startsWith('+') ? 'green' : 'red'}-500 ml-1`}
                >
                  {token.diff}
                </TextWithFont>
              ))}
          </View>
          <TextWithFont customStyle={`text-gray-400 text-sm md:text-base`}>
            ${formatNumber(token.balanceUsd)}
          </TextWithFont>
        </View>
      </View>
      <View className="items-end">
        <TextWithFont customStyle={`text-white text-lg md:text-2xl`}>
          {formatNumber(token.balance)} {token.symbol}
        </TextWithFont>
        <TextWithFont customStyle={`text-gray-400 text-sm md:text-base`}>
          ${formatNumber(token.cost)}
        </TextWithFont>
      </View>
    </View>
  );
}
