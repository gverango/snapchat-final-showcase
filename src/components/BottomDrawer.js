import React, { useEffect, useRef, useState, useMemo } from "react";
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
import PantryDetailCard from "./PantryDetailCard";

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

  // --- Memoized Categories ---
  const uniqueCategories = useMemo(() => {
    const categorySet = new Set();
    entries.forEach(item => {
      for (let i = 0; i <= 6; i++) {
        const category = item[`categories/${i}`];
        if (category && category.trim() !== "") {
          categorySet.add(category);
        }
      }
    });
    return Array.from(categorySet);
  }, [entries]);

  // --- Filtered Pantries ---
  const filteredPantries = selectedCategory
    ? entries.filter(pantry =>
        Object.keys(pantry).some(
          key => key.startsWith("categories/") && pantry[key] === selectedCategory
        )
      )
    : entries;

  // --- Handlers ---
  const handleCardPress = (item) => {
    setSelectedPantry(item);
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
                source={{
                  uri: "https://media.istockphoto.com/id/2150313780/vector/food-donation-outline-icon-box-with-food.jpg?s=612x612&w=0&k=20&c=wGzHLux3IWsArmzBQod9Jw9VAZklhofs_b4JlI8THDU=",
                }}
              />
              <View style={styles.textContainer}>
                <Text style={styles.header}>Find Food Assistance</Text>
                <Text style={styles.subheader}>Powered by Pantry Path</Text>
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
                      setSelectedCategory(prev =>
                        prev === category ? null : category
                      )
                    }
                  >
                    <Text style={styles.filterText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Pantry List */}
            <FlatList
              data={filteredPantries}
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

      {/* Pantry Detail Card - Modal for now */}
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
     color:'#333',
  },
});