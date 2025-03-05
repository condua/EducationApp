import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";

const LessonScreen = () => {
  const downloadAndOpenPDF = async () => {
    // có thể dùng google drive
    const pdfUrl =
      "https://firebasestorage.googleapis.com/v0/b/crud-node-firebase-3c5b5.appspot.com/o/Introduction%20to%20algorithms%20by%20Thomas%20H.%20Cormen%2C%20Charles%20E.%20Leiserson%2C%20Ronald%20L.%20Rivest%2C%20Clifford%20Stein%20(z-lib.org).pdf?alt=media&token=3acdf2fa-8001-4d0a-8dd7-e6c5d1b8b921";

    Linking.openURL(pdfUrl);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>MOBILE APPS DESIGN</Text>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Your progress</Text>
        <Text style={styles.score}>Score: 96.3%</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "96%" }]} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Current lesson</Text>
      <Text style={styles.lessonTitle}>MOBILE PROTOTYPING</Text>

      <View style={styles.videoContainer}>
        <WebView
          style={styles.video}
          source={{
            uri: "https://www.youtube.com/embed/VsZQE9rRlnE?modestbranding=1&showinfo=0&controls=1&rel=0",
          }}
          allowsFullscreenVideo
          javaScriptEnabled
          domStorageEnabled
        />
      </View>

      <View style={styles.instructorContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/40" }}
          style={styles.instructorImage}
        />
        {/* <Text style={styles.instructorName}>Lucas Walker</Text>
        <Text style={styles.lessonDuration}>• 21:50 min</Text> */}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={downloadAndOpenPDF}
        >
          <Text style={styles.secondaryButtonText}>
            📎 Additional materials
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Home tasks</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Next lessons</Text>
      <View style={styles.lessonItem}>
        <Text style={styles.lessonName}>9. Design process</Text>
        <Text style={styles.lessonTime}>14:30 min →</Text>
      </View>
      <View style={styles.lessonItem}>
        <Text style={styles.lessonName}>10. Animation</Text>
        <Text style={styles.lessonTime}>18:45 min →</Text>
      </View>
      <View style={{ paddingBottom: 30 }}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  progressContainer: {
    backgroundColor: "#E8F0FF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  progressText: { fontSize: 14, color: "#555" },
  score: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  progressBar: {
    height: 8,
    backgroundColor: "#D0E2FF",
    borderRadius: 5,
    marginTop: 5,
  },
  progressFill: { height: "100%", backgroundColor: "#357AFF", borderRadius: 5 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 20 },
  lessonTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  videoContainer: {
    height: 200,
    backgroundColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
  },
  video: { flex: 1 },
  instructorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  instructorImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  instructorName: { fontSize: 14, fontWeight: "bold" },
  lessonDuration: { fontSize: 14, color: "#777" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  secondaryButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#000",
  },
  secondaryButtonText: { fontSize: 14 },
  primaryButton: { backgroundColor: "#357AFF", padding: 10, borderRadius: 10 },
  primaryButtonText: { color: "#FFF", fontSize: 14 },
  lessonItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  lessonName: { fontSize: 16 },
  lessonTime: { fontSize: 14, color: "#777" },
});

export default LessonScreen;
