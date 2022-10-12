import { View, TextInput, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const InputElement = ({
  type,
  title,
  placeholder,
  icon,
  value,
  onTextChange,
  textContentType,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.inputTitle}>{title}</Text>
      <View style={styles.inputBody}>
        <Ionicons name={icon} size={20} color="black" />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A9A9A9"
          textContentType={textContentType}
          value={value}
          onChangeText={(text) => onTextChange(type, text)}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputTitle: {
    fontSize: 14,
    color: "#222222",
    marginBottom: 5,
  },
  inputBody: {
    backgroundColor: "#F6F6F6",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
  },
  input: {
    marginLeft: 7,
    width: "100%",
  },
});

export default InputElement;
