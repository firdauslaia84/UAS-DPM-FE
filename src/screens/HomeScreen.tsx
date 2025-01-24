import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import HeaderHome from "../components/HeaderHome";
import TabBar from "../components/TabBar";
import FeaturedContent, { FeaturedMovie } from "../components/FeaturedContent";
import TrendingSection from "../components/TrendingSection";
import ContinueWatchingSection from "../components/ContinueWatchingSection";
import ForYouSection from "../components/ForYouSection";
import MovieSection from "../components/MovieSection";
import API_URL from "../config/api";
import { Movie, ContinueWatchingItem, ImageMovie } from "../types";
import { getGenreName } from "../utils/genre";
import _ from "lodash";

const { height } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const imageMovie: ImageMovie = {
  carnageImage: require("../../assets/images/movie1.png"),
  spaceHero: require("../../assets/images/movie2.png"),
  redDoctors: require("../../assets/images/movie3.png"),
};

interface HomeScreenData {
  success: boolean;
  continueWatching: any[];
  trending: any[];
  forYou: any[];
  animeMovies: any[];
  dramaMovies: any[];
  popularSeries: any[];
  newMovies?: any[];
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { userId } = useAuth();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [data, setData] = useState<HomeScreenData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (userId) {
      fetchHomeData();
    }
  }, [userId]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [homeData, moviesData, tvShowsData] = await Promise.all([
        fetch(`${API_URL}/home/${userId}`).then((res) => res.json()),
        fetch(`${API_URL}/movies/tab-data/${userId}`).then((res) => res.json()),
        fetch(`${API_URL}/tvshows/tab-data/${userId}`).then((res) =>
          res.json()
        ),
      ]);

      if (homeData.success) {
        const combinedData = {
          ...homeData,
          trending: _.uniqBy(
            [
              ...(homeData.trending || []),
              ...(moviesData.trending || []),
              ...(tvShowsData.trending || []),
            ],
            (item) => `${item.id}-${item.title}`
          ),
          popularSeries: _.uniqBy(
            [...(tvShowsData.popular || []), ...(homeData.popularSeries || [])],
            (item) => `${item.id}-${item.title}`
          ),
          newMovies: _.uniqBy(
            [...(moviesData.newMovies || []), ...(tvShowsData.newShows || [])],
            (item) => `${item.id}-${item.title}`
          ),
          continueWatching: _.uniqBy(
            [
              ...(homeData.continueWatching || []),
              ...(moviesData.continueWatching || []),
              ...(tvShowsData.continueWatching || []),
            ],
            (item) => `${item.id}-${item.title}`
          ),
          animeMovies: _.uniqBy(
            [
              ...(homeData.animeMovies || []),
              ...(moviesData.trending?.slice(0, 5) || []),
            ],
            (item) => `${item.id}-${item.title}`
          ),
          dramaMovies: _.uniqBy(
            [
              ...(homeData.dramaMovies || []),
              ...(moviesData.popular?.slice(0, 5) || []),
            ],
            (item) => `${item.id}-${item.title}`
          ),
        };

        setData(combinedData);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

    const handleMoviePress = (
      id: string | number,
      type: "movie" | "tvshow"
    ) => {
      if (type === "movie") {
        navigation.navigate("MovieDetail", { id: id.toString() });
      } else {
        navigation.navigate("TvShowDetail", { id: id.toString() });
      }
    };

  const transformToMovie = (apiMovie: any, index: number): Movie => ({
    id: `${apiMovie.id}-${apiMovie.title || apiMovie.name}-${index}`,
    image: apiMovie.poster_path
      ? { uri: apiMovie.poster_path }
      : apiMovie.backdrop_path
      ? { uri: apiMovie.backdrop_path }
      : imageMovie.carnageImage,
    title: apiMovie.title || apiMovie.name,
    genres: apiMovie.genre_ids?.map(getGenreName) || [],
    type: apiMovie.name ? "tvshow" : "movie",
    vote_average: apiMovie.vote_average,
    overview: apiMovie.overview,
    release_date: apiMovie.release_date || apiMovie.first_air_date,
    backdrop_path: apiMovie.backdrop_path,
    poster_path: apiMovie.poster_path,
  });

  const transformToFeaturedMovie = (
    apiMovie: any,
    index: number
  ): FeaturedMovie => ({
    id: `${apiMovie.id}-${apiMovie.title || apiMovie.name}-${index}`,
    title: apiMovie.title || apiMovie.name,
    image: apiMovie.backdrop_path
      ? { uri: apiMovie.backdrop_path }
      : imageMovie.carnageImage,
    genres: apiMovie.genre_ids?.map(getGenreName) || [],
  });

  const transformToContinueWatching = (
    apiMovie: any,
    index: number
  ): ContinueWatchingItem => ({
    id: `${apiMovie.id}-${apiMovie.title || apiMovie.name}-${index}`,
    image: apiMovie.poster_path
      ? { uri: apiMovie.poster_path }
      : apiMovie.backdrop_path
      ? { uri: apiMovie.backdrop_path }
      : imageMovie.carnageImage,
    title: apiMovie.title || apiMovie.name,
    genres: apiMovie.genre_ids?.map(getGenreName) || [],
    type: apiMovie.name ? "tvshow" : "movie",
    vote_average: apiMovie.vote_average,
    overview: apiMovie.overview,
    release_date: apiMovie.release_date || apiMovie.first_air_date,
    progress: apiMovie.progress || "45 min left",
    backdrop_path: apiMovie.backdrop_path,
    poster_path: apiMovie.poster_path,
  });

  if (loading || !data) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4E6EE3" />
      </View>
    );
  }

  const featuredMovies = data.trending
    .slice(0, 3)
    .map((movie, index) => transformToFeaturedMovie(movie, index));

  const trendingMovies = data.trending.map((movie, index) =>
    transformToMovie(movie, index)
  );

  const continueWatchingItems = data.continueWatching.map((movie, index) =>
    transformToContinueWatching(movie, index)
  );

  const forYouMovies = data.forYou.map((movie, index) =>
    transformToMovie(movie, index)
  );

  const animeMovies = data.animeMovies.map((movie, index) =>
    transformToMovie(movie, index)
  );

  const dramaMovies = data.dramaMovies.map((movie, index) =>
    transformToMovie(movie, index)
  );

  const popularSeries = data.popularSeries.map((movie, index) =>
    transformToMovie(movie, index)
  );

  const newMovies = (data.newMovies || []).map((movie, index) =>
    transformToMovie(movie, index)
  );

  const createUniqueMovieList = <T extends Movie | ContinueWatchingItem>(
    movies: T[]
  ): T[] => {
    return _.uniqBy(movies, "id");
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderHome />
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        ref={scrollViewRef}
      >
        <View style={styles.featuredWrapper}>
          <FeaturedContent
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            scrollViewRef={scrollViewRef}
            featuredMovies={featuredMovies}
            activeTab={activeTab}
          />
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </View>

        {activeTab === "all" && (
          <>
            <TrendingSection
              movieList={createUniqueMovieList(trendingMovies.slice(0, 10))}
              onMoviePress={handleMoviePress}
            />
            <ContinueWatchingSection
              watchList={createUniqueMovieList(
                continueWatchingItems.slice(0, 10)
              )}
              onMoviePress={handleMoviePress}
            />
            <ForYouSection
              movieList={createUniqueMovieList(
                [...forYouMovies, ...trendingMovies].slice(0, 10)
              )}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="What to watch tonight"
              images={imageMovie}
              movieList={createUniqueMovieList(
                [...trendingMovies, ...popularSeries].slice(3, 13)
              )}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="New on MUXX"
              images={imageMovie}
              movieList={createUniqueMovieList(
                [...newMovies, ...trendingMovies].slice(0, 10)
              )}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="Action"
              images={imageMovie}
              movieList={createUniqueMovieList(trendingMovies.slice(0, 10))}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="Anime Collection"
              images={imageMovie}
              movieList={createUniqueMovieList(animeMovies.slice(0, 10))}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="Popular Series"
              images={imageMovie}
              movieList={createUniqueMovieList(popularSeries.slice(0, 10))}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="Drama Movies"
              images={imageMovie}
              movieList={createUniqueMovieList(dramaMovies.slice(0, 10))}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="Watch it again"
              images={imageMovie}
              movieList={createUniqueMovieList(
                continueWatchingItems.slice(0, 10)
              )}
              onMoviePress={handleMoviePress}
            />
          </>
        )}

        {activeTab === "tvshows" && (
          <>
            <TrendingSection
              movieList={createUniqueMovieList(
                [...popularSeries, ...trendingMovies]
                  .filter((m) => m.type === "tvshow")
                  .slice(0, 10)
              )}
              onMoviePress={handleMoviePress}
            />
            <ContinueWatchingSection
              watchList={createUniqueMovieList(
                continueWatchingItems
                  .filter((m) => m.type === "tvshow")
                  .slice(0, 10)
              )}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="Popular Series"
              images={imageMovie}
              movieList={createUniqueMovieList(
                popularSeries.filter((m) => m.type === "tvshow").slice(0, 10)
              )}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="New TV Shows"
              images={imageMovie}
              movieList={createUniqueMovieList(
                [...newMovies, ...trendingMovies]
                  .filter((m) => m.type === "tvshow")
                  .slice(0, 10)
              )}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="Drama Series"
              images={imageMovie}
              movieList={createUniqueMovieList(dramaMovies.slice(0, 10))}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="Action"
              images={imageMovie}
              movieList={createUniqueMovieList(trendingMovies.slice(0, 10))}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="Anime Series"
              images={imageMovie}
              movieList={createUniqueMovieList(animeMovies.slice(0, 10))}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="Watch it again"
              images={imageMovie}
              movieList={createUniqueMovieList(
                continueWatchingItems
                  .filter((m) => m.type === "tvshow")
                  .slice(0, 10)
              )}
              onMoviePress={handleMoviePress}
            />
          </>
        )}

        {activeTab === "movies" && (
          <>
            <TrendingSection
              movieList={createUniqueMovieList(
                [...trendingMovies, ...forYouMovies]
                  .filter((m) => m.type === "movie")
                  .slice(0, 10)
              )}
              onMoviePress={handleMoviePress}
            />
            <ContinueWatchingSection
              watchList={createUniqueMovieList(
                continueWatchingItems
                  .filter((m) => m.type === "movie")
                  .slice(0, 10)
              )}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="Popular Movies"
              images={imageMovie}
              movieList={createUniqueMovieList(
                [...trendingMovies, ...forYouMovies]
                  .filter((m) => m.type === "movie")
                  .slice(0, 10)
              )}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="New Releases"
              images={imageMovie}
              movieList={createUniqueMovieList(
                newMovies.filter((m) => m.type === "movie").slice(0, 10)
              )}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="Action"
              images={imageMovie}
              movieList={createUniqueMovieList(trendingMovies.slice(0, 10))}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="Drama Movies"
              images={imageMovie}
              movieList={createUniqueMovieList(dramaMovies.slice(0, 10))}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="Anime Movies"
              images={imageMovie}
              movieList={createUniqueMovieList(animeMovies.slice(0, 10))}
              onMoviePress={handleMoviePress}
            />
            <MovieSection
              title="Watch it again"
              images={imageMovie}
              movieList={createUniqueMovieList(
                continueWatchingItems
                  .filter((m) => m.type === "movie")
                  .slice(0, 10)
              )}
              onMoviePress={handleMoviePress}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030303",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingTop:
      Platform.OS === "ios" ? 70 : 84 + (StatusBar.currentHeight || 0),
  },
  featuredWrapper: {
    position: "relative",
    height: height * 0.65,
  },
});

export default HomeScreen;