import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ContinueWatchingItem } from "../types/index";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

const { width } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ContinueWatchingSectionProps {
  watchList: ContinueWatchingItem[];
  onMoviePress: (id: string | number, type: "movie" | "tvshow") => void;
}

export const ContinueWatchingSection: React.FC<ContinueWatchingSectionProps> = ({
  watchList,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handleMoviePress = (item: ContinueWatchingItem) => {
    if (item.type === "tvshow") {
      navigation.navigate("TvShowDetail", { id: item.id.toString() });
    } else {
      navigation.navigate("MovieDetail", { id: item.id.toString() });
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Continue watching</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {watchList.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.continueWatchingItem}
            onPress={() => handleMoviePress(item)}
            activeOpacity={0.7}
          >
            <Image
              source={item.image}
              style={styles.continueWatchingImage}
              resizeMode="cover"
            />
            <Text style={styles.continueWatchingTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.continueWatchingProgress}>
              {typeof item.progress === "number"
                ? `${Math.round(item.progress * 100)}%`
                : item.progress}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    color: "white",
    fontSize: width * 0.056,
    fontWeight: "800",
    marginBottom: 12,
  },
  continueWatchingItem: {
    marginRight: 12,
    width: width * 0.35,
  },
  continueWatchingImage: {
    width: "100%",
    height: width * 0.2,
    borderRadius: 8,
  },
  continueWatchingTitle: {
    color: "white",
    marginTop: 6,
    fontSize: width * 0.034,
    fontWeight: "500",
  },
  continueWatchingProgress: {
    color: "#AAAAAA",
    fontSize: width * 0.03,
    marginTop: 2,
  },
});

export default ContinueWatchingSection;