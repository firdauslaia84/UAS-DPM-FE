import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { ImageMovie, Movie, ContinueWatchingItem } from "../types/index";
import MovieItem from "./MovieItem";
import _ from "lodash";

const { width } = Dimensions.get("window");

interface MovieSectionProps {
  title: string;
  images: ImageMovie;
  movieList: Movie[] | ContinueWatchingItem[];
  onMoviePress: (id: string | number, type: "movie" | "tvshow") => void;
}

export const MovieSection: React.FC<MovieSectionProps> = ({
  title,
  images,
  movieList,
  onMoviePress,
}) => {
  const createUniqueMovieList = <T extends Movie | ContinueWatchingItem>(
    movies: T[]
  ): T[] => {
    return _.uniqBy(movies, "id");
  };

  const uniqueMovieList = movieList ? createUniqueMovieList(movieList) : null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {uniqueMovieList
          ? uniqueMovieList.map((movie, index) => (
              <MovieItem
                key={`${movie.id}-${movie.type}-${index}`}
                movie={movie}
                title={title}
                isWatchTonight={title === "What to watch tonight"}
                onPress={() => onMoviePress(movie.id, movie.type || "movie")}
              />
            ))
          : [images.carnageImage, images.redDoctors, images.spaceHero].map(
              (image, index) => (
                <MovieItem
                  key={`fallback-${index}`}
                  movie={{
                    id: index,
                    image: image,
                    title: "",
                    overview: "",
                    release_date: "",
                  }}
                  title={title}
                  isWatchTonight={title === "What to watch tonight"}
                />
              )
            )}
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
});

export default MovieSection;