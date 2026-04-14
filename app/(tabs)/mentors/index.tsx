import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const getInitials = (name: string) => {
  const words = name.trim().split(" ");
  const first = words[0]?.charAt(0) || "";
  const last = words[words.length - 1]?.charAt(0) || "";
  return (first + last).toUpperCase();
};

const mentors = [
  {
    id: "1",
    name: "Phan Hoàng Phúc",
    category: "Toán",
    avatar: `https://ui-avatars.com/api/?name=${getInitials("Phan Hoàng Phúc")}&background=22c55e&color=fff&size=128`,
  },
  {
    id: "2",
    name: "Phan Tấn Lộc",
    category: "Tiếng Anh",
    avatar: `https://ui-avatars.com/api/?name=${getInitials("Phan Tấn Lộc")}&background=22c55e&color=fff&size=128`,
  },
];

const MentorListScreen = () => {
  return (
    <View
      style={{ flex: 1, backgroundColor: "#F8FAFC", paddingHorizontal: 20 }}
    >
      {/* Header */}
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 20,
        }}
      >
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 16 }}>
          Top Mentors
        </Text>
        <TouchableOpacity style={{ marginLeft: "auto" }}>
          <Ionicons name="search-outline" size={24} color="black" />
        </TouchableOpacity>
      </View> */}

      {/* Mentor List */}
      <FlatList
        data={mentors}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 30 }}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "black",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {item.avatar ? (
                <Image
                  source={{ uri: item.avatar }}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                />
              ) : (
                <Ionicons name="person" size={24} color="white" />
              )}
            </View>
            <View style={{ marginLeft: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 14, color: "#6B7280" }}>
                {item.category}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default MentorListScreen;
