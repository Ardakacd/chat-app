import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  View,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LogoutReq } from "../request/authenticationReq";
import { useState, useEffect, useLayoutEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getChats } from "../request/chatReq";
import ChatCard from "../components/ChatCard";
import { useIsFocused } from "@react-navigation/native";

const Home = ({ navigation }) => {
  const [error, setError] = useState(null);
  const [chats, setChats] = useState(null);
  const [count, setCount] = useState(0);
  const [username, setUsername] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const handleChats = async () => {
        let user = await AsyncStorage.getItem("user");
        user = JSON.parse(user);
        let username = user.username;
        setUsername(username);
        const [data, status] = await getChats();

        if (status === 200) {
          let chats = data.data.rooms;

          let result = data.data.result;
          setChats(chats);
          setCount(result);
        } else {
          if (data.message) {
            setError(data.message);
          } else {
            setError("Something broke!");
          }
        }
      };

      handleChats();
    }
  }, [isFocused]);
  <AntDesign name="user" size={24} color="black" />;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <AntDesign
          name="user"
          size={24}
          color="#fff"
          style={{ marginLeft: 10, marginBottom: 2 }}
          onPress={() => navigation.navigate("Profile")}
        />
      ),
      headerStyle: {
        backgroundColor: "#34B7F1",
      },
      headerTintColor: "#fff",
      headerRight: () => (
        <MaterialIcons
          name="logout"
          size={24}
          color="#fff"
          style={{ marginRight: 10, marginBottom: 2 }}
          onPress={handleLogout}
        />
      ),
    });
  }, [navigation]);

  const handleLogout = async () => {
    const [status] = await LogoutReq();

    if (status === 200) {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      navigation.replace("Login");
    } else {
      if (data.message) {
        setError(data.message);
      } else {
        setError("Something broke!");
      }
    }
  };

  if (chats === null && error === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate("AddChat")}>
            <Text style={styles.newChatText}>New Chat!</Text>
          </TouchableOpacity>
        </View>
        {error &&
          Alert.alert("Error", { error }, [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ])}
        {chats.length === 0 ? (
          <View style={styles.noChatContainer}>
            <Text style={styles.noChatText}>
              You do not have any conversation yet! Start one by clicking New
              Chat!
            </Text>
          </View>
        ) : (
          <View>
            <FlatList
              data={chats}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <ChatCard room={item} username={username} />
              )}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  newChatText: {
    color: "#4285F4",
    textAlign: "right",
    marginBottom: 15,
    fontWeight: "bold",
  },
  noChatContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  noChatText: {
    color: "gray",
    fontSize: 18,
  },
});

export default Home;
