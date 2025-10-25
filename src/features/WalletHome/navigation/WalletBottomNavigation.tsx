import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainWalletScreen from '../screens/MainWalletScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Settings, Home, History } from 'lucide-react-native';
import { View } from 'react-native';
import WalletTabsProps from './type';

// Fix render error
const HomeIcon = ({ color }: { color: string }) => (
  <View>
    <Home color={color} size={24} strokeWidth={1.5} />
  </View>
);

const HistoryIcon = ({ color }: { color: string }) => (
  <View>
    <History color={color} size={24} strokeWidth={1.5} />
  </View>
);

const SettingsIcon = ({ color }: { color: string }) => (
  <View>
    <Settings color={color} size={24} strokeWidth={1.5} />
  </View>
);

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
  screenOptions: {
    headerShown: false,
    sceneStyle: {
      backgroundColor: '#362F2E',
    },
    tabBarStyle: {
      backgroundColor: '#362F2E',
      borderTopWidth: 6,
      height: 70,
      paddingBottom: 5,
      borderTopColor: '#1F1612',
    },
    tabBarActiveTintColor: '#FF4800',
    tabBarInactiveTintColor: '#8b8b8b',
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '400',
      marginBottom: 4,
    },
  },
});
