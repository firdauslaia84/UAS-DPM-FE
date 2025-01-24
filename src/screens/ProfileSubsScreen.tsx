import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
} from "react-native";
import { ChevronLeft, History } from "lucide-react-native";
import { Play } from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

const { width } = Dimensions.get("window");

type ProfileSubsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProfileSubs"
>;

interface Props {
  navigation: ProfileSubsScreenNavigationProp;
}

const ProfileSubsScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const features = [
    "Unlimited ad-free Movies and TV Shows",
    "Watch in 4K",
    "Unlimited devices",
  ];

  const handleHistoryPress = () => {
    navigation.navigate("ProfileSubsPayment");
  };

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
        <Text style={styles.headerTitle}>Subscriptions</Text>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={handleHistoryPress}
        >
          <History color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity
          style={[
            styles.currentPlanCard,
            selectedPlan === "monthly" && styles.selectedPlan,
          ]}
          onPress={() => setSelectedPlan("monthly")}
        >
          <View style={styles.planLabel}>
            <Text style={styles.planLabelText}>Your plan</Text>
          </View>

          <Text style={styles.price}>
            IDR149.999
            <Text style={styles.period}>/mo</Text>
          </Text>

          <Text style={styles.cancelText}>Cancel at any time.</Text>

          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Play color="#CCFF00" size={20} fill="#CCFF00" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.yearlyPlanCard,
            selectedPlan === "yearly" && styles.selectedPlan,
          ]}
          onPress={() => setSelectedPlan("yearly")}
        >
          <Text style={styles.yearlyPrice}>
            IDR1.619.999
            <Text style={styles.period}>/y</Text>
          </Text>

          <Text style={styles.saveText}>
            With 1 year subscription save 19%.
          </Text>

          <TouchableOpacity
            style={[
              styles.subscribeButton,
              selectedPlan === "yearly" && styles.selectedButton,
            ]}
          >
            <Text
              style={[
                styles.subscribeButtonText,
                selectedPlan === "yearly" && styles.selectedButtonText,
              ]}
            >
              Yearly
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  backButton: {
    padding: 8,
  },
  historyButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: width * 0.05,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  currentPlanCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedPlan: {
    borderColor: "#CCFF00",
    borderWidth: 2,
  },
  planLabel: {
    position: "absolute",
    top: -15,
    alignSelf: "center",
    backgroundColor: "#CCFF00",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  planLabelText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  price: {
    color: "#FFFFFF",
    fontSize: width * 0.09,
    fontWeight: "bold",
    marginTop: 20,
  },
  yearlyPrice: {
    color: "#FFFFFF",
    fontSize: width * 0.09,
    fontWeight: "bold",
  },
  period: {
    color: "#808080",
    fontSize: width * 0.04,
  },
  cancelText: {
    color: "#808080",
    fontSize: width * 0.04,
    marginTop: 8,
    marginBottom: 24,
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    color: "#FFFFFF",
    fontSize: width * 0.045,
    fontWeight: "500",
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
  subscribeButtonText: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
  selectedButtonText: {
    color: "black",
  },
  cancelButton: {
    marginTop: 32,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#CCFF00",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
  yearlyPlanCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "transparent",
  },
  saveText: {
    color: "#808080",
    fontSize: width * 0.04,
    marginTop: 8,
    marginBottom: 24,
  },
});

export default ProfileSubsScreen;