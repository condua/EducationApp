import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLogin } from "../src/store/authSlice";
import { useRouter, Link } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { RootState } from "@/src/store/store";
import Toast from "react-native-toast-message";

// 🟢 1. Import các thư viện mới của Expo
import * as WebBrowser from "expo-web-browser";
import {
  useAuthRequest,
  makeRedirectUri,
  ResponseType,
} from "expo-auth-session";

// 🟢 2. Cần thiết để tắt trình duyệt web sau khi có kết quả
WebBrowser.maybeCompleteAuthSession();

// Cấu hình endpoint của Google
const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export default function LoginScreen() {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const { loading, error } = useSelector((state: RootState) => state.auth);

  // 🟢 3. Khởi tạo Hook Đăng nhập Google
  const [request, response, promptAsync] = useAuthRequest(
    {
      // Thay bằng Client ID của Web bạn tạo trên Google Cloud Console
      clientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
      scopes: ["openid", "profile", "email"],
      // Yêu cầu trả thẳng về id_token
      responseType: ResponseType.IdToken,
      redirectUri: makeRedirectUri({
        scheme: "educationapp", // Trùng khớp với chữ bạn điền trong app.json
      }),
    },
    discovery,
  );

  // 🟢 4. Lắng nghe kết quả trả về sau khi trình duyệt đóng lại
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params; // Lấy được id_token

      if (id_token) {
        // Gửi id_token lên Redux thunk
        dispatch(googleLogin(id_token))
          .unwrap()
          .then(() => {
            Toast.show({
              type: "success",
              text1: "Thành công",
              text2: "Đăng nhập Google thành công!",
              visibilityTime: 2000,
            });
            setTimeout(() => router.replace("/(tabs)"), 1000);
          })
          .catch((err: any) => {
            Toast.show({
              type: "error",
              text1: "Lỗi Server",
              text2: err || "Không thể xác thực với máy chủ.",
            });
          });
      }
    } else if (response?.type === "error" || response?.type === "dismiss") {
      Toast.show({
        type: "info",
        text1: "Đã hủy",
        text2: "Bạn đã đóng khung đăng nhập.",
      });
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Lỗi đăng nhập",
        text2: "Vui lòng nhập cả email và mật khẩu.",
      });
      return;
    }

    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Đang chuyển hướng...",
      });
      setTimeout(() => router.replace("/(tabs)"), 1000);
    } else {
      Toast.show({
        type: "error",
        text1: "Đăng nhập thất bại",
        text2: result.payload as string,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>Chào mừng bạn</Text>
      <Text style={styles.subtitle}>
        Đến với MLPA! Hãy đăng nhập để tiếp tục trải nghiệm.
      </Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={20}
          color="#888"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#888"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          placeholderTextColor="#888"
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Ionicons
            name={secureText ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      {/* Terms & Conditions / Forgot Password */}
      <Link style={styles.checkboxContainer} href={"/sendemail"}>
        Quên mật khẩu?
      </Link>

      {/* Sign In Button */}
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.signUpText}>
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>
        <View style={styles.divider} />
      </View>

      {/* Social Login */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={24} color="#1877F2" />
        </TouchableOpacity>

        {/* 🟢 Gọi hàm promptAsync() khi bấm nút Google */}
        <TouchableOpacity
          style={styles.socialButton}
          disabled={!request || loading}
          onPress={() => promptAsync()}
        >
          <FontAwesome name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
      </View>

      {/* Sign Up Link */}
      <View style={styles.footerContainer}>
        <Text style={styles.signInText}>
          Bạn chưa có tài khoản?{" "}
          <Link style={styles.signInLink} href={"/register"}>
            Đăng ký ngay
          </Link>
        </Text>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F5F7",
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 25,
    width: "100%",
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  checkboxContainer: {
    textAlign: "right",
    width: "100%",
    color: "#00B14F",
    marginBottom: 25,
    fontWeight: "500",
  },
  signUpButton: {
    flexDirection: "row",
    backgroundColor: "#00B14F",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 25,
  },
  signUpText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  orText: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 10,
  },
  socialContainer: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 30,
  },
  socialButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  footerContainer: {
    marginTop: 10,
  },
  signInText: {
    fontSize: 14,
    color: "#333",
  },
  signInLink: {
    color: "#00B14F",
    fontWeight: "bold",
  },
});
