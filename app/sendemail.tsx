import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Image,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useRef, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Link, router } from "expo-router";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const SendEmail = () => {
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
    outputRange: [12, -10],
  });

  const placeholderFontSize = placeholderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 14],
  });

  const placeholderColor = placeholderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#aaa", "black"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Password Recovery</Text>
        <Text style={styles.subtitle}>Enter your email to reset password</Text>
        <View style={styles.inputContainer}>
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
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/verifyotp")}
        >
          <Text style={styles.buttonText}>Recover Password</Text>
        </TouchableOpacity>
      </View>
      <Image
        style={styles.image}
        source={require("../assets/forgot-password.png")}
        resizeMode="contain"
      />
    </View>
  );
};

export default SendEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  inner: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 17,
    color: "#888",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    width: screenWidth * 0.8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "gray",
  },
  button: {
    width: screenWidth * 0.8,
    height: 50,
    backgroundColor: "#FFD700",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  image: {
    position: "absolute",
    bottom: 0, // Cố định hình ảnh ở dưới cùng
    width: "100%",
    height: 180,
  },
  placeholder: {
    position: "absolute",
    left: 10,
    top: 0,
    color: "#aaa",
    backgroundColor: "white",
  },
});
