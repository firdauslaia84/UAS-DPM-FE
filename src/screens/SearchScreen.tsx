import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import axios from "axios";
import API_URL from "../config/api";
import HeaderSearch from "../components/HeaderSearch";
import SearchBar from "../components/SearchBar";
import PopularActors from "../components/PopularActors";
import RecommendedMovies from "../components/RecommendedMovies";
import { Movie } from "../types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SearchResponse {
  success: boolean;
  results?: any[];
  popularActors?: any[];
  recommended?: Movie[];
}

const SearchScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMoviePress = (id: number) => {
    navigation.navigate("MovieDetail", { id: id.toString() });
  };

  const searchContent = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_URL}/movies/search?query=${encodeURIComponent(query)}`
      );
      setSearchResults(response.data);
    } catch (err) {
      setError("Failed to fetch search results");
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery) {
        searchContent(searchQuery);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const NoResultsView = () => (
    <View style={styles.noResults}>
      <Text style={styles.noResultsText}>No results found</Text>
      <Text style={styles.noResultsSubText}>
        Try searching with different keywords
      </Text>
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (searchQuery && searchResults?.results?.length === 0) {
      return <NoResultsView />;
    }

    if (searchResults?.results) {
      return (
        <View style={styles.resultsContainer}>
          {searchResults.results.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              style={styles.resultItem}
              onPress={() => handleMoviePress(item.id)}
              activeOpacity={0.7}
            >
              {item.poster_path && (
                <Image
                  source={{ uri: item.poster_path }}
                  style={styles.posterImage}
                />
              )}
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.title || item.name}</Text>
                {item.release_date && (
                  <Text style={styles.itemSubtitle}>
                    {new Date(item.release_date).getFullYear()}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return (
      <>
        {searchResults?.popularActors && (
          <PopularActors actors={searchResults.popularActors} />
        )}
        {searchResults?.recommended && (
          <RecommendedMovies movies={searchResults.recommended} />
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderSearch />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          {renderContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
  },
  noResults: {
    alignItems: "center",
    paddingTop: 40,
  },
  noResultsText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  noResultsSubText: {
    color: "#999",
    fontSize: 14,
    marginTop: 8,
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    overflow: "hidden",
  },
  posterImage: {
    width: 80,
    height: 120,
  },
  itemDetails: {
    flex: 1,
    padding: 12,
  },
  itemTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  itemSubtitle: {
    color: "#999",
    fontSize: 14,
    marginTop: 4,
  },
});

export default SearchScreen;