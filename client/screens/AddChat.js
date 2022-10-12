import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useState, useLayoutEffect } from "react";
import InputElement from "../components/InputElement";
import { createChat } from "../request/chatReq";

const AddChat = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  let onChangeInputText = (type, value) => {
    setUsername(value);
  };

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerStyle: {
  //       backgroundColor: "#34B7F1",
  //     },
  //     headerTintColor: "#fff",
  //   });
  // }, [navigation]);

  const handleCreateChat = async () => {
    const [data, status] = await createChat("", [username], true);

    if (status === 201) {
      let room = data.data.room;
      navigation.navigate("Home");
    } else {
      if (data.message) {
        setError(data.message);
      } else {
        setError("Something broke!");
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={styles.header}>
          <Text style={styles.mainTitle}>Create Private Chat</Text>
          <Text style={styles.info}>
            Start a conversation with your friend!
          </Text>
        </View>
        <View>
          {error && <Text style={styles.error}>{error}</Text>}
          <InputElement
            value={username}
            placeholder="Enter username"
            title="Username"
            icon="body"
            onTextChange={onChangeInputText}
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateChat}
          >
            <Text style={styles.buttonText}>Create Chat</Text>
          </TouchableOpacity>
          <View style={styles.navigate}>
            <Pressable onPress={() => navigation.navigate("AddGroupChat")}>
              <Text style={styles.customizedText}>Create Group</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 50,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222222",
    marginBottom: 4,
  },
  error: {
    fontSize: 20,
    color: "red",
  },
  info: {
    fontSize: 17,
    color: "#222222",
  },
  submitButton: {
    backgroundColor: "#124BCD",
    borderRadius: 4,
    padding: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  forgotText: {
    textAlign: "right",
    color: "#1D59E1",
  },
  footer: {
    marginTop: 30,
  },
  navigate: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 7,
  },
  customizedText: {
    color: "#1D59E1",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
  },
});

export default AddChat;
