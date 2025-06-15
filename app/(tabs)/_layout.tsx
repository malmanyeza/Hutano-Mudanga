import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { Home, MessageSquare, Book, Bookmark, User } from 'lucide-react-native';

const isWeb = Platform.OS === 'web';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarHideOnKeyboard: true,
        tabBarPosition: 'bottom',
        tabBarBackground: () => {
          if (isWeb) return null;
          if (Platform.OS === 'ios') {
            return <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />;
          }
          return null;
        },
        tabBarActiveTintColor: '#6f5415',
        tabBarInactiveTintColor: '#987a59',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: 'Guide',
          tabBarIcon: ({ color, size }) => <Book size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size }) => <Bookmark size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    marginHorizontal: 20,
    bottom: 20,
    borderRadius: 20,
    height: 70,
    ...Platform.select({
      web: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      ios: {
        backgroundColor: 'transparent',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        backgroundColor: '#ffffff',
        elevation: 4,
      },
    }),
    borderTopWidth: 0,
  },
  tabBarLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    marginBottom: 8,
  },
  tabBarItem: {
    height: 70,
    paddingTop: 12,
  },
});
