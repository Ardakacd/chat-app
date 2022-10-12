import { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      let user = await AsyncStorage.getItem("user");
      user = JSON.parse(user);
      setUser(user);
    };
    getUser();
  }, []);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      try {
        const uploadResult = await FileSystem.uploadAsync(
          `http://localhost:3001/api/v1/user/update/${user.id}`,
          result.uri,
          {
            httpMethod: "PATCH",
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: "avatar",
          }
        );
      } catch (error) {
        Alert.alert("Error", "Error while changing profile photo", [
          {
            text: "OK",
          },
        ]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.outerText}>
        Name: <Text style={styles.innerText}>{user.username}</Text>
      </Text>
      <Text style={styles.outerText}>
        Email Address: <Text style={styles.innerText}>{user.email}</Text>
      </Text>
      <Text style={styles.outerText}>Profile Photo:</Text>
      {user?.photo && (
        <Image
          source={{ uri: `http://localhost:3001/images/${user.photo}` }}
          style={styles.image}
        />
      )}
      <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
        <Text style={{ color: "white" }}>Pick an image from camera roll</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 10,
    flex: 1,
  },
  outerText: {
    color: "#34B7F1",
    fontSize: 20,
    marginBottom: 15,
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
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    alignSelf: "center",
    marginBottom: 30,
  },
});

export default Profile;
