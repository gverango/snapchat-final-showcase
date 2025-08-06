import { View, Text,Button, StyleSheet, Image} from "react-native";




export default function SnapScreen({route}) {
  const {imageUrl} = route.params;

  return (
    <View style={styles.container}>
      <Text>whats ups</Text>
      <Image source={{ uri: imageUrl }} style={styles.image}/>    
    </View>
  );
}

const styles = StyleSheet.create({
image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
  },
});