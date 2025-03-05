import React from "react";
import { Provider, useSelector } from "react-redux";
import { store, RootState } from "../src/store/store";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

function AuthenticatedStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* <Stack.Screen
        name="/courses"
        options={{ headerShown: false, title: "aaa" }}
      /> */}
    </Stack>
  );
}

function NoAuthStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="sendemail" options={{ headerShown: false }} />
      <Stack.Screen name="verifyotp" options={{ headerShown: false }} />
    </Stack>
  );
}

function LayoutSelector() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return isAuthenticated ? <AuthenticatedStack /> : <NoAuthStack />;
}

export default function Layout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.container}>
        <LayoutSelector />
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
