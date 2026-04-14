import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../src/store/authSlice";
import { useRouter, Link, useNavigation } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { RootState } from "@/src/store/store";
import Toast from "react-native-toast-message"; // <-- Import thư viện Toast

export default function LoginScreen() {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const navigate = useNavigation();
  const handleLogin = async () => {
    if (!email || !password) {
      // Sử dụng Toast hiển thị cảnh báo (Warning)
      Toast.show({
        type: "error", // Có thể là 'success', 'error', hoặc 'info'
        text1: "Lỗi đăng nhập",
        text2: "Vui lòng nhập cả email và mật khẩu.",
        position: "top", // Hiện từ trên xuống
        visibilityTime: 3000, // Tự động ẩn sau 3 giây
      });
      return;
    }

    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      // Toast thông báo thành công (Tùy chọn)
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Đăng nhập thành công, đang chuyển hướng...",
        visibilityTime: 2000,
      });

      // Chuyển hướng sau một khoảng trễ ngắn để người dùng kịp đọc
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 1000);
    } else {
      // Toast báo lỗi thất bại
      Toast.show({
        type: "error",
        text1: "Đăng nhập thất bại",
        text2: result.payload || "Đã xảy ra lỗi không xác định.",
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../assets/logoMLPA.png")} style={styles.logo} />

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
      <TouchableOpacity style={styles.signUpButton} onPress={handleLogin}>
        <Text style={styles.signUpText}>Đăng nhập</Text>
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
        <TouchableOpacity style={styles.socialButton}>
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
    backgroundColor: "#FFFFFF", // Đổi nền thành màu trắng tinh
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
    backgroundColor: "#F4F5F7", // Đổi nền input thành xám nhạt
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 25, // Bo góc nhiều hơn giống ảnh
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
    color: "#00B14F", // Đổi màu chữ link thành xanh lá cây
    marginBottom: 25,
    fontWeight: "500",
  },
  signUpButton: {
    flexDirection: "row",
    backgroundColor: "#00B14F", // Đổi màu nút thành xanh lá cây TopCV
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
    borderColor: "#E0E0E0", // Viền mỏng thay vì shadow đậm
  },
  footerContainer: {
    marginTop: 10,
  },
  signInText: {
    fontSize: 14,
    color: "#333",
  },
  signInLink: {
    color: "#00B14F", // Đổi màu chữ link thành xanh lá cây
    fontWeight: "bold",
  },
});
