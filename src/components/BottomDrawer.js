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
  const [openNowFilter, setOpenNowFilter] = useState(false);
  const [maxDistance, setMaxDistance] = useState(null);

  // --- User Location (static for now) ---
  const userLocation = {
    latitude: 34.0190324,
    longitude: -118.4552004
  };

  // --- Categories Extraction ---
  const categorySet = new Set();
  entries.forEach(item => {
    for (let i = 0; i <= 3; i++) { // To be changed when we refine supabase rows
      const category = item[`categories/${i}`];
      if (category !== "") {
        categorySet.add(category);
      }
    }
  });
  const uniqueCategories = Array.from(categorySet);

  // --- Helper: Is Pantry Open Now ---
  function isOpenNow(hours) {
    if (!hours) return false;
    const days = [
      "sunday", "monday", "tuesday", "wednesday",
      "thursday", "friday", "saturday"
    ];
    const now = new Date();
    const today = days[now.getDay()];
    const todayHours = hours[today];
    if (!todayHours) return false; // closed today
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = parseInt(todayHours.open.split(":")[0]) * 60 + parseInt(todayHours.open.split(":")[1]);
    const closeMinutes = parseInt(todayHours.close.split(":")[0]) * 60 + parseInt(todayHours.close.split(":")[1]);
    return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
  }

  // --- Helper: Distance Calculation (miles) ---
  function getDistanceMiles(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // radius of Earth in miles
    const toRad = (value) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // --- Filtered Pantries ---
  const filteredPantries = entries.filter(item => {
    const matchesCategory = selectedCategory
      ? Object.values(item).includes(selectedCategory)
      : true;
    const matchesOpenNow = openNowFilter
      ? isOpenNow(item.hours)
      : true;
    const matchesDistance = maxDistance
      ? getDistanceMiles(
        userLocation.latitude,
        userLocation.longitude,
        item.latitude,
        item.longitude
      ) <= maxDistance
      : true;
    return matchesCategory && matchesOpenNow && matchesDistance;
  });

  // --- Handlers ---
  const handleCardPress = (item) => {
    setSelectedPantry(item);
  };
  const handleFilterPress = (category) => {
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
      {/* Drawer (only if no pantry is selected) */}
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

              {/* Filter Chips */}
              <View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterContainer}
                >
                  {/* Open Now filter chip */}
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      openNowFilter && styles.selectedChip
                    ]}
                    onPress={() => setOpenNowFilter(prev => !prev)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        openNowFilter && styles.selectedChipText
                      ]}
                    >
                      Open Now
                    </Text>
                  </TouchableOpacity>
                  {/* Distance filter chips */}
                  {[1, 5].map((miles) => (
                    <TouchableOpacity
                      key={miles}
                      style={[
                        styles.filterChip,
                        maxDistance === miles && styles.selectedChip
                      ]}
                      onPress={() => setMaxDistance(miles)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          maxDistance === miles && styles.selectedChipText
                        ]}
                      >
                        {`<${miles} mi`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {/* Category filter chips */}
                  {uniqueCategories.map((category, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.filterChip,
                        selectedCategory === category && styles.selectedChip
                      ]}
                      onPress={() => handleFilterPress(category)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedCategory === category && styles.selectedChipText
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
                data={filteredPantries}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  // guard and coerce to numbers in case lat/lon are strings
                  const lat = item.latitude ? Number(item.latitude) : null;
                  const lon = item.longitude ? Number(item.longitude) : null;
                  const distanceMiles =
                    lat && lon
                      ? getDistanceMiles(
                          userLocation.latitude,
                          userLocation.longitude,
                          lat,
                          lon
                        )
                      : null;
                  return (
                    <Pressable onPress={() => handleCardPress(item)}>
                      <PantryCard pantry={item} distanceMiles={distanceMiles} />
                    </Pressable>
                  );
                }}
              />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
      {/* Detail Drawer for selected pantry */}
      <BottomDetailDrawer
        isVisible={!!selectedPantry}
        pantry={selectedPantry}
        onClose={() => setSelectedPantry(null)}
      />
    </>
  );
}

// --- Styles ---
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