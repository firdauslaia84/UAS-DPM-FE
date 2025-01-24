import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={20} color="#fff" />
        <TextInput
          style={styles.searchInput}
          placeholder="Movies, TV Shows..."
          placeholderTextColor="#666"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      <TouchableOpacity>
        <Ionicons name="options-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 18,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 17,
  },
});

export default SearchBar;