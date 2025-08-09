import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import PantryCard from "./PantryCard";
import BottomDetailDrawer from "./BottomDetailDrawer";

const { height } = Dimensions.get("window");

export default function BottomDrawer({
  isVisible,
  onClose,
  entries,
  selectedPantry,
  setSelectedPantry,
}) {
  // --- Animation ---
  const translateY = useRef(new Animated.Value(height)).current;

  // --- State ---
  const [selectedCategory, setSelectedCategory] = useState(null);

  // --- Categories ---
  const categorySet = new Set();
  entries.forEach(item => {
    for (let i = 0; i <= 6; i++) { // To be changed when we refine supabase rows
      const category = item[`categories/${i}`];
      if (category !== "") {
        categorySet.add(category);
      }
    }
  });
  const uniqueCategories = Array.from(categorySet);

  // --- Filtered Pantries ---
  const filteredPantries = [];

  // --- Handlers ---
  const handleCardPress = (item) => {
    setSelectedPantry(item);
    console.log(`PantryCard clicked, Selected Pantry: ${item}`);
  };
  const handleFilterPress = (category) => {
    console.log(`Selected Category: ${category}`)
    setSelectedCategory(category)
  };

  // --- Animation Effect ---
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? height * 0.2 : height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  // --- Render ---
  return (
    <>
      {!selectedPantry && (
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFillObject}>
            <Animated.View
              style={[
                styles.drawer,
                { transform: [{ translateY }] },
              ]}
            >
              {/* Header */}
              <View style={styles.headerContainer}>
                <Image
                  style={styles.entriesImage}
                  source={require("../../assets/shelfHelpIcon.jpg")}

                />
                <View style={styles.textContainer}>
                  <Text style={styles.header}>Find Food Assistance</Text>
                  <Text style={styles.subheader}>Powered by ShelfHelp</Text>
                </View>
                {/* 
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>x</Text>
              </Pressable> 
              */}
              </View>

              {/* Category Filters */}
              <View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterContainer}
                >
                  {uniqueCategories.map((category, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.filterButton,
                        selectedCategory === category && styles.selectedFilter,
                      ]}
                      onPress={() =>
                        handleFilterPress(category)
                      }
                    >
                      <Text style={styles.filterText}>{category}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Pantry List */}
              <FlatList
                data={entries}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable onPress={() => handleCardPress(item)}>
                    <PantryCard pantry={item} />
                  </Pressable>
                )}
              />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
      <BottomDetailDrawer
        isVisible={!!selectedPantry}
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
    backgroundColor: "rgba(255, 255, 255, 1)",
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
    alignItems: "flex-start",
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
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    gap: 8,
  },
  filterButton: {
    backgroundColor: 'rgba(240, 240, 240, 1) ',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  selectedFilter: {
    backgroundColor: 'rgba(255, 209, 45, 1)',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
});