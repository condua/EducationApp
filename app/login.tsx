import React from "react";
import { View, Text, Button } from "react-native";
import { useDispatch } from "react-redux";
import { login } from "../src/store/authSlice";
import { useRouter, Link } from "expo-router";

export default function LoginScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = () => {
    dispatch(login());
    // Navigate to authenticated part of the app after login
    router.replace("/tabs");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login Screen</Text>
      <Button title="Login" onPress={handleLogin} />
      <Link href="/register">Go to Register</Link>
      <Link href="/forgot-password">Forgot Password?</Link>
    </View>
  );
}
