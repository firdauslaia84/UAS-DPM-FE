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
import HeaderTvShow from "../components/HeaderTvShow";
import FeaturedTvShowDetail from "../components/FeaturedTvShowDetail";
import TvShowDetailAbout from "../components/TvShowDetailAbout";
import TvShowDetailEpisodes from "../components/TvShowDetailEpisodes";
import TvShowDetailSimilar from "../components/TvShowDetailSimilar";
import { TvShowDetails, Episode } from "../types";

const { height } = Dimensions.get("window");

type TvShowDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "TvShowDetail"
>;

interface ShowData {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  year: number;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number;
  vote_average: number;
  genres: Array<{ id: number; name: string }>;
  languages: string[];
  rating: string;
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
  crew: {
    creator?: Array<{ name: string }>;
    producers?: Array<{ name: string }>;
    cinematographers?: Array<{ name: string }>;
  };
}

interface FeaturedTvShowData
  extends Omit<TvShowDetails, "Director" | "Writer" | "DOP" | "genres"> {
  Director: string;
  Writer: string;
  DOP: string;
  genres: string[];
}

const TvShowDetailScreen: React.FC = () => {
  const route = useRoute<TvShowDetailScreenRouteProp>();
  const { id: tvShowId } = route.params;
  const [activeTab, setActiveTab] = useState<"about" | "episodes" | "similar">(
    "about"
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [tvShowData, setTvShowData] = useState<ShowData | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const fetchTVShowData = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const [showResponse, recommendationsResponse] = await Promise.all([
          axios.get(`${API_URL}/tvshows/${tvShowId}`),
          axios.get(`${API_URL}/tvshows/${tvShowId}/recommendations`),
        ]);

        if (showResponse.data.success) {
          setTvShowData(showResponse.data.tvShow);
          setRecommendations(recommendationsResponse.data.recommendations);

          if (showResponse.data.tvShow.number_of_seasons > 0) {
            const seasonResponse = await axios.get(
              `${API_URL}/tvshows/${tvShowId}/season/1`
            );
            setEpisodes(seasonResponse.data.season.episodes);
          }
        } else {
          setError("TV Show not found");
        }
      } catch (error) {
        setError("Failed to load TV show details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTVShowData();
  }, [tvShowId]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#CCFF00" />
      </View>
    );
  }

  if (error || !tvShowData) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error || "TV Show not found"}</Text>
      </View>
    );
  }

  const tvShowDetails: TvShowDetails = {
    title: tvShowData.name,
    description: tvShowData.overview,
    rating: tvShowData.rating,
    languages: tvShowData.languages,
    year: tvShowData.year,
    runtime: `${tvShowData.episode_run_time}min`,
    Director: tvShowData.crew?.creator?.[0]?.name || "N/A",
    Writer: tvShowData.crew?.producers?.[0]?.name || "N/A",
    DOP: tvShowData.crew?.cinematographers?.[0]?.name || "N/A",
    genres: tvShowData.genres.map((genre) => genre.name),
    image: { uri: tvShowData.backdrop_path || tvShowData.poster_path || "" },
  };

  const featuredTvShowData: FeaturedTvShowData = {
    id: tvShowData.id,
    title: tvShowData.name,
    description: tvShowData.overview,
    rating: tvShowData.rating,
    languages: tvShowData.languages,
    year: tvShowData.year,
    runtime: `${tvShowData.episode_run_time}min`,
    image: { uri: tvShowData.backdrop_path || tvShowData.poster_path || "" },
    Director: tvShowData.crew?.creator?.[0]?.name || "N/A",
    Writer: tvShowData.crew?.producers?.[0]?.name || "N/A",
    DOP: tvShowData.crew?.cinematographers?.[0]?.name || "N/A",
    genres: tvShowData.genres.map((genre) => genre.name),
  };

  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return <TvShowDetailAbout tvshow={tvShowDetails} />;
      case "episodes":
        return (
          <TvShowDetailEpisodes
            episodes={episodes.map((ep) => ({
              id: ep.id,
              title: ep.title,
              duration: `${tvShowData.episode_run_time}m`,
              thumbnail: { uri: ep.still_path || "" },
            }))}
          />
        );
      case "similar":
        return (
          <TvShowDetailSimilar
            similarTvShow={recommendations.map((show) => ({
              id: show.id.toString(),
              image: { uri: show.poster_path },
            }))}
          />
        );
      default:
        return null;
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
        <HeaderTvShow />
        <View style={styles.featuredWrapper}>
          <FeaturedTvShowDetail
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            scrollViewRef={scrollViewRef}
            featuredTvShows={[featuredTvShowData]}
            activeTab={activeTab}
          />
        </View>

        <View style={styles.tabWrapper}>
          <View style={styles.tabContainer}>
            {[
              { id: "about", label: "About" },
              { id: "episodes", label: "Episodes" },
              { id: "similar", label: "More like this" },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                onPress={() =>
                  setActiveTab(tab.id as "about" | "episodes" | "similar")
                }
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.id && styles.activeTabText,
                  ]}
                >
                  {tab.label}
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  scrollContent: {
    flexGrow: 1,
  },
  featuredWrapper: {
    height: height * 0.65,
    position: "relative",
  },
  contentContainer: {
    flex: 1,
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
});

export default TvShowDetailScreen;