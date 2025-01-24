import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config/api";

const { width, height } = Dimensions.get("window");

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;

function LoginScreen({ navigation }: LoginScreenProps) {
  const { setUserId } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canGoBack = navigation.canGoBack();

  const handleLogin = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password");
      }

      if (data.accessToken) {
        await AsyncStorage.setItem("access_token", data.accessToken);
      }
      if (data.refreshToken) {
        await AsyncStorage.setItem("refresh_token", data.refreshToken);
      }

      if (data.user?._id) {
        await setUserId(data.user._id);
      }

      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return false;
    }

    setError("");
    return true;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            {canGoBack && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back" size={24} color="white" />
              </TouchableOpacity>
            )}
            <Text
              style={[
                styles.headerTitle,
                !canGoBack && styles.headerTitleCenter,
              ]}
            >
              Sign In
            </Text>
          </View>

          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="black" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: width * 0.05,
    fontWeight: "600",
    color: "white",
    marginRight: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.04,
  },
  inputContainer: {
    gap: 16,
    marginBottom: height * 0.04,
  },
  input: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    fontSize: width * 0.045,
    color: "white",
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#CCFF00",
    padding: height * 0.022,
    borderRadius: 100,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "black",
    fontSize: width * 0.045,
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.5,
  },
  errorText: {
    color: "#FF4444",
    textAlign: "center",
    fontSize: width * 0.035,
  },
  headerTitleCenter: {
    marginLeft: 48,
    marginRight: 48,
  },
});

export default LoginScreen;