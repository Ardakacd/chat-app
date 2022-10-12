import axiosInstance from "../axios/axiosInstance";

const SignUpReq = async (username, email, password) => {
  try {
    let { data, status } = await axiosInstance.post("/user/register", {
      username,
      email,
      password,
    });

    return [data, status];
  } catch (error) {
    let data = error.response.data;
    let status = error.response.status;

    return [data, status];
  }
};

const LoginReq = async (email, password) => {
  try {
    let { data, status } = await axiosInstance.post("/user/login", {
      email,
      password,
    });

    return [data, status];
  } catch (error) {
    let data = error.response.data
      ? error.response.data
      : error.response._response;
    let status = error.response.status;

    return [data, status];
  }
};

const LogoutReq = async () => {
  try {
    let { status } = await axiosInstance.post("/user/logout", {});

    return [status];
  } catch (error) {
    let data = error.response.data
      ? error.response.data
      : error.response._response;
    let status = error.response.status;

    return [data, status];
  }
};

export { SignUpReq, LoginReq, LogoutReq };
