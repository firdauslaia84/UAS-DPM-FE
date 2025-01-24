import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/navigations/MainNavigator";
import "react-native-gesture-handler";

export default function App() {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}