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
                  style={styles.shelfHelpIcon}
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
                        styles.filterChip,
                        selectedCategory === category && styles.selectedChip,
                      ]}
                      onPress={() => handleFilterPress(category)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedCategory === category && styles.selectedChipText,
                        ]}
                      >
                        {category}
                      </Text>
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
    height: height * 0.65,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 12,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  shelfHelpIcon: {
    width: 52,
    height: 52,
    marginRight: 10,
    borderRadius: 26,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  subheader: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  // Category chip container
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: "#EDEEEF",
    borderColor: "#EDEEEF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#646567",
  },
  selectedChip: {
    backgroundColor: "#3da77e",
    borderColor: "#3da77e",
  },
  selectedChipText: {
    color: "white",
    fontWeight: "700",
  },

});
