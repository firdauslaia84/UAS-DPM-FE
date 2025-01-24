import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

const { width } = Dimensions.get("window");

type NavigationProp = StackNavigationProp<RootStackParamList, "Main">;

interface ButtonGroupProps {
  activeTab: string;
  movieId?: string | number;
  movieTitle?: string;
  type?: "movie" | "tvshow";
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  activeTab,
  movieId,
  movieTitle,
  type = "movie",
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePlayPress = () => {
    if (!movieId) return;

    if (type === "tvshow") {
      navigation.navigate("TvShowDetail", { id: movieId });
    } else {
      navigation.navigate("Streaming", {
        movieId: movieId,
        movieTitle: movieTitle,
        type: type,
      });
    }
  };

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.playButton}
        onPress={handlePlayPress}
        activeOpacity={0.7}
      >
        <Icon name="play" size={20} color="black" />
        <Text style={styles.playButtonText}>Play</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton}>
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
  playButton: {
    flexDirection: "row",
    backgroundColor: "#CCFF00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#CCFF00",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  playButtonText: {
    color: "black",
    fontWeight: "800",
    marginLeft: 2,
    fontSize: width * 0.044,
  },
  addButton: {
    marginLeft: 12,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
  },
});

export default ButtonGroup;