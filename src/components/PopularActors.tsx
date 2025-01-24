import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { ImageCast } from "../types";

interface Actor {
  id: string;
  name: string;
  image: ImageCast[keyof ImageCast];
}

interface PopularActorsProps {
  actors: Actor[];
}

const PopularActors: React.FC<PopularActorsProps> = ({ actors }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular actors</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {actors.map((actor) => (
          <View key={actor.id} style={styles.actorContainer}>
            <Image source={actor.image} style={styles.actorImage} />
            <Text style={styles.actorName}>{actor.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  scrollView: {
    flexDirection: "row",
  },
  actorContainer: {
    marginRight: 16,
    alignItems: "center",
  },
  actorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  actorName: {
    color: "#fff",
    marginTop: 8,
    fontSize: 14,
  },
});

export default PopularActors;