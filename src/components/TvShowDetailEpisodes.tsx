import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Episode } from "../types";

interface EpisodeCardProps {
  episode: Episode;
  onPlayPress?: (episode: Episode) => void;
  onDownloadPress?: (episode: Episode) => void;
}

interface TvShowDetailEpisodesProps {
  episodes: Episode[];
  onEpisodePress?: (episode: Episode) => void;
  onDownloadPress?: (episode: Episode) => void;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  onPlayPress,
  onDownloadPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.episodeCard}
      onPress={() => onPlayPress?.(episode)}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={episode.thumbnail} style={styles.thumbnail} />
        <View style={styles.playButton}>
          <Ionicons name="play" size={16} color="white" />
        </View>
      </View>
      <View style={styles.episodeInfo}>
        <Text
          style={styles.episodeTitle}
        >{`${episode.id}. ${episode.title}`}</Text>
        <Text style={styles.duration}>{episode.duration}</Text>
      </View>
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => onDownloadPress?.(episode)}
      >
        <Ionicons name="download-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const TvShowDetailEpisodes: React.FC<TvShowDetailEpisodesProps> = ({
  episodes,
  onEpisodePress,
  onDownloadPress,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<string>("Season 1");

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.seasonSelector}>
        <Text style={styles.seasonText}>{selectedSeason}</Text>
        <Ionicons name="chevron-down" size={24} color="#fff" />
      </TouchableOpacity>

      <ScrollView style={styles.episodesList}>
        {episodes.map((episode) => (
          <EpisodeCard
            key={episode.id}
            episode={episode}
            onPlayPress={onEpisodePress}
            onDownloadPress={onDownloadPress}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  seasonSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  seasonText: {
    color: "#fff",
    fontSize: 16,
  },
  episodesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  episodeCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  thumbnailContainer: {
    position: "relative",
    marginRight: 12,
  },
  thumbnail: {
    width: 120,
    height: 68,
    borderRadius: 4,
  },
  playButton: {
    position: "absolute",
    left: 8,
    bottom: 8,
    width: 24,
    height: 24,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },
  duration: {
    color: "#999",
    fontSize: 14,
  },
  downloadButton: {
    padding: 8,
  },
});

export default TvShowDetailEpisodes;