import React from "react";
import { View, Text, Button } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../../src/store/authSlice";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Screen (Authenticated)</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
