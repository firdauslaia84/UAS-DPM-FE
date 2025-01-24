import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HeaderProfile from "../components/HeaderProfile";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabParamList, RootStackParamList } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config/api";

const { width } = Dimensions.get("window");

type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, "Profile">,
  NativeStackScreenProps<RootStackParamList>
>;

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
}

function MenuItem({ icon, title, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={24} color="#808080" />
      <Text style={styles.menuItemText}>{title}</Text>
      <Ionicons name="chevron-forward" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { userId, setUserId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState({
    name: "",
    avatar: null,
  });

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    if (!userId) return;

    setProfileLoading(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await fetch(`${API_URL}/users/me/${userId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      if (data?.user) {
        const { name, avatar } = data.user;
        setUserProfile({
          name: name || "User",
          avatar: avatar?.url || null,
        });
      } else {
        throw new Error("Invalid user data received");
      }
    } catch (error: any) {
      setError(error.message);

      if (
        error.message.includes("unauthorized") ||
        error.message.includes("token")
      ) {
        handleLogout();
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      try {
        const response = await fetch(
          `${API_URL}/users/logout?userId=${userId}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await response.json();
      } catch (error) {
      }
      await AsyncStorage.multiRemove([
        "access_token",
        "refresh_token",
        "userId",
      ]);
      setUserId(null);

      navigation.getParent()?.reset({
        index: 0,
        routes: [{ name: "Splash" }],
      });
    } catch (error: any) {
      setError(error.message);

      await AsyncStorage.multiRemove([
        "access_token",
        "refresh_token",
        "userId",
      ]);
      setUserId(null);

      navigation.getParent()?.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } finally {
      setLoading(false);
    }
  };

  const ProfileCardContent = () => {
    if (profileLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#CCFF00" />
        </View>
      );
    }

    return (
      <>
        <View style={styles.profileImageContainer}>
          {userProfile.avatar ? (
            <Image
              source={{ uri: userProfile.avatar }}
              style={styles.profileImage}
            />
          ) : (
            <Image
              source={require("../../assets/images/defaultavatar.png")}
              style={styles.profileImage}
            />
          )}
        </View>
        <Text style={styles.profileName}>{userProfile.name || "User"}</Text>
        <Ionicons name="chevron-down" size={24} color="#fff" />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <HeaderProfile />

      <ScrollView style={styles.scrollContent}>
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <ProfileCardContent />
        </TouchableOpacity>

        <MenuItem
          icon="card-outline"
          title="Subscriptions"
          onPress={() => navigation.navigate("ProfileSubs")}
        />
        <MenuItem
          icon="notifications-outline"
          title="Notifications"
          onPress={() => navigation.navigate("ProfileNotification")}
        />
        <MenuItem
          icon="settings-outline"
          title="Settings"
          onPress={() => navigation.navigate("ProfileSetting")}
        />
        <MenuItem
          icon="person-outline"
          title="Account"
          onPress={() => navigation.navigate("EditProfile")}
        />
        <MenuItem
          icon="information-circle-outline"
          title="Support"
          onPress={() => navigation.navigate("Profile")}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.logoutButton, loading && styles.disabledButton]}
          onPress={handleLogout}
          disabled={loading}
        >
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text style={styles.logoutText}>
            {loading ? "Logging out..." : "Log Out"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    padding: 15,
    marginHorizontal: 16,
    borderRadius: 20,
    marginBottom: 40,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#2C2C2E",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profileName: {
    color: "white",
    fontSize: width * 0.05,
    fontWeight: "700",
    flex: 1,
    marginLeft: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 23,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#2C2C2E",
  },
  menuItemText: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "700",
    flex: 1,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C1C1E",
    marginHorizontal: width * 0.2,
    marginTop: 80,
    marginBottom: 20,
    padding: width * 0.03,
    borderRadius: width * 0.1,
  },
  logoutText: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "700",
    marginLeft: 8,
  },
  scrollContent: {
    flex: 1,
    paddingTop: 94,
  },
  errorText: {
    color: "#FF4444",
    textAlign: "center",
    marginTop: 16,
    fontSize: width * 0.035,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;