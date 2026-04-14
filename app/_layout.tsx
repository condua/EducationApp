import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, RootState } from "../src/store/store";
import { Stack, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { restoreLogin } from "@/src/store/authSlice";
import Toast from "react-native-toast-message"; // ✅ Thêm dòng import này

// Tách riêng logic điều hướng để có thể dùng các Hook của Redux và Expo Router
function RootNavigation() {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const segments = useSegments();

  // Lấy trạng thái đăng nhập từ Redux
  const { isAuthenticated, isInitialized } = useSelector(
    (state: RootState) => state.auth,
  );

  // 1. Đọc token từ máy khi app vừa mở lên
  useEffect(() => {
    dispatch(restoreLogin());
  }, [dispatch]);

  // 2. Tự động điều hướng dựa trên trạng thái đăng nhập
  useEffect(() => {
    if (!isInitialized) return;

    // Khai báo các màn hình thuộc nhóm Chưa Đăng Nhập
    const inAuthGroup =
      segments[0] === "login" ||
      segments[0] === "register" ||
      segments[0] === "forgot-password" ||
      segments[0] === "sendemail" ||
      segments[0] === "verifyotp";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isInitialized, segments, router]);

  // 3. Màn hình chờ trong vài mili-giây lúc app đang đọc token
  if (!isInitialized) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // 4. Render một Stack DUY NHẤT khai báo mọi màn hình
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="sendemail" />
      <Stack.Screen name="verifyotp" />
    </Stack>
  );
}

// Layout gốc bọc toàn bộ ứng dụng
export default function Layout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.container}>
        <RootNavigation />
        {/* ✅ Đặt Toast ở đây để nó có thể đè lên tất cả các màn hình trong RootNavigation */}
        <Toast />
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
});
