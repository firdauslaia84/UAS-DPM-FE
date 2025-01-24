import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Movie } from "../types";

interface RecommendedMoviesProps {
  movies: Movie[];
}

const { width } = Dimensions.get("window");
const movieWidth = (width - (16 * 2 + 16 * 2)) / 3;

const RecommendedMovies: React.FC<RecommendedMoviesProps> = ({ movies }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended</Text>
      <View style={styles.moviesGrid}>
        {movies.map((movie) => (
          <View key={movie.title} style={styles.movieContainer}>
            <Image source={movie.image} style={styles.movieImage} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  moviesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "flex-start",
  },
  movieContainer: {
    width: movieWidth,
  },
  movieImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
  },
});

export default RecommendedMovies;