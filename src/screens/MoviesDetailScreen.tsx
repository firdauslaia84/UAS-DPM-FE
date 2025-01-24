import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import axios from "axios";
import API_URL from "../config/api";
import HeaderMovie from "../components/HeaderMovie";
import FeaturedMovieDetail from "../components/FeaturedMovieDetail";
import MovieDetailAbout from "../components/MovieDetailAbout";
import MovieDetailCast from "../components/MovieDetailCast";
import MovieDetailSimilar from "../components/MovieDetailSimilar";

const { height } = Dimensions.get("window");

type MovieDetailScreenRouteProp = RouteProp<RootStackParamList, "MovieDetail">;

const MovieDetailScreen = () => {
  const route = useRoute<MovieDetailScreenRouteProp>();
  const { id } = route.params;
  const [activeTab, setActiveTab] = useState<"about" | "cast" | "similar">(
    "about"
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [movieDetail, setMovieDetail] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setError(null);
        setIsLoading(true);

        const [movieResponse, recommendationsResponse] = await Promise.all([
          axios.get(`${API_URL}/movies/${id}`),
          axios.get(`${API_URL}/movies/${id}/recommendations`),
        ]);

        if (movieResponse.data.success) {
          setMovieDetail(movieResponse.data.movie);
          setRecommendations(recommendationsResponse.data.recommendations);
        } else {
          setError("Movie not found");
        }
      } catch (error) {
        setError("Failed to load movie details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#CCFF00" />
      </View>
    );
  }

    if (error || !movieDetail) {
      return (
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.errorText}>{error || "Movie not found"}</Text>
        </View>
      );
    }

  const featuredMovie = {
    id: movieDetail.id,
    title: movieDetail.title,
    description: movieDetail.overview,
    rating: movieDetail.rating,
    languages: movieDetail.languages,
    year: movieDetail.year,
    runtime: movieDetail.runtime_formatted,
    genres: movieDetail.genres.map((g: any) => g.name),
    image: { uri: movieDetail.backdrop_path || movieDetail.poster_path },
  };

  const castData = movieDetail.cast.map((member: any) => ({
    id: member.id.toString(),
    name: member.name,
    character: member.character,
    image: { uri: member.profile_path },
  }));

  const crewData = [
    { role: "Director", name: movieDetail.crew.director?.name || "N/A" },
    { role: "Writer", name: movieDetail.crew.writer?.[0]?.name || "N/A" },
    { role: "DOP", name: movieDetail.crew.dop?.name || "N/A" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return <MovieDetailAbout movie={featuredMovie} />;
      case "cast":
        return <MovieDetailCast cast={castData} crew={crewData} />;
      case "similar":
        return (
          <MovieDetailSimilar
            similarMovies={recommendations.map((show) => ({
              id: show.id.toString(),
              image: { uri: show.poster_path },
            }))}
          />
        );
      default:
        return <MovieDetailAbout movie={featuredMovie} />;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]}
        contentContainerStyle={styles.scrollContent}
      >
        <HeaderMovie />
        <FeaturedMovieDetail
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          scrollViewRef={scrollViewRef}
          featuredMovies={[featuredMovie]}
          activeTab={activeTab}
        />

        <View style={styles.tabWrapper}>
          <View style={styles.tabContainer}>
            {["about", "cast", "similar"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() =>
                  setActiveTab(tab as "about" | "cast" | "similar")
                }
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab === "similar"
                    ? "More like this"
                    : tab === "cast"
                    ? "Cast & Crew"
                    : "About"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.contentContainer}>{renderContent()}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 20,
  },
  tabWrapper: {
    backgroundColor: "rgba(0,0,0,0.9)",
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "#CCFF00",
  },
  tabText: {
    color: "#ffff",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },
  activeTabText: {
    color: "#000000",
    fontWeight: "900",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default MovieDetailScreen;