import { Text } from 'react-native';

// TODO: rename it to just Text because we don't use Text from React
export default function TextWithFont({
  children,
  customStyle,
}: {
  children?: React.ReactNode;
  customStyle?: string;
}): React.ReactNode {
  return <Text className={`font-[spacegrotesk] ${customStyle}`}>{children}</Text>;
}
