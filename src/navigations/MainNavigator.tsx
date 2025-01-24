import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "../context/AuthContext";
import BottomNavigator from "./BottomNavigator";
import SplashScreen from "../screens/SplashScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SubscriptionScreen from "../screens/SubscriptionScreen";
import PaymentSubsScreen from "../screens/PaymentSubsScreen";
import LoginScreen from "../screens/LoginScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import ProfileSettingScreen from "../screens/ProfileSettingScreen";
import ProfileSubsScreen from "../screens/ProfileSubsScreen";
import ProfileSubsPaymentScreen from "../screens/ProfileSubsPaymentScreen";
import ProfileNotificationScreen from "../screens/ProfileNotificationScreen";
import MovieDetailScreen from "../screens/MoviesDetailScreen";
import TvShowDetailScreen from "../screens/TvShowDetailScreen";
import StreamingScreen from "../screens/SteamingScreen";
import { RootStackParamList } from "../types";

const Stack = createStackNavigator<RootStackParamList>();

function MainNavigator() {
  return (
    <AuthProvider>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        <Stack.Screen name="PaymentSubs" component={PaymentSubsScreen} />

        <Stack.Screen name="Main" component={BottomNavigator} />

        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ProfileSetting" component={ProfileSettingScreen} />
        <Stack.Screen name="ProfileSubs" component={ProfileSubsScreen} />
        <Stack.Screen
          name="ProfileSubsPayment"
          component={ProfileSubsPaymentScreen}
        />
        <Stack.Screen
          name="ProfileNotification"
          component={ProfileNotificationScreen}
        />
        <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
        <Stack.Screen name="TvShowDetail" component={TvShowDetailScreen} />
        <Stack.Screen name="Streaming" component={StreamingScreen} />
      </Stack.Navigator>
    </AuthProvider>
  );
}

export default MainNavigator;