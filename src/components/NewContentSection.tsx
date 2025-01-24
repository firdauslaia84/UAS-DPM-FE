import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ImageMovie } from "../types/index";

const { width } = Dimensions.get("window");

interface NewContentSectionProps {
  images: ImageMovie;
}

export const NewContentSection: React.FC<NewContentSectionProps> = ({
  images,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.newBadgeContainer}>
        <Text style={styles.sectionTitle}>New on MUXX</Text>
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.newContentContainer}>
        <Image
          source={images.redDoctors}
          style={styles.newContentImage}
          resizeMode="cover"
        />
        <View style={styles.newContentInfo}>
          <Text style={styles.newContentTitle}>Red Doctors</Text>
          <Text style={styles.newContentDescription}>
            Exploration docuseries in the '60s and '70s with two back-to-back
            cult films
          </Text>
          <TouchableOpacity style={styles.watchNowButton}>
            <Text style={styles.watchNowText}>Watch Now</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
  newBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  newBadge: {
    backgroundColor: "#4E6EE3",
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 13,
    marginLeft: 17,
    marginTop: -16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  newBadgeText: {
    color: "white",
    fontSize: width * 0.034,
    fontWeight: "600",
  },
  newContentContainer: {
    backgroundColor: "#141414",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  newContentImage: {
    width: "100%",
    height: width * 0.5,
  },
  newContentInfo: {
    padding: 16,
  },
  newContentTitle: {
    color: "white",
    fontSize: width * 0.042,
    fontWeight: "600",
    marginBottom: 8,
  },
  newContentDescription: {
    color: "#EEEEEE",
    fontSize: width * 0.034,
    marginBottom: 16,
    lineHeight: width * 0.045,
  },
  watchNowButton: {
    backgroundColor: "#4E6EE3",
    padding: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  watchNowText: {
    color: "white",
    fontWeight: "600",
    fontSize: width * 0.038,
  },
});

export default NewContentSection;