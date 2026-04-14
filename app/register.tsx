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
import { Link, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../src/store/authSlice";

// Định nghĩa màu chủ đạo theo phong cách TopCV
const PRIMARY_COLOR = "#00B14F";
const ERROR_COLOR = "#EF4444";

export default function RegisterScreen() {
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const { loading, error: reduxError } = useSelector(
    (state: any) => state.auth,
  );

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Thêm state nhập lại mật khẩu
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true); // Thêm state ẩn/hiện nhập lại MK
  const [checked, setChecked] = useState(false);

  const [localError, setLocalError] = useState("");

  const isFormValid =
    fullName.trim() &&
    email.trim() &&
    password.trim() &&
    confirmPassword.trim() &&
    checked;

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

    // Kiểm tra mật khẩu nhập lại
    if (password !== confirmPassword) {
      setLocalError("Mật khẩu nhập lại không khớp.");
      return;
    }

    if (isFormValid) {
      const result = await dispatch(
        registerUser({
          fullName: fullName.trim(),
          email: email.trim(),
          password: password,
        }),
      );

      if (registerUser.fulfilled.match(result)) {
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
              source={require("../assets/logoMLPA.png")}
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
                color="#888"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                placeholderTextColor="#888"
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
                color="#888"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
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
                color="#888"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor="#888"
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
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#888"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor="#888"
                secureTextEntry={secureConfirmText}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setLocalError("");
                }}
              />
              <TouchableOpacity
                onPress={() => setSecureConfirmText(!secureConfirmText)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={secureConfirmText ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            {/* Terms & Conditions */}
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={checked ? "checked" : "unchecked"}
                onPress={() => setChecked(!checked)}
                color={PRIMARY_COLOR}
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
                  color={ERROR_COLOR}
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
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
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
    width: 130,
    height: 130,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F5F7", // Xám nhạt giống đăng nhập
    borderRadius: 25, // Bo góc mạnh giống đăng nhập
    paddingHorizontal: 15,
    height: 52,
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
    height: 52,
    borderRadius: 30, // Bo góc mạnh như nút đăng nhập
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  signUpButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  signUpText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  orText: {
    color: "#666",
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
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
    alignItems: "center",
    marginTop: "auto",
  },
  signInText: {
    fontSize: 14,
    color: "#333",
  },
  signInLink: {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
  },
});
