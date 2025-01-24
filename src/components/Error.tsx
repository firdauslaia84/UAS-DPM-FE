import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

const Error: React.FC<ErrorScreenProps> = ({ message, onRetry }) => (
  <View style={styles.container}>
    <Text style={styles.errorText}>{message}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#030303",
    padding: 20,
  },
  errorText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#4E6EE3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Error;