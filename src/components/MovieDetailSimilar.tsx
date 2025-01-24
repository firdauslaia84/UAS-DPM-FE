import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
} from "react-native";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 3;
const GAP_SIZE = 16;
const PADDING_HORIZONTAL = 16;
const IMAGE_WIDTH =
  (width - PADDING_HORIZONTAL * 2 - GAP_SIZE * (COLUMN_COUNT - 1)) /
  COLUMN_COUNT;

interface SimilarMovie {
  id: string;
  image: ImageSourcePropType;
}

interface MovieDetailSimilarProps {
  similarMovies: SimilarMovie[];
}

const MovieDetailSimilar: React.FC<MovieDetailSimilarProps> = ({
  similarMovies,
}) => {
  const chunkedMovies = similarMovies.reduce(
    (resultArray: SimilarMovie[][], item, index) => {
      const chunkIndex = Math.floor(index / COLUMN_COUNT);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }

      resultArray[chunkIndex].push(item);
      return resultArray;
    },
    []
  );

  return (
    <View style={styles.similarContainer}>
      <View style={styles.gridContainer}>
        {chunkedMovies.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((movie) => (
              <Image
                key={movie.id}
                source={movie.image}
                style={styles.similarImage}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  similarContainer: {
    padding: PADDING_HORIZONTAL,
    paddingVertical: 13,
  },
  gridContainer: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: GAP_SIZE,
    gap: GAP_SIZE,
  },
  similarImage: {
    width: IMAGE_WIDTH,
    height: 180,
    borderRadius: 13,
  },
});

export default MovieDetailSimilar;