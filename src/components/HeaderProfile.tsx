import React from "react";
import { StyleSheet, View, Text } from "react-native";

const HeaderProfile: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Profile</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: "#000",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default HeaderProfile;