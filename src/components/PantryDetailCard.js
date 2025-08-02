
import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Button,
} from "react-native";

export default function PantryDetailCard({ visible, onClose, pantry }) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{pantry?.title}</Text>
          <Text style={styles.description}>{pantry?.description}</Text>

          <Text style={styles.subheader}>Community Snaps:</Text>
          <FlatList
            horizontal
            data={pantry?.snaps || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.snapImage} />
            )}
          />

          <Button title="Upload Snap" onPress={() => {}} />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    marginVertical: 10,
  },
  subheader: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },
  snapImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
});
