import React from "react";
import { Provider, useSelector } from "react-redux";
import { store, RootState } from "../src/store/store";
import { Stack } from "expo-router";

function AuthenticatedStack() {
  return (
    <Stack>
      {/* For authenticated users, navigate to the tabs (main app) */}
      <Stack.Screen name="tabs/index" options={{ headerShown: false }} />
    </Stack>
  );
}

function NoAuthStack() {
  return (
    <Stack>
      {/* For unauthenticated users, show auth screens */}
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
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
      <LayoutSelector />
    </Provider>
  );
}
