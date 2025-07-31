import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import EventCard from "./EventCard";

export default function BottomDrawer({ isVisible, onClose, events }) {
  if (!isVisible) return null;

  return (
    <View style={styles.drawer}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <EventCard event="Test" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: { 
    backgroundColor: "rgb(255,0,0)", padding: 20, flex: 1 
  },
 });
