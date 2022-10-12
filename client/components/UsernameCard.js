import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const UsernameCard = ({ username, onClose }) => {
  return (
    <View style={styles.roomContainer}>
      <Text style={styles.nameText}>{username}</Text>
      <Ionicons
        name="md-close-sharp"
        size={24}
        color="black"
        onPress={() => onClose(username)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  roomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 5,
  },
  nameText: {
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
  },
});

export default UsernameCard;
