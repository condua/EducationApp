import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Image,
  Animated,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// 🟢 THÊM MỚI: Import Redux
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "@/src/store/authSlice"; // Sửa lại đường dẫn nếu cần
import { AppDispatch, RootState } from "@/src/store/store"; // Sửa lại đường dẫn nếu có file store riêng
import Toast from "react-native-toast-message";
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const PRIMARY_COLOR = "#00B14F";

const SendEmail = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // 🟢 THÊM MỚI: Lấy state loading từ Redux
  const { loading } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const placeholderAnim = useRef(new Animated.Value(0)).current;
  const [exampleEmail, setExampleEmail] = useState("Example@gmail.com");

  const handleFocus = () => {
    setIsFocused(true);
    setExampleEmail("Enter your email");
    Animated.timing(placeholderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (email === "") {
      setIsFocused(false);
      setExampleEmail("Example@gmail.com");
      Animated.timing(placeholderAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  // 🟢 THÊM MỚI: Hàm xử lý khi bấm nút gửi OTP
  const handleSendOTP = () => {
    // Validate cơ bản
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập email của bạn.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập một địa chỉ email hợp lệ.",
      });
      return;
    }

    // Gọi API qua Redux Thunk
    dispatch(forgotPassword(email.toLowerCase()))
      .unwrap()
      .then((res) => {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: res.message || "Mã OTP đã được gửi!",
        });
        // Chuyển trang và truyền email sang màn hình Verify OTP
        router.push({
          pathname: "/verifyotp",
          params: { email: email.toLowerCase() },
        });
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: error || "Đã xảy ra lỗi. Vui lòng thử lại.",
        });
      });
  };

  const placeholderTranslateY = placeholderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [14, -12],
  });

  const placeholderFontSize = placeholderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 13],
  });

  const placeholderColor = placeholderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#aaa", PRIMARY_COLOR],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={loading} // Vô hiệu hóa nút back khi đang tải
        >
          <Ionicons name="arrow-back-outline" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.inner}>
        <Text style={styles.title}>Quên mật khẩu</Text>
        <Text style={styles.subtitle}>
          Nhập email của bạn để lấy lại mật khẩu
        </Text>

        <View
          style={[
            styles.inputContainer,
            { borderColor: isFocused ? PRIMARY_COLOR : "#ccc" },
          ]}
        >
          <Animated.Text
            style={[
              styles.placeholder,
              {
                transform: [{ translateY: placeholderTranslateY }],
                fontSize: placeholderFontSize,
                color: placeholderColor,
              },
            ]}
          >
            {exampleEmail}
          </Animated.Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading} // Vô hiệu hóa nhập liệu khi đang tải
          />
        </View>

        {/* 🟢 THÊM MỚI: Xử lý hiển thị UI khi đang loading */}
        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: "#80d8a7" }]}
          onPress={handleSendOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Khôi phục mật khẩu</Text>
          )}
        </TouchableOpacity>
      </View>

      <Image
        style={styles.image}
        source={require("../assets/forgot-password.png")}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
};

export default SendEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 150,
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
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: screenWidth * 0.85,
    borderWidth: 1.5,
    borderRadius: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
    height: 56,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  button: {
    width: screenWidth * 0.85,
    height: 52,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  image: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 180,
    zIndex: -1,
  },
  placeholder: {
    position: "absolute",
    left: 15,
    top: 15,
    backgroundColor: "white",
    paddingHorizontal: 5,
  },
});
