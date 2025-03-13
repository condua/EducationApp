import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/src/store/authSlice";
import { updateProfile } from "@/src/slices/profileSlice";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
export default function EditProfileScreen() {
  const router = useRouter();
  // const [passwordVisible, setPasswordVisible] = useState(false);
  // const [name, setName] = useState("Charlotte King");
  // const [phone, setPhone] = useState("+86 689532");
  const dispatch = useDispatch();
  const { fullName, phone, email, avatar } = useSelector(
    (state) => state.profile
  );
  const [localName, setLocalName] = useState(fullName);
  const [localPhone, setLocalPhone] = useState(phone);
  const handleUpdate = () => {
    dispatch(updateProfile({ name: localName, phone: localPhone }));
    console.log(fullName);
  };
  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };
  // 🔹 Load lại dữ liệu khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      setLocalName(fullName);
      setLocalPhone(phone);
      console.log(localName);
    }, [fullName, phone])
  );
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleUpdate}>
          <Ionicons name="checkmark" size={24} color="green" />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: avatar || "https://example.com/default-avatar.png" }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editIcon}>
          <Ionicons name="camera" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={localName}
          onChangeText={(text) => setLocalName(text)}
        />

        <Text style={styles.label}>Phone number</Text>
        <TextInput
          style={styles.input}
          value={localPhone}
          onChangeText={(text) => setLocalPhone(text)}
        />

        <Text style={styles.label}>E-mail address</Text>
        <TextInput style={styles.input} value={email} editable={false} />

        {/* 
        <Text style={styles.label}>User name</Text>
        <TextInput
          style={styles.input}
          value="@johnkinggraphics"
          editable={false}
        /> */}

        {/* <Text style={styles.label}>Password</Text> */}
        {/* <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={!passwordVisible}
            value="**********"
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? "eye" : "eye-off"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View> */}
      </View>
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={{ textAlign: "center", color: "white", fontSize: 18 }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 10,
    backgroundColor: "black",
    borderRadius: 20,
    padding: 5,
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 15,
  },
  input: {
    backgroundColor: "#F2F2F2",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginTop: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 5,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  logout: {
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 20,
    marginVertical: 20,
  },
});
