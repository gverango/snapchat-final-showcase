import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import PantryDetailCard from "./PantryDetailCard";
const { height } = Dimensions.get("window");

export default function BottomDrawer({ isVisible, onClose, entries }) {
  const translateY = useRef(new Animated.Value(height)).current;
  const [selectedPantry, setSelectedPantry] = useState(null);

  const handleCardPress = (item) => {
    setSelectedPantry(item);
  };

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? height * 0.2 : height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <>
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={StyleSheet.absoluteFillObject}>
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.headerContainer}>
            <Image
              style={styles.entriesImage}
              source={{
                uri: "https://media.istockphoto.com/id/2150313780/vector/food-donation-outline-icon-box-with-food.jpg?s=612x612&w=0&k=20&c=wGzHLux3IWsArmzBQod9Jw9VAZklhofs_b4JlI8THDU=",
              }}
            />
            <View style={styles.textContainer}>
              <Text style={styles.header}>Find Food Assistance</Text>
              <Text style={styles.subheader}>Powered by Pantry Path</Text>
            </View>
            {/* <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>x</Text>
            </Pressable> */}
          </View>
          <FlatList
              data={entries}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleCardPress(item)}>
                  <View style={styles.card}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                  </View>
                </Pressable>
              )}
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>

      <PantryDetailCard
        visible={!!selectedPantry}
        pantry={selectedPantry}
        onClose={() => setSelectedPantry(null)}
      />
    </>
  );
}
const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.6,
    backgroundColor: "rgba(255, 255, 170, 1)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-start", // aligns image with top of text block
    marginBottom: 10,
  },
  entriesImage: {
    width: 50,
    height: 50,
    marginRight: 8,
    borderRadius: 25,
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 2,
  },
  subheader: {
    fontSize: 14,
    color: "#666",
  },
  closeButton: {
    marginLeft: 'auto',
    backgroundColor: "#f2f2f2",
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 100,
    marginLeft: 100,
    marginTop: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
  },
  description: {
    marginTop: 4,
  },
});
