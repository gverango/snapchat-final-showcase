import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { supabase } from "../utils/hooks/supabase";
import { useNavigation } from "@react-navigation/native";

export default function CameraScreen() {
  const navigation = useNavigation();

  const pickAndUploadImage = async () => {
    console.log("pickAndUploadImage called");

    // Request gallery permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "We need access to your gallery!");
      return;
    }

    // Launch picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) {
      console.log("Image picking canceled");
      return;
    }

    const fileUri = result.assets[0].uri;
    const fileName = `snap-${Date.now()}.jpg`;
    console.log("Selected file:", fileUri);

    try {
      // Convert image to Uint8Array
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const fileBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

      // Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from("snaps")
        .upload(fileName, fileBuffer, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        Alert.alert("Upload failed", uploadError.message);
        return;
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from("snaps")
        .getPublicUrl(fileName);

      const publicUrl = publicData.publicUrl;
      console.log("Public URL:", publicUrl);

      // Navigate to SnapScreen
      console.log("Navigating to SnapScreen");
      navigation.navigate("SnapScreen", { imageUrl: publicUrl });
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera / Gallery</Text>
      <TouchableOpacity style={styles.button} onPress={pickAndUploadImage}>
        <Text style={styles.buttonText}>Pick from Gallery</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#65b5ff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
