import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  ScrollView,
} from "react-native";

interface CrewMember {
  role: string;
  name: string;
}

interface CastMember {
  id: string;
  name: string;
  character: string;
  image: ImageSourcePropType;
}

interface ProfileCastProps {
  cast: CastMember[];
  crew: CrewMember[];
}

const MovieDetailCast: React.FC<ProfileCastProps> = ({ cast, crew }) => {
  return (
    <View style={styles.castContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.castScrollContainer}
      >
        <View style={styles.castList}>
          {cast.map((member) => (
            <View key={member.id} style={styles.castMember}>
              <Image source={member.image} style={styles.castImage} />
              <Text style={styles.castName}>{member.name}</Text>
              <Text style={styles.characterName}>{member.character}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.crewContainer}>
        {crew.map((member, index) => (
          <View key={index} style={styles.crewMember}>
            <Text style={styles.crewRole}>{member.role}</Text>
            <Text style={styles.crewName}>{member.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  castContainer: {
    padding: 16,
  },
  castScrollContainer: {
    paddingRight: 16,
  },
  castList: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  castMember: {
    alignItems: "center",
    width: 100,
  },
  castImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  castName: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  characterName: {
    color: "#9ca3af",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
  },
  crewContainer: {
    gap: 12,
  },
  crewMember: {
    flexDirection: "row",
    alignItems: "center",
  },
  crewRole: {
    color: "#9ca3af",
    width: 80,
    fontSize: 14,
  },
  crewName: {
    color: "white",
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "700",
  },
});

export default MovieDetailCast;