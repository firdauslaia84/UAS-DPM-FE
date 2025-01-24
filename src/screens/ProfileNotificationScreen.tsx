import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type ProfileNotificaitionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProfileNotification"
>;

interface Props {
  navigation: ProfileNotificaitionScreenNavigationProp;
}

const ProfileNotification: React.FC<Props> = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

    const handleBackPress = () => {
      navigation.goBack();
    };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ChevronLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>App Notifications</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#32CD32" }}
            thumbColor={isEnabled ? "#FFFFFF" : "#F4F3F4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        <Text style={styles.legalText}>Some legal notice</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333333",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 24,
  },
  content: {
    padding: 16,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  settingText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "500",
  },
  legalText: {
    color: "#808080",
    fontSize: 15,
  },
});

export default ProfileNotification;