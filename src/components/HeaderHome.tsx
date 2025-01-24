import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 60 : StatusBar.currentHeight;

export const HeaderHome: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <View style={styles.header}>
        <Text style={styles.logo}>MUXX</Text>
        <View style={styles.headerRight}>
          <Icon name="person-circle-outline" size={30} color="white" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(3, 3, 3, 0.85)",
    zIndex: 1000,
    paddingTop: STATUSBAR_HEIGHT,
  },
  header: {
    height: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  logo: {
    fontSize: width * 0.11,
    fontWeight: "900",
    color: "white",
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 20,
  },
});

export default HeaderHome;