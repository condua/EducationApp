import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CourseLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // Ẩn header hệ thống
        }}
      />
      <Stack.Screen
        name="detail"
        options={{
          title: "Chi tiết khóa học",
        }}
      />
      <Stack.Screen
        name="list"
        options={{
          title: "Bài học",
        }}
      />
      <Stack.Screen
        name="testOverview"
        options={{
          headerShown: false, // Ẩn header hệ thống
        }}
      />
      <Stack.Screen
        name="takingTest"
        options={{
          title: "Làm bài kiểm tra",
        }}
      />
      // Trong courses/_layout.tsx
      <Stack.Screen
        name="attemptDetail"
        options={{
          headerShown: false, // Ẩn header hệ thống
        }}
      />
    </Stack>
  );
}
