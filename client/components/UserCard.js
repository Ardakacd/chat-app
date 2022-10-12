import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const UserCard = ({ user, onDelete, isOwner, owner }) => {
  return (
    <View style={styles.roomContainer}>
      <View style={styles.leftContainer}>
        <Image
          source={{ uri: `http://localhost:3001/images/${user.photo}` }}
          style={styles.userImage}
        />
        <Text style={styles.nameText}>{user.username}</Text>
      </View>
      {isOwner ? (
        <>
          {user.username === owner ? (
            <Text style={styles.adminText}>Admin</Text>
          ) : (
            <Ionicons
              name="md-close-sharp"
              size={24}
              color="black"
              onPress={() => onDelete(user._id)}
            />
          )}
        </>
      ) : (
        <>
          {user.username === owner && (
            <Text style={styles.adminText}>Admin</Text>
          )}
        </>
      )}
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
  leftContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    marginRight: 15,
  },
  nameText: {
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
  },
  adminText: {
    color: "gray",
    fontSize: 15,
  },
});

export default UserCard;
