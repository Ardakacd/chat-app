import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ChatCard = ({ room, username }) => {
  const navigation = useNavigation();

  const filterRoomName = () => {
    let splitted = room.name.split("-");

    if (username.charAt(0).toUpperCase() + username.slice(1) === splitted[0]) {
      return splitted[1];
    }
    return splitted[0];
  };

  const filterRoomPhoto = () => {
    if (room.participants[0].username === username) {
      return room.participants[1].photo;
    } else {
      return room.participants[0].photo;
    }
  };

  const roomName = room.isPersonal ? filterRoomName() : room.name;

  const roomPhoto = room.isPersonal ? filterRoomPhoto() : room.photo;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ChatRoom", { roomId: room._id })}
    >
      <View style={styles.roomContainer}>
        <Image
          source={{ uri: `http://localhost:3001/images/${roomPhoto}` }}
          style={styles.roomImage}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{roomName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  roomContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 10,
  },
  roomImage: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  nameContainer: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 5,
    marginLeft: 10,
  },
  nameText: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
});

export default ChatCard;
