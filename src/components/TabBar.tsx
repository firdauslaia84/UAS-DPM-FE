import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => (
  <View style={styles.tabContainer}>
    <TouchableOpacity
      style={[styles.tab, activeTab === "all" && styles.activeTab]}
      onPress={() => onTabChange("all")}
    >
      <Text
        style={[styles.tabText, activeTab === "all" && styles.activeTabText]}
      >
        All
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, activeTab === "tvshows" && styles.activeTab]}
      onPress={() => onTabChange("tvshows")}
    >
      <Text
        style={[
          styles.tabText,
          activeTab === "tvshows" && styles.activeTabText,
        ]}
      >
        TV shows
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, activeTab === "movies" && styles.activeTab]}
      onPress={() => onTabChange("movies")}
    >
      <Text
        style={[styles.tabText, activeTab === "movies" && styles.activeTabText]}
      >
        Movies
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  tab: {
    marginRight: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#CCFF00",
    shadowColor: "#CCFF00",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  tabText: {
    color: "#ffffff",
    fontSize: width * 0.045,
    fontWeight: "700",
  },
  activeTabText: {
    color: "#000000",
    fontWeight: "700",
  },
});

export default TabBar;