import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Movie } from "../types/index";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

const { width } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


interface ForYouSectionProps {
  movieList: Movie[];
  onMoviePress: (id: string | number, type: "movie" | "tvshow") => void;
}

export const ForYouSection: React.FC<ForYouSectionProps> = ({ movieList }) => {
  const navigation = useNavigation<NavigationProp>();

  const handleMoviePress = (movie: Movie) => {
    if (movie.type === "tvshow") {
      navigation.navigate("TvShowDetail", { id: movie.id.toString() });
    } else {
      navigation.navigate("MovieDetail", { id: movie.id.toString() });
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>For you</Text>
      {movieList.length > 0 && (
        <TouchableOpacity
          style={styles.forYouContainer}
          onPress={() => handleMoviePress(movieList[0])}
          activeOpacity={0.7}
        >
          <Image
            source={movieList[0].image}
            style={styles.forYouImage}
            resizeMode="cover"
          />
          <View style={styles.overlay}>
            <Text style={styles.forYouTitle} numberOfLines={2}>
              {movieList[0].title}
            </Text>
            {movieList[0].genres && movieList[0].genres.length > 0 && (
              <Text style={styles.genres}>
                {movieList[0].genres.slice(0, 3).join(" • ")}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      )}
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
  forYouContainer: {
    width: "100%",
    height: width * 0.5,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
    position: "relative",
  },
  forYouImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  forYouTitle: {
    color: "white",
    fontSize: width * 0.05,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  genres: {
    color: "#CCCCCC",
    fontSize: width * 0.035,
    marginTop: 4,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default ForYouSection;