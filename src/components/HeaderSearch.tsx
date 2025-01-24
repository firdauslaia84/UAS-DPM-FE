import { View, Text, StyleSheet } from "react-native";
import React from "react";

const HeaderSearch = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Search</Text>
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

export default HeaderSearch;