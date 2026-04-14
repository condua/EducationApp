import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Image,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // Thêm thư viện icon

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

// Định màu chủ đạo
const PRIMARY_COLOR = "#00B14F";

const SendEmail = () => {
  const router = useRouter(); // Sử dụng hook useRouter
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

  const placeholderTranslateY = placeholderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [14, -12], // Căn chỉnh lại độ cao khi label bay lên
  });

  const placeholderFontSize = placeholderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 13],
  });

  const placeholderColor = placeholderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#aaa", PRIMARY_COLOR], // Đổi màu chữ khi focus thành xanh lá
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()} // Nút quay lại màn hình trước
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
            { borderColor: isFocused ? PRIMARY_COLOR : "#ccc" }, // Đổi màu viền khi focus
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
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/verifyotp")}
        >
          <Text style={styles.buttonText}>Khôi phục mật khẩu</Text>
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
    marginLeft: -8, // Căn lề cho icon cân đối với mép màn hình
  },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 150, // Chừa khoảng trống cho hình ảnh ở dưới
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
    borderWidth: 1.5, // Tăng độ dày viền một chút cho rõ nét
    borderRadius: 15, // Bo góc mềm mại hơn
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
    height: 56, // Cố định chiều cao để text không bị xô lệch
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
    marginTop: 5, // Đẩy text xuống một chút để không đè lên label
  },
  button: {
    width: screenWidth * 0.85,
    height: 52,
    backgroundColor: PRIMARY_COLOR, // Đổi sang xanh TopCV
    borderRadius: 30, // Bo góc mạnh như các màn hình khác
    justifyContent: "center",
    alignItems: "center",
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4, // Đổ bóng nhẹ cho nút
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
    zIndex: -1, // Đẩy hình nền ra phía sau để không che mất nội dung
  },
  placeholder: {
    position: "absolute",
    left: 15,
    top: 15, // Căn giữa theo chiều dọc mặc định
    backgroundColor: "white",
    paddingHorizontal: 5,
  },
});
