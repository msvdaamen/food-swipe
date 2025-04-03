import React from 'react';
import { Tabs } from 'expo-router';

import { useColorScheme } from 'react-native';
import { Book, CookingPot, House, Search } from 'lucide-react-native';
import AppHeader from '@/components/app-header';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
  const theme = useColorScheme();
  const backgroundColor = theme === 'dark' ? '#121212' : '#ffffff';
  const tabBarBorderColor = theme === 'dark' ? '#262626' : '#dbdbdb';

  return (
    <>
    <StatusBar backgroundColor={backgroundColor} />
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#10b981',
        sceneStyle: {backgroundColor},
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor,
          borderTopColor: tabBarBorderColor,
        },
        tabBarItemStyle: {
          alignItems: 'center',
          flexDirection: 'row',
        },
        header: (e) => <AppHeader layout={e.layout} />
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
          tabBarIcon: ({ color }) => <CookingPot size={28} color={color} />
        }}
        />
      <Tabs.Screen
        name="recipe-books"
        options={{
          title: 'Recipe Books',
          tabBarIcon: ({ color }) => <Book size={28} color={color} />,
        }}
        />
    </Tabs>
        </>
  );
}

