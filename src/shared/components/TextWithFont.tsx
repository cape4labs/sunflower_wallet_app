import { Text } from 'react-native';

type WrapperType = {
  children?: React.ReactNode;
  customStyle?: string;
};

// TODO rename it to just Text because we don't use Text from React
export default function TextWithFont({ children, customStyle }: WrapperType) {
  return <Text className={`font-[spacegrotesk] ${customStyle}`}>{children}</Text>;
}
