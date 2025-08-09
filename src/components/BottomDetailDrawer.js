import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SnapUploads from "./SnapUploads";

const { height } = Dimensions.get("window");

export default function BottomDetailDrawer({
  isVisible,
  onClose,
  pantry,
}) {
  const translateY = useRef(new Animated.Value(height)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Animate when visibility changes
  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height * 0.04,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  if (!pantry) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={StyleSheet.absoluteFillObject}>
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Image
              style={styles.shelfHelpIcon}
              source={require("../../assets/shelfHelpIcon.jpg")}

            />
            <View style={styles.textContainer}>
              <Text style={styles.header}>{pantry.title}</Text>
              <Text style={styles.subheader}>{pantry.organizer}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {/* Categories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContainer}
            >
              {Object.keys(pantry)
                .filter((key) => key.startsWith("categories/") && pantry[key])
                .map((key, index) => (
                  <View key={index} style={styles.categoryChip}>
                    <Text style={styles.categoryText}>{pantry[key]}</Text>
                  </View>
                ))}
            </ScrollView>

            {/* Info Section */}
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>📍 Address</Text>
              <Text style={styles.infoText}>{pantry.address}</Text>

              {pantry.contact ? (
                <>
                  <Text style={styles.infoLabel}>📞 Contact</Text>
                  <Text style={styles.infoText}>{pantry.contact}</Text>
                </>
              ) : null}

              {pantry.website_url ? (
                <>
                  <Text style={styles.infoLabel}>🔗 Website</Text>
                  <Text
                    style={styles.websiteLink}
                    onPress={() => Linking.openURL(pantry.website_url)}
                  >
                    {pantry.website_url}
                  </Text>
                </>
              ) : null}

              {pantry.description ? (
                <>
                  <Text style={styles.infoLabel}>📝 Description</Text>
                  <Text style={styles.description}>{pantry.description}</Text>
                </>
              ) : null}
            </View>

            <SnapUploads pantry={pantry} />
          </ScrollView>

        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
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
  shelfHelpIcon: {
    width: 50,
    height: 50,
    marginRight: 8,
    borderRadius: 25,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
  },
  subheader: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 15,
  },
  categoryChip: {
    backgroundColor: "#EAF4F4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#CCE0E0",
  },
  categoryText: {
    fontSize: 13,
    color: "#2B5555",
    fontWeight: "500",
  },
  infoSection: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 10,
    color: "#444",
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  websiteLink: {
    fontSize: 14,
    color: "#1E90FF",
    textDecorationLine: "underline",
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
    lineHeight: 20,
  },
  backButton: {
    marginTop: 10,
    marginLeft: 300,
    position: 'absolute',
    alignSelf: 'flex-start',
    backgroundColor: "#eee",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
