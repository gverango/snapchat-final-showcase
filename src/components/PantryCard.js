import React from "react";
import { View, Text, StyleSheet } from "react-native";

// PantryCard displays a summary of a pantry, including title, organizer, address, distance, and today's hours.
export default function PantryCard({ pantry, distanceMiles }) {
  // --- Helper: Format today's hours ---
  function formatTodayHours(hours) {
    if (!hours) return "Hours unavailable";

    const days = [
      "sunday", "monday", "tuesday", "wednesday",
      "thursday", "friday", "saturday"
    ];
    const today = days[new Date().getDay()];
    const todayHours = hours[today];

    if (!todayHours) return "Closed today";

    // Format time as "h:mm AM/PM"
    const formatTime = (time) => {
      const [hour, minute] = time.split(":").map(Number);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
    };

    return `${formatTime(todayHours.open)} – ${formatTime(todayHours.close)}`;
  }

  // --- Distance display ---
  const distanceText =
    typeof distanceMiles === "number"
      ? `${distanceMiles.toFixed(1)} mi away`
      : null;

  // --- Render ---
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{pantry.title}</Text>
      <Text style={styles.description}>{pantry.organizer}</Text>
      <Text style={styles.address}>{pantry.address}</Text>

      {/* Hours + Distance row */}
      <View style={styles.hoursDistanceRow}>
        <Text style={styles.hours}>{formatTodayHours(pantry.hours)}</Text>
        {distanceText && <Text style={styles.distance}>{distanceText}</Text>}
      </View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: { fontSize: 16, fontWeight: "bold" },
  description: { fontSize: 14, color: "#666" },
  address: { fontSize: 12, color: "#999" },
  hours: {
    fontSize: 12,
    color: "#3da77e",
    fontWeight: "500",
    marginTop: 4,
  },
  distance: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  hoursDistanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  }


});