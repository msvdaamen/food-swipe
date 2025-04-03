import React from "react";
import { Tabs } from "expo-router";

import { useColorScheme } from "react-native";
import { Book, CookingPot, House, Search } from "lucide-react-native";
import AppHeader from "@/components/app-header";
import { StatusBar } from "expo-status-bar";

export default function TabLayout() {
  const theme = useColorScheme();
  const backgroundColor = theme === "dark" ? "#121212" : "#f9fafb";
  const tabBarBorderColor = theme === "dark" ? "#27272a" : "#dbdbdb";
  const tabBarBackgroundColor = theme === "dark" ? "#121212" : "white";

  return (
    <>
      <StatusBar backgroundColor={backgroundColor} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#10b981",
          sceneStyle: { backgroundColor },
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: tabBarBackgroundColor,
            borderTopColor: tabBarBorderColor,
            borderTopWidth: 1,
          },
          tabBarItemStyle: {
            alignItems: "center",
            flexDirection: "row",
          },
          header: (e) => <AppHeader {...e} />,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Food Swipe",
            tabBarIcon: ({ color }) => <House size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="recipes"
          options={{
            title: "Recipes",
            tabBarIcon: ({ color }) => <CookingPot size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="recipe-books"
          options={{
            title: "My recipe Books",
            tabBarIcon: ({ color }) => <Book size={28} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
