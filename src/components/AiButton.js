import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native"; // 👈 Add this

export default function AiButton({imageUrl}) {
  // const imageUrl = "https://cdn.britannica.com/77/81277-050-2A6A35B2/Adelie-penguin.jpg";
  const navigation = useNavigation();

  function pressedButton() {
    console.log("THIS WAS PRESSED");

    navigation.navigate("GroupChat", {
      initialMessage: `here is an image: ${imageUrl} describe it`,
    });
  }

  return (
    <View>
      <TouchableOpacity onPress={pressedButton} style={styles.button}>
        <Image
          source={{
            uri: "https://www.figma.com/community/resource/74b03344-29a5-4c98-a507-ea0ed86d7d1b/thumbnail",
          }}
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
