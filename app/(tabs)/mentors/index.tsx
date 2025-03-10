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

const mentors = [
  { id: "1", name: "Jiya Shetty", category: "3D Design", avatar: "" },
  { id: "2", name: "Donald S", category: "Arts & Humanities", avatar: "" },
  { id: "3", name: "Aman", category: "Personal Development", avatar: "" },
  { id: "4", name: "Vrushab. M", category: "SEO & Marketing", avatar: "" },
  {
    id: "5",
    name: "Robert William",
    category: "Office Productivity",
    avatar: "",
  },
  { id: "6", name: "Soman", category: "Web Development", avatar: "" },
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
