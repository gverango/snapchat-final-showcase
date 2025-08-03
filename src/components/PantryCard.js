import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PantryCard({ pantry }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{pantry.title}</Text>
      <Text style={styles.description}>{pantry.organizer}</Text>
      <Text style={styles.address}>{pantry.address}</Text>

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
  description: {
    fontSize: 14,
    color: "#666",
  },
  organizer: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#888",  
  },
  address: {
    fontSize: 12,
    color: "#999",
  },  
});
