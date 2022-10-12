import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Pressable,
  FlatList,
} from "react-native";
import { useState, useLayoutEffect } from "react";
import InputElement from "../components/InputElement";
import { createChat } from "../request/chatReq";
import { GroupChatConst } from "../constants/inputContants";
import UsernameCard from "../components/UsernameCard";
const AddGroupChat = ({ navigation }) => {
  const [inputs, setInputs] = useState({ username: "", groupName: "" });
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState(null);

  const {
    type: groupType,
    title: groupTitle,
    placeholder: groupPlaceholder,
    icon: groupIcon,
  } = GroupChatConst[0];
  const {
    type: usernameType,
    title: usernameTitle,
    placeholder: usernamePlaceholder,
    icon: usernameIcon,
  } = GroupChatConst[1];

  let onChangeInputText = (type, value) => {
    setInputs({ ...inputs, [type]: value });
  };

  const onClose = (username) => {
    let users = allUsers.filter((user) => user !== username);
    setAllUsers(users);
  };

  const addParticipant = () => {
    if (inputs.username && !allUsers.includes(inputs.username)) {
      setAllUsers((allUsers) => [...allUsers, inputs.username]);
    }
    setInputs({ ...inputs, username: "" });
  };

  const handleCreateGroupChat = async () => {
    const [data, status] = await createChat(inputs.groupName, allUsers, false);

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
          <Text style={styles.mainTitle}>Create Group Chat</Text>
          <Text style={styles.info}>Start a conversation with others!</Text>
        </View>
        <View>
          {error && <Text style={styles.error}>{error}</Text>}
          <InputElement
            value={inputs.groupName}
            placeholder={groupPlaceholder}
            title={groupTitle}
            icon={groupIcon}
            onTextChange={onChangeInputText}
            type={groupType}
          />
          <InputElement
            value={inputs.username}
            placeholder={usernamePlaceholder}
            title={usernameTitle}
            icon={usernameIcon}
            onTextChange={onChangeInputText}
            type={usernameType}
          />
          <TouchableOpacity style={styles.addButton} onPress={addParticipant}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateGroupChat}
          >
            <Text style={styles.buttonText}>Create Group Chat</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.participantText}>Participants</Text>
            <FlatList
              data={allUsers}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <UsernameCard username={item} onClose={onClose} />
              )}
              showsVerticalScrollIndicator={false}
            />
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
  addButton: {
    alignSelf: "flex-end",
    padding: 8,
  },
  addText: {
    color: "#34B7F1",
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
    flex: 1,
  },
  participantText: {
    marginVertical: 10,
    fontSize: 20,
  },
});

export default AddGroupChat;
