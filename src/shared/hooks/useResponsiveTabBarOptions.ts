import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useWindowDimensions } from 'react-native';

export interface TabBarConfig {
  height: number;
  paddingTop: number;
  iconSize: number;
  borderTopWidth: number;
  labelSize: number;
}

export const useResponsiveTabBarOptions = (): BottomTabNavigationOptions & {
  config: TabBarConfig;
} => {
  const { height } = useWindowDimensions();

  const isSmall = height < 700;

  const config: TabBarConfig = {
    height: isSmall ? 70 : 80,
    paddingTop: isSmall ? 12 : 15,
    iconSize: isSmall ? 25 : 30,
    borderTopWidth: isSmall ? 2 : 2,
    labelSize: isSmall ? 11 : 12,
  };

  return {
    config,
    tabBarStyle: {
      backgroundColor: '#362F2E',
      height: config.height,
      paddingTop: config.paddingTop,
      borderTopWidth: config.borderTopWidth,
      borderTopColor: '#1F1612',
    },
    tabBarActiveTintColor: '#FF4800',
    tabBarInactiveTintColor: '#8b8b8b',
    tabBarLabelStyle: {
      fontSize: config.labelSize,
      fontWeight: '400',
      marginBottom: 4,
    },
  };
};
