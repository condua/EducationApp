import { router, Stack, Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function CourseLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",

        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={() => ({
          title: "Courses",
        })}
      />
      <Stack.Screen
        name="detail"
        options={{
          title: "My Course",
        }}
      />
      <Stack.Screen
        name="list"
        options={{
          title: "List",
        }}
      />
    </Stack>
  );
}
