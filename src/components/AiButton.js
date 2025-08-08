import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../utils/hooks/supabase";
import { getImageChat } from "../../getImageChatGPT";

const MESSAGES_TABLE = "messages";

export default function AiButton({ image_url }) {
  const navigation = useNavigation();

  const deleteFirstRow = async () => {
    const { data, error: fetchError } = await supabase
      .from(MESSAGES_TABLE)
      .select("*")
      .order("id", { ascending: true })
      .limit(1);

    const { error: deleteError } = await supabase
      .from(MESSAGES_TABLE)
      .delete()
      .eq("id", data[0].id);

    if (deleteError) {
      console.error("Error deleting first row:", deleteError);
    }
  };

  const pressedButton = async () => {
    const prompt =
      "Create a very simple short and clear recipe for the image you see.";
    const test = image_url;

    const response = await getImageChat({ prompt, imageUrl: test });
    const aiReply = response?.choices?.[0]?.message?.content;

    // console.log("AI RESPONDED:", aiReply);

    await supabase.from(MESSAGES_TABLE).insert({
      content: aiReply,
      user_email: "myAI@ai.chatroom",
      room: "global_room",
    });

    await deleteFirstRow();

    navigation.navigate("GroupChat", { initialMessage: "AI Reply sent" });
  };

  return (
    <View>
      <TouchableOpacity onPress={pressedButton} style={styles.button}>
        <Image
          source={require("../../assets/carrotIcon.png")}
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
