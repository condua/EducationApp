import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0_Wf8WPav95w57u5EQZcrUylkt1lmxhM",
  authDomain: "directed-asset-459105-t2.firebaseapp.com",
  projectId: "directed-asset-459105-t2",
  storageBucket: "directed-asset-459105-t2.firebasestorage.app",
  messagingSenderId: "914193048655",
  appId: "1:914193048655:web:c89516a37dad9b6810f63a"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Auth với tính năng lưu phiên đăng nhập (Persistence)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };