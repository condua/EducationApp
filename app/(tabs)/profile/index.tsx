import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/src/store/authSlice";
import { updateProfile } from "@/src/slices/profileSlice";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker"; // Import thư viện ảnh

export default function EditProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { fullName, phone, email, avatar } = useSelector(
    (state) => state.profile,
  );

  const [localName, setLocalName] = useState(fullName || "");
  const [localPhone, setLocalPhone] = useState(phone || "");
  const [localAvatar, setLocalAvatar] = useState(avatar || "");

  // Load lại dữ liệu khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      setLocalName(fullName || "");
      setLocalPhone(phone || "");
      setLocalAvatar(avatar || "");
    }, [fullName, phone, avatar]),
  );

  const handleUpdate = () => {
    // Truyền thêm avatar vào hàm updateProfile
    dispatch(
      updateProfile({
        name: localName,
        phone: localPhone,
        avatar: localAvatar,
      }),
    );
    Alert.alert("Thành công", "Hồ sơ của bạn đã được cập nhật!");
    router.back();
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => {
          dispatch(logout());
          router.replace("/login");
        },
      },
    ]);
  };

  const handlePickAvatar = async () => {
    // 1. Xin quyền truy cập thư viện ảnh
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Lỗi quyền truy cập",
        "Bạn cần cấp quyền truy cập thư viện ảnh để đổi ảnh đại diện.",
      );
      return;
    }

    // 2. Mở thư viện ảnh
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Bật tính năng cắt ảnh
      aspect: [1, 1], // Ép cắt theo tỉ lệ vuông 1:1
      quality: 0.8, // Giảm chất lượng nhẹ để tối ưu hiệu năng
    });

    // 3. Nếu người dùng chọn ảnh (không bấm hủy)
    if (!result.canceled) {
      // Lưu đường dẫn ảnh mới vào state
      setLocalAvatar(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
          <View style={styles.dummyView} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{
                  uri:
                    localAvatar ||
                    "https://ui-avatars.com/api/?name=" +
                      (localName || "User") +
                      "&background=4F46E5&color=fff",
                }}
                style={styles.avatar}
              />
              <TouchableOpacity
                style={styles.editIcon}
                onPress={handlePickAvatar}
              >
                <Ionicons name="camera" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Họ và tên</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#6B7280"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                value={localName}
                onChangeText={setLocalName}
                placeholder="Nhập họ và tên"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <Text style={styles.label}>Số điện thoại</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="call-outline"
                size={20}
                color="#6B7280"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                value={localPhone}
                onChangeText={setLocalPhone}
                placeholder="Nhập số điện thoại"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            <Text style={styles.label}>Địa chỉ Email</Text>
            <View style={[styles.inputWrapper, styles.inputDisabled]}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#9CA3AF"
                style={styles.icon}
              />
              <TextInput
                style={[styles.input, { color: "#9CA3AF" }]}
                value={email || "Chưa cập nhật"}
                editable={false}
              />
              <Ionicons name="lock-closed" size={16} color="#D1D5DB" />
            </View>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
              <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#EF4444"
                style={styles.logoutIcon}
              />
              <Text style={styles.logoutButtonText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const PRIMARY_COLOR = "#4F46E5";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  dummyView: {
    width: 40,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: PRIMARY_COLOR,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: PRIMARY_COLOR,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
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
    marginBottom: 20,
  },
  inputDisabled: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  actionContainer: {
    marginTop: 32,
    gap: 16,
  },
  saveButton: {
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
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
