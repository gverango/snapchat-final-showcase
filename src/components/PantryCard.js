import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PantryCard({ pantry }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{pantry.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
