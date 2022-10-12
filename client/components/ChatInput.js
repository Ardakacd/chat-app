import { TextInput, View, StyleSheet } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { createMessage } from "../request/chatReq";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatInput = ({ roomId, socket }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const handleSentMessage = async () => {
    if (message) {
      const [data, status] = await createMessage(message, roomId);

      if (status === 204) {
        let user = await AsyncStorage.getItem("user");
        user = JSON.parse(user);

        let currentMili = new Date().getTime();
        socket.emit("add-message", {
          _id: currentMili,
          content: message,
          sender: [user.username],
          roomId,
        });
      } else {
        if (data.message) {
          setError(data.message);
        } else {
          setError("Something broke!");
        }
      }
    }

    setMessage("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={message}
        onChangeText={(text) => setMessage(text)}
        style={styles.input}
        multiline={true}
      ></TextInput>
      <Ionicons
        name="ios-send"
        size={24}
        color="white"
        style={styles.icon}
        onPress={handleSentMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  input: {
    backgroundColor: "white",
    flex: 4,
    padding: 8,
    borderRadius: 10,
  },
  icon: {
    flex: 1,
    textAlign: "center",
  },
});

export default ChatInput;
