import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Text,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../utils/hooks/supabase";
import { getImageChat } from "../../getImageChatGPT";

const MESSAGES_TABLE = "messages";

export default function AiButton({ image_url }) {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const deleteFirstRow = async () => {
    const { data, error: fetchError } = await supabase
      .from(MESSAGES_TABLE)
      .select("*")
      .order("id", { ascending: true })
      .limit(1);

    if (fetchError || !data?.length) {
      console.error("Error fetching first row:", fetchError);
      return;
    }

    const { error: deleteError } = await supabase
      .from(MESSAGES_TABLE)
      .delete()
      .eq("id", data[0].id);

    if (deleteError) {
      console.error("Error deleting first row:", deleteError);
    }
  };

  const pressedButton = async () => {
    setModalVisible(false);

    const prompt =
      "Create a very simple short and clear recipe for the image you see.";
    const response = await getImageChat({ prompt, imageUrl: image_url });
    const aiReply = response?.choices?.[0]?.message?.content;

    await supabase.from(MESSAGES_TABLE).insert({
      content: aiReply,
      user_email: "My AI@ai.chatroom",
      room: "global_room",
    });

    await deleteFirstRow();

    navigation.navigate("My AI", { initialMessage: "AI Reply sent" });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.button}
      >
        <Image
          source={require("../../assets/carrotIcon.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Image
              source={require("../../assets/carrotIcon.png")}
              style={styles.bellaImage}
            />
            <Text style={styles.modalText}>
              Want me to analyze this picture and generate a recipe with
              ingredients?
            </Text>

            <TouchableOpacity
              style={[styles.buttonPrimary, { backgroundColor: "#10adff" }]}
              onPress={pressedButton}
            >
              <Text style={styles.buttonText}>Analyze Food</Text>
            </TouchableOpacity>

            <Button
              title="Cancel"
              color="red"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
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
  bellaImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    overflow: "hidden",
    alignSelf: "center",
    marginBottom: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
});
