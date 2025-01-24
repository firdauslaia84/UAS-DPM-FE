import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TextInput,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";
import API_URL from "../config/api";

const { width } = Dimensions.get("window");

type PaymentSubsScreenProps = NativeStackScreenProps<RootStackParamList, "PaymentSubs">;

function PaymentSubsScreen({ navigation, route }: PaymentSubsScreenProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const { subscriptionId, amount, planType } = route.params;
  const [loading, setLoading] = useState(false);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    const formatted = cleaned.replace(/(\d{4})/g, "$1 ").trim();
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const formatPrice = (price: number) => {
    return `IDR${price.toLocaleString("id-ID")}`;
  };

  const validateCard = () => {
    const cleanCardNumber = cardNumber.replace(/\s/g, "");

    if (!cleanCardNumber || cleanCardNumber.length !== 16) {
      setError("Card number must be 16 digits (demo mode allows any digits)");
      return false;
    }

    if (!cardHolder.trim()) {
      setError("Please enter the cardholder name");
      return false;
    }

    const [month, year] = expiryDate.split("/");
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      setError("Please enter a valid expiry date (MM/YY)");
      return false;
    }

    const monthNum = parseInt(month, 10);
    if (monthNum < 1 || monthNum > 12) {
      setError("Invalid expiry month");
      return false;
    }

    if (!cvv || cvv.length !== 3) {
      setError("CVV must be 3 digits");
      return false;
    }

    setError("");
    return true;
  };

  const handlePayment = async () => {
    if (!validateCard()) return;
    setLoading(true);
    setError("");

    try {
      const [month, year] = expiryDate.split("/");
      const fullYear = 2000 + parseInt(year, 10);
      const cleanCardNumber = cardNumber.replace(/\s/g, "");

      const response = await fetch(`${API_URL}/subscriptions/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          subscriptionId,
          cardNumber: cleanCardNumber,
          cardholderName: cardHolder,
          expiryMonth: parseInt(month, 10),
          expiryYear: fullYear,
          cvv,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg =
          data.message || response.statusText || "Payment failed";
        throw new Error(errorMsg);
      }

      navigation.navigate("Register", {
        subscriptionDetails: {
          id: data.subscription.id,
          status: data.subscription.status,
          planType: data.subscription.planType,
          startDate: data.subscription.startDate,
          endDate: data.subscription.endDate,
          price: data.subscription.price,
          paymentVerificationId: data.subscription.paymentVerificationId,
        },
      });
    } catch (error: any) {
      const errorMessage = error.message || "Payment processing failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Plan</Text>
            <Text style={styles.summaryValue}>
              {planType.charAt(0).toUpperCase() + planType.slice(1)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount</Text>
            <Text style={styles.summaryValue}>{formatPrice(amount)}</Text>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Card Details</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              placeholder="JOHN DOE"
              value={cardHolder}
              onChangeText={setCardHolder}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                placeholder="123"
                value={cvv}
                onChangeText={(text) => setCvv(text.replace(/\D/g, ""))}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <TouchableOpacity
          style={[styles.payButton, loading && styles.disabledButton]}
          onPress={handlePayment}
          disabled={loading}
        >
          <Text style={styles.payButtonText}>
            {loading ? "Processing..." : `Pay ${formatPrice(amount)}`}
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
    fontWeight: "700",
    color: "white",
    marginRight: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  summaryCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: width * 0.06,
    fontWeight: "700",
    color: "white",
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: width * 0.04,
    color: "rgba(255, 255, 255, 0.6)",
  },
  summaryValue: {
    fontSize: width * 0.04,
    color: "white",
    fontWeight: "700",
  },
  cardContainer: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "white",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: width * 0.035,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 16,
    color: "white",
    fontSize: width * 0.04,
  },
  rowContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: "#CCFF00",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  payButtonText: {
    color: "black",
    fontSize: width * 0.045,
    fontWeight: "700",
  },
  errorText: {
    color: "#FF4444",
    fontSize: width * 0.035,
    marginTop: -10,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default PaymentSubsScreen;