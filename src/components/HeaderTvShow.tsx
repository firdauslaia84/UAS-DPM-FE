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

export const HeaderTvShow: React.FC = () => {
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
    zIndex: 1000,
    paddingTop: STATUSBAR_HEIGHT,
  },
  header: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 8,
    borderRadius: 20,
  },
  placeholder: {
    width: 30,
  },
  logo: {
    fontSize: width * 0.09,
    fontWeight: "900",
    color: "white",
    letterSpacing: 1,
  },
});

export default HeaderTvShow;