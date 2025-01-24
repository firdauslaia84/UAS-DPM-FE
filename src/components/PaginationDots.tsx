import React from "react";
import { View, StyleSheet } from "react-native";

interface PaginationDotsProps {
  activeIndex: number;
  total: number;
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({
  activeIndex,
  total,
}) => {
  return (
    <View style={styles.paginationContainer}>
      {Array(total)
        .fill(0)
        .map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    position: "relative",
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 4,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ffffff",
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: "#CCFF00",
    width: 18,
  },
});

export default PaginationDots;