import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const Loading: React.FC = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#4E6EE3" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#030303",
  },
});

export default Loading;