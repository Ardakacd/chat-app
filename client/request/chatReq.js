import axiosInstance from "../axios/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getChats = async () => {
  try {
    let token = await AsyncStorage.getItem("token");
    let { data, status } = await axiosInstance.get("/room", {
      headers: { Authorization: token },
    });

    return [data, status];
  } catch (error) {
    let data = error.response.data;
    let status = error.response.status;

    return [data, status];
  }
};

const getChatsById = async (id) => {
  try {
    let token = await AsyncStorage.getItem("token");
    let { data, status } = await axiosInstance.get(`/room/${id}`, {
      headers: { Authorization: token },
    });

    return [data, status];
  } catch (error) {
    let data = error.response.data;
    let status = error.response.status;

    return [data, status];
  }
};

const createChat = async (name, participants, isPersonal) => {
  try {
    let token = await AsyncStorage.getItem("token");
    let { data, status } = await axiosInstance.post(
      "/room",
      {
        name,
        participants,
        isPersonal,
      },
      {
        headers: { Authorization: token },
      }
    );

    return [data, status];
  } catch (error) {
    let data = error.response.data;
    let status = error.response.status;

    return [data, status];
  }
};

const createMessage = async (content, chatRoom) => {
  try {
    let token = await AsyncStorage.getItem("token");
    let { data, status } = await axiosInstance.post(
      "/message",
      {
        content,
        chatRoom,
      },
      {
        headers: { Authorization: token },
      }
    );

    return [data, status];
  } catch (error) {
    let data = error.response.data;
    let status = error.response.status;

    return [data, status];
  }
};

const exitFromChat = async (roomId) => {
  try {
    let token = await AsyncStorage.getItem("token");

    let { data, status } = await axiosInstance.patch(
      `/room/exit/${roomId}`,
      {},
      {
        headers: { Authorization: token },
      }
    );

    return [data, status];
  } catch (error) {
    let data = error.response.data;
    let status = error.response.status;

    return [data, status];
  }
};

const deleteChat = async (roomId) => {
  try {
    let token = await AsyncStorage.getItem("token");

    let { data, status } = await axiosInstance.delete(`/room/${roomId}`, {
      headers: { Authorization: token },
    });

    return [data, status];
  } catch (error) {
    let data = error.response.data;
    let status = error.response.status;

    return [data, status];
  }
};

const removeParticipant = async (userId, roomId) => {
  try {
    let token = await AsyncStorage.getItem("token");

    let { data, status } = await axiosInstance.patch(
      `/room/${roomId}`,
      { removeParticipant: userId },
      {
        headers: { Authorization: token },
      }
    );

    return [data, status];
  } catch (error) {
    let data = error.response.data;
    let status = error.response.status;

    return [data, status];
  }
};

const editGroupChat = async (editedParts, roomId) => {
  try {
    let token = await AsyncStorage.getItem("token");

    let { data, status } = await axiosInstance.patch(
      `/room/${roomId}`,
      { ...editedParts },
      {
        headers: { Authorization: token },
      }
    );

    return [data, status];
  } catch (error) {
    let data = error.response.data;
    let status = error.response.status;

    return [data, status];
  }
};

export {
  getChats,
  createChat,
  getChatsById,
  createMessage,
  exitFromChat,
  deleteChat,
  removeParticipant,
  editGroupChat,
};
