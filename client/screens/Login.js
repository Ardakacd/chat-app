import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useState } from "react";
import InputElement from "../components/InputElement";
import { AuthConst } from "../constants/inputContants";
import { LoginReq } from "../request/authenticationReq";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const {
    type: emailType,
    title: emailTitle,
    placeholder: emailPlaceholder,
    icon: emailIcon,
  } = AuthConst[1];
  const {
    type: passType,
    title: passTitle,
    placeholder: passPlaceholder,
    icon: passIcon,
  } = AuthConst[2];

  let onChangeInputText = (type, value) => {
    setInputs({ ...inputs, [type]: value });
  };

  const handleLogin = async () => {
    const [data, status] = await LoginReq(inputs.email, inputs.password);

    if (status === 200) {
      let user = data.data.user;
      let token = data.data.token;
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          id: user["_id"],
          username: user["username"],
          email: user["email"],
          photo: user["photo"],
        })
      );
      await AsyncStorage.setItem("token", token);
      navigation.replace("Home");
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
          <Text style={styles.mainTitle}>Login</Text>
          <Text style={styles.info}>Login to get started</Text>
        </View>
        <View>
          {error && <Text style={styles.error}>{error}</Text>}
          <InputElement
            value={inputs["email"]}
            type={emailType}
            placeholder={emailPlaceholder}
            title={emailTitle}
            icon={emailIcon}
            onTextChange={onChangeInputText}
            textContentType="emailAddress"
          />

          <InputElement
            value={inputs["password"]}
            type={passType}
            placeholder={passPlaceholder}
            title={passTitle}
            icon={passIcon}
            onTextChange={onChangeInputText}
            textContentType="password"
          />
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <View style={styles.navigate}>
            <Pressable onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.customizedText}>Create Account</Text>
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

export default Login;
