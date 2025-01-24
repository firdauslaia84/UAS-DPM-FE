import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { Check, AlertCircle } from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type ProfileSubsPaymentScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProfileSubsPayment"
>;

interface Props {
  navigation: ProfileSubsPaymentScreenNavigationProp;
}

interface PaymentItem {
  month: string;
  year: number;
  amount: string;
  status: "success" | "pending" | "failed";
}

const ProfileSubsPaymentScreen: React.FC<Props> = ({ navigation }) => {
  const paymentHistory: PaymentItem[] = [
    {
      month: "January",
      year: 2025,
      amount: "IDR149.999",
      status: "success",
    },
    {
      month: "February",
      year: 2025,
      amount: "IDR149.999",
      status: "success",
    },
    {
      month: "March",
      year: 2025,
      amount: "IDR149.999",
      status: "failed",
    },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderStatusIcon = (status: PaymentItem["status"]) => {
    switch (status) {
      case "success":
        return <Check color="#32CD32" size={24} />;
      case "failed":
        return <AlertCircle color="#FF0000" size={24} />;
      case "pending":
        return <AlertCircle color="#FFA500" size={24} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ChevronLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment history</Text>
      </View>

      <ScrollView style={styles.content}>
        {paymentHistory.map((payment, index) => (
          <View
            key={`${payment.month}-${payment.year}`}
            style={[
              styles.paymentItem,
              index !== paymentHistory.length - 1 && styles.borderBottom,
            ]}
          >
            <Text
              style={styles.date}
            >{`${payment.month} ${payment.year}`}</Text>
            <View style={styles.rightContent}>
              <Text style={styles.amount}>{payment.amount}</Text>
              {renderStatusIcon(payment.status)}
            </View>
          </View>
        ))}
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
    padding: 16,
    paddingTop: 8,
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
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  borderBottom: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#333333",
  },
  date: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "400",
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center", 
    gap: 8,
  },
  amount: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "400",
    marginRight: 8,
  },
});

export default ProfileSubsPaymentScreen;