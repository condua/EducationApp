import { StyleSheet, Text, View } from "react-native";
import React from "react";
import YoutubeIframe from "react-native-youtube-iframe";
type Props = {};

const forgotpassword = (props: Props) => {
  return (
    <View style={styles.container}>
      <YoutubeIframe height={250} videoId="KoVsHDXYi1U" />
    </View>
  );
};

export default forgotpassword;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
