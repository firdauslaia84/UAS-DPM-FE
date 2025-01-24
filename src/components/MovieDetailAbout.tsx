import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MovieDetails } from "../types";

interface MovieAboutProps {
  movie: MovieDetails;
}

const MovieDetailAbout: React.FC<MovieAboutProps> = ({ movie }) => {
  return (
    <View style={styles.aboutContainer}>
      <Text style={styles.description}>{movie.description}</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Rating: {movie.rating}</Text>
        <Text style={styles.detailText}>
          Languages: {movie.languages.join(", ")}
        </Text>
        <Text style={styles.detailText}>Year: {movie.year}</Text>
        <Text style={styles.detailText}>Runtime: {movie.runtime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  aboutContainer: {
    padding: 16,
  },
  description: {
    color: "#fff",
    marginBottom: 30,
    lineHeight: 20,
  },
  detailsContainer: {
    gap: 8,
  },
  detailText: {
    color: "#fff",
  },
});

export default MovieDetailAbout;