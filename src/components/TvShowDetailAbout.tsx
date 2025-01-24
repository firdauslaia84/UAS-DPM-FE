import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { TvShowDetails } from "../types";

interface TvShowAboutProps {
  tvshow: TvShowDetails;
}

const TvShowDetailAbout: React.FC<TvShowAboutProps> = ({ tvshow }) => {
  return (
    <View style={styles.aboutContainer}>
      <Text style={styles.description}>{tvshow.description}</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Rating: {tvshow.rating}</Text>
        <Text style={styles.detailText}>
          Languages: {tvshow.languages.join(", ")}
        </Text>
        <Text style={styles.detailText}>Year: {tvshow.year}</Text>
        <Text style={styles.detailText}>Runtime: {tvshow.runtime}</Text>
        <Text style={styles.detailText}>Director: {tvshow.Director}</Text>
        <Text style={styles.detailText}>Writer: {tvshow.Writer}</Text>
        <Text style={styles.detailText}>DOP: {tvshow.DOP}</Text>
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

export default TvShowDetailAbout;