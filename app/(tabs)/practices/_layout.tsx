import { Stack } from "expo-router";

export default function PracticesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Ngữ pháp Tiếng Anh",
          headerShown: false,
          headerLargeTitle: true, // Tùy chọn: Hiển thị title lớn trên iOS
        }}
      />
      {/* Sau này bạn có thể thêm các màn hình chi tiết ở đây */}
      {/* <Stack.Screen name="[id]" options={{ title: 'Chi tiết bài học' }} /> */}
    </Stack>
  );
}
