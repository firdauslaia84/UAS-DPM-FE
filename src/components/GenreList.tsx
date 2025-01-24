import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface GenreListProps {
  genres: string[];
}

export const GenreList: React.FC<GenreListProps> = ({ genres }) => (
  <View style={styles.genreContainer}>
    {genres.map((genre, idx) => (
      <React.Fragment key={idx}>
        <Text style={styles.genreText}>{genre}</Text>
        {idx < genres.length - 1 && <Text style={styles.genreText}>•</Text>}
      </React.Fragment>
    ))}
  </View>
);

const styles = StyleSheet.create({
  genreContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  genreText: {
    color: "white",
    marginRight: 16,
    fontSize: width * 0.03,
    opacity: 0.95,
    fontWeight: "600",
  },
});

export default GenreList;