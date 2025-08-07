import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getImageChat } from "../../getImageChatGPT"; 
import { useCallback} from 'react';
import { supabase } from '../utils/hooks/supabase';

const MESSAGES_TABLE = 'messages';

export default function AiButton({image_url}) {
  const navigation = useNavigation();
  
  function pressedButton() {
    console.log("Image URL:", image_url);
    console.log("THIS WAS PRESSED");

    const prompt = "Create a very simple short and clear recipe for the image you see."
    const test = image_url

    getImageChat({ prompt, imageUrl: test })
    .then(response => {
      const aiReply = response?.choices?.[0]?.message?.content;
      console.log("AI RESPONDED!");

      sendMessage(aiReply, "myAI");

      navigation.navigate("GroupChat", {initialMessage: "GAH",});
    })
    .catch(err => {
      console.error("❌ OpenAI error:", err);
    });

    // navigation.navigate("GroupChat", {
    //   initialMessage: "Create a very simple short and clear recipe for the image you see. ",
    //   imageUrl: image_url,
    // });
  }

  const sendMessage = useCallback(
    async (content, user = username) => {
      const { error } = await supabase.from(MESSAGES_TABLE).insert({
        content,
        user_email: user,
        room: "global_room",
      });

      if (error) {
        console.error('Send message error:', error);
      }
    },
    ["global_room", "myAi"]
  );

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
