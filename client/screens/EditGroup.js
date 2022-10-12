import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import InputElement from "../components/InputElement";
import { EditGroupConst } from "../constants/inputContants";
import UsernameCard from "../components/UsernameCard";
import { editGroupChat } from "../request/chatReq";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditGroup = ({ navigation, route }) => {
  const { room } = route.params;
  const [inputs, setInputs] = useState({
    username: "",
    groupName: room.name,
    description: room.description,
  });
  const [addedUsers, setAddedUsers] = useState([]);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const {
    type: groupType,
    title: groupTitle,
    placeholder: groupPlaceholder,
    icon: groupIcon,
  } = EditGroupConst[0];
  const {
    type: descType,
    title: descTitle,
    placeholder: descPlaceholder,
    icon: descIcon,
  } = EditGroupConst[1];
  const {
    type: usernameType,
    title: usernameTitle,
    placeholder: usernamePlaceholder,
    icon: usernameIcon,
  } = EditGroupConst[2];

  let onChangeInputText = (type, value) => {
    setInputs({ ...inputs, [type]: value });
  };

  const onClose = (username) => {
    let users = addedUsers.filter((user) => user !== username);
    setAddedUsers(users);
  };

  const addParticipant = () => {
    if (inputs.username && !addedUsers.includes(inputs.username)) {
      setAddedUsers((addedUsers) => [...addedUsers, inputs.username]);
    }
    setInputs({ ...inputs, username: "" });
  };

  const EditGroupChat = async () => {
    let dataObj = {};

    if (room.name !== inputs.groupName) {
      dataObj = { name: inputs.groupName };
    }
    if (room.description !== inputs.description) {
      dataObj = { ...dataObj, description: inputs.description };
    }
    if (addedUsers) {
      dataObj = { ...dataObj, addParticipant: addedUsers };
    }
    if (result) {
      try {
        let token = await AsyncStorage.getItem("token");
        const uploadResult = await FileSystem.uploadAsync(
          `http://localhost:3001/api/v1/room/${room._id}`,
          result.uri,
          {
            httpMethod: "PATCH",
            headers: { Authorization: token },
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: "profile",
          }
        );
      } catch (error) {
        Alert.alert("Error", "Error while changing profile photo", [
          {
            text: "OK",
          },
        ]);
        return;
      }
    }

    const [data, status] = await editGroupChat(dataObj, room._id);

    if (status === 200) {
      navigation.navigate("Home");
    } else {
      if (data.message) {
        setError(data.message);
      } else {
        setError("Something broke!");
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setResult(result);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>Edit {room.name}</Text>
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
          value={inputs.description}
          placeholder={descPlaceholder}
          title={descTitle}
          icon={descIcon}
          onTextChange={onChangeInputText}
          type={descType}
        />
        <Text style={styles.imageText}>Profile Photo:</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Text style={{ color: "white" }}>Pick an image from camera roll</Text>
        </TouchableOpacity>
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
        <TouchableOpacity style={styles.submitButton} onPress={EditGroupChat}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.participantText}>Participants</Text>
          <FlatList
            data={addedUsers}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <UsernameCard username={item} onClose={onClose} />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
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
  imageText: {
    fontSize: 14,
    color: "#222222",
    marginBottom: 5,
  },
  innerText: {
    color: "gray",
    fontSize: 15,
  },
  imageButton: {
    backgroundColor: "#124BCD",
    borderRadius: 4,
    padding: 16,
    width: "80%",
    marginBottom: 10,
  },
});

export default EditGroup;
