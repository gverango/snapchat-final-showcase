import react from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  useState,
TouchableOpacity,

} from "react-native";
import { colors } from "../../assets/themes/colors";

export default function PartyButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>🎉</Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom:650,
    right: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4
},
  text: {
    fontSize: 28,
  },
});