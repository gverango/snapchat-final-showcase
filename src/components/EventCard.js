import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function EventCard({ event }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{event}</Text>
    </View>
  );
}
