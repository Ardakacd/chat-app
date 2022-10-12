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
import { SignUpReq } from "../request/authenticationReq";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = ({ navigation }) => {
  const [inputs, setInputs] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const {
    type: nameType,
    title: nameTitle,
    placeholder: namePlaceholder,
    icon: nameIcon,
  } = AuthConst[0];
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

  const handleSignUp = async () => {
    const [data, status] = await SignUpReq(
      inputs.name,
      inputs.email,
      inputs.password
    );

    if (status === 201) {
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
          <Text style={styles.mainTitle}>Create Account</Text>
          <Text style={styles.info}>Sign up to get started</Text>
        </View>
        <View>
          {error && <Text style={styles.error}>{error}</Text>}
          <InputElement
            value={inputs["name"]}
            type={nameType}
            placeholder={namePlaceholder}
            title={nameTitle}
            icon={nameIcon}
            onTextChange={onChangeInputText}
            textContentType="username"
          />
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
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
          <View style={styles.navigate}>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={styles.footerText}>Already have an account?</Text>
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
    fontSize: 14,
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
  footer: {
    marginTop: 20,
  },
  navigate: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 7,
  },
  footerText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  customizedText: {
    color: "#1D59E1",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default SignUp;
