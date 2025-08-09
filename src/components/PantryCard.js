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
    backgroundColor: 'rgba(255, 255, 255, 1) ',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
