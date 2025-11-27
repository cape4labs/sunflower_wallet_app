import { Text } from 'react-native';

type WrapperType = {
  children?: React.ReactNode;
  customStyle?: string;
};

export default function TextWithFont({ children, customStyle }: WrapperType) {
  return <Text className={`font-[spacegrotesk] ${customStyle}`}>{children}</Text>;
}
