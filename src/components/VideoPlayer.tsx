import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import API_URL from "../config/api";

interface VideoPlayerProps {
  movieId: string | number;
  userId: string;
  initialQuality: "360p" | "480p" | "720p" | "1080p";
  streamingUrl: string;
  navigation: any;
  onFullscreenChange: (isFullscreen: boolean) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  movieId,
  userId,
  streamingUrl,
  onFullscreenChange,
}) => {
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<Video>(null);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (isPlaying) {
      progressInterval = setInterval(async () => {
        if (videoRef.current) {
          const status = await videoRef.current.getStatusAsync();
          if (status.isLoaded) {
            updateProgress(status.positionMillis / 1000);
          }
        }
      }, 10000);
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isPlaying]);

  const updateProgress = async (currentTime: number) => {
    try {
      await axios.post(`${API_URL}/streaming/progress`, {
        userId,
        movieId,
        currentTime,
        duration: duration / 1000,
      });
    } catch (error) {
    }
  };

  const togglePlay = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = async () => {
    const newFullscreenState = !isFullscreen;
    setIsFullscreen(newFullscreenState);
    onFullscreenChange(newFullscreenState);
  };

  const formatTime = (timeInMillis: number) => {
    const totalSeconds = Math.floor(timeInMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleVideoStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setStatus(status);
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis);
      setIsPlaying(status.isPlaying);
      setLoading(false);
    } else {
      // Handle error state
      if (status.error) {
        setError("Error playing video");
      }
    }
  };

  const handleSliderChange = async (value: number) => {
    if (videoRef.current) {
      try {
        await videoRef.current.setPositionAsync(value);
        setPosition(value);
      } catch (error) {
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={isFullscreen ? styles.fullscreenContainer : styles.container}>
      <Video
        ref={videoRef}
        style={isFullscreen ? styles.fullscreenVideo : styles.video}
        source={{ uri: streamingUrl }}
        useNativeControls={false}
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        onPlaybackStatusUpdate={handleVideoStatus}
        onLoadStart={() => setLoading(true)}
        onError={(error) => {
          setError("Error playing video");
          setLoading(false);
        }}
      />

      <View style={styles.controls}>
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Slider
            style={styles.progressBar}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#CCFF00"
            maximumTrackTintColor="#555555"
            thumbTintColor="#CCFF00"
          />
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={togglePlay} style={styles.controlButton}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={30}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleFullscreen}
            style={styles.controlButton}
          >
            <Ionicons
              name={isFullscreen ? "contract" : "expand"}
              size={30}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    height: 240,
    width: "100%",
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    height: "100%",
    width: "100%",
  },
  fullscreenVideo: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  progressBar: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  controlButton: {
    padding: 10,
  },
  errorText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 14,
  },
});

export default VideoPlayer;