import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";
import API_URL from "../config/api";

const { width } = Dimensions.get("window");

type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Register"
>;

function RegisterScreen({ navigation, route }: RegisterScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { subscriptionDetails } = route.params;

  const handleRegister = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          passwordAgain,
          subscriptionId: subscriptionDetails.id,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed");
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigation.navigate("Login");
      }, 3000);
    } catch (error: any) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    if (!name || !email || !password || !passwordAgain) {
      setError("Please fill in all fields");
      return false;
    }

    if (password !== passwordAgain) {
      setError("Passwords do not match");
      return false;
    }

    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions");
      return false;
    }

    setError("");
    return true;
  };

  const formatPrice = (price: number) => {
    return `IDR${price.toLocaleString("id-ID")}`;
  };

  return (
    <>
      {showSuccess && (
        <View style={styles.successOverlay}>
          <View style={styles.successContent}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="checkmark"
                size={40}
                color="#CCFF00"
                style={styles.checkIcon}
              />
            </View>
            <Text style={styles.successTitle}>
              Your account has{"\n"}been successfully{"\n"}activated.
            </Text>
          </View>
        </View>
      )}
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sign Up</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Selected plan</Text>
              <View style={styles.planCard}>
                <Text style={styles.priceText}>
                  {formatPrice(subscriptionDetails.price)}
                  <Text style={styles.periodText}>/mo</Text>
                </Text>
                <Ionicons
                  name="checkmark"
                  size={24}
                  color="#CCFF00"
                  style={styles.checkmark}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal info</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={name}
                  onChangeText={setName}
                />

                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                <TextInput
                  style={styles.input}
                  placeholder="Password again"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={passwordAgain}
                  onChangeText={setPasswordAgain}
                  secureTextEntry
                />
              </View>

              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setTermsAccepted(!termsAccepted)}
                >
                  {termsAccepted && (
                    <Ionicons
                      name="checkmark-sharp"
                      size={20}
                      color="#CCFF00"
                    />
                  )}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Terms & Conditions</Text>
              </View>

              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setPrivacyAccepted(!privacyAccepted)}
                >
                  {privacyAccepted && (
                    <Ionicons
                      name="checkmark-sharp"
                      size={20}
                      color="#CCFF00"
                    />
                  )}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Privacy policy</Text>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[
                  styles.registerButton,
                  loading && styles.disabledButton,
                ]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.registerButtonText}>
                  {loading ? "Processing..." : "Activate Account"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContent: {
    flexGrow: 1,
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
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: width * 0.06,
    fontWeight: "700",
    color: "white",
    marginBottom: 16,
  },
  planCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 24,
  },
  priceText: {
    fontSize: width * 0.07,
    fontWeight: "700",
    color: "white",
  },
  periodText: {
    fontSize: width * 0.04,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "400",
  },
  checkmark: {
    marginLeft: 12,
  },
  inputContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    color: "white",
    fontSize: width * 0.045,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxLabel: {
    color: "white",
    fontSize: width * 0.045,
  },
  registerButton: {
    backgroundColor: "#CCFF00",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 32,
  },
  registerButtonText: {
    color: "black",
    fontSize: width * 0.045,
    fontWeight: "800",
  },
  errorText: {
    color: "#FF4444",
    textAlign: "center",
    marginTop: 16,
    fontSize: width * 0.035,
  },
  successOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  successContent: {
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#CCFF00",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  checkIcon: {
    marginLeft: 2,
  },
  successTitle: {
    fontSize: width * 0.08,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    lineHeight: width * 0.11, 
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default RegisterScreen;