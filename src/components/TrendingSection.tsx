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
import { Movie } from "../types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

const { width } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TrendingSectionProps {
  movieList: Movie[];
  onMoviePress: (id: string | number, type: "movie" | "tvshow") => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({ movieList }) => {
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
      <Text style={styles.sectionTitle}>Trending</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {movieList.map((movie) => (
          <TouchableOpacity
            key={movie.id}
            style={styles.trendingItem}
            onPress={() => handleMoviePress(movie)}
            activeOpacity={0.7}
          >
            <Image
              source={movie.image}
              style={styles.trendingImage}
              resizeMode="cover"
            />
            {movie.vote_average && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>
                  {movie.vote_average.toFixed(1)}
                </Text>
              </View>
            )}
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
  trendingItem: {
    marginRight: 12,
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  trendingImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: 12,
    padding: 4,
    minWidth: 32,
    alignItems: "center",
  },
  ratingText: {
    color: "#FFC107",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default TrendingSection;