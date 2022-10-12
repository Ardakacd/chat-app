import { View, ActivityIndicator } from "react-native";
import { useLayoutEffect, useState, useEffect } from "react";
import RoomHeader from "../components/RoomHeader";
import { getChatsById } from "../request/chatReq";
import ChatInput from "../components/ChatInput";
import ChatMessages from "../components/ChatMessages";
import RoomDetail from "../components/RoomDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { io } = require("socket.io-client");

const ChatRoom = ({ navigation, route }) => {
  const [isHeaderReady, setIsHeaderReady] = useState(false);
  const { roomId } = route.params;
  const [roomData, setRoomData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState(null);

  const openModal = () => {
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
  };

  const toNavigate = (route, params) => {
    setIsVisible(false);
    if (params) {
      navigation.navigate(route, params);
    } else {
      navigation.navigate(route);
    }
  };

  useLayoutEffect(() => {
    let getChatInfo = async () => {
      const [data, status] = await getChatsById(roomId);

      const room = data.data.room[0];
      const name = room.name;
      const photo = room.photo;
      const isPersonal = room.isPersonal;

      setRoomData(room);

      let user = await AsyncStorage.getItem("user");
      user = JSON.parse(user);
      let username = user.username;
      setUsername(username);

      let realPhoto = photo;
      if (isPersonal) {
        if (room.participants[0].username === username) {
          realPhoto = room.participants[1].photo;
        } else {
          realPhoto = room.participants[0].photo;
        }
      }

      navigation.setOptions({
        headerShown: true,
        headerTitle: (options) => {
          return (
            <RoomHeader
              room={{ name, photo: realPhoto, isPersonal }}
              onOpen={openModal}
              username={username}
            ></RoomHeader>
          );
        },
      });

      setIsHeaderReady(true);
    };

    getChatInfo();
  }, []);

  useEffect(() => {
    if (!socket) {
      setSocket(io("http://localhost:3001"));
    }

    const unsubscribe = navigation.addListener("focus", () => {
      socket?.emit("join-the-room", { roomId });
    });
    navigation.addListener("blur", () => {
      socket?.emit("leave-the-room", { roomId });
    });

    return unsubscribe;
  }, [navigation, socket]);

  if (!isHeaderReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 8, padding: 10 }}>
        <ChatMessages
          messages={roomData.messages}
          isPersonal={roomData.isPersonal}
          socket={socket}
        ></ChatMessages>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "#efdede",
          paddingHorizontal: 5,
          paddingVertical: 10,
        }}
      >
        <ChatInput roomId={roomData._id} socket={socket} />
        <RoomDetail
          room={roomData}
          isVisible={isVisible}
          onClose={closeModal}
          toNavigate={toNavigate}
          username={username}
        />
      </View>
    </View>
  );
};

export default ChatRoom;
