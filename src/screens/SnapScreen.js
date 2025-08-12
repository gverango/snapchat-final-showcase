import { View, Text, StyleSheet, Image } from "react-native";
import AiButton from "../components/AiButton";

export default function SnapScreen({ route }) {
  const { imageUrl } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.buttonOverlay}>
          <AiButton image_url={imageUrl} />
          <Image
            source={require("../../assets/Actions.png")}
            style={styles.actionImages}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Image
          source={require("../../assets/Story Footer.png")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 8,          
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  buttonOverlay: {
    position: "absolute",
    top: 475,
    left: 350,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",     
  },
  footer: {
    flex: 1.25,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  actionImages: {
    marginTop: 35,
  }
});
