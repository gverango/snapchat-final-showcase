import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  SafeAreaView,
} from "react-native";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { useRealtimeChat } from "../hooks/use-realtime-chat";
import { useChatScroll } from "../hooks/use-chat-scroll";
import { getChat } from "../../getChatGPT";
import { getImageChat } from "../../getImageChatGPT";
import ScreenButton from "../components/ScreenButton";

export default function GroupChatScreen({ route, navigation }) {
  const { user } = useAuthentication();
  const username = user?.email || "myAI";

  const { messages, sendMessage, isConnected } = useRealtimeChat({
    roomName: "global_room",
    username,
  });

  const [input, setInput] = useState("");
  const previousMessagesRef = useRef([]);
  const { containerRef, scrollToBottom } = useChatScroll();

  const addMessage = (msg, userEmail = username) => {
    if (msg.trim() !== "") {
      sendMessage(msg.trim(), userEmail);
    }
  };

  const handleSend = () => {
    addMessage(input);
    setInput("");
  };

  useEffect(() => {
    if (route?.params?.initialMessage) {
      navigation.setParams({ initialMessage: null });
    }
  }, [route?.params?.initialMessage]);

  useEffect(() => {
    const previousMessages = previousMessagesRef.current;

    if (messages.length > previousMessages.length) {
      const newMessages = messages.slice(previousMessages.length);

      const newUserMessages = newMessages.filter(
        (msg) =>
          msg.user_email !== "myAI@ai.chatroom" && msg.user_email === username
      );

      if (
        newUserMessages.length > 0 &&
        newMessages[newMessages.length - 1].user_email !== "myAI@ai.chatroom"
      ) {
        const openAIMessages = [
          {
            role: "system",
            content: "you are myAI from snapchat -> be helpful",
          },
          ...messages.map((msg) => ({
            role: msg.user_email === "myAI@ai.chatroom" ? "assistant" : "user",
            content: msg.content,
          })),
        ];

        getChat(openAIMessages)
          .then((response) => {
            const aiReply = response.choices[0].message.content;
            sendMessage(aiReply, "myAI@ai.chatroom");
          })
          .catch((err) => console.error("OpenAI error:", err));
      }
    }

    previousMessagesRef.current = messages;
  }, [messages, sendMessage, username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>myAI!</Text>
      <FlatList
        ref={containerRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const messageUser =
            item.user?.name?.split("@")[0] ||
            item.user_email?.split("@")[0] ||
            "Unknown";
          const isSender = messageUser === username.split("@")[0];

          return (
            <Text
              style={[
                styles.message,
                isSender ? styles.senderText : styles.otherText,
              ]}
            >
              <Text style={styles.username}>{messageUser} </Text>
              {"\n"}
              <Text style={styles.message}>{item.content}</Text>
            </Text>
          );
        }}
        onContentSizeChange={scrollToBottom}
      />

      <ScreenButton image_url="https://httkhtqkarrfmxpssjph.supabase.co/storage/v1/object/public/snaps/food.jpeg" />

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          style={styles.input}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  message: { paddingVertical: 4, fontSize: 16 },
  username: { fontWeight: "bold" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  senderText: {
    color: "darkred",
  },
  otherText: {
    color: "black",
  },
});
