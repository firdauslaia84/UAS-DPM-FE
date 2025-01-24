import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";
import API_URL from "../config/api";

const { width } = Dimensions.get("window");

type SubscriptionScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

interface SubscriptionData {
  id: string;
  price: number;
  planType: "monthly" | "yearly";
}

type Props = {
  navigation: SubscriptionScreenNavigationProp;
};

const SubscriptionScreen = ({ navigation }: Props) => {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<"monthly" | "yearly" | null>(
    null
  );

  const handleSubscribe = async (planType: "monthly" | "yearly") => {
    try {
      setLoadingPlan(planType);
      const response = await fetch(`${API_URL}/subscriptions/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to create subscription");
      }

      navigation.navigate("PaymentSubs", {
        subscriptionId: data.subscription.id,
        amount: data.subscription.price,
        planType,
      });
    } catch (error: any) {
      Alert.alert(
        "Subscription Error",
        error.message || "Failed to create subscription"
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  const renderLoadingState = (planType: "monthly" | "yearly") => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator color="#000000" />
      <Text
        style={[
          styles.loadingText,
          selectedPlan === planType && styles.selectedButtonText,
        ]}
      >
        Processing
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscriptions</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={[
            styles.planCard,
            selectedPlan === "monthly" && styles.selectedPlan,
          ]}
          onPress={() => {
            setSelectedPlan("monthly");
            handleSubscribe("monthly");
          }}
        >
          <View>
            <Text style={styles.priceText}>
              IDR149.999
              <Text style={styles.periodText}>/mo</Text>
            </Text>
            <Text style={styles.cancelText}>Cancel at any time.</Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <View style={styles.bulletPoint} />
              <Text style={styles.featureText}>
                Unlimited ad-free Movies and TV Shows
              </Text>
            </View>
            <View style={styles.featureRow}>
              <View style={styles.bulletPoint} />
              <Text style={styles.featureText}>Watch in 4K</Text>
            </View>
            <View style={styles.featureRow}>
              <View style={styles.bulletPoint} />
              <Text style={styles.featureText}>Unlimited devices</Text>
            </View>
          </View>

          <View
            style={[
              styles.subscribeButton,
              selectedPlan === "monthly" && styles.selectedButton,
              loading && styles.disabledButton,
            ]}
          >
            <Text
              style={[
                styles.subscribeButtonText,
                selectedPlan === "monthly" && styles.selectedButtonText,
              ]}
            >
              {loadingPlan === "monthly"
                ? renderLoadingState("monthly")
                : "Monthly"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.planCard,
            selectedPlan === "yearly" && styles.selectedPlan,
          ]}
          onPress={() => {
            setSelectedPlan("yearly");
            handleSubscribe("yearly");
          }}
        >
          <View>
            <Text style={styles.priceText}>
              IDR1.619.999
              <Text style={styles.periodText}>/y</Text>
            </Text>
            <Text style={styles.cancelText}>
              With 1 year subscription save 10%.
            </Text>
          </View>

          <View
            style={[
              styles.subscribeButton,
              selectedPlan === "yearly" && styles.selectedButton,
              loading && styles.disabledButton,
            ]}
          >
            <Text
              style={[
                styles.subscribeButtonText,
                selectedPlan === "yearly" && styles.selectedButtonText,
              ]}
            >
              {loadingPlan === "yearly"
                ? renderLoadingState("yearly")
                : "Yearly"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: width * 0.045,
    fontWeight: "700",
    color: "white",
  },
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
    paddingHorizontal: 24,
    gap: 16,
  },
  planCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  selectedPlan: {
    borderColor: "#CCFF00",
    borderWidth: 2,
  },
  priceText: {
    fontSize: width * 0.09,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  periodText: {
    fontSize: width * 0.04,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "700",
  },
  cancelText: {
    fontSize: width * 0.04,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 24,
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    backgroundColor: "#CCFF00",
    borderRadius: 4,
  },
  featureText: {
    fontSize: width * 0.045,
    color: "white",
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: "transparent",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  selectedButton: {
    backgroundColor: "#CCFF00",
    borderColor: "#CCFF00",
  },
  disabledButton: {
    opacity: 0.5,
  },
  subscribeButtonText: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "700",
  },
  selectedButtonText: {
    color: "black",
  },
});

export default SubscriptionScreen;