import SignUp from "./screens/SignUp";
import Login from "./screens/Login";
import Home from "./screens/Home";
import AddChat from "./screens/AddChat";
import AddGroupChat from "./screens/AddGroupChat";
import ChatRoom from "./screens/ChatRoom";
import EditGroup from "./screens/EditGroup";
import Profile from "./screens/Profile";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { ActivityIndicator, View, Alert } from "react-native";
import * as SplashScreen from "expo-splash-screen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [initialPage, setInitialPage] = useState(null);

  useEffect(() => {
    console.log("Çalıştı");
    const getToken = async () => {
      let token = await AsyncStorage.getItem("token");
      let initialPage = token ? "Home" : "Login";
      console.log(initialPage);
      setInitialPage(initialPage);
      setAppReady(true);
    };
    getToken();
  }, []);

  if (!appReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialPage}
        screenOptions={{
          headerStyle: {
            backgroundColor: "#34B7F1",
          },
          headerTintColor: "#fff",
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="AddChat"
          component={AddChat}
          options={{ title: "Create Chat" }}
        />
        <Stack.Screen
          name="AddGroupChat"
          component={AddGroupChat}
          options={{ title: "Create Group Chat" }}
        />
        <Stack.Screen
          name="ChatRoom"
          component={ChatRoom}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditGroup"
          component={EditGroup}
          options={{ title: "Edit Group Chat" }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: "Profile" }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
