import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { shareAsync } from "expo-sharing";
import * as ImagePicker from "expo-image-picker";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CameraActions from "../components/CameraActions";
import CameraOptions from "../components/CameraOptions";
import PostcaptureOptions from "../components/PostcaptureActions";
import { supabase } from "../utils/hooks/supabase";

export default function CameraScreen({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [showGalleryMenu, setShowGalleryMenu] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(status === "granted");
    })();
  }, []);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function flipCamera() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function galleryMenu() {
    setShowGalleryMenu(!showGalleryMenu);
  }

  async function checkGallery() {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
    });
    setShowGalleryMenu(false);

    if (!pickerResult.canceled) {
      const imageAsset = pickerResult.assets[0];
      setPhoto(imageAsset);
      await uploadImage(imageAsset.uri);
    }
  }

  async function uploadImage(photoUri) {
    try {
      const response = await fetch(photoUri);
      const blob = await response.blob();
      const fileName = `${Date.now()}.jpg`;

      const { data, error } = await supabase
        .storage
        .from("pictureStorage")
        .upload(fileName, blob, { contentType: "image/jpeg" });

      if (error) throw error;

      const { publicUrl } = supabase
        .storage
        .from("pictureStorage")
        .getPublicUrl(fileName).data;

      await supabase.from("gallery").insert({ photo: publicUrl });
      console.log("Uploaded:", publicUrl);
    } catch (err) {
      console.error("Upload failed:", err.message);
    }
  }

  async function takePhoto() {
    if (!cameraRef.current) return;

    const options = { quality: 1, base64: false };
    const newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
    await uploadImage(newPhoto.uri);
  }

  function savePhoto() {
    MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
      setPhoto(null);
    });
  }

  if (photo) {
    return (
      <View
        style={[
          styles.container,
          { marginBottom: tabBarHeight, paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <Image
          style={facing === "front" ? styles.frontPreview : styles.preview}
          source={{ uri: photo.uri }}
        />
        {hasMediaLibraryPermission && (
          <PostcaptureOptions
            deletePhoto={() => setPhoto(null)}
            savePhoto={savePhoto}
          />
        )}
      </View>
    );
  }

  if (showGalleryMenu) {
    return (
      <View
        style={[
          styles.container,
          { marginBottom: tabBarHeight, paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
        <CameraOptions flipCamera={flipCamera} />
        <CameraActions
          galleryMenu={galleryMenu}
          checkGallery={checkGallery}
          takePhoto={takePhoto}
        />
        <Modal
          animationType="slide"
          transparent
          visible={showGalleryMenu}
          onRequestClose={() => setShowGalleryMenu(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable onPress={checkGallery} style={styles.buttonStyle}>
                <Text style={styles.buttonText}>Phone Gallery</Text>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate("MemoryScreen")}
                style={styles.buttonStyle}
              >
                <Text style={styles.buttonText}>ChatSnap Memories</Text>
              </Pressable>
              <Pressable onPress={galleryMenu} style={styles.closeButtonStyle}>
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { marginBottom: tabBarHeight, paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
      <CameraOptions flipCamera={flipCamera} />
      <CameraActions
        galleryMenu={galleryMenu}
        checkGallery={checkGallery}
        takePhoto={takePhoto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  camera: {
    overflow: "hidden",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  preview: { flex: 1, borderRadius: 16 },
  frontPreview: { flex: 1, borderRadius: 16, transform: [{ scaleX: -1 }] },
  modalView: {
    margin: 20,
    marginTop: 400,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
  },
  buttonStyle: {
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 20,
    backgroundColor: "#2196F3",
  },
  closeButtonStyle: {
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 20,
    backgroundColor: "red",
  },
  buttonText: { fontSize: 20, color: "white" },
});
