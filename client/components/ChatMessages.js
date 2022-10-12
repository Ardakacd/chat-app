import { View, FlatList } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Message from "./Message";

const ChatMessages = ({ messages, isPersonal, socket }) => {
  const [chatMessages, setChatMessages] = useState(messages);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    socket.on("new-message", (data) => {
      setChatMessages((chatMessages) => [...chatMessages, data]);
    });
    let getUsername = async () => {
      let user = await AsyncStorage.getItem("user");
      user = JSON.parse(user);
      setUsername(user.username);
    };

    getUsername();
  }, []);

  if (!username) {
    return null;
  }

  return (
    <View>
      <FlatList
        data={[...chatMessages].reverse()}
        renderItem={({ item }) => (
          <Message message={item} username={username} isPersonal={isPersonal} />
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        inverted
      ></FlatList>
    </View>
  );
};

export default ChatMessages;
