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
import { ImageBackground } from "react-native";


export default function GroupChatScreen({ route, navigation }) {
  const { user } = useAuthentication();
  const username = user?.email || "My AI";

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
          msg.user_email !== "My Ai@ai.chatroom" && msg.user_email === username
      );

      if (
        newUserMessages.length > 0 &&
        newMessages[newMessages.length - 1].user_email !== "My AI@ai.chatroom"
      ) {
        const openAIMessages = [
          {
            role: "system",
            content: "you are myAI from snapchat -> be helpful",
          },
          ...messages.map((msg) => ({
            role: msg.user_email === "My AI@ai.chatroom" ? "assistant" : "user",
            content: msg.content,
          })),
        ];

        getChat(openAIMessages)
          .then((response) => {
            const aiReply = response.choices[0].message.content;
            sendMessage(aiReply, "My AI@ai.chatroom");
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
  <ImageBackground
    source={require("../../assets/myAiBackground.jpg")}
    style={styles.container}
    resizeMode="cover"
  >

    <View
      style={styles.chatWrapper}
    >
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
            <Text style={styles.message}>
              <Text
                style={[
                  styles.username,
                  isSender ? styles.senderText : styles.otherText,
                ]}
              >
                {messageUser[0].toUpperCase() +
                  messageUser.substring(1, messageUser.length)}{" "}
              </Text>
              {"\n"}
              <Text style={styles.message}>{item.content}</Text>
            </Text>
          );
        }}
        onContentSizeChange={scrollToBottom}
      />
    </View>

    <View style={styles.inputContainer}>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Type a message..."
        style={styles.input}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  </ImageBackground>
  
);

}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  chatWrapper: {
    flex: 1,
    padding: 20,
  },
  header: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 8 
  },
  message: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "white",      
    borderRadius: 8,               
    marginVertical: 4,
    fontFamily: Platform.select({
    ios: "AvenirNext-Regular",
    android: "sans-serif-medium",

  }),
  fontWeight: Platform.select({
    ios: "600",
    android: "700", // android needs a heavier weight for more thickness
  }),
  },
  username: { 
    fontWeight: "bold", 
  },
  inputContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.9)",
  paddingHorizontal: 10,
  paddingVertical: 8,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  width: "100%",
  paddingBottom: 20,
  paddingLeft: 20,
  paddingRight: 20,
},
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    backgroundColor: "#EDEEEF",
  },
  senderText: {
    color: "#f54242",
  },
  otherText: {
    color: "#3391f5",
  },
});
