import { View, Text, StyleSheet, Image } from "react-native";
import AiButton from "../components/AiButton";

export default function SnapScreen({ route }) {
  const { imageUrl } = route.params;

  return (
    <View style={styles.container}>
        <View style={styles.footer}>
        </View>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.footer}>
        <AiButton image_url={imageUrl}/>
        <Text style={styles.footerText}>[insert a footer]</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
  },
  footer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "white",
  },
});
