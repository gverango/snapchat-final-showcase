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
      <Image style={styles.image}
        source={require("../../assets/shelfHelpIcon.jpg")}
        />
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
  image: {
    width: 50, 
    height: 50, 
    borderRadius:25,
    position: "absolute", 
    top: 5, 
    left: 5 
  },
});