import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Checkbox } from "react-native-paper";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router"; // <-- Thêm useRouter
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../src/store/authSlice";

export default function RegisterScreen() {
  const dispatch = useDispatch<any>();
  const router = useRouter(); // <-- Khởi tạo router

  // Lấy trạng thái loading và error từ Redux store
  const { loading, error: reduxError } = useSelector(
    (state: any) => state.auth,
  );

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [checked, setChecked] = useState(false);

  // Trạng thái lưu lỗi xác thực tại máy (Local Error)
  const [localError, setLocalError] = useState("");

  const isFormValid =
    fullName.trim() && email.trim() && password.trim() && checked;

  // <-- Đổi thành async function
  const handleRegister = async () => {
    setLocalError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setLocalError("Email không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (isFormValid) {
      // <-- Đợi kết quả từ Redux Action
      const result = await dispatch(
        registerUser({
          fullName: fullName.trim(),
          email: email.trim(),
          password: password,
        }),
      );

      // <-- Kiểm tra nếu đăng ký thành công thì chuyển hướng
      if (registerUser.fulfilled.match(result)) {
        // Tự động vào màn hình chính vì authSlice của bạn đã set isAuthenticated = true
        router.replace("/(tabs)");
      }
    }
  };

  const displayError = localError || reduxError;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Bắt đầu hành trình!</Text>
            <Text style={styles.subtitle}>
              Tạo tài khoản để khám phá các khóa học của bạn
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Full Name Input */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#6B7280"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                placeholderTextColor="#9CA3AF"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setLocalError("");
                }}
                autoCapitalize="words"
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#6B7280"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setLocalError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#6B7280"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={secureText}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setLocalError("");
                }}
              />
              <TouchableOpacity
                onPress={() => setSecureText(!secureText)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={secureText ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* Terms & Conditions */}
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={checked ? "checked" : "unchecked"}
                onPress={() => setChecked(!checked)}
                color="#4F46E5"
                uncheckedColor="#9CA3AF"
              />
              <Text style={styles.checkboxText}>
                Tôi đồng ý với{" "}
                <Text style={styles.linkText}>Điều khoản & Dịch vụ</Text>
              </Text>
            </View>

            {/* Vùng hiển thị lỗi */}
            {displayError ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color="#EF4444"
                />
                <Text style={styles.errorText}>{displayError}</Text>
              </View>
            ) : null}

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                styles.signUpButton,
                (!isFormValid || loading) && styles.signUpButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.signUpText}>Đăng ký</Text>
                  <Ionicons
                    name="arrow-forward-outline"
                    size={20}
                    color="white"
                  />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>Hoặc tiếp tục với</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="google" size={22} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="apple" size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <Text style={styles.signInText}>
              Đã có tài khoản?{" "}
              <Link style={styles.signInLink} href={"/login"}>
                ĐĂNG NHẬP
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Định nghĩa màu chủ đạo
const PRIMARY_COLOR = "#4F46E5";
const ERROR_COLOR = "#EF4444"; // Màu đỏ cho lỗi

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  eyeIcon: {
    padding: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: -8,
  },
  checkboxText: {
    fontSize: 14,
    color: "#4B5563",
  },
  linkText: {
    color: PRIMARY_COLOR,
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    color: ERROR_COLOR,
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  signUpButton: {
    flexDirection: "row",
    backgroundColor: PRIMARY_COLOR,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signUpButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
  },
  signUpText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  orText: {
    color: "#6B7280",
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginBottom: 32,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  footerContainer: {
    alignItems: "center",
    marginTop: "auto",
  },
  signInText: {
    fontSize: 15,
    color: "#4B5563",
  },
  signInLink: {
    color: PRIMARY_COLOR,
    fontWeight: "700",
  },
});
