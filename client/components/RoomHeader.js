import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const RoomHeader = ({ room, onOpen, username }) => {
  const filterRoomName = () => {
    let splitted = room.name.split("-");

    if (username.charAt(0).toUpperCase() + username.slice(1) === splitted[0]) {
      return splitted[1];
    }
    return splitted[0];
  };

  const roomName = room.isPersonal ? filterRoomName() : room.name;

  return (
    <TouchableOpacity
      onPress={() => {
        if (!room.isPersonal) {
          onOpen();
        }
      }}
    >
      <View style={styles.roomContainer}>
        <Image
          source={{ uri: `http://localhost:3001/images/${room.photo}` }}
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

    borderRadius: 10,
  },
  roomImage: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
  },
  nameContainer: {
    justifyContent: "center",
    paddingLeft: 5,
    marginLeft: 10,
  },
  nameText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RoomHeader;
