import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList, MovieDetails } from "../types";
import VideoPlayer from "../components/VideoPlayer";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as ScreenOrientation from "expo-screen-orientation";
import API_URL from "../config/api";
import { useAuth } from "../context/AuthContext";
import { IQuality } from "../interfaces/streaming.interface";

type StreamingScreenRouteProp = RouteProp<RootStackParamList, "Streaming">;

const StreamingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<StreamingScreenRouteProp>();
  const { movieId, movieTitle } = route.params;
  const { userId } = useAuth();

  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<
    "360p" | "480p" | "720p" | "1080p"
  >("720p");
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamingUrl, setStreamingUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchMovieDetails();
    fetchAvailableQualities();

    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, [movieId]);

  useEffect(() => {
    if (selectedQuality) {
      fetchStreamingDetails();
    }
  }, [selectedQuality]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/movies/${movieId}`);
      if (response.data.success) {
        const movieData = response.data.movie;
        const transformedData: MovieDetails = {
          title: movieData.title,
          description: movieData.overview || "",
          rating: movieData.rating || "",
          languages: movieData.languages || [],
          year: movieData.year || 0,
          runtime: movieData.runtime || "",
          genres: movieData.genres || [],
          image: { uri: movieData.backdrop_path || movieData.poster_path },
        };
        setMovieDetails(transformedData);
      } else {
        setError("Movie not found");
      }
    } catch (err) {
      setError("Failed to load movie details");
    }
  };

const fetchAvailableQualities = async () => {
  try {
    const numericMovieId =
      typeof movieId === "string" ? parseInt(movieId) : movieId;

    const response = await axios.get(
      `${API_URL}/streaming/qualities/${numericMovieId}`
    );

    if (response.data.success) {
      setAvailableQualities(response.data.qualities);
    } else {
      setAvailableQualities(["720p"]);
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
    }
    setAvailableQualities(["720p"]);
  }
};

const fetchStreamingDetails = async () => {
  try {
    setLoading(true);
    setError(null);

    const numericMovieId =
      typeof movieId === "string" ? parseInt(movieId) : movieId;

    const response = await axios.get(`${API_URL}/streaming/stream`, {
      params: {
        movieId: numericMovieId,
        userId,
        quality: selectedQuality,
      },
    });

    if (response.data.success) {
      const { streamingUrl } = response.data.streamingDetails;
      if (!streamingUrl) {
        setError("No streaming URL available");
        return;
      }
      setStreamingUrl(streamingUrl);
    } else {
      setError(response.data.message || "Failed to load streaming details");
    }
  } catch (err) {
    setError("Failed to load streaming details");
  } finally {
    setLoading(false);
  }
};

  const handleQualityChange = (quality: "360p" | "480p" | "720p" | "1080p") => {
    setSelectedQuality(quality);
    setShowQualityModal(false);
  };

  const handleFullscreenChange = async (isFullscreen: boolean) => {
    setIsFullscreen(isFullscreen);
    if (isFullscreen) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    }
  };

    if (loading) {
      return (
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" color="#CCFF00" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchStreamingDetails}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={isFullscreen} />

      {!isFullscreen && (
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {movieTitle || movieDetails?.title || ""}
          </Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <View
        style={isFullscreen ? styles.fullscreenVideo : styles.videoContainer}
      >
        {streamingUrl && (
          <VideoPlayer
            movieId={movieId}
            userId={userId || ""}
            initialQuality={selectedQuality}
            streamingUrl={streamingUrl}
            navigation={navigation}
            onFullscreenChange={handleFullscreenChange}
          />
        )}

        {!isFullscreen && (
          <View style={styles.videoControls}>
            <TouchableOpacity
              onPress={() => setShowQualityModal(true)}
              style={styles.controlButton}
            >
              <Ionicons name="settings-outline" size={24} color="white" />
              <Text style={styles.controlText}>{selectedQuality}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal
        visible={showQualityModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQualityModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Quality</Text>
              <TouchableOpacity
                onPress={() => setShowQualityModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            {availableQualities.map((quality) => (
              <TouchableOpacity
                key={quality}
                style={[
                  styles.qualityOption,
                  selectedQuality === quality && styles.selectedOption,
                ]}
                onPress={() =>
                  handleQualityChange(
                    quality as "360p" | "480p" | "720p" | "1080p"
                  )
                }
              >
                <Text
                  style={[
                    styles.qualityText,
                    selectedQuality === quality && styles.selectedQualityText,
                  ]}
                >
                  {quality}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
  },
  fullscreenVideo: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  controlText: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 14,
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    padding: 10,
    backgroundColor: "#CCFF00",
    borderRadius: 5,
  },
  retryText: {
    color: "#000",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  qualityOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#333",
  },
  selectedOption: {
    backgroundColor: "#CCFF00",
  },
  qualityText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  selectedQualityText: {
    color: "#000",
  },
});

export default StreamingScreen;