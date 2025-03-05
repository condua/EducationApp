import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function CourseLayout() {
  const router = useRouter(); // Lấy router từ expo-router

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
        options={{
          title: "Home",
        }}
      />
    </Stack>
  );
}
