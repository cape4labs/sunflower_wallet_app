import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainWalletScreen from '../screens/MainWalletScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Settings, Home, History } from 'lucide-react-native';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

export function WalletTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
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
      }}
    >
      <Tab.Screen
        name="MainWallet"
        component={MainWalletScreen}
        options={{
          title: '',
          sceneStyle: {
            backgroundColor: '#362F2E',
          },
          tabBarIcon: ({ color }) => (
            <View>
              <Home color={color} size={24} strokeWidth={1.5} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: '',
          sceneStyle: {
            backgroundColor: '#362F2E',
          },
          tabBarIcon: ({ color }) => (
            <View>
              <History color={color} size={24} strokeWidth={1.5} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: '',
          sceneStyle: {
            backgroundColor: '#362F2E',
          },
          tabBarIcon: ({ color }) => (
            <View>
              <Settings color={color} size={24} strokeWidth={1.5} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
