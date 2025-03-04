import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Image,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const VerifyOtpScreen = () => {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(300); // 5 phút (300 giây)
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  // Hàm mô phỏng xác thực OTP (thay thế bằng API thật)
  const verifyOtp = async ({ email, otp }: { email: string; otp: number }) => {
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

  // Sử dụng mảng refs để chuyển focus giữa các ô nhập OTP
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleInputChange = (value: string, index: number) => {
    // Chỉ cho phép nhập số
    const numericValue = value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    // Nếu đã nhập đủ 1 ký tự, chuyển focus sang ô tiếp theo (nếu có)
    if (numericValue.length === 1 && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    const otpValueNumber = parseInt(otpValue, 10);
    if (otpValue.length === 4) {
      try {
        await verifyOtp({ email, otp: otpValueNumber });
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "OTP Verified Successfully",
          button: "OK",
          onPressButton: () => {
            router.push({
              pathname: "/changepassword",
              params: { email, otp: otpValueNumber },
            });
          },
        });
      } catch (error) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Failed to verify OTP.",
          button: "Close",
        });
      }
    } else {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Please enter the complete OTP.",
        button: "Close",
      });
    }
  };

  const handleResend = async () => {
    setOtp(["", "", "", ""]);
    try {
      await reSendOtp({ email });
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "OTP Resent Successfully",
        button: "Close",
      });
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Failed to resend OTP.",
        button: "Close",
      });
    }
    setTimer(300); // Reset timer về 5 phút
  };

  // Định dạng thời gian hiển thị dạng mm:ss
  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  // Đếm ngược thời gian
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AlertNotificationRoot>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.title}>Check Your Phone</Text>
          <Text style={styles.subtitle}>
            Enter the 4-digit code sent to your phone.
          </Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleInputChange(value, index)}
                ref={(ref) => (inputRefs.current[index] = ref)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            ))}
          </View>
          <Text style={styles.timer}>Code expires in {formatTimer(timer)}</Text>
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
            <Text style={styles.verifyText}>Verify OTP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
        <Image
          style={styles.image}
          source={require("../assets/forgot-password.png")}
          resizeMode="contain"
        />
      </View>
    </AlertNotificationRoot>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 5,
  },
  timer: {
    fontSize: 14,
    color: "#555",
    marginBottom: 30,
  },
  verifyButton: {
    width: 200,
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: "center",
  },
  verifyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resendButton: {
    width: 200,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    alignItems: "center",
  },
  resendText: {
    color: "#555",
    fontSize: 16,
  },
  image: {
    position: "absolute",
    bottom: -10,
    width: "100%",
    height: 180,
  },
});
