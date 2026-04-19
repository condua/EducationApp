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
  ActivityIndicator,
  Modal, // Thêm Modal cho chọn giới tính
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/src/store/authSlice";
import { updateUserProfileOnServer } from "@/src/slices/profileSlice";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker"; // Thêm thư viện ngày tháng
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { fetchCurrentUser } from "@/src/slices/profileSlice";
const API_UPLOAD_URL =
  "https://educationappbackend-4inf.onrender.com/api/upload";

// 🟢 MÀU CHỦ ĐẠO MỚI: Xanh lá nhạt
const PRIMARY_COLOR = "#34D399";

export default function EditProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Lấy thêm trạng thái loading từ profileSlice để hiển thị lúc tải data
  const {
    fullName,
    phone,
    email,
    avatar,
    gender,
    birthDate,
    address,
    loading: isFetching,
  } = useSelector((state) => state.profile);

  const [localName, setLocalName] = useState(fullName || "");
  const [localPhone, setLocalPhone] = useState(phone || "");
  const [localAvatar, setLocalAvatar] = useState(avatar || "");

  // 🟢 THÊM STATE MỚI
  const [localAddress, setLocalAddress] = useState(address || "");
  const [localGender, setLocalGender] = useState(gender || "");
  const [localBirthDate, setLocalBirthDate] = useState(
    birthDate ? new Date(birthDate) : new Date(),
  );

  // Trạng thái hiển thị popup
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🟢 LOGIC MỚI: Tải dữ liệu mới nhất từ Server mỗi khi vào màn hình
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadData = async () => {
        try {
          // Gọi API lấy thông tin mới nhất (Xử lý trường hợp đổi account)
          await dispatch(fetchCurrentUser()).unwrap();
        } catch (error) {
          console.error("Không thể tải thông tin mới nhất:", error);
        }
      };

      loadData();

      return () => {
        isMounted = false;
      };
    }, [dispatch]),
  );

  // 🟢 LOGIC CŨ CẬP NHẬT: Khi dữ liệu Redux thay đổi, cập nhật local state
  React.useEffect(() => {
    setLocalName(fullName || "");
    setLocalPhone(phone || "");
    setLocalAvatar(avatar || "");
    setLocalAddress(address || "");
    setLocalGender(gender || "");
    if (birthDate) setLocalBirthDate(new Date(birthDate));
  }, [fullName, phone, avatar, address, gender, birthDate]);

  const uploadImageToServer = async (imageUri) => {
    const formData = new FormData();
    const filename = imageUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    formData.append("image", {
      uri: imageUri,
      name: filename,
      type: type,
    });

    const response = await fetch(API_UPLOAD_URL, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (!response.ok) throw new Error("Lỗi kết nối khi upload ảnh lên server.");
    const data = await response.json();
    return data.imageUrl;
  };

  const handleUpdate = async () => {
    if (!localName.trim()) {
      Alert.alert("Lỗi", "Họ và tên không được để trống.");
      return;
    }

    try {
      setIsLoading(true);
      let finalAvatarUrl = localAvatar;

      if (localAvatar && !localAvatar.startsWith("http")) {
        finalAvatarUrl = await uploadImageToServer(localAvatar);
      }

      // 🟢 Gửi thêm các trường mới lên server
      await dispatch(
        updateUserProfileOnServer({
          fullName: localName,
          phone: localPhone,
          avatar: finalAvatarUrl,
          address: localAddress,
          gender: localGender,
          birthDate: localBirthDate.toISOString(),
        }),
      ).unwrap();

      Alert.alert("Thành công", "Hồ sơ của bạn đã được cập nhật!");
      router.back();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      Alert.alert(
        "Lỗi",
        typeof error === "string"
          ? error
          : "Không thể cập nhật hồ sơ lúc này. Vui lòng thử lại!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await GoogleSignin.signOut(); // đợi logout Google
          } catch (error) {
            console.error("Lỗi khi đăng xuất Google:", error);
          } finally {
            dispatch(logout()); // luôn logout app
            router.replace("/login");
          }
        },
      },
    ]);
  };

  const handlePickAvatar = async () => {
    if (isLoading) return;

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Lỗi quyền truy cập",
        "Bạn cần cấp quyền truy cập thư viện ảnh để đổi ảnh đại diện.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) setLocalAvatar(result.assets[0].uri);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || localBirthDate;
    setShowDatePicker(Platform.OS === "ios"); // iOS giữ lịch mở, Android tự đóng
    setLocalBirthDate(currentDate);
  };

  const selectGender = (selected) => {
    setLocalGender(selected);
    setShowGenderModal(false);
  };
  // Thêm hiển thị loading khi đang tải profile ban đầu
  if (isFetching && !localName) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={{ marginTop: 10 }}>Đang tải thông tin...</Text>
      </View>
    );
  }
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
            disabled={isLoading}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isLoading ? "#9CA3AF" : "#111827"}
            />
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
                      "&background=34D399&color=fff",
                }}
                style={styles.avatar}
              />
              <TouchableOpacity
                style={[
                  styles.editIcon,
                  isLoading && { backgroundColor: "#9CA3AF" },
                ]}
                onPress={handlePickAvatar}
                disabled={isLoading}
              >
                <Ionicons name="camera" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Họ và tên</Text>
            <View
              style={[styles.inputWrapper, isLoading && styles.inputDisabled]}
            >
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
                editable={!isLoading}
              />
            </View>

            <Text style={styles.label}>Số điện thoại</Text>
            <View
              style={[styles.inputWrapper, isLoading && styles.inputDisabled]}
            >
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
                editable={!isLoading}
              />
            </View>

            {/* 🟢 THÊM: Địa chỉ */}
            <Text style={styles.label}>Địa chỉ</Text>
            <View
              style={[styles.inputWrapper, isLoading && styles.inputDisabled]}
            >
              <Ionicons
                name="location-outline"
                size={20}
                color="#6B7280"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                value={localAddress}
                onChangeText={setLocalAddress}
                placeholder="Nhập địa chỉ của bạn"
                placeholderTextColor="#9CA3AF"
                editable={!isLoading}
              />
            </View>

            {/* 🟢 SỬA: Lịch chọn Ngày sinh */}
            <Text style={styles.label}>Ngày sinh</Text>
            <TouchableOpacity
              style={[styles.inputWrapper, isLoading && styles.inputDisabled]}
              onPress={() => !isLoading && setShowDatePicker(true)}
              disabled={isLoading}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#6B7280"
                style={styles.icon}
              />
              <Text
                style={[styles.input, !localBirthDate && { color: "#9CA3AF" }]}
              >
                {localBirthDate
                  ? localBirthDate.toLocaleDateString("vi-VN")
                  : "Chọn ngày sinh"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={localBirthDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangeDate}
                maximumDate={new Date()} // Không cho chọn ngày tương lai
              />
            )}

            {/* 🟢 SỬA: Dropdown Giới tính */}
            <Text style={styles.label}>Giới tính</Text>
            <TouchableOpacity
              style={[styles.inputWrapper, isLoading && styles.inputDisabled]}
              onPress={() => !isLoading && setShowGenderModal(true)}
              disabled={isLoading}
            >
              <Ionicons
                name={
                  localGender === "Nam"
                    ? "man-outline"
                    : localGender === "Nữ"
                      ? "woman-outline"
                      : "male-female-outline"
                }
                size={20}
                color="#6B7280"
                style={styles.icon}
              />
              <Text
                style={[styles.input, !localGender && { color: "#9CA3AF" }]}
              >
                {localGender || "Chọn giới tính"}
              </Text>
              <Ionicons name="chevron-down-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.label}>Email</Text>
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
            <TouchableOpacity
              style={[
                styles.saveButton,
                isLoading && styles.saveButtonDisabled,
              ]}
              onPress={handleUpdate}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.logoutButton, isLoading && { opacity: 0.5 }]}
              onPress={handleLogout}
              disabled={isLoading}
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

      {/* 🟢 MODAL: Chọn giới tính */}
      <Modal visible={showGenderModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn giới tính</Text>
            {["Nam", "Nữ", "Khác"].map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.modalOption}
                onPress={() => selectGender(item)}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    localGender === item && {
                      color: PRIMARY_COLOR,
                      fontWeight: "700",
                    },
                  ]}
                >
                  {item}
                </Text>
                {localGender === item && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={PRIMARY_COLOR}
                  />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowGenderModal(false)}
            >
              <Text style={styles.modalCancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  dummyView: { width: 40 },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  avatarContainer: { alignItems: "center", marginTop: 24, marginBottom: 32 },
  avatarWrapper: { position: "relative" },
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
  formContainer: { width: "100%" },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
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
  inputDisabled: { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB" },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: "#111827" },
  actionContainer: { marginTop: 32, gap: 16 },
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
    flexDirection: "row",
  },
  saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  saveButtonDisabled: {
    backgroundColor: "#A7F3D0",
    shadowOpacity: 0,
    elevation: 0,
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
  logoutIcon: { marginRight: 8 },
  logoutButtonText: { color: "#EF4444", fontSize: 16, fontWeight: "600" },

  // Styles cho Modal Giới tính
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalOptionText: { fontSize: 16, color: "#374151" },
  modalCancel: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  modalCancelText: { fontSize: 16, fontWeight: "600", color: "#4B5563" },
});
