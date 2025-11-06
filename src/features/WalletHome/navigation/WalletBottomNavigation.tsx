// navigation/WalletTabs.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainWalletScreen from '../screens/MainWalletScreen';
import HistoryScreen from '../screens/HistoryScreen';
import { useResponsiveTabBarOptions } from '../../../shared/hooks/useResponsiveTabBarOptions';
import WalletTabsProps from './type';
import { View } from 'react-native';
import { Home, FileText, Settings } from 'lucide-react-native';
import SettingsScreen from '../../Settings/screens/SettingsScreen';

const createTabIcon = (IconComponent: any) => {
  return ({ color, focused }: { color: string; focused: boolean }) => {
    const { config } = useResponsiveTabBarOptions();
    const iconSize = config.iconSize;

    return (
      <View>
        <IconComponent color={color} size={iconSize} strokeWidth={focused ? 2 : 1.5} />
      </View>
    );
  };
};

const HomeIcon = createTabIcon(Home);
const HistoryIcon = createTabIcon(FileText);
const SettingsIcon = createTabIcon(Settings);

// Dynamic screenOptions
const getScreenOptions = (): any => {
  const options = useResponsiveTabBarOptions();
  return {
    headerShown: false,
    sceneStyle: { backgroundColor: '#292928' },
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
