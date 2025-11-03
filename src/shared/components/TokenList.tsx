import { View, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { Token } from '../../shared/types/Token';
import Coin from './Coin';
import TextWithFont from './TextWithFont';
import { useWalletScreenStyles } from '../hooks/useWalletScreenStyle';


interface TokenListProps {
  tokens: Token[];
  isLoading: boolean;
  error: string | null;
  onTokenPress?: (token: Token) => void;
  inMainScreen?: boolean;
  customStyle: string;
}

export function TokenList({
  tokens,
  isLoading,
  error,
  onTokenPress,
  inMainScreen = true,
  customStyle,
}: TokenListProps) {
  const styles = useWalletScreenStyles().tokenList;

  if (isLoading) return <ActivityIndicator size="large" color="#fff" className="mt-5" />;
  if (error) return <TextWithFont customStyle="text-red-500">{error}</TextWithFont>;

  return (
    <View className={`flex-col w-full bg-custom_complement rounded-2xl ${styles.container} ${customStyle}`}>
      <FlatList
        data={tokens}
        keyExtractor={item => item.symbol}
        renderItem={({ item }) => (
          <Pressable onPress={() => onTokenPress?.(item)} className={styles.item}>
            <Coin token={item} inMainScreen={inMainScreen} />
          </Pressable>
        )}
        ListEmptyComponent={<TextWithFont customStyle="text-white">No tokens available</TextWithFont>}
      />
    </View>
  );
}
