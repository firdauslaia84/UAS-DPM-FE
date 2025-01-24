import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { LinearGradient } from "expo-linear-gradient";
import GenreList from "./GenreList";
import ButtonGroup from "./ButtonGroup";
import PaginationDots from "./PaginationDots";
import { MovieDetails as MovieDetailsType } from "../types/index";

const { width, height } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ExtendedMovieDetails extends MovieDetailsType {
  id?: string | number;
}

interface FeaturedMovieDetailProps {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  scrollViewRef: React.RefObject<ScrollView>;
  featuredMovies: ExtendedMovieDetails[];
  activeTab: string;
}

export const FeaturedMovieDetail: React.FC<FeaturedMovieDetailProps> = ({
  activeIndex,
  setActiveIndex,
  scrollViewRef,
  featuredMovies,
  activeTab,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handleMoviePress = (movie: ExtendedMovieDetails) => {
    if (movie.id) {
      navigation.navigate("MovieDetail", { id: movie.id.toString() });
    }
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffset / width + 0.5);

    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: activeIndex * width,
        animated: false,
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={32}
        decelerationRate={0.992}
        removeClippedSubviews={true}
        overScrollMode="never"
        bounces={false}
        snapToInterval={width}
        snapToAlignment="center"
        style={styles.scrollView}
      >
        {featuredMovies.map((movie, index) => (
          <TouchableOpacity
            key={index}
            style={styles.featuredContainer}
            onPress={() => handleMoviePress(movie)}
            activeOpacity={0.9}
          >
            <Image
              source={movie.image}
              style={styles.featuredImage}
              resizeMode="cover"
            />
            <LinearGradient
              style={styles.featuredGradient}
              colors={[
                "transparent",
                "rgba(3,3,3,0.2)",
                "rgba(3,3,3,0.4)",
                "rgba(3,3,3,0.6)",
                "rgba(3,3,3,0.8)",
                "rgba(3,3,3,0.9)",
                "rgba(3,3,3,0.95)",
                "#030303",
              ]}
              locations={[0, 0.3, 0.4, 0.5, 0.6, 0.75, 0.85, 1]}
            />
            <View style={styles.featuredInfo}>
              <Text style={styles.featuredTitle}>{movie.title}</Text>
              <GenreList genres={movie.genres || []} />
              <ButtonGroup
                activeTab={activeTab}
                movieId={movie.id?.toString()}
                type="movie"
              />
              <PaginationDots
                activeIndex={activeIndex}
                total={featuredMovies.length}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.65,
    position: "relative",
  },
  scrollView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  featuredContainer: {
    width: width,
    height: "100%",
    position: "relative",
    paddingHorizontal: 16,
  },
  featuredImage: {
    width: "95%",
    height: "95%",
    position: "absolute",
    alignSelf: "center",
    borderRadius: 12,
  },
  featuredGradient: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "5%",
    right: "5%",
    height: "95%",
    zIndex: 2,
    borderRadius: 12,
  },
  featuredInfo: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    padding: 20,
    zIndex: 3,
  },
  featuredTitle: {
    color: "white",
    fontSize: width * 0.11,
    fontWeight: "800",
    marginBottom: 12,
    fontFamily: "serif",
    letterSpacing: 2,
    lineHeight: width * 0.125,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
});

export default FeaturedMovieDetail;