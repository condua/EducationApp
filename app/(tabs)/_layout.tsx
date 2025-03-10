import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="courses"
        options={{
          title: "Course",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="course.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mentors"
        options={{
          title: "Mentors",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="person-chalkboard" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="tim"
        options={{
          title: "Chúc mừng 8/3",
          tabBarIcon: ({ color }) => (
            <Ionicons name="rose" size={24} color={color} />
          ),
        }}
      /> */}
    </Tabs>
  );
}
