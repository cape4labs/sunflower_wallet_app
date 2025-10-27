import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainWalletScreen from '../screens/MainWalletScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Settings, Home, History } from 'lucide-react-native';
import { View } from 'react-native';

// Fix render error
const HomeIcon = ({ color }: { color: string }) => (
  <View>
    <Home color={color} size={30} strokeWidth={1.5} />
  </View>
);

const HistoryIcon = ({ color }: { color: string }) => (
  <View>
    <History color={color} size={30} strokeWidth={1.5} />
  </View>
);

const SettingsIcon = ({ color }: { color: string }) => (
  <View>
    <Settings color={color} size={30} strokeWidth={1.5} />
  </View>
);

export const WalletTabs = createBottomTabNavigator({
  screens: {
    MainWalletScreen: {
      screen: MainWalletScreen,
      options: {
        tabBarLabel: '',
        tabBarIcon: HomeIcon,
        sceneStyle: {
          backgroundColor: '#362F2E',
        },
      },
    },

    HistoryScreen: {
      screen: HistoryScreen,
      options: {
        tabBarLabel: '',
        tabBarIcon: HistoryIcon,
        sceneStyle: {
          backgroundColor: '#362F2E',
        },
      },
    },

    SettingsScreen: {
      screen: SettingsScreen,
      options: {
        tabBarLabel: '',
        tabBarIcon: SettingsIcon,
        sceneStyle: {
          backgroundColor: '#362F2E',
        },
      },
    },
  },
  screenOptions: {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: '#362F2E',
      borderTopWidth: 6,
      height: 90,
      paddingTop: 15,
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
