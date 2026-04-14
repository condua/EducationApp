import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const PRIMARY_COLOR = "#00B14F";

const VerifyOtpScreen = () => {
  const { email } = useLocalSearchParams();
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(300); // 5 phút (300 giây)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // State cho mật khẩu mới
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);

  // Hàm mô phỏng đổi mật khẩu trực tiếp (thay thế bằng API thật)
  const resetPassword = async ({
    email,
    otp,
    newPassword,
  }: {
    email: string;
    otp: number;
    newPassword: string;
  }) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 1000);
    });
  };

  // Hàm mô phỏng gửi lại OTP (thay thế bằng API thật)
  const reSendOtp = async ({ email }: { email: string }) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 1000);
    });
  };

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleInputChange = (value: string, index: number) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    if (numericValue.length === 1 && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (text: string, index: number) => {
    if (text === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyAndChangePassword = async () => {
    const otpValue = otp.join("");
    const otpValueNumber = parseInt(otpValue, 10);

    // Validate OTP
    if (otpValue.length < 4) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Thiếu thông tin",
        textBody: "Vui lòng nhập đầy đủ mã OTP 4 chữ số.",
        button: "Đóng",
      });
      return;
    }

    // Validate Mật khẩu
    if (newPassword.length < 6) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Cảnh báo",
        textBody: "Mật khẩu phải có ít nhất 6 ký tự.",
        button: "Đóng",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Cảnh báo",
        textBody: "Mật khẩu nhập lại không khớp.",
        button: "Đóng",
      });
      return;
    }

    try {
      await resetPassword({
        email: email as string,
        otp: otpValueNumber,
        newPassword,
      });

      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Thành công",
        textBody: "Mật khẩu của bạn đã được thay đổi thành công.",
        button: "Đăng nhập ngay",
        onPressButton: () => {
          Dialog.hide();
          router.replace("/login"); // Chuyển về trang đăng nhập
        },
      });
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Lỗi",
        textBody: "Mã OTP không chính xác hoặc đã hết hạn.",
        button: "Đóng",
      });
    }
  };

  const handleResend = async () => {
    setOtp(["", "", "", ""]);
    try {
      await reSendOtp({ email: email as string });
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Đã gửi lại",
        textBody: "Mã OTP mới đã được gửi đến bạn.",
        button: "Đóng",
      });
      setTimer(300); // Reset timer về 5 phút
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Lỗi",
        textBody: "Không thể gửi lại mã OTP. Vui lòng thử lại sau.",
        button: "Đóng",
      });
    }
  };

  // Định dạng thời gian
  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AlertNotificationRoot>
      <SafeAreaView style={styles.wrapper}>
        {/* Header Back Button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back-outline" size={26} color="#333" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Nhập mã xác nhận</Text>
            <Text style={styles.subtitle}>
              Mã gồm 4 chữ số đã được gửi đến thiết bị của bạn.
            </Text>

            {/* OTP Inputs */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={[
                    styles.otpInput,
                    focusedIndex === index && styles.otpInputFocused,
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => handleInputChange(value, index)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === "Backspace") {
                      handleBackspace(digit, index);
                    }
                  }}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                />
              ))}
            </View>

            <Text style={styles.timer}>
              Mã hết hạn trong{" "}
              <Text style={styles.timerBold}>{formatTimer(timer)}</Text>
            </Text>

            {/* Password Inputs */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#888"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu mới"
                placeholderTextColor="#888"
                secureTextEntry={secureText}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Ionicons
                  name={secureText ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#888"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nhập lại mật khẩu mới"
                placeholderTextColor="#888"
                secureTextEntry={secureConfirmText}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setSecureConfirmText(!secureConfirmText)}
              >
                <Ionicons
                  name={secureConfirmText ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerifyAndChangePassword}
            >
              <Text style={styles.verifyText}>Đổi mật khẩu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResend}
            >
              <Text style={styles.resendText}>Gửi lại mã OTP</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

        {!isKeyboardVisible && (
          <Image
            style={styles.image}
            source={require("../assets/forgot-password.png")}
            resizeMode="contain"
          />
        )}
      </SafeAreaView>
    </AlertNotificationRoot>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: "flex-start",
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 150, // Tránh đè lên hình ảnh bên dưới
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 15,
  },
  otpInput: {
    width: 55,
    height: 60,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#F4F5F7",
    borderRadius: 15,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  otpInputFocused: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: "#FFFFFF",
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  timer: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
  timerBold: {
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F5F7",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 52,
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
  verifyButton: {
    width: "100%",
    backgroundColor: PRIMARY_COLOR,
    height: 52,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  verifyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  resendButton: {
    width: "100%",
    height: 52,
    borderWidth: 1.5,
    borderColor: PRIMARY_COLOR,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  resendText: {
    color: PRIMARY_COLOR,
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    position: "absolute",
    bottom: -10,
    width: "100%",
    height: 180,
    zIndex: -1, // Cho hình nền ẩn ra sau để không ảnh hưởng bấm nút
  },
});
