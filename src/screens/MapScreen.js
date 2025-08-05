import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as Location from "expo-location";
import PartyButton from "../components/PartyButton";
import BottomDrawer from "../components/BottomDrawer";
import { supabase } from "../utils/hooks/supabase";

// --- Helper Functions ---
const fetchPantries = async (setEntries) => {
  let { data, error } = await supabase.from("pantries").select("*");
  if (error) {
    console.error("Error fetching pantries:", error);
  } else {
    setEntries(data);
  }
};

export default function MapScreen({ navigation }) {
  // --- State ---
  const [visible, setVisible] = useState(false);
  const [entries, setEntries] = useState([]);
  const [showMarkers, setShowMarkers] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [selectedPantry, setSelectedPantry] = useState(null);
  const mapRef = useRef(null);

  // --- Effects ---
  useEffect(() => {
    fetchPantries(setEntries);
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return errorMsg;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setCurrentRegion({
        latitude: 34.018165588378906,
        longitude: -118.45117950439453,
        latitudeDelta: 0.1,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  // --- Handlers ---
  const handleMarkerPress = (entry) => {
    setVisible(true);
    setSelectedPantry(entry);
  };

  const flyToPantry = (pantry) => {
    if (!pantry) return;
    const lat = parseFloat(pantry.latitude); 
    const lng = parseFloat(pantry.longitude);
    if (
      mapRef.current &&
      !isNaN(lat) &&
      !isNaN(lng)
    ) {
      mapRef.current.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.045,
          longitudeDelta: 0.045,
        },
        500
      );
    }
  };

  // --- Render ---
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={[styles.container, { marginBottom: tabBarHeight }]}>
      {currentRegion ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          region={currentRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {visible && location && showMarkers &&
            entries.map((entry) => {
              const lat = parseFloat(entry.latitude);
              const lng = parseFloat(entry.longitude);
              if (isNaN(lat) || isNaN(lng)) return null;
              return (
                <Marker
                  key={entry.id}
                  coordinate={{ latitude: lat, longitude: lng }}
                  title={entry.title}
                  description={entry.description}
                  onPress={() => handleMarkerPress(entry)}
                  pinColor={selectedPantry?.id === entry.id ? "blue" : "red"}
                />
              );
            })}
        </MapView>
      ) : (
        <Text>Loading map...</Text>
      )}

      <View style={styles.mapFooter}>
        <View style={styles.locationContainer}>
          <PartyButton
            onPress={() => {
              setVisible(true);
              setShowMarkers(true);
            }}
          />
          <BottomDrawer
            entries={entries}
            isVisible={visible}
            onClose={() => setVisible(false)}
            selectedPantry={selectedPantry}
            setSelectedPantry={(pantry) => {
              setSelectedPantry(pantry);
              flyToPantry(pantry);
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapFooter: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    bottom: 0,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  locationContainer: {
    backgroundColor: "transparent",
    width: "100%",
    paddingBottom: 8,
    alignItems: "center",
  },
  userLocation: {
    backgroundColor: "white",
    borderRadius: 100,
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  shadow: {
    shadowColor: "rgba(0, 0, 0)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 3,
    shadowOpacity: 0.5,
    elevation: 4,
  },
});