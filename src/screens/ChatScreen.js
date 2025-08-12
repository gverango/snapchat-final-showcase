import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "../components/Header";
import { CHATBOTS } from "./ConversationScreen";

export default function ChatScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  function getChatbots() {
    let chatbotsTemp = [];
    for (const botId in CHATBOTS) {
      chatbotsTemp.push({ isChatbot: true, chatId: botId });
    }

    setChats((otherChats) => [...otherChats, ...chatbotsTemp]);
  }

  useEffect(() => {
    if (chats.length < 1) {
      getChatbots();
      // getUserChats();
    }
  }, [chats.length]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          marginBottom: tabBarHeight,
        },
      ]}
    >
      <Header title="Chat" />
      <View>
        <TouchableOpacity
          style={[styles.userButton, {}]}
          onPress={() => navigation.navigate("My AI")}
          key="group-chat"
        >
          {/* <Ionicons
            style={styles.userIcon}
            name="people-outline"
            size={36}
            color="lightgrey"
          /> */}

          <Image
            source={require("../../assets/ChefAI.png")}
            style={styles.userIcon}
          />

          <Text style={[styles.userName, { color: "black" }]}>My AI</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  userButton: {
    padding: 25,
    display: "flex",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  userIcon: {
  position: "absolute",
  left: 5,
  top: 7,
  width: 36,
  height: 36,
  resizeMode: "contain",
},

  userName: {
    position: "absolute",
    left: 50,
    top: 14,
    fontSize: 18,
  },
  userCamera: {
    position: "absolute",
    right: 15,
    top: 10,
  },
});
