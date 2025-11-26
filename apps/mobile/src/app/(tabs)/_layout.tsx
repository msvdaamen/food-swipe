import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { House, Plane, Utensils } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function TabLayout() {
  const tabBarActiveTintColor = useThemeColor({
    dark: Colors.emerald600,
    light: Colors.emerald600,
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabBarActiveTintColor,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <House size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ color }) => <Utensils size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Plane size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
