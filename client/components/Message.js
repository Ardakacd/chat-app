import { View, Text, StyleSheet } from "react-native";

const Message = ({ message, username, isPersonal }) => {
  let isSender = username === message.sender[0];

  return (
    <View
      style={[styles.messageContainer, isSender ? styles.right : styles.left]}
    >
      {!isSender && !isPersonal && (
        <Text style={styles.usernameText}>{message.sender[0]}</Text>
      )}
      <Text style={{ color: "white" }}>{message.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: "50%",
    paddingHorizontal: 8,
    paddingVertical: 16,
    marginBottom: 8,
    borderRadius: 10,
  },
  usernameText: {
    fontSize: 12,
    color: "yellow",
    marginBottom: 10,
  },
  left: {
    alignSelf: "flex-start",
    backgroundColor: "#107C10",
  },
  right: {
    alignSelf: "flex-end",
    backgroundColor: "#3A3A3A",
  },
});

export default Message;
