import React from "react";
import {
  TouchableOpacity,
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Movie } from "../types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

const { width } = Dimensions.get("window");

interface MovieItemProps {
  movie: Movie;
  title: string;
  isWatchTonight?: boolean;
  onPress?: () => void;
}

type MovieNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MovieItem: React.FC<MovieItemProps> = ({ movie, isWatchTonight }) => {
  const navigation = useNavigation<MovieNavigationProp>();

  const handlePress = () => {
    if (movie.type === "tvshow") {
      navigation.navigate("TvShowDetail", { id: movie.id });
    } else {
      navigation.navigate("MovieDetail", { id: movie.id });
    }
  };

  return (
    <TouchableOpacity
      style={isWatchTonight ? styles.watchTonightItem : styles.movieItem}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={movie.image}
        style={isWatchTonight ? styles.watchTonightImage : styles.movieImage}
        resizeMode="cover"
      />
      {!isWatchTonight && movie.title && (
        <Text style={styles.movieTitle} numberOfLines={1}>
          {movie.title}
        </Text>
      )}
      {movie.vote_average && (
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{movie.vote_average.toFixed(1)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  movieItem: {
    marginRight: 12,
    width: width * 0.32,
  },
  movieImage: {
    width: "100%",
    height: width * 0.45,
    borderRadius: 8,
  },
  movieTitle: {
    color: "white",
    fontSize: width * 0.034,
    marginTop: 6,
    fontWeight: "500",
  },
  watchTonightItem: {
    marginRight: 20,
    width: width * 0.46,
    height: width * 0.36,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
    position: "relative",
  },
  watchTonightImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
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

export default MovieItem;