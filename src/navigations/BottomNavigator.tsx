import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { RootStackParamList, BottomTabParamList } from "../types";

const Tab = createBottomTabNavigator<BottomTabParamList>();

export type ProfileTabScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, "Profile">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function BottomNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen as React.ComponentType<any>}
      />
    </Tab.Navigator>
  );
}

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconName = getIconName(route.name, isFocused);

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={[styles.tabButton, isFocused && styles.activeTabButton]}
          >
            <Icon
              name={iconName}
              size={24}
              color={isFocused ? "#CCFF00" : "#666666"}
            />
            <Text style={[styles.tabText, isFocused && styles.activeTabText]}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const getIconName = (routeName: string, isFocused: boolean) => {
  switch (routeName) {
    case "Home":
      return isFocused ? "home" : "home-outline";
    case "Search":
      return isFocused ? "search" : "search-outline";
    case "Favorite":
      return isFocused ? "heart" : "heart-outline";
    case "Profile":
      return isFocused ? "person" : "person-outline";
    default:
      return "ellipse-outline";
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    height: 85,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    borderTopWidth: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 8,
  },
  activeTabButton: {
    opacity: 1,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: "#666666",
  },
  activeTabText: {
    color: "#CCFF00",
  },
  tabBar: {
    position: "absolute",
    backgroundColor: "transparent",
    borderTopWidth: 0,
    height: 80,
    elevation: 0,
  },
});