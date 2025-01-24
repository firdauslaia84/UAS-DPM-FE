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

interface SimilarTvShow {
  id: string;
  image: ImageSourcePropType;
}

interface TvShowDetailSimilarProps {
  similarTvShow: SimilarTvShow[];
}

const TvShowDetailSimilar: React.FC<TvShowDetailSimilarProps> = ({
  similarTvShow,
}) => {
  const chunkedTvShows = similarTvShow.reduce(
    (resultArray: SimilarTvShow[][], item, index) => {
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
        {chunkedTvShows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((tvshow) => (
              <Image
                key={tvshow.id}
                source={tvshow.image}
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

export default TvShowDetailSimilar;