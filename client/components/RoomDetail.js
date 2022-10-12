const {
  Modal,
  Alert,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} = require("react-native");
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import UserCard from "./UserCard";
import {
  exitFromChat,
  deleteChat,
  removeParticipant,
} from "../request/chatReq";
import { useNavigation } from "@react-navigation/native";

const RoomDetail = ({ room, isVisible, onClose, toNavigate }) => {
  const [isOwner, setIsOwner] = useState(null);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState(room.participants);
  const navigation = useNavigation();

  useEffect(() => {
    const handleIsOwner = async () => {
      let user = await AsyncStorage.getItem("user");
      user = JSON.parse(user);

      setIsOwner(user.username === room.owner);
    };

    handleIsOwner();
  }, []);

  const handleExit = async () => {
    if (isOwner) {
      Alert.alert(
        "Attention",
        "Because you are the admin of the group it will be deleted permanently!",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              const [data, status] = await deleteChat(room._id);

              if (status === 204) {
                toNavigate("Home");
              } else {
                if (data.message) {
                  setError(data.message);
                } else {
                  setError("Something broke!");
                }
              }
            },
          },
        ]
      );
    } else {
      const [data, status] = await exitFromChat(room._id);

      if (status === 200) {
        toNavigate("Home");
      } else {
        if (data.message) {
          setError(data.message);
        } else {
          setError("Something broke!");
        }
      }
    }
  };

  const onDelete = async (userId) => {
    const [data, status] = await removeParticipant(userId, room._id);

    if (status === 200) {
      setParticipants((oldPartipants) =>
        oldPartipants.filter((participant) => participant._id !== userId)
      );
    } else {
      if (data.message) {
        setError(data.message);
      } else {
        setError("Something broke!");
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        onClose();
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.roomHeader}>{room.name}</Text>
            <AntDesign name="close" size={24} color="black" onPress={onClose} />
          </View>
          {room.description && (
            <Text style={styles.headerText}>{room.description}</Text>
          )}
          {!room.isPersonal && (
            <>
              <View style={{ marginTop: 10 }}>
                <Text style={styles.headerText}>Participants</Text>
                <FlatList
                  data={participants}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <UserCard
                      user={item}
                      onDelete={onDelete}
                      owner={room.owner}
                      isOwner={isOwner}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                />
              </View>
              {error && <Text style={styles.error}>{error}</Text>}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.exit]}
                  onPress={handleExit}
                >
                  <Text style={styles.buttonText}>Exit Group</Text>
                </TouchableOpacity>
                {isOwner && (
                  <TouchableOpacity
                    style={[styles.button, styles.edit]}
                    onPress={() => toNavigate("EditGroup", { room })}
                  >
                    <Text style={styles.buttonText}>Edit Group</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomHeader: {
    fontSize: 30,
    color: "#34B7F1",
  },
  headerText: {
    marginVertical: 10,
    fontSize: 18,
  },
  error: {
    fontSize: 20,
    color: "red",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  exit: {
    backgroundColor: "red",
  },
  edit: {
    backgroundColor: "blue",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default RoomDetail;
