import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  SafeAreaView,
  Dimensions,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../config/api";

const { width } = Dimensions.get("window");

type EditProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EditProfile"
>;

type Props = {
  navigation: EditProfileScreenNavigationProp;
};

const EditProfileScreen = ({ navigation }: Props) => {
  const { userId } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
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
      if (data?.user) {
        setFullName(data.user.name ?? "");
        setEmail(data.user.email ?? "");
        setAvatar(
          data.user.avatar && data.user.avatar.url ? data.user.avatar.url : null
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setProfileLoading(false);
    }
  };

  const checkPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Photo Access Required",
            message:
              "This app needs access to your photos to update your profile picture",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true;
  };

const handleSelectImage = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;

      setAvatar(imageUri);
      await updateProfilePicture(base64Image);
    }
  } catch (error) {
    Alert.alert("Error", "Failed to pick image");
  }
};

  const updateProfilePicture = async (base64Image: string) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");

      const response = await fetch(`${API_URL}/users/update-profile-avatar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          avatar: base64Image,
          userId: userId,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      Alert.alert("Success", "Profile picture updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");

      const response = await fetch(`${API_URL}/users/update-user-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: fullName,
          userId: userId,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      Alert.alert("Success", "Profile updated successfully", [
        {
          text: "OK",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "Main",
                  state: {
                    routes: [{ name: "Profile" }],
                  },
                },
              ],
            });
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <View style={styles.avatarContainer}>
        <Image
          source={
            avatar
              ? { uri: avatar }
              : require("../../assets/images/defaultavatar.png")
          }
          style={styles.avatar}
        />
        <TouchableOpacity
          onPress={handleSelectImage}
          style={styles.cameraButton}
          disabled={loading}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="camera" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>FULL NAME</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          placeholderTextColor="#666"
          editable={!loading}
        />

        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={email}
          editable={false}
          placeholderTextColor="#666"
        />
      </View>

      <TouchableOpacity
        style={[styles.updateButton, loading && styles.disabledButton]}
        onPress={handleUpdateProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.updateButtonText}>Update</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333333",
    paddingTop: Platform.OS === "android" ? 16 : 0,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#FFA500",
    padding: 8,
    borderRadius: 20,
    zIndex: 1,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  form: {
    padding: 16,
    marginTop: 20,
  },
  label: {
    color: "#999",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 100,
    fontSize: 17,
    padding: 20,
    color: "#FFF",
    marginBottom: 16,
  },
  disabledInput: {
    opacity: 0.7,
  },
  updateButton: {
    backgroundColor: "#FFA500",
    borderWidth: 1,
    margin: 16,
    paddingVertical: 19,
    borderRadius: 100,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#000",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default EditProfileScreen;