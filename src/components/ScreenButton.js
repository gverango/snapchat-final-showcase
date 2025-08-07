import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native"; 

export default function ScreenButton({image_url}) {
  const navigation = useNavigation();

  function pressedButton() {
    console.log("THIS WAS PRESSED 2");

    navigation.navigate("SnapScreen", {
      imageUrl: image_url
    });
  }

  return (
    <View>
      <TouchableOpacity onPress={pressedButton} style={styles.button}>
        <Image
          source={require('../../assets/carrotIcon.png')}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    borderRadius: 40,
    overflow: "hidden",
  },
});
