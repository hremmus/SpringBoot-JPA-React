import axios from "axios";
import storage from "lib/storage";
import { Navigate } from "react-router-dom";
import { logout } from "redux/modules/user";
import { store } from "redux/store";
import { refreshToken } from "./AuthService";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "Application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = store.getState().user.accessToken;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const {
      config,
      response: { status },
    } = error;
    const prevRequest = config;
    if (status === 401 && !prevRequest.sent) {
      prevRequest.sent = true;
      await refreshToken()
        .then((response) => {
          const newAccessToken = response.data.result.data.accessToken;
          config.headers["Authorization"] = newAccessToken;
          storage.set("accessToken", newAccessToken);
        })
        .catch(() => {
          store.dispatch(logout());
          storage.remove("loggedInfo");
          storage.remove("accessToken");
          Navigate("/auth/login?expired");
        });
      return api(prevRequest);
    }
    return Promise.reject(error);
  }
);

export default api;
