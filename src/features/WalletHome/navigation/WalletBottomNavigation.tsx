// navigation/WalletTabs.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainWalletScreen from '../screens/MainWalletScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useResponsiveTabBarOptions } from '../../../shared/hooks/useResponsiveTabBarOptions';
import WalletTabsProps from './type';
import { View } from 'react-native';
import { Home, History, Settings } from 'lucide-react-native';

const createTabIcon = (IconComponent: any) => {
  return ({ color, focused }: { color: string; focused: boolean }) => {
    const { config } = useResponsiveTabBarOptions(); 
    const iconSize = config.iconSize; 

    return (
      <View>
        <IconComponent
          color={color}
          size={iconSize}
          strokeWidth={focused ? 2 : 1.5}
        />
      </View>
    );
  };
};

const HomeIcon = createTabIcon(Home);
const HistoryIcon = createTabIcon(History);
const SettingsIcon = createTabIcon(Settings);

// Dynamic screenOptions
const getScreenOptions = (): any => {
  const options = useResponsiveTabBarOptions();
  return {
    headerShown: false,
    sceneStyle: { backgroundColor: '#362F2E' },
    ...options,
  };
};

export const WalletTabs = createBottomTabNavigator<WalletTabsProps>({
  screens: {
    MainWalletScreen: {
      screen: MainWalletScreen,
      options: {
        tabBarLabel: '',
        tabBarIcon: HomeIcon,
      },
    },
    HistoryScreen: {
      screen: HistoryScreen,
      options: {
        tabBarLabel: '',
        tabBarIcon: HistoryIcon,
      },
    },
    SettingsScreen: {
      screen: SettingsScreen,
      options: {
        tabBarLabel: '',
        tabBarIcon: SettingsIcon,
      },
    },
  },
  screenOptions: getScreenOptions(),
});