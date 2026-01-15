import { useState } from 'react';
import { Image, View } from 'react-native';

import formatNumber from '../../shared/utils/formatNumber';
import { useWalletScreenStyles } from '../hooks/useWalletScreenStyle';
import { Token } from '../types/Token';
import TextWithFont from './TextWithFont';

const getLocalIcon = (symbol: string) => {
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
  const [iconError, setIconError] = useState(false);

  const localIcon = getLocalIcon(token.symbol);

  // Potential remote icon URL (e.g. from a public repo or service)
  const remoteIconUrl = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${token.symbol.toLowerCase()}.png`;

  const renderIcon = () => {
    if (localIcon && !iconError) {
      return <Image source={localIcon} className={styles.iconSize} onError={() => setIconError(true)} />;
    }

    if (!iconError) {
      return (
        <Image
          source={{ uri: remoteIconUrl }}
          className={styles.iconSize}
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
        className={`${styles.iconSize} rounded-full items-center justify-center`}
        style={{ backgroundColor: colors[colorIndex] }}
      >
        <TextWithFont customStyle="text-white font-bold text-xs">{firstLetter}</TextWithFont>
      </View>
    );
  };

  return (
    <View className={`flex-row justify-between items-center w-full ${styles.container}`}>
      <View className="flex-row items-center">
        {renderIcon()}
        <View className="ml-2">
          <View className="flex-row items-center">
            <TextWithFont customStyle={`text-white ${styles.nameText}`}>{token.name}</TextWithFont>
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
